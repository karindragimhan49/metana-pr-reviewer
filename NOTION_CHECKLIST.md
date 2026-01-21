# ✅ Notion Integration - Pre-Launch Checklist

## 📋 Before You Start

Print this checklist and check off each item as you complete it!

---

## Part 1: Notion Setup (10 minutes)

### Step 1.1: Create Notion Integration
- [ ] Go to https://www.notion.so/my-integrations
- [ ] Click **"+ New integration"**
- [ ] Name: `Metana PR Reviewer`
- [ ] Select your workspace
- [ ] Type: **Internal**
- [ ] Click **"Submit"**
- [ ] **Copy the integration token** (starts with `secret_`)
- [ ] Save token in a secure location (you'll need it next)

### Step 1.2: Configure Backend Environment
- [ ] Navigate to `backend/` folder
- [ ] Open `.env` file (create if it doesn't exist)
- [ ] Add this line:
  ```
  NOTION_API_KEY=secret_YOUR_ACTUAL_TOKEN_HERE
  ```
- [ ] Replace `secret_YOUR_ACTUAL_TOKEN_HERE` with your actual token
- [ ] Save the file
- [ ] Verify `.env` is in `.gitignore` ✅

---

## Part 2: Organize Notion Pages (15 minutes)

### Step 2.1: Create/Organize Grading Rules Pages
- [ ] Create a Notion folder/database: **"Grading Rules"**
- [ ] Create pages for each module (recommended structure):
  ```
  📁 Grading Rules
    ├── 📄 Solidity Module 01
    ├── 📄 Solidity Module 02
    ├── 📄 Solidity Module 03
    ├── ...
    ├── 📄 Full Stack Module 01
    ├── 📄 Full Stack Module 02  ✅ (Already mapped!)
    ├── ...
    ├── 📄 Cyber Security Module 01
    ├── ...
    └── 📄 Rust Module 01
  ```

### Step 2.2: Format Each Page
Use this template for each grading page:

```markdown
# Module XX Grading Criteria

## Overview
[Brief description of module topics]

## Required Features
- Feature 1
- Feature 2
- Feature 3

## Grading Rubric

### Category 1: Implementation (40 points)
- Criterion A (20 points): [description]
- Criterion B (15 points): [description]
- Criterion C (5 points): [description]

### Category 2: Code Quality (30 points)
- Clean code
- Comments
- Error handling

### Category 3: Testing (30 points)
- Unit tests
- Edge cases
- Coverage > 80%

## Common Issues to Check
- Issue 1
- Issue 2
- Issue 3

## Bonus Points
- Advanced feature (+10)
- Extra creativity (+5)
```

Check off each page as you create it:
- [ ] Solidity Module 01
- [ ] Solidity Module 02
- [ ] Solidity Module 03
- [ ] (Add all your modules...)
- [ ] Full Stack Module 01
- [ ] Full Stack Module 02 ✅
- [ ] (Continue...)

### Step 2.3: Share ALL Pages with Integration
For EACH page created above:
- [ ] Open the page
- [ ] Click **"Share"** (top right)
- [ ] Click **"Invite"**
- [ ] Search for **"Metana PR Reviewer"**
- [ ] Click **"Invite"**
- [ ] Verify integration appears in shared list

**Pro tip**: You can share the parent folder and all children inherit access!

---

## Part 3: Get Page IDs (20 minutes)

### Step 3.1: Extract Page IDs
For each page, do this:

1. Open the Notion page
2. Click **"Share"** → **"Copy link"**
3. Paste the link somewhere (it looks like this):
   ```
   https://www.notion.so/Module-02-Full-Stack-1fc10bb6c03980fd9dcfe2dfa9b4be9f
   ```
4. The Page ID is the **last part**: `1fc10bb6c03980fd9dcfe2dfa9b4be9f`
5. Write it down in this format:
   ```
   Course: Solidity | Module: module-01 | Page ID: ___________
   Course: Solidity | Module: module-02 | Page ID: ___________
   Course: Fullstack | Module: module-02 | Page ID: 1fc10bb6c03980fd9dcfe2dfa9b4be9f ✅
   ...
   ```

### Step 3.2: Update notionMap.js
- [ ] Open `backend/config/notionMap.js`
- [ ] Find the `COURSE_MAP` object
- [ ] Add ALL your Page IDs:

```javascript
const COURSE_MAP = {
  solidity: {
    'module-01': 'YOUR_PAGE_ID_1',
    'module-02': 'YOUR_PAGE_ID_2',
    'module-03': 'YOUR_PAGE_ID_3',
    // ... add all
  },
  
  fullstack: {
    'module-01': 'YOUR_PAGE_ID_X',
    'module-02': '1fc10bb6c03980fd9dcfe2dfa9b4be9f', // ✅ Already done!
    'module-03': 'YOUR_PAGE_ID_Y',
    // ... add all
  },
  
  seca: {
    'module-01': 'YOUR_PAGE_ID_A',
    'module-02': 'YOUR_PAGE_ID_B',
    // ... add all
  },
  
  rust: {
    'module-01': 'YOUR_PAGE_ID_M',
    'module-02': 'YOUR_PAGE_ID_N',
    // ... add all
  }
};
```

- [ ] Save the file
- [ ] Double-check all IDs are correct (32 characters, alphanumeric)

---

## Part 4: Backend Testing (10 minutes)

### Step 4.1: Start Backend Server
```bash
cd backend
npm start
```

- [ ] Server starts without errors
- [ ] Console shows: `Server is running on port 3000`

### Step 4.2: Test Notion Health Check
In a new terminal:
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

- [ ] ✅ Response shows `"hasApiKey": true`
- [ ] ❌ If false, check `NOTION_API_KEY` in `.env`

### Step 4.3: Test Fetching Rules
```bash
curl -X POST http://localhost:3000/api/notion/rules \
  -H "Content-Type: application/json" \
  -d '{"repoName":"fullstack-fsd20b-mousa","branchName":"module-02"}'
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

- [ ] ✅ Response shows `"success": true`
- [ ] ✅ `gradingInstructions` contains text from your Notion page
- [ ] ✅ `course` is "fullstack"
- [ ] ✅ `module` is "module-02"

### Step 4.4: Test Other Courses
Test each course you've configured:

```bash
# Solidity
curl -X POST http://localhost:3000/api/notion/rules \
  -H "Content-Type: application/json" \
  -d '{"repoName":"solidity-sol-74-poppy","branchName":"module-01"}'
```

- [ ] Solidity module-01 works
- [ ] Solidity module-02 works
- [ ] (Test all configured modules...)

### Step 4.5: Test Error Cases
```bash
# Test unmapped module
curl -X POST http://localhost:3000/api/notion/rules \
  -H "Content-Type: application/json" \
  -d '{"repoName":"fullstack-test","branchName":"module-99"}'
```

- [ ] Returns error: "Notion Page ID not found"
- [ ] Error message is clear and helpful

---

## Part 5: Frontend Testing (15 minutes)

### Step 5.1: Start Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```

- [ ] Frontend starts without errors
- [ ] Opens browser at `http://localhost:5173` (or shown port)

### Step 5.2: Login
- [ ] Login with instructor email: `karindra@gmail.com`
- [ ] Successfully redirected to dashboard

### Step 5.3: Navigate to Grading Assistant
- [ ] Click **"Grading Assistant"** in sidebar
- [ ] Page loads correctly

### Step 5.4: Test Auto-Fetch
1. Click repository dropdown
2. Select: **"fullstack-fsd20b-mousa"**
3. Wait for branches to load
4. Select branch: **"module-02"**
5. **Watch carefully!**

Check these indicators:
- [ ] Label shows: "🔄 Fetching from Notion..."
- [ ] Textarea shows: "Fetching rules from Notion..."
- [ ] Textarea becomes disabled (grayed out)
- [ ] After 1-2 seconds, grading rules appear
- [ ] Label returns to: "4. Grading Instructions / Custom Rubric"
- [ ] Textarea becomes editable again
- [ ] Hint changes from "⏳ Loading..." to "💡 Tip: Be specific..."

### Step 5.5: Verify Content
- [ ] Grading rules in textarea match your Notion page
- [ ] Formatting is preserved (headings, lists, etc.)
- [ ] No weird characters or encoding issues

### Step 5.6: Test Other Courses
Test each configured course:

- [ ] Select "solidity-sol-74-poppy" → "module-01"
  - [ ] Rules auto-load correctly
- [ ] Select "seca-cohort-2025" → "module-01"
  - [ ] Rules auto-load correctly
- [ ] (Test all your configured modules...)

### Step 5.7: Test Error Handling
Try an unmapped module:
- [ ] Select any repo
- [ ] Type a fake branch name in dropdown (if possible) OR
- [ ] Request a module you haven't configured
- [ ] Verify error message is clear and helpful

---

## Part 6: End-to-End Grading Flow (10 minutes)

### Step 6.1: Grade with Auto-Loaded Rules
1. Navigate to Grading Assistant
2. Select repository: `fullstack-fsd20b-mousa`
3. Select branch: `module-02`
4. Verify rules auto-load ✅
5. Optionally edit/customize rules
6. Add student name (optional)
7. Click **"Start AI Grading"**
8. Wait for analysis

- [ ] Grading completes successfully
- [ ] Results show score and feedback
- [ ] Feedback references the grading criteria from Notion

### Step 6.2: Test PR Integration
1. Navigate to **"Active PRs"**
2. Find a PR
3. Click **"Review"** button
4. Should redirect to Grading Assistant with:
   - [ ] Repository pre-filled
   - [ ] Branch pre-filled
   - [ ] Student name pre-filled
5. Grading rules should auto-load
6. Complete grading

---

## Part 7: Edge Cases & Polish (5 minutes)

### Step 7.1: Test Browser Console
- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Perform grading flow
- [ ] Check for errors (should be none)
- [ ] Look for success message: "🔄 Repo and branch selected, fetching grading rules..."

### Step 7.2: Test Multiple Selections
- [ ] Select repo A → branch 1 → rules load
- [ ] Change to repo B → branch 2 → new rules load
- [ ] Change only branch → rules update
- [ ] Verify no duplicate fetches

### Step 7.3: Test Manual Editing
- [ ] Let rules auto-load
- [ ] Manually edit the textarea
- [ ] Change branch → rules refresh
- [ ] Your edits are overwritten (expected behavior)

---

## Part 8: Documentation Review (5 minutes)

- [ ] Read [NOTION_SETUP_GUIDE.md](./NOTION_SETUP_GUIDE.md)
- [ ] Read [NOTION_INTEGRATION_FLOW.md](./NOTION_INTEGRATION_FLOW.md)
- [ ] Read [NOTION_IMPLEMENTATION_COMPLETE.md](./NOTION_IMPLEMENTATION_COMPLETE.md)
- [ ] Bookmark these for future reference

---

## Part 9: Security Check (5 minutes)

- [ ] `.env` is in `.gitignore`
- [ ] `NOTION_API_KEY` is not committed to Git
- [ ] Notion integration token is kept secure
- [ ] Only necessary pages are shared with integration
- [ ] Integration has read-only access (default)

---

## Part 10: Production Readiness (Optional)

### If Deploying to Production:
- [ ] Move `NOTION_API_KEY` to production environment variables
- [ ] Update CORS settings for production domain
- [ ] Test Notion API rate limits with expected load
- [ ] Consider adding Redis cache for frequently accessed pages
- [ ] Set up monitoring for Notion API errors
- [ ] Document Page ID mapping for other instructors
- [ ] Create backup of Notion pages
- [ ] Set up Notion workspace permissions

---

## 🎉 Final Verification

### You're ready to go if:
- [✅] Backend health check passes
- [✅] At least 1 module auto-loads correctly
- [✅] Error messages are clear and helpful
- [✅] Frontend shows loading indicators
- [✅] Rules appear in textarea automatically
- [✅] Grading works end-to-end with auto-loaded rules

---

## 📊 Success Criteria

| Metric | Target | Your Result |
|--------|--------|-------------|
| Backend health check | ✅ Pass | _____ |
| Modules configured | ≥10 | _____ |
| Auto-fetch working | ✅ Yes | _____ |
| Load time | <3 sec | _____ |
| Error handling | Clear messages | _____ |
| UI feedback | Visible indicators | _____ |

---

## 🐛 Common Issues During Testing

| Issue | Cause | Fix |
|-------|-------|-----|
| "hasApiKey: false" | Missing `.env` | Add `NOTION_API_KEY` |
| "Object not found" | Page not shared | Share with integration |
| "Page ID not found" | Not in notionMap | Update `notionMap.js` |
| Rules don't load | Backend not running | Start backend server |
| CORS error | Wrong origin | Check `server.js` CORS |
| Slow loading | Large Notion page | Consider splitting page |

---

## 📞 Need Help?

### Debugging Steps:
1. Check backend console for error logs
2. Check frontend console (F12) for errors
3. Test with curl first before using UI
4. Verify Page ID is correct (32 chars)
5. Verify page is shared with integration

### Reference Documents:
- **Setup**: [NOTION_SETUP_GUIDE.md](./NOTION_SETUP_GUIDE.md)
- **Architecture**: [NOTION_INTEGRATION_FLOW.md](./NOTION_INTEGRATION_FLOW.md)
- **Overview**: [NOTION_IMPLEMENTATION_COMPLETE.md](./NOTION_IMPLEMENTATION_COMPLETE.md)

---

## ✅ Sign-Off

Once all items are checked:

- [ ] **I have completed all setup steps**
- [ ] **I have tested at least 3 modules successfully**
- [ ] **I understand how to add new modules**
- [ ] **I know how to troubleshoot common issues**
- [ ] **The system is ready for production use**

**Completed by**: ________________  
**Date**: ________________  
**Total modules configured**: ______  
**Time taken**: ______ minutes

---

**Congratulations! 🎉 Your dynamic rule-based grading engine is now live!**

---

*Checklist version 1.0 - Updated for full Notion integration*
