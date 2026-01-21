# 🚀 Notion Integration Setup Guide

## Overview
This guide walks you through setting up the Notion integration for the dynamic grading rules engine.

---

## Prerequisites
- ✅ Notion workspace with access to create integrations
- ✅ Backend server configured and running
- ✅ Grading rules documented in Notion pages

---

## Step 1: Create Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in details:
   - **Name**: `Metana PR Reviewer`
   - **Associated workspace**: Select your workspace
   - **Type**: Internal
4. Click **"Submit"**
5. **Copy the "Internal Integration Token"** (starts with `secret_`)

---

## Step 2: Configure Backend Environment

1. Navigate to `backend/` folder
2. Create or edit `.env` file:

```env
# Notion API Configuration
NOTION_API_KEY=secret_YOUR_INTEGRATION_TOKEN_HERE

# Other existing variables
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_key
PORT=3000
```

3. Save the file

---

## Step 3: Share Notion Pages with Integration

For each Notion page containing grading rules:

1. Open the Notion page
2. Click **"Share"** (top right)
3. Click **"Invite"**
4. Search for **"Metana PR Reviewer"** (your integration name)
5. Click **"Invite"**

**Important**: You must share EVERY page that contains grading rules!

---

## Step 4: Get Notion Page IDs

### Method 1: From URL
1. Open the Notion page
2. Copy the URL: `https://notion.so/Page-Name-1fc10bb6c03980fd9dcfe2dfa9b4be9f`
3. The Page ID is the last part: `1fc10bb6c03980fd9dcfe2dfa9b4be9f`

### Method 2: Share Link
1. Click **"Share"** → **"Copy link"**
2. The link contains the page ID at the end

---

## Step 5: Update Notion Mapping

Edit `backend/config/notionMap.js`:

```javascript
const COURSE_MAP = {
  // Solidity Courses
  solidity: {
    'module-01': 'PAGE_ID_HERE',
    'module-02': 'PAGE_ID_HERE',
    'module-03': 'PAGE_ID_HERE',
    // ... add all modules
  },

  // Full Stack Courses
  fullstack: {
    'module-01': 'PAGE_ID_HERE',
    'module-02': '1fc10bb6c03980fd9dcfe2dfa9b4be9f', // ✅ Already configured
    'module-03': 'PAGE_ID_HERE',
    // ... add all modules
  },

  // Cyber Security Courses
  seca: {
    'module-01': 'PAGE_ID_HERE',
    'module-02': 'PAGE_ID_HERE',
    // ... add all modules
  },

  // Rust Courses
  rust: {
    'module-01': 'PAGE_ID_HERE',
    'module-02': 'PAGE_ID_HERE',
    // ... add all modules
  }
};
```

---

## Step 6: Organize Notion Pages

### Recommended Structure:

```
📁 Grading Rules (Database or Folder)
  ├── 📄 Solidity Module 01 - Introduction
  ├── 📄 Solidity Module 02 - Smart Contracts
  ├── 📄 Solidity Module 03 - Security
  ├── 📄 Fullstack Module 01 - HTML/CSS
  ├── 📄 Fullstack Module 02 - JavaScript  ✅ Currently mapped
  └── ... (all other modules)
```

### Page Content Format:

Each Notion page should contain:

```markdown
# Module XX Grading Criteria

## Overview
Brief description of what this module covers

## Required Features
- Feature 1
- Feature 2
- Feature 3

## Grading Rubric

### Category 1: Implementation (40 points)
- Criterion A (20 points)
- Criterion B (15 points)
- Criterion C (5 points)

### Category 2: Code Quality (30 points)
- Clean code practices
- Proper comments
- Error handling

### Category 3: Testing (30 points)
- Unit tests present
- Edge cases covered
- Test coverage > 80%

## Common Issues to Check
- Issue 1
- Issue 2
- Issue 3

## Bonus Points (Optional)
- Advanced implementation (+10)
- Extra features (+5)
```

---

