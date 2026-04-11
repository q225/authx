### 📄 `CONTRIBUTING.md`

```markdown
# Contributing to AuthX

Thanks for taking the time to contribute! 🎉  
AuthX is an open project and we welcome all improvements — bug fixes, features, docs, and tests.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Style](#code-style)
- [Reporting Issues](#reporting-issues)

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/your-username/authx.git
   cd authx
   ```
3. **Install** dependencies
   ```bash
   npm install
   ```
4. **Set up** environment variables
   ```bash
   cp env.example .env
   ```
5. **Run** the development server
   ```bash
   npm run dev
   ```

---

## Branch Naming

Use a clear, consistent naming convention:

| Type | Pattern | Example |
|----------|--------------------------|--------------------------------|
| Feature | `feat/short-description` | `feat/add-docker-support` |
| Bug Fix | `fix/short-description` | `fix/token-expiry-handling` |
| Docs | `docs/short-description` | `docs/update-readme` |
| Test | `test/short-description` | `test/auth-endpoint-coverage` |
| Chore | `chore/short-description`| `chore/update-dependencies` |

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
<type>: <short description>
```

**Examples:**
```
feat: add Docker and docker-compose support
fix: resolve refresh token rotation bug
docs: add CONTRIBUTING guide
test: add smoke tests for auth endpoints
chore: upgrade express to v5
```

Keep the subject line under **72 characters**.

---

## Pull Request Guidelines

Before submitting a PR, make sure:

- [ ] Your branch is up to date with `main`
- [ ] Code runs without errors (`npm run dev`)
- [ ] No `.env` or secrets are committed
- [ ] Commit messages follow the convention above
- [ ] PR title is clear and descriptive
- [ ] PR description explains **what** and **why**

### PR Title Format
```
feat: Add Docker support for containerized deployment
fix: Handle expired refresh token gracefully
```

---

## Code Style

- Use **camelCase** for variables and functions
- Use **async/await** over raw promises
- Keep controllers thin — business logic belongs in services
- Always validate input using `express-validator`
- Never log sensitive data (passwords, tokens)

---

## Reporting Issues

Found a bug or have a feature request?  
Open an [Issue](https://github.com/q225/authx/issues) with:

- A clear title
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your Node.js and OS version

---

Built with ❤️ — happy contributing!
```

---

## 🚀 Git Commands

```bash
git add CONTRIBUTING.md
git commit -m "docs: add CONTRIBUTING.md with PR and branching guidelines"
git push origin your-branch-name
```
