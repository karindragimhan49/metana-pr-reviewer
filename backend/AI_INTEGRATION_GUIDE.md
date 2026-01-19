# 🤖 AI Integration Guide - OpenAI Code Analysis

## Overview
The grading system now includes **AI-powered code quality analysis** using OpenAI's GPT-4o model. This provides intelligent assessment of:
- Clean code principles
- Variable naming conventions
- Code modularity and organization
- Best practices adherence
- Modern JavaScript patterns

---

## 🔑 Setup

### 1. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-...`)

### 2. Add to .env File
```env
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Install Package (Already Done)
```bash
npm install openai
```

---

## 🚀 How It Works

### Architecture
```
Grading Request
     ↓
Module 02 Handler
     ↓
Read Scripts/index.js
     ↓
AI Helper (aiHelper.js)
     ↓
OpenAI GPT-4o API
     ↓
AI Analysis Result
     ↓
Combined with Structural Score
     ↓
Final Grade (0-100)
```

### Scoring Breakdown
- **Completeness (40 points)**: Deterministic file/folder checks
- **Code Quality (60 points)**: AI-powered analysis

---

## 🧪 Testing

### Quick AI Test
```bash
cd backend
node test-ai-integration.js
```

This will:
1. ✅ Check API key configuration
2. ✅ Test OpenAI connectivity
3. ✅ Analyze sample JavaScript code
4. ✅ Display results and feedback

### Full System Test
```bash
node test-grading.js
```

### Real Grading with AI
```bash
curl -X POST http://localhost:3000/api/grade \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/student/html-css-project",
    "moduleNumber": 2,
    "studentName": "test-student"
  }'
```

---

## 📊 Response Structure

### Example Response (with AI)
```json
{
  "success": true,
  "student": "john-doe",
  "moduleNumber": 2,
  "results": {
    "completeness": {
      "score": 40,
      "maxScore": 40,
      "passed": ["✓ All files found"],
      "errors": []
    },
    "codeQuality": {
      "score": 52,
      "maxScore": 60,
      "feedback": "The code demonstrates good practices with clear variable naming and modular functions. Consider adding error handling and input validation. The code could benefit from more comments explaining complex logic.",
      "details": {
        "model": "gpt-4o",
        "tokensUsed": 287,
        "analyzedFile": "Scripts/index.js",
        "codeLength": 450
      }
    },
    "totalScore": 92,
    "maxTotalScore": 100
  },
  "summary": {
    "totalScore": 92,
    "maxScore": 100,
    "percentage": "92.00",
    "status": "Excellent"
  }
}
```

---

## 🔧 Configuration

### Model Selection
Default: **GPT-4o** (best quality)

To change model, edit `aiHelper.js`:
```javascript
model: 'gpt-4o',        // High quality, higher cost
// OR
model: 'gpt-3.5-turbo', // Faster, lower cost
```

### Temperature Setting
Current: `0.3` (more consistent results)

To adjust, edit `aiHelper.js`:
```javascript
temperature: 0.3, // 0.0 = very consistent, 1.0 = more creative
```

### Max Tokens
Current: `500` tokens for response

```javascript
max_tokens: 500, // Increase if you need longer feedback
```

---

## 📝 AI Analysis Criteria

The AI evaluates JavaScript code on:

1. **Clean Code Principles**
   - Readability
   - Simplicity
   - DRY (Don't Repeat Yourself)

2. **Variable Naming**
   - Descriptive names
   - Consistent conventions
   - Meaningful identifiers

3. **Code Modularity**
   - Focused functions
   - Reusability
   - Single responsibility

4. **Error Handling**
   - Edge cases covered
   - Proper error messages
   - Graceful failures

5. **Modern JavaScript**
   - ES6+ features
   - Avoiding deprecated patterns
   - Best practices

6. **Documentation**
   - Comments where needed
   - Clear function purposes
   - Code explanations

---

## ⚠️ Error Handling

### Scenario 1: API Key Missing
```json
{
  "codeQuality": {
    "score": 0,
    "feedback": "AI analysis failed: OpenAI API key not configured.",
    "error": true
  }
}
```

### Scenario 2: File Not Found
```json
{
  "codeQuality": {
    "score": 0,
    "feedback": "JavaScript file (Scripts/index.js) not found. Cannot perform code quality analysis."
  }
}
```

### Scenario 3: Empty File
```json
{
  "codeQuality": {
    "score": 0,
    "feedback": "JavaScript file is empty or contains minimal code."
  }
}
```

### Scenario 4: OpenAI API Error
```json
{
  "codeQuality": {
    "score": 0,
    "feedback": "AI analysis failed: Rate limit exceeded.",
    "error": true
  }
}
```

**Important**: Grading continues even if AI fails. The system defaults to score 0 for code quality but still returns structural scores.

---

## 💰 Cost Considerations

### GPT-4o Pricing (as of Jan 2026)
- **Input**: ~$5 per 1M tokens
- **Output**: ~$15 per 1M tokens

### Average Cost Per Grading
- Average code file: ~500 tokens input
- AI response: ~200 tokens output
- **Cost per grading**: ~$0.005 (half a cent)

### Monthly Estimates
- 100 gradings/month: **~$0.50**
- 1,000 gradings/month: **~$5.00**
- 10,000 gradings/month: **~$50.00**

### Cost Optimization Tips
1. Switch to `gpt-3.5-turbo` for lower cost (85% cheaper)
2. Reduce `max_tokens` if feedback is too long
3. Cache results for identical code (future enhancement)
4. Batch multiple files in one request

---

## 🎯 Extending AI Analysis

### Adding HTML Analysis
```javascript
const { analyzeHTML } = require('../utils/aiHelper');

