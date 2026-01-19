# 🚀 Quick Start Guide - Automated Grading System

## Step-by-Step Setup

### 1️⃣ Install Dependencies

```bash
cd backend
npm install simple-git fs-extra shelljs glob
```

### 2️⃣ Start the Server

```bash
node server.js
```

You should see:
```
Server is running on port 3000
Webhook endpoint: http://localhost:3000/webhook/github
```

### 3️⃣ Test the System

Open a new terminal and run:

```bash
cd backend
node test-grading.js
```

This will run 5 automated tests to verify everything works!

---

## 📝 Manual Testing with cURL

### Health Check
```bash
curl http://localhost:3000/api/grade/health
```

### Grade a Repository
```bash
curl -X POST http://localhost:3000/api/grade \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/student/html-css-project",
    "moduleNumber": 2,
    "studentName": "john-doe"
  }'
```

---

## 📂 What Was Created

### Core System Files:
1. **[backend/grading-engine/cloner.js](backend/grading-engine/cloner.js)** - Clones & cleans up repositories
2. **[backend/grading-engine/utils/fileChecker.js](backend/grading-engine/utils/fileChecker.js)** - File/folder validation utilities
3. **[backend/grading-engine/module-handlers/module02.js](backend/grading-engine/module-handlers/module02.js)** - Module 02 grading logic
4. **[backend/controllers/gradingController.js](backend/controllers/gradingController.js)** - Main API controller
5. **[backend/routes/gradingRoutes.js](backend/routes/gradingRoutes.js)** - API routes

### Documentation & Testing:
6. **[backend/GRADING_SYSTEM_README.md](backend/GRADING_SYSTEM_README.md)** - Complete documentation
7. **[backend/INSTALLATION.md](backend/INSTALLATION.md)** - Installation guide
8. **[backend/test-grading.js](backend/test-grading.js)** - Automated test suite
9. **[backend/examples/grading-examples.js](backend/examples/grading-examples.js)** - Usage examples

---

## 🎯 Module 02 Grading Criteria

### What it checks:
- ✅ **Folders**: `Styles/`, `Scripts/`, `Assets/`
- ✅ **Files**: 
  - `index.html`
  - `Styles/index.css`
  - `Styles/loginForm.css`
  - `Styles/moodSelecter.css`
  - `Scripts/index.js`

### Scoring:
- Each correct folder/file: **5 points**
- Maximum score: **40 points** (Completeness)
- AI Code Quality: **60 points** (Coming soon)

---

## 🔧 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/grade` | Grade a submission |
| GET | `/api/grade/health` | Health check |

---

## 📊 Example Response

```json
{
  "success": true,
  "student": "john-doe",
  "moduleNumber": 2,
  "summary": {
    "totalScore": 35,
    "maxScore": 40,
    "percentage": "87.50",
    "status": "Good"
  },
  "results": {
    "completeness": {
      "score": 35,
      "passed": ["✓ Directory found: Styles/", "✓ File found: index.html"],
      "errors": ["✗ Missing file: Scripts/index.js"]
    }
  }
}
```

---

## 🐛 Troubleshooting

### "Server not reachable"
- Ensure `node server.js` is running
- Check port 3000 is not in use

### "Cloning failed"
- Verify Git is installed: `git --version`
- Ensure repository is public or credentials are set

### "Module not implemented"
- Only Module 02 is currently supported
- Check `moduleNumber: 2` in your request

---

## 🎓 Next Steps

1. **Test with Real Repository**: Replace the test URL with an actual student repo
2. **Add More Modules**: Create `module03.js`, `module04.js` etc.
3. **Integrate AI**: Add OpenAI for code quality analysis
4. **Build UI**: Create a dashboard to view results

---

## 📚 Additional Resources

- Full Documentation: [GRADING_SYSTEM_README.md](GRADING_SYSTEM_README.md)
- Installation Guide: [INSTALLATION.md](INSTALLATION.md)
- Usage Examples: [examples/grading-examples.js](examples/grading-examples.js)

---

## 💡 Pro Tips

1. **Temp Files**: Cloned repos are auto-deleted after grading
2. **Error Handling**: System gracefully handles failed clones
3. **Logging**: Check console for detailed `[Cloner]`, `[Module02]` logs
4. **Parallel Grading**: Can handle multiple requests (repos isolated by timestamp)

---

## ✅ System Features

- ✅ Automatic repository cloning
- ✅ Deterministic file/folder validation
- ✅ Detailed error reporting
- ✅ Automatic cleanup
- ✅ Comprehensive logging
- ✅ RESTful API
- ✅ Production-ready error handling
- ⏳ AI code quality (coming soon)

---

**Built for Metana Coding Bootcamp** 🎓

Need help? Check the documentation or review the code comments!
