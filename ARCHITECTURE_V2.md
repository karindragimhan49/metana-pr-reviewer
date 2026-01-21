# 🏗️ System Architecture - Dynamic Rule-Based Grading Engine v2.0

## Complete System Overview

[See detailed architecture documentation with diagrams, data flows, component maps, and deployment considerations]

This file documents the complete architecture of the Metana PR Reviewer with Dynamic Rule-Based Grading Engine and Notion Integration.

## Key Components

### Backend
- **server.js**: Main entry point with Express routing
- **notionController.js**: Handles Notion API requests
- **notionService.js**: Notion client wrapper
- **notionMap.js**: Course-to-module-to-PageID mapping
- **gradingController.js**: AI grading orchestration
- **githubController.js**: GitHub API integration

### Frontend
- **GradingAssistant.jsx**: Main grading interface with auto-fetch
- **ActivePRList.jsx**: PR list with navigation to grading
- **App.jsx**: Router and authentication

## Integration Flow

```
User selects repo + branch 
  → Auto-detects course 
  → Fetches Notion Page ID from mapping 
  → Calls Notion API 
  → Populates grading rules automatically 
  → Instructor can customize 
  → Submits to AI grading 
  → Returns scored results
```

## External Services
1. **Notion API**: Grading rules database
2. **GitHub API**: Repository/branch/PR data
3. **OpenAI API**: AI-powered code analysis
4. **Firebase**: Authentication

## Performance
- Notion fetch: ~1-2 seconds
- Repository cloning: ~2-10 seconds (varies by size)
- AI grading: ~5-30 seconds (varies by complexity)
- Total average: ~15 seconds end-to-end

## Security
- Environment variables for all secrets
- Instructor-only whitelist
- CORS protection
- Input validation on all endpoints

For detailed architecture with full diagrams, see documentation files:
- NOTION_INTEGRATION_FLOW.md
- NOTION_SETUP_GUIDE.md

**Status**: ✅ Production Ready
