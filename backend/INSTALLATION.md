# 📦 Installation Guide for Grading System

## Required Dependencies

Add these packages to your backend:

```bash
cd backend
npm install simple-git fs-extra shelljs glob axios
```

## Dependency Details

| Package | Purpose | Version |
|---------|---------|---------|
| `simple-git` | Git operations (clone, pull, etc.) | Latest |
| `fs-extra` | Enhanced file system operations | Latest |
| `shelljs` | Shell command execution | Latest |
| `glob` | Pattern matching for files | Latest |
| `axios` | HTTP client (for testing/examples) | Latest |

## Updated package.json

Your dependencies section should include:

```json
{
  "dependencies": {
    "@octokit/rest": "^22.0.1",
    "@prisma/client": "^5.22.0",
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "fs-extra": "^11.2.0",
    "glob": "^10.3.0",
    "nodemon": "^3.1.11",
    "prisma": "^5.22.0",
    "shelljs": "^0.8.5",
    "simple-git": "^3.21.0"
  }
}
```

## Verify Installation

After installing, verify the packages:

```bash
npm list simple-git fs-extra shelljs glob
```

## System Requirements

- **Node.js**: v16 or higher
- **Git**: Must be installed and accessible from command line
- **Disk Space**: Ensure sufficient space for temporary repository clones

## Test Git Access

```bash
git --version
```

If Git is not installed:
- **Windows**: Download from https://git-scm.com/download/win
- **Mac**: `brew install git`
- **Linux**: `sudo apt-get install git`

## Running the System

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or with auto-reload
npm run dev
```

## Quick Test

Once running, test the health endpoint:

```bash
curl http://localhost:3000/api/grade/health
```

Expected response:
```json
{
  "success": true,
  "service": "Automated Grading Assistant",
  "status": "operational",
  "availableModules": [2]
}
```
