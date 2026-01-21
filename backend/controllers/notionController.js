/**
 * Notion Controller
 * Handles HTTP requests for fetching grading rules from Notion
 */

const { detectCourseType, getNotionPageId } = require('../config/notionMap');
const { fetchPageContent, checkNotionHealth } = require('../services/notionService');

/**
 * Fetches grading rules from Notion based on repository and branch
 * POST /api/notion/rules
 * Body: { repoName, branchName }
 */
async function getGradingRules(req, res) {
  try {
    const { repoName, branchName } = req.body;
    
    console.log('[NotionController] Fetching rules for:', { repoName, branchName });
    
    // Validate input
    if (!repoName || typeof repoName !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid or missing repoName'
      });
    }
    
    if (!branchName || typeof branchName !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid or missing branchName'
      });
    }
    
    // Check if Notion is configured
    if (!process.env.NOTION_API_KEY) {
      return res.status(503).json({
        success: false,
        error: 'Notion API is not configured. Please set NOTION_API_KEY in .env'
      });
    }
    
    // Step A: Detect Course Type
    const courseKey = detectCourseType(repoName);
    
    if (!courseKey) {
      return res.status(404).json({
        success: false,
        error: 'Unknown Course Type',
        message: `Could not detect course type from repository name: "${repoName}"`
      });
    }
    
    console.log(`[NotionController] Detected course: ${courseKey}`);
    
    // Step B: Find Notion Page ID
    const pageId = getNotionPageId(repoName, branchName);
    
    if (!pageId) {
      return res.status(404).json({
        success: false,
        error: 'No grading rules found',
        message: `No Notion page configured for ${courseKey} - ${branchName}`,
        course: courseKey,
        branch: branchName
      });
    }
    
    if (pageId === 'replace_with_actual_notion_page_id') {
      return res.status(404).json({
        success: false,
        error: 'Notion page not configured',
        message: `Please update the Notion Page ID in notionMap.js for ${courseKey} - ${branchName}`,
        course: courseKey,
        branch: branchName
      });
    }
    
    console.log(`[NotionController] Using Notion Page ID: ${pageId}`);
    
    // Step C: Fetch Content from Notion
    const gradingInstructions = await fetchPageContent(pageId);
    
    if (!gradingInstructions || gradingInstructions.trim() === '') {
      return res.status(404).json({
        success: false,
        error: 'Empty grading rules',
        message: 'The Notion page exists but contains no content'
      });
    }
    
    console.log('[NotionController] Successfully fetched grading rules');
    
    // Return the grading instructions
    res.status(200).json({
      success: true,
      course: courseKey,
      branch: branchName,
      notionPageId: pageId,
      gradingInstructions: gradingInstructions,
      characterCount: gradingInstructions.length
    });
    
  } catch (error) {
    console.error('[NotionController] Error fetching grading rules:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch grading rules',
      message: error.message
    });
  }
}

/**
 * Health check for Notion API
 * GET /api/notion/health
 */
async function checkHealth(req, res) {
  try {
    const isHealthy = await checkNotionHealth();
    
    if (isHealthy) {
      res.status(200).json({
        success: true,
        message: 'Notion API is connected and healthy',
        configured: true
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'Notion API is not configured or unreachable',
        configured: !!process.env.NOTION_API_KEY
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  getGradingRules,
  checkHealth
};
