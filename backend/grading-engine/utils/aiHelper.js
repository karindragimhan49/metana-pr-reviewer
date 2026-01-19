/**
 * AI Helper Module
 * Provides AI-powered code analysis using OpenAI's GPT models
 */

const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Analyzes code using OpenAI's GPT model
 * @param {string} codeSnippet - The code to analyze
 * @param {string} criteria - The criteria/prompt for analysis
 * @returns {Promise<Object>} - Object with score (0-60) and feedback (string)
 */
async function analyzeCode(codeSnippet, criteria) {
  try {
    console.log('[AIHelper] Starting code analysis...');
    
    // Validate inputs
    if (!codeSnippet || typeof codeSnippet !== 'string') {
      throw new Error('Invalid code snippet provided');
    }
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }
    
    // Prepare the prompt
    const userPrompt = `
Code to analyze:
\`\`\`javascript
${codeSnippet}
\`\`\`

Analysis Criteria:
${criteria}

Please provide your analysis as a JSON object with:
- "score": A number between 0-60 representing code quality
- "feedback": A detailed string explaining your assessment

Return ONLY the JSON object, no additional text.
`;

    console.log('[AIHelper] Sending request to OpenAI...');
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Using GPT-4o as requested (fallback to gpt-3.5-turbo if needed)
      messages: [
        {
          role: 'system',
          content: 'You are a Senior Code Reviewer. Analyze the code based on the criteria. Return a JSON object with "score" (0-60) and "feedback" (string).'
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 500,
      response_format: { type: 'json_object' } // Ensure JSON response
    });
    
    // Extract and parse the response
    const aiResponse = response.choices[0].message.content;
    console.log('[AIHelper] Received response from OpenAI');
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('[AIHelper] Failed to parse AI response:', parseError);
      throw new Error('AI returned invalid JSON format');
    }
    
    // Validate response structure
    if (typeof parsedResponse.score !== 'number' || typeof parsedResponse.feedback !== 'string') {
      throw new Error('AI response missing required fields (score/feedback)');
    }
    
    // Ensure score is within bounds
    const score = Math.max(0, Math.min(60, Math.round(parsedResponse.score)));
    
    console.log(`[AIHelper] Analysis complete. Score: ${score}/60`);
    
    return {
      score: score,
      feedback: parsedResponse.feedback,
      model: response.model,
      tokensUsed: response.usage.total_tokens
    };
    
  } catch (error) {
    console.error('[AIHelper] Error during code analysis:', error.message);
    
    // Return a safe default response on error
    return {
      score: 0,
      feedback: `AI analysis failed: ${error.message}. Please check your OpenAI API configuration.`,
      error: true,
      errorMessage: error.message
    };
  }
}

/**
 * Analyzes HTML code for semantic structure and best practices
 * @param {string} htmlContent - The HTML code to analyze
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzeHTML(htmlContent) {
  const criteria = `
Evaluate this HTML code based on:
1. Semantic HTML usage (proper tags like header, nav, main, section, etc.)
2. Accessibility (alt attributes, ARIA labels, semantic structure)
3. Code organization and readability
4. Best practices (proper nesting, valid structure)
5. Modern HTML5 standards
`;
  
  return await analyzeCode(htmlContent, criteria);
}

/**
 * Analyzes CSS code for best practices and organization
 * @param {string} cssContent - The CSS code to analyze
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzeCSS(cssContent) {
  const criteria = `
Evaluate this CSS code based on:
1. Code organization (logical grouping, consistent formatting)
2. Naming conventions (BEM, meaningful class names)
3. Best practices (avoiding !important, efficient selectors)
4. Responsive design implementation
5. Maintainability and scalability
`;
  
  return await analyzeCode(cssContent, criteria);
}

/**
 * Analyzes JavaScript code for quality and best practices
 * @param {string} jsContent - The JavaScript code to analyze
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzeJavaScript(jsContent) {
  const criteria = `
Evaluate this JavaScript code based on:
1. Clean code principles (readability, simplicity)
2. Variable naming conventions (descriptive, consistent)
3. Code modularity (functions are focused, reusable)
4. Error handling and edge cases
5. Modern JavaScript practices (ES6+, avoiding deprecated patterns)
6. Comments and documentation
`;
  
  return await analyzeCode(jsContent, criteria);
}

/**
 * Checks if OpenAI API is configured and accessible
 * @returns {Promise<boolean>}
 */
async function checkAPIHealth() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return false;
    }
    
    // Try a minimal API call to verify connectivity
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 5
    });
    
    return response && response.choices && response.choices.length > 0;
  } catch (error) {
    console.error('[AIHelper] API health check failed:', error.message);
    return false;
  }
}

module.exports = {
  analyzeCode,
  analyzeHTML,
  analyzeCSS,
  analyzeJavaScript,
  checkAPIHealth
};
