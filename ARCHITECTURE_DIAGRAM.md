# 🏗️ System Architecture - Automated Grading Assistant

## High-Level Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                              │
│  POST /api/grade                                                    │
│  {                                                                  │
│    "repoUrl": "https://github.com/student/repo",                   │
│    "moduleNumber": 2,                                               │
│    "studentName": "john-doe"                                        │
│  }                                                                  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GRADING CONTROLLER                               │
│  (controllers/gradingController.js)                                 │
│                                                                     │
│  ① Validate Input                                                   │
│     ├─ Check GitHub URL format                                      │
│     ├─ Validate module number                                       │
│     └─ Verify student name                                          │
│                                                                     │
│  ② Clone Repository ────────────────────────┐                      │
└─────────────────────────────────────────────┼──────────────────────┘
                                              │
                                              ▼
                        ┌──────────────────────────────────────┐
                        │         CLONER MODULE                │
                        │  (grading-engine/cloner.js)          │
                        │                                      │
                        │  cloneRepo(url, student)             │
                        │  ├─ Create temp folder               │
                        │  │  temp_submissions/                │
                        │  │    └─ john-doe-1737123456789/     │
                        │  ├─ Execute git clone                │
                        │  └─ Return folder path               │
                        └──────────────┬───────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ③ Route to Module Handler (switch/case)                           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────────────┐
        │       MODULE 02 HANDLER                           │
        │  (grading-engine/module-handlers/module02.js)     │
        │                                                   │
        │  grade(repoPath)                                  │
        │    │                                              │
        │    ├──► Check Folder Structure                   │
        │    │    ├─ Styles/     [5 pts]                   │
        │    │    ├─ Scripts/    [5 pts]                   │
        │    │    └─ Assets/     [5 pts]                   │
        │    │                                              │
        │    ├──► Check Required Files                     │
        │    │    ├─ index.html              [5 pts]       │
        │    │    ├─ Styles/index.css        [5 pts]       │
        │    │    ├─ Styles/loginForm.css    [5 pts]       │
        │    │    ├─ Styles/moodSelecter.css [5 pts]       │
        │    │    └─ Scripts/index.js        [5 pts]       │
        │    │                                              │
        │    └──► AI Code Quality (Placeholder)            │
        │         └─ Returns dummy data [0/60 pts]         │
        │                                                   │
        │  Uses: FILE CHECKER UTILITIES ──────────┐        │
        └─────────────────┬───────────────────────┼────────┘
                          │                       │
                          │                       ▼
                          │    ┌──────────────────────────────────┐
                          │    │   FILE CHECKER UTILS             │
                          │    │  (grading-engine/utils/          │
                          │    │   fileChecker.js)                │
                          │    │                                  │
                          │    │  checkDirectoryExists(path)      │
                          │    │  checkFileExists(path)           │
                          │    │  checkMultipleFiles(...)         │
                          │    │  checkMultipleDirectories(...)   │
                          │    └──────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ④ Aggregate Results                                                │
│     {                                                               │
│       completeness: { score: 35, maxScore: 40, errors: [...] }    │
│       codeQuality: { score: 0, maxScore: 60, feedback: "..." }    │
│       totalScore: 35,                                              │
│       maxTotalScore: 100                                           │
│     }                                                              │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ⑤ Cleanup (ALWAYS RUNS - finally block)                           │
│                                                                     │
│     cloner.cleanupRepo(path)                                       │
│     └─ Deletes: temp_submissions/john-doe-1737123456789/           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ⑥ Send JSON Response                                               │
│     {                                                               │
│       "success": true,                                              │
│       "student": "john-doe",                                        │
│       "moduleNumber": 2,                                            │
│       "summary": {                                                  │
│         "totalScore": 35,                                           │
│         "maxScore": 100,                                            │
│         "percentage": "35.00",                                      │
│         "status": "Needs Improvement"                               │
│       },                                                            │
│       "results": { ... detailed breakdown ... }                     │
│     }                                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
┌──────────────────┐
│   Express.js     │
│   Server         │
└────────┬─────────┘
         │
         │ routes/gradingRoutes.js
         │
         ▼
┌─────────────────────────────────────────┐
│     gradingController.js                │
│  ┌───────────────────────────────────┐  │
│  │  gradeSubmission(req, res)        │  │
│  │    • Input validation             │  │
│  │    • Orchestrates workflow        │  │
│  │    • Error handling               │  │
│  └───────────────────────────────────┘  │
└──┬───────────────────────────────────┬──┘
   │                                   │
   │ Uses                           Uses
   ▼                                   ▼