// In module handler:
const htmlPath = path.join(repoPath, 'index.html');
const htmlContent = await fs.readFile(htmlPath, 'utf-8');
const htmlResult = await analyzeHTML(htmlContent);
```

### Adding CSS Analysis
```javascript
const { analyzeCSS } = require('../utils/aiHelper');

// In module handler:
const cssPath = path.join(repoPath, 'Styles/index.css');
const cssContent = await fs.readFile(cssPath, 'utf-8');
const cssResult = await analyzeCSS(cssContent);
```

### Custom Analysis Criteria
```javascript
const { analyzeCode } = require('../utils/aiHelper');

const customCriteria = `
Evaluate based on:
1. Security best practices
2. Performance optimization
3. Memory management
4. Scalability considerations
`;

const result = await analyzeCode(codeContent, customCriteria);
```

---

## 🔒 Security & Privacy

### API Key Protection
- ✅ Stored in `.env` file (not committed to git)
- ✅ Never exposed in API responses
- ✅ Only accessible server-side

### Code Privacy
- ⚠️ Code is sent to OpenAI servers for analysis
- ⚠️ OpenAI may store data per their policy
- ⚠️ Consider privacy implications for sensitive code

### Recommendations for Production
1. Use enterprise OpenAI plan for data privacy
2. Consider self-hosted AI models for sensitive data
3. Add audit logging for all AI requests
4. Implement rate limiting per student
5. Cache results to minimize API calls

---

## 📈 Monitoring & Logging

### Console Logs
All AI operations are logged with `[AIHelper]` prefix:
```
[AIHelper] Starting code analysis...
[AIHelper] Sending request to OpenAI...
[AIHelper] Received response from OpenAI
[AIHelper] Analysis complete. Score: 52/60
```

### Token Usage Tracking
Each analysis returns:
```javascript
{
  tokensUsed: 287,
  model: "gpt-4o"
}
```

### Future Enhancements
- [ ] Store token usage in database
- [ ] Generate monthly usage reports
- [ ] Set budget alerts
- [ ] Track costs per student/module

---

## 🐛 Troubleshooting

### "Cannot find module 'openai'"
```bash
npm install openai
```

### "OpenAI API key not configured"
Check `.env` file has:
```env
OPENAI_API_KEY=sk-...
```

### "Rate limit exceeded"
- Wait a few minutes
- Upgrade OpenAI plan
- Implement request queuing

### "AI returned invalid JSON format"
- Model may need adjustment
- Try increasing `temperature` slightly
- Check OpenAI API status

### "Timeout error"
- Increase timeout in aiHelper.js
- Check internet connection
- Verify OpenAI service status

---

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Node.js Library](https://github.com/openai/openai-node)
- [OpenAI Pricing](https://openai.com/pricing)
- [Best Practices for Prompts](https://platform.openai.com/docs/guides/prompt-engineering)

---

## ✅ Checklist

Before using AI grading in production:
- [ ] OpenAI API key configured in `.env`
- [ ] `npm install openai` completed
- [ ] Test script passes (`node test-ai-integration.js`)
- [ ] Budget alerts set in OpenAI dashboard
- [ ] Privacy policy updated (if storing code)
- [ ] Error handling tested
- [ ] Monitoring/logging in place

---

**AI Integration Status**: ✅ **PRODUCTION READY**

The AI code quality analysis is fully functional and integrated into Module 02 grading. Students now receive intelligent, detailed feedback on their code quality in addition to structural validation.

---

*Last Updated: January 19, 2026*
