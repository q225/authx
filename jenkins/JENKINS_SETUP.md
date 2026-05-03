# Jenkins Setup Guide for AuthX

## 1. Start Jenkins Locally

```bash
docker compose -f jenkins/docker-compose.jenkins.yml up -d
```

Open http://localhost:8080 in your browser.

## 2. Get Initial Admin Password

```bash
docker exec authx_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

## 3. Install Required Plugins

In Jenkins → Manage Jenkins → Plugins, install:

- **Pipeline**
- **Docker Pipeline**
- **GitHub Integration**
- **Credentials Binding**
- **Blue Ocean** (optional, nice UI)

## 4. Add Credentials

Go to **Manage Jenkins → Credentials → Global → Add Credentials**

Add these as `Secret text`:

| ID                   | Value                        |
| -------------------- | ---------------------------- |
| `DATABASE_URL`       | your postgres connection URL |
| `JWT_ACCESS_SECRET`  | your access secret           |
| `JWT_REFRESH_SECRET` | your refresh secret          |

## 5. Create Pipeline Job

1. New Item → **Multibranch Pipeline**
2. Name it `authx`
3. Under Branch Sources → Add → **GitHub**
4. Enter repo URL: `https://github.com/q225/authx`
5. Set Script Path: `Jenkinsfile`
6. Save → Jenkins will scan and build automatically

## 6. Pipeline Stages

| Stage              | What it does                      |
| ------------------ | --------------------------------- |
| Checkout           | Pulls latest code                 |
| Install            | `npm ci` — clean install          |
| Lint               | ESLint checks                     |
| Test               | Jest unit tests                   |
| Build Docker Image | Builds `authx-app:latest`         |
| Security Scan      | `npm audit` for vulnerabilities   |
| Deploy             | Runs container (main branch only) |
| Health Check       | Hits `/api/v1/health` to verify   |