## Step 7: Test the Integration

### Backend Health Check:
```bash
curl http://localhost:3000/api/notion/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Notion service is configured",
  "hasApiKey": true
}
```

### Test Fetching Rules:
```bash
curl -X POST http://localhost:3000/api/notion/rules \
  -H "Content-Type: application/json" \
  -d '{
    "repoName": "fullstack-fsd20b-mousa",
    "branchName": "module-02"
  }'
```

Expected response:
```json
{
  "success": true,
  "gradingInstructions": "# Module 02 Grading Criteria\n\n...",
  "course": "fullstack",
  "module": "module-02"
}
```

---

## Step 8: Frontend Testing

1. Start both backend and frontend:
```bash
# Backend
cd backend
npm start

# Frontend (new terminal)
cd frontend
npm run dev
```

2. Open `http://localhost:5173` (or your Vite port)
3. Navigate to **Grading Assistant**
4. Select a repository (e.g., `fullstack-fsd20b-mousa`)
5. Select branch `module-02`
6. **Watch the magic!** 🎉
   - You should see "🔄 Fetching from Notion..." in the label
   - The textarea will show "Fetching rules from Notion..."
   - After ~1-2 seconds, grading rules appear automatically!

---

## Troubleshooting

### ❌ Error: "Notion Page ID not found"
**Solution**: Update `backend/config/notionMap.js` with the correct Page ID for that course/module

### ❌ Error: "NOTION_API_KEY not configured"
**Solution**: Check `backend/.env` has `NOTION_API_KEY=secret_...`

### ❌ Error: "Object not found" (from Notion API)
**Solution**: 
- Verify the Page ID is correct (copy from URL)
- Make sure you shared the page with your integration
- Check that the integration has read access

### ❌ Error: "Course not detected"
**Solution**: Repository name must match pattern:
- `solidity-*` or `sol-*` → Solidity
- `fullstack-*` or `fsd*` → Full Stack
- `seca*` → Cyber Security
- `rust-*` → Rust

### ❌ Rules not loading automatically
**Solution**:
- Check browser console for errors (F12 → Console)
- Verify backend is running on port 3000
- Check CORS settings if needed

### ❌ "Cannot read properties of undefined" error
**Solution**: The Notion page might be empty or improperly formatted. Add some content to the page.

---

## Course Detection Logic

The system automatically detects courses based on repository name:

| Repo Name Pattern | Detected Course | Badge Color |
|------------------|----------------|-------------|
| `solidity-*` or `sol-*` | Solidity | Blue ⚡ |
| `fullstack-*` or `fsd*` | Full Stack | Purple 🌐 |
| `seca*` | Cyber Security | Red 🔒 |
| `rust-*` | Rust | Orange 🦀 |
| _other_ | General Engineering | Gray 📚 |

---

## Next Steps

1. **Document all modules** in Notion with clear grading criteria
2. **Share each page** with your integration
3. **Update notionMap.js** with all Page IDs
4. **Test each course/module** combination
5. **Refine grading rules** based on instructor feedback

---

## Support

If you encounter issues:
1. Check backend logs: Look for console output from server
2. Check frontend logs: Open browser DevTools (F12)
3. Verify Notion page permissions
4. Test with curl commands first before using UI

---

## Security Notes

⚠️ **NEVER commit `.env` to Git!** Add to `.gitignore`:
```
.env
.env.local
.env.production
```

✅ Store `NOTION_API_KEY` securely (use environment variables in production)

---

## Benefits of This System

✅ **Dynamic**: Update grading rules in Notion without code changes
✅ **Centralized**: All instructors can access and update rules
✅ **Versioned**: Notion has built-in version history
✅ **Collaborative**: Multiple instructors can contribute
✅ **Fast**: Auto-fetches rules when branch is selected
✅ **Scalable**: Easy to add new courses and modules

---

**Status**: ✅ Backend Complete | ✅ Frontend Complete | ⏳ Notion Pages Setup Needed