┌──────────────────┐         ┌─────────────────────┐
│   cloner.js      │         │  Module Handlers    │
│                  │         │                     │
│  • cloneRepo()   │         │  module02.js        │
│  • cleanupRepo() │         │  • grade()          │
│  • validate URL  │         │  • scoring rules    │
└──────────────────┘         └──────────┬──────────┘
                                        │
                                     Uses
                                        ▼
                             ┌─────────────────────┐
                             │  fileChecker.js     │
                             │                     │
                             │  • checkFile()      │
                             │  • checkDir()       │
                             │  • batch checks     │
                             └─────────────────────┘
```

---

## Data Flow

```
INPUT DATA
──────────
{
  repoUrl: "https://github.com/student/repo",
  moduleNumber: 2,
  studentName: "john-doe"
}
        │
        ▼
VALIDATION
──────────
✓ Valid GitHub URL?
✓ Module exists?
✓ Student name valid?
        │
        ▼
CLONING
───────
Clone to: temp_submissions/john-doe-1737123456789/
        │
        ▼
GRADING
───────
Check:                          Points
• Styles/ exists?               5/5 ✓
• Scripts/ exists?              5/5 ✓
• Assets/ exists?               0/5 ✗ MISSING
• index.html exists?            5/5 ✓
• Styles/index.css exists?      5/5 ✓
• Styles/loginForm.css exists?  5/5 ✓
• Styles/moodSelecter.css?      0/5 ✗ MISSING
• Scripts/index.js exists?      5/5 ✓
                          ──────────
                          Total: 35/40
        │
        ▼
AGGREGATION
───────────
{
  completeness: { score: 35, maxScore: 40 },
  codeQuality: { score: 0, maxScore: 60 },
  totalScore: 35,
  maxTotalScore: 100,
  percentage: 35.00,
  status: "Needs Improvement"
}
        │
        ▼
CLEANUP
───────
Delete: temp_submissions/john-doe-1737123456789/
        │
        ▼
OUTPUT DATA
───────────
{
  success: true,
  student: "john-doe",
  summary: { ... },
  results: { ... },
  timestamp: "2026-01-19T..."
}
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────┐
│         Error Scenarios                 │
└────────────────┬────────────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
     ▼                       ▼
┌─────────────┐      ┌──────────────┐
│ Validation  │      │  Runtime     │
│   Errors    │      │   Errors     │
└──────┬──────┘      └──────┬───────┘
       │                    │
       │                    │
