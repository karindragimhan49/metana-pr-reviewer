# Automated Grading Assistant - Backend

## Overview
A scalable Node.js backend system for automated grading of coding bootcamp assignments using a **Hybrid Deterministic Engine** approach:
- **Deterministic Rules**: File-system checks for 100% structural accuracy
- **AI Analysis** (Coming Soon): Qualitative code quality assessment

---

## 📁 Project Structure

```
backend/
├── controllers/
│   └── gradingController.js      # Main API handler
├── grading-engine/
│   ├── cloner.js                  # Repository cloning & cleanup
│   ├── utils/
│   │   └── fileChecker.js         # File/folder validation utilities
│   └── module-handlers/
│       └── module02.js            # Module 02 grading logic
├── routes/
│   └── gradingRoutes.js           # API routes
└── server.js                       # Express server
```

---

## 🚀 Getting Started

### Prerequisites
```bash
npm install express simple-git fs-extra shelljs glob
```

### Environment Setup
Create a `.env` file:
```env
PORT=3000
NODE_ENV=development
```

### Start Server
```bash
cd backend
node server.js
```

---

## 📡 API Endpoints

### 1. Grade Submission
**POST** `/api/grade`

**Request Body:**
```json
{
  "repoUrl": "https://github.com/student/assignment-repo",
  "moduleNumber": 2,
  "studentName": "john-doe"
}
```

**Response:**
```json
{
  "success": true,
  "student": "john-doe",
  "moduleNumber": 2,
  "repositoryUrl": "https://github.com/student/assignment-repo",
  "results": {
    "moduleNumber": 2,
    "moduleName": "HTML/CSS Basics",
    "completeness": {
      "score": 40,
      "maxScore": 40,
      "passed": [
        "✓ Directory found: Styles/",
        "✓ File found: index.html",
        ...
      ],
      "errors": []
    },
    "codeQuality": {
      "score": 0,
      "maxScore": 60,
      "feedback": "AI analysis pending"
    },
    "totalScore": 40,
    "maxTotalScore": 100
  },
  "summary": {
    "totalScore": 40,
    "maxScore": 100,
    "percentage": "40.00",
    "status": "Needs Improvement"
  }
}
```

### 2. Health Check
**GET** `/api/grade/health`

**Response:**
```json
{
  "success": true,
  "service": "Automated Grading Assistant",
  "status": "operational",
  "availableModules": [2]
}
```

---

## 🎯 Module 02: HTML/CSS Basics

### Grading Criteria

#### Completeness (40 points)
| Check | Points | Description |
|-------|--------|-------------|
| `Styles/` directory | 5 | Required folder structure |
| `Scripts/` directory | 5 | Required folder structure |
| `Assets/` directory | 5 | Required folder structure |
| `index.html` | 5 | Main HTML file |
| `Styles/index.css` | 5 | Main stylesheet |
| `Scripts/index.js` | 5 | Main JavaScript file |
| `Styles/loginForm.css` | 5 | Login form styles |
| `Styles/moodSelecter.css` | 5 | Mood selector styles |

#### Code Quality (60 points) - Coming Soon
- HTML semantic structure
- CSS best practices
- Accessibility
- Responsive design

---

## 🧪 Testing with cURL

```bash
# Test grading endpoint
curl -X POST http://localhost:3000/api/grade \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/student/html-css-assignment",
    "moduleNumber": 2,
    "studentName": "test-student"
  }'

# Health check
curl http://localhost:3000/api/grade/health
```

---

## 🛠️ How It Works

### Grading Flow

1. **Request Received**
   - Validates `repoUrl`, `moduleNumber`, `studentName`

2. **Repository Cloning**
   - Clones to `./temp_submissions/{studentName}-{timestamp}`
   - Uses `simple-git` library

3. **Module Handler Routing**
   - Routes to specific module handler (e.g., `module02.js`)

4. **Deterministic Checks**
   - Validates folder structure
   - Checks required files
   - Assigns points based on criteria

5. **AI Analysis** (Placeholder)
   - Future: OpenAI integration for code quality

6. **Cleanup**
   - Always deletes cloned repository (even on error)
   - Ensures no disk space issues

7. **Response**
   - Returns JSON with scores and detailed feedback

---

## 🔒 Error Handling

The system includes comprehensive error handling:

- **Invalid GitHub URL**: Returns 400 error
- **Cloning Failure**: Returns 500 with error details
- **Missing Module Handler**: Returns 500 error
- **Cleanup Always Runs**: Uses `finally` block to ensure cleanup

---

## 📝 Adding New Modules

### Step 1: Create Module Handler
Create `backend/grading-engine/module-handlers/module03.js`:

```javascript
async function grade(repoPath) {
  // Your grading logic here
  return {
    moduleNumber: 3,
    moduleName: 'JavaScript Fundamentals',
    completeness: { score: 0, maxScore: 50, errors: [] },
    codeQuality: { score: 0, maxScore: 50, feedback: '' },
    totalScore: 0,
    maxTotalScore: 100
  };
}

module.exports = { grade };
```

### Step 2: Update Controller
In `gradingController.js`, add case to `routeToModuleHandler`:

```javascript
case 3:
  return await module03Handler.grade(repoPath);
```

---

## 🚀 Future Enhancements

- [ ] OpenAI integration for code quality analysis
- [ ] Support for multiple programming languages
- [ ] Plagiarism detection
- [ ] Automated test execution
- [ ] Batch grading for multiple students
- [ ] Web dashboard for results visualization
- [ ] Email notifications for grading completion

---

## 📊 Logging

All operations are logged with prefixes for easy debugging:
- `[Cloner]` - Repository operations
- `[Module02]` - Module-specific grading
- `[GradingController]` - Request handling
- `[FileChecker]` - File validation

---

## 🤝 Contributing

When adding new module handlers:
1. Follow the existing structure
2. Use the `fileChecker` utilities
3. Return consistent JSON structure
4. Add comprehensive logging
5. Update this README

---

## 📄 License

Internal use for Metana Coding Bootcamp

---

## 🐛 Troubleshooting

### Issue: Cloning fails
- Ensure Git is installed
- Check repository is public or credentials are provided

### Issue: Cleanup fails
- Check file permissions
- Ensure no processes are locking the temp directory

### Issue: Module handler not found
- Verify module number is supported
- Check `routeToModuleHandler` switch case

---

Built with ❤️ for Metana Coding Bootcamp
