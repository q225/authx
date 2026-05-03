pipeline {
    agent any

    environment {
        IMAGE_NAME = 'authx-app'
        CONTAINER_NAME = 'authx_app'
        DOCKER_REGISTRY = '' // e.g. 'docker.io/yourusername' for DockerHub
        NODE_VERSION = '18'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        // ─────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo "📦 Checking out branch: ${env.BRANCH_NAME}"
                checkout scm
            }
        }

        // ─────────────────────────────────────────
        stage('Install Dependencies') {
            agent {
                docker {
                    image "node:${NODE_VERSION}-alpine"
                    args '-u root'
                    reuseNode true
                }
            }
            steps {
                echo '📥 Installing npm dependencies...'
                sh 'npm ci'
            }
        }

        // ─────────────────────────────────────────
        stage('Lint') {
            agent {
                docker {
                    image "node:${NODE_VERSION}-alpine"
                    args '-u root'
                    reuseNode true
                }
            }
            steps {
                echo '🔍 Running ESLint...'
                sh 'npm run lint || echo "Lint warnings found — check output above"'
            }
        }

        // ─────────────────────────────────────────
        stage('Test') {
            agent {
                docker {
                    image "node:${NODE_VERSION}-alpine"
                    args '-u root'
                    reuseNode true
                }
            }
            environment {
                NODE_ENV = 'test'
                DATABASE_URL = 'postgresql://test:test@localhost:5432/authx_test'
                JWT_ACCESS_SECRET = 'test-access-secret-min-32-chars-long'
                JWT_REFRESH_SECRET = 'test-refresh-secret-min-32-chars-long'
                JWT_ACCESS_EXPIRES_IN = '15m'
                JWT_REFRESH_EXPIRES_IN= '7d'
            }
            steps {
                echo '🧪 Running tests...'
                sh 'npm test -- --ci --forceExit --detectOpenHandles'
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: '**/junit.xml'
                }
            }
        }

        // ─────────────────────────────────────────
        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image: ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                sh """
                    docker build \
                        --build-arg NODE_ENV=production \
                        -t ${IMAGE_NAME}:${env.BUILD_NUMBER} \
                        -t ${IMAGE_NAME}:latest \
                        .
                """
            }
        }

        // ─────────────────────────────────────────
        stage('Security Scan') {
            steps {
                echo '🔒 Running npm audit...'
                sh 'npm audit --audit-level=high || true'
            }
        }

        // ─────────────────────────────────────────
        // Only runs on 'main' branch
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying to production...'
                withCredentials([
                    string(credentialsId: 'JWT_ACCESS_SECRET', variable: 'JWT_ACCESS_SECRET'),
                    string(credentialsId: 'JWT_REFRESH_SECRET', variable: 'JWT_REFRESH_SECRET'),
                    string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL')
                ]) {
                    sh """
                        # Stop and remove old container if exists
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true

                        # Run new container
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            --restart unless-stopped \
                            -p 3000:3000 \
                            -e NODE_ENV=production \
                            -e PORT=3000 \
                            -e DATABASE_URL=${DATABASE_URL} \
                            -e JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET} \
                            -e JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET} \
                            -e JWT_ACCESS_EXPIRES_IN=15m \
                            -e JWT_REFRESH_EXPIRES_IN=7d \
                            -e BCRYPT_SALT_ROUNDS=12 \
                            ${IMAGE_NAME}:${env.BUILD_NUMBER}
                    """
                }
            }
        }

        // ─────────────────────────────────────────
        stage('Health Check') {
            when {
                branch 'main'
            }
            steps {
                echo '❤️ Verifying deployment...'
                sh """
                    sleep 10
                    curl -f http://localhost:3000/api/v1/health || \
                        (echo 'Health check failed!' && exit 1)
                """
            }
        }

    }

    // ─────────────────────────────────────────────
    post {
        success {
            echo "✅ Pipeline passed! Image: ${IMAGE_NAME}:${env.BUILD_NUMBER}"
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above.'
        }
        cleanup {
            echo '🧹 Cleaning up unused Docker images...'
            sh 'docker image prune -f || true'
        }
    }
}