┌──────▼──────────────────────────▼────────┐
│     try {                                │
│       validate()  ← 400 Bad Request      │
│       clone()     ← 500 Clone Failed     │
│       grade()     ← 500 Grade Failed     │
│     }                                    │
│     catch (error) {                      │
│       ← Return error JSON                │
│     }                                    │
│     finally {                            │
│       cleanup()  ← ALWAYS RUNS           │
│     }                                    │
└──────────────────────────────────────────┘
```

---

## File System Layout

```
BEFORE GRADING:
backend/
├── temp_submissions/          (empty or doesn't exist)
└── ...

DURING GRADING:
backend/
├── temp_submissions/
│   └── john-doe-1737123456789/      ← CLONED REPO
│       ├── index.html
│       ├── Styles/
│       │   ├── index.css
│       │   └── loginForm.css
│       ├── Scripts/
│       │   └── index.js
│       └── Assets/
└── ...

AFTER GRADING:
backend/
├── temp_submissions/          (empty again - cleaned up)
└── ...
```

---

## Scoring Calculation

```
Module 02 Scoring Breakdown
───────────────────────────

COMPLETENESS (40 points max)
┌──────────────────────────────────────────┐
│ Item                    │ Points │ Score │
├─────────────────────────┼────────┼───────┤
│ Styles/ directory       │   5    │   ?   │
│ Scripts/ directory      │   5    │   ?   │
│ Assets/ directory       │   5    │   ?   │
│ index.html              │   5    │   ?   │
│ Styles/index.css        │   5    │   ?   │
│ Styles/loginForm.css    │   5    │   ?   │
│ Styles/moodSelecter.css │   5    │   ?   │
│ Scripts/index.js        │   5    │   ?   │
├─────────────────────────┴────────┼───────┤
│ COMPLETENESS TOTAL              │  ?/40 │
└─────────────────────────────────┴───────┘

CODE QUALITY (60 points max) - FUTURE
┌──────────────────────────────────────────┐
│ Aspect             │ Points │ Score      │
├────────────────────┼────────┼────────────┤
│ HTML Semantics     │   15   │  Pending   │
│ CSS Best Practices │   15   │  Pending   │
│ Accessibility      │   15   │  Pending   │
│ Responsive Design  │   15   │  Pending   │
├────────────────────┴────────┼────────────┤
│ CODE QUALITY TOTAL          │    0/60    │
└─────────────────────────────┴────────────┘

FINAL SCORE
┌──────────────────────────────────────────┐
│ Completeness        │      ?/40          │
│ Code Quality        │      0/60          │
├─────────────────────┼────────────────────┤
│ TOTAL               │     ?/100          │
├─────────────────────┼────────────────────┤
│ Percentage          │      ?%            │
├─────────────────────┼────────────────────┤
│ Status              │  Excellent (90%+)  │
│                     │  Good (80-89%)     │
│                     │  Satisfactory      │
│                     │    (70-79%)        │
│                     │  Needs Improve     │
│                     │    (60-69%)        │
│                     │  Unsatisfactory    │
│                     │    (<60%)          │
└─────────────────────┴────────────────────┘
```

---

## API Endpoints Detail

```
ENDPOINT 1: Grade Submission
────────────────────────────
POST /api/grade

Request Headers:
  Content-Type: application/json

Request Body:
  {
    "repoUrl": string (required) - GitHub repo URL
    "moduleNumber": number (required) - Module to grade
    "studentName": string (required) - Student identifier
  }

Response (200 OK):
  {
    "success": true,
    "student": string,
    "moduleNumber": number,
    "repositoryUrl": string,
    "results": {
      "moduleNumber": number,
      "moduleName": string,
      "completeness": {
        "score": number,
        "maxScore": number,
        "passed": string[],
        "errors": string[],
        "warnings": string[]
      },
      "codeQuality": {
        "score": number,
        "maxScore": number,
        "feedback": string
      },
      "totalScore": number,
      "maxTotalScore": number,
      "gradedAt": string (ISO date)
    },
    "summary": {
      "totalScore": number,
      "maxScore": number,
      "percentage": string,
      "status": string
    },
    "timestamp": string (ISO date)
  }

Error Response (400 Bad Request):
  {
    "success": false,
    "error": string
  }

Error Response (500 Internal Error):
  {
    "success": false,
    "error": string,
    "message": string,
    "timestamp": string
  }

────────────────────────────

ENDPOINT 2: Health Check
────────────────────────────
GET /api/grade/health

Response (200 OK):
  {
    "success": true,
    "service": "Automated Grading Assistant",
    "status": "operational",
    "availableModules": number[],
    "timestamp": string (ISO date)
  }
```

---

## Extensibility: Adding Module 03

```
Step 1: Create Handler
──────────────────────
File: backend/grading-engine/module-handlers/module03.js

async function grade(repoPath) {
  // Your custom grading logic
  return {
    moduleNumber: 3,
    moduleName: 'JavaScript Fundamentals',
    completeness: { ... },
    codeQuality: { ... },
    totalScore: 0,
    maxTotalScore: 100
  };
}
module.exports = { grade };

Step 2: Update Controller
─────────────────────────
File: backend/controllers/gradingController.js

// Add import
const module03Handler = require('../grading-engine/module-handlers/module03');

// Add case in routeToModuleHandler()
case 3:
  return await module03Handler.grade(repoPath);

Step 3: Test
────────────
curl -X POST http://localhost:3000/api/grade \
  -d '{"repoUrl":"...","moduleNumber":3,"studentName":"test"}'
```

---

## Security & Best Practices

```
✅ IMPLEMENTED
─────────────
• URL validation (GitHub only)
• Input sanitization (basic)
• Isolated temp folders
• Automatic cleanup
• Error messages don't leak sensitive data

⚠️ RECOMMENDED FOR PRODUCTION
──────────────────────────────
• Authentication (JWT/OAuth)
• Rate limiting (express-rate-limit)
• Request size limits
• Sandboxed execution (Docker)
• Virus scanning of cloned repos
• Timeout limits for long-running operations
• Database logging for audit trails
• HTTPS/TLS
• CORS configuration
• Environment variable secrets
```

---

**Diagram Version**: 1.0
**Last Updated**: January 19, 2026
