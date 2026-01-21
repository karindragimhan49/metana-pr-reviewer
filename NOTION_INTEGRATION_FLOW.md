# 🔄 Notion Integration Flow

## Complete Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NOTION INTEGRATION FLOW                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  Instructor UI  │
│  (Frontend)     │
└────────┬────────┘
         │
         │ 1. Selects Repo (e.g., "fullstack-fsd20b-mousa")
         │ 2. Selects Branch (e.g., "module-02")
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  GradingAssistant.jsx                                        │
│  ────────────────────                                        │
│  useEffect(() => {                                           │
│    if (selectedRepo && formData.branchName) {                │
│      fetchGradingRules(repoName, branchName);                │
│    }                                                          │
│  }, [selectedRepo, formData.branchName]);                    │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           │ POST /api/notion/rules
                           │ Body: { repoName, branchName }
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  Backend: notionRoutes.js                                    │
│  ─────────────────────────                                   │
│  router.post('/rules', notionController.getGradingRules)     │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  notionController.js                                         │
│  ────────────────────                                        │
│  1. Extract repoName & branchName from request               │
│  2. detectCourseType(repoName)                               │
│     • "fullstack-fsd20b-mousa" → "fullstack"                 │
│  3. getNotionPageId(courseType, branchName)                  │
│     • COURSE_MAP["fullstack"]["module-02"]                   │
│     • Returns: "1fc10bb6c03980fd9dcfe2dfa9b4be9f"            │
│  4. Call notionService.fetchPageContent(pageId)              │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  notionService.js                                            │
│  ─────────────────                                           │
│  1. Initialize Notion client with NOTION_API_KEY             │
│  2. notion.blocks.children.list({ block_id: pageId })        │
│  3. Loop through all blocks:                                 │
│     • paragraph → extract plain text                         │
│     • heading_1/2/3 → extract with #/##/###                  │
│     • bulleted_list_item → extract with "-"                  │
│     • numbered_list_item → extract with "1."                 │
│     • code → extract with ```language\n...```                │
│     • quote → extract with "> "                              │
│     • callout → extract text + icon                          │
│  4. Combine all text into single string                      │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           │ Returns full page content
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  Response to Frontend                                        │
│  ────────────────────                                        │
│  {                                                            │
│    "success": true,                                          │
│    "gradingInstructions": "# Module 02...\n\n...",           │
│    "course": "fullstack",                                    │
│    "module": "module-02"                                     │
│  }                                                            │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  GradingAssistant.jsx - Update State                         │
│  ─────────────────────────────────────                       │
│  setFormData(prev => ({                                      │
│    ...prev,                                                  │
│    customInstructions: response.data.gradingInstructions     │
│  }));                                                         │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  Textarea Auto-Populated ✅                                   │
│  ────────────────────────                                    │
│  Grading rules from Notion now visible to instructor!        │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Files

### Frontend
- **`frontend/src/components/GradingAssistant.jsx`**
  - Lines 37-38: `fetchingRules` state
  - Lines 130-160: `fetchGradingRules()` function
  - Lines 220-228: `useEffect` auto-trigger
  - Lines 515-523: Visual loading indicator in textarea

### Backend
- **`backend/config/notionMap.js`**
  - Course-to-module-to-PageID mapping
  - `detectCourseType(repoName)` helper
  - `getNotionPageId(course, branch)` helper

- **`backend/services/notionService.js`**
  - Notion client initialization
  - `fetchPageContent(pageId)` - main fetch logic
  - `extractTextFromBlock(block)` - parser for all block types
  - `extractRichText(richTextArray)` - text combiner

- **`backend/controllers/notionController.js`**
  - `getGradingRules(req, res)` - POST /api/notion/rules handler
  - `checkHealth(req, res)` - GET /api/notion/health
  - Error handling for missing config/pages

- **`backend/routes/notionRoutes.js`**
  - Route definitions

