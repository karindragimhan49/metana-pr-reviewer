/**
 * Grading Controller
 * Handles HTTP requests for automated grading submissions
 */

const { cloneRepo, cleanupRepo, isValidGitHubUrl } = require('../grading-engine/cloner');
const module02Handler = require('../grading-engine/module-handlers/module02');

/**
 * Main grading endpoint handler
 * POST /api/grade
 * Body: { repoUrl, moduleNumber, studentName }
 */
async function gradeSubmission(req, res) {
  let clonedPath = null;
  
  try {
    // Step 1: Extract and validate request data
    const { repoUrl, moduleNumber, studentName } = req.body;
    
    console.log(`[GradingController] Received grading request:`);
    console.log(`  Student: ${studentName}`);
    console.log(`  Module: ${moduleNumber}`);
    console.log(`  Repository: ${repoUrl}`);
    
    // Validate required fields
    const validationError = validateRequestData(repoUrl, moduleNumber, studentName);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError
      });
    }
    
    // Step 2: Clone the repository
    console.log('[GradingController] Cloning repository...');
    clonedPath = await cloneRepo(repoUrl, studentName);
    
    // Step 3: Route to appropriate module handler
    console.log(`[GradingController] Running Module ${moduleNumber} grading...`);
    const gradingResults = await routeToModuleHandler(moduleNumber, clonedPath);
    
    // Step 4: Prepare response
    const response = {
      success: true,
      student: studentName,
      moduleNumber: moduleNumber,
      repositoryUrl: repoUrl,
      results: gradingResults,
      summary: {
        totalScore: gradingResults.totalScore,
        maxScore: gradingResults.maxTotalScore,
        percentage: ((gradingResults.totalScore / gradingResults.maxTotalScore) * 100).toFixed(2),
        status: getGradingStatus(gradingResults.totalScore, gradingResults.maxTotalScore)
      },
      timestamp: new Date().toISOString()
    };
    
    console.log(`[GradingController] Grading completed successfully`);
    console.log(`  Score: ${response.summary.totalScore}/${response.summary.maxScore} (${response.summary.percentage}%)`);
    
    // Step 5: Send response
    res.status(200).json(response);
    
  } catch (error) {
    console.error(`[GradingController] Error during grading: ${error.message}`);
    console.error(error.stack);
    
    res.status(500).json({
      success: false,
      error: 'Grading failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
    
  } finally {
    // Step 6: Always cleanup the cloned repository (even if grading failed)
    if (clonedPath) {
      try {
        console.log('[GradingController] Starting cleanup...');
        await cleanupRepo(clonedPath);
        console.log('[GradingController] Cleanup completed');
      } catch (cleanupError) {
        console.error(`[GradingController] Cleanup failed: ${cleanupError.message}`);
        // Log but don't throw - we don't want cleanup errors to affect the response
      }
    }
  }
}

/**
 * Validates the request data
 * @param {string} repoUrl - GitHub repository URL
 * @param {number} moduleNumber - Module number
 * @param {string} studentName - Student name
 * @returns {string|null} - Error message or null if valid
 */
function validateRequestData(repoUrl, moduleNumber, studentName) {
  if (!repoUrl || typeof repoUrl !== 'string') {
    return 'Invalid or missing repoUrl';
  }
  
  if (!isValidGitHubUrl(repoUrl)) {
    return 'Invalid GitHub URL format';
  }
  
  if (!moduleNumber || typeof moduleNumber !== 'number') {
    return 'Invalid or missing moduleNumber';
  }
  
  if (!studentName || typeof studentName !== 'string' || studentName.trim() === '') {
    return 'Invalid or missing studentName';
  }
  
  return null;
}

/**
 * Routes the grading request to the appropriate module handler
 * @param {number} moduleNumber - The module number
 * @param {string} repoPath - Path to the cloned repository
 * @returns {Promise<Object>} - Grading results
 */
async function routeToModuleHandler(moduleNumber, repoPath) {
  switch (moduleNumber) {
    case 2:
      return await module02Handler.grade(repoPath);
    
    // Add more module handlers as they are implemented
    // case 3:
    //   return await module03Handler.grade(repoPath);
    // case 4:
    //   return await module04Handler.grade(repoPath);
    
    default:
      throw new Error(`Module ${moduleNumber} grading handler not implemented`);
  }
}

/**
 * Determines the grading status based on score
 * @param {number} score - Achieved score
 * @param {number} maxScore - Maximum possible score
 * @returns {string} - Status string
 */
function getGradingStatus(score, maxScore) {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Good';
  if (percentage >= 70) return 'Satisfactory';
  if (percentage >= 60) return 'Needs Improvement';
  return 'Unsatisfactory';
}

/**
 * Health check endpoint for the grading service
 * GET /api/grade/health
 */
function healthCheck(req, res) {
  res.status(200).json({
    success: true,
    service: 'Automated Grading Assistant',
    status: 'operational',
    availableModules: [2], // Update as more modules are added
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  gradeSubmission,
  healthCheck
};