- **`backend/server.js`**
  - Line: `app.use('/api/notion', notionRoutes)`

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Error Scenario 1: Notion API Key Not Set                  │
├─────────────────────────────────────────────────────────────┤
│  1. Backend checks process.env.NOTION_API_KEY               │
│  2. If missing → 500 error                                  │
│  3. Frontend shows: "⚠️ Notion integration not configured"  │
│  4. Troubleshooting steps displayed                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Error Scenario 2: Course Not Detected                     │
├─────────────────────────────────────────────────────────────┤
│  1. detectCourseType(repoName) returns null                 │
│  2. Backend → 400 error                                     │
│  3. Frontend shows: "Could not detect course type"          │
│  4. Suggests checking repo name pattern                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Error Scenario 3: Notion Page ID Not Mapped               │
├─────────────────────────────────────────────────────────────┤
│  1. getNotionPageId() doesn't find course/branch combo      │
│  2. Backend → 404 error                                     │
│  3. Frontend shows: "No grading rules found"                │
│  4. Suggests updating notionMap.js                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Error Scenario 4: Notion API Error                        │
├─────────────────────────────────────────────────────────────┤
│  1. Notion client throws error (wrong ID, no access, etc.)  │
│  2. Backend catches and logs error                          │
│  3. Frontend shows: "Failed to fetch from Notion"           │
│  4. Displays Notion error message                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### Example 1: Successful Fetch
```javascript
// Input
repoName: "fullstack-fsd20b-mousa"
branchName: "module-02"

// Step 1: Course Detection
detectCourseType("fullstack-fsd20b-mousa")
→ "fullstack"

// Step 2: Page ID Lookup
COURSE_MAP["fullstack"]["module-02"]
→ "1fc10bb6c03980fd9dcfe2dfa9b4be9f"

// Step 3: Notion Fetch
notion.blocks.children.list({
  block_id: "1fc10bb6c03980fd9dcfe2dfa9b4be9f"
})
→ [block1, block2, block3, ...]

// Step 4: Text Extraction
"# Module 02 Grading Criteria\n\n## Required Features\n- Feature 1..."

// Step 5: Response
{
  success: true,
  gradingInstructions: "...",
  course: "fullstack",
  module: "module-02"
}
```

### Example 2: Missing Page ID
```javascript
// Input
repoName: "solidity-sol-74-poppy"
branchName: "module-05"

// Step 1: Course Detection ✅
detectCourseType("solidity-sol-74-poppy")
→ "solidity"

// Step 2: Page ID Lookup ❌
COURSE_MAP["solidity"]["module-05"]
→ undefined

// Step 3: Error Response
{
  success: false,
  error: "Notion Page ID not found for course 'solidity', module 'module-05'"
}

// Step 4: Frontend Display
"⚠️ No grading rules configured for this module yet.
Please update backend/config/notionMap.js..."
```

---

## State Management

### Frontend States

```javascript
// Loading State
fetchingRules: false → true → false

// Form Data State
formData.customInstructions:
  "" → "Fetching rules from Notion..." → "# Module 02..."

// Visual Feedback
Label: "4. Grading Instructions" 
     → "4. Grading Instructions 🔄 Fetching from Notion..."
     → "4. Grading Instructions"

Textarea: enabled → disabled → enabled

Hint: "💡 Tip: Be specific..."
    → "⏳ Loading grading rules from Notion database..."
    → "💡 Tip: Be specific..."
```

### Backend States

```javascript
// Request Flow
1. Receive POST /api/notion/rules
2. Validate: repoName ✅ branchName ✅
3. Detect course type
4. Look up page ID
5. Fetch from Notion API
6. Extract and format text
7. Return JSON response
```

---

## Testing Checklist

### Backend Tests
```bash
# 1. Health check
curl http://localhost:3000/api/notion/health

# 2. Test with valid course/module
curl -X POST http://localhost:3000/api/notion/rules \
  -H "Content-Type: application/json" \
  -d '{"repoName":"fullstack-fsd20b-mousa","branchName":"module-02"}'

# 3. Test with invalid course
curl -X POST http://localhost:3000/api/notion/rules \
  -H "Content-Type: application/json" \
  -d '{"repoName":"unknown-repo","branchName":"module-01"}'

# 4. Test with unmapped module
curl -X POST http://localhost:3000/api/notion/rules \
  -H "Content-Type: application/json" \
  -d '{"repoName":"fullstack-test","branchName":"module-99"}'
```

### Frontend Tests
1. Open Grading Assistant
2. Select "fullstack-fsd20b-mousa"
3. Select "module-02" branch
4. Verify:
   - [ ] "🔄 Fetching from Notion..." appears in label
   - [ ] Textarea shows "Fetching rules from Notion..."
   - [ ] Textarea becomes disabled
   - [ ] After 1-2 seconds, rules appear
   - [ ] Label returns to normal
   - [ ] Textarea becomes enabled again
   - [ ] Hint shows "⏳ Loading..." then returns to normal

### Error Tests
1. Test with unmapped module
2. Test with invalid NOTION_API_KEY
3. Test with unshared Notion page
4. Test with deleted Notion page

---

## Performance Considerations

- **Caching**: Consider adding Redis cache for frequently accessed pages
- **Rate Limits**: Notion API has rate limits (3 requests/second)
- **Debouncing**: Current implementation prevents double-fetching via useEffect deps
- **Timeout**: Axios default timeout is sufficient (~30 seconds)

---

## Future Enhancements

1. **Cache Notion responses** in backend (Redis/memory)
2. **Refresh button** to manually re-fetch if rules updated
3. **Notion database view** instead of individual pages
4. **Version tracking** to show when rules were last updated
5. **Diff view** to compare rule changes over time
6. **Fallback rules** if Notion is unavailable
7. **Admin UI** to manage Page ID mappings without editing code

---

**Status**: ✅ Fully Implemented | Ready for Environment Setup
