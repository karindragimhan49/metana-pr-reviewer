/**
 * Grading Controller
 * Handles HTTP requests for automated grading submissions
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { cloneRepo, cleanupRepo, isValidGitHubUrl } = require('../grading-engine/cloner');
const module02Handler = require('../grading-engine/module-handlers/module02');

/**
 * Main grading endpoint handler
 * POST /api/grade
 * Body: { repoUrl, branchName, customInstructions, studentName }
 */
async function gradeSubmission(req, res) {
  let clonedPath = null;
  
  try {
    // Step 1: Extract and validate request data
    const { repoUrl, branchName, customInstructions, studentName } = req.body;
    
    console.log(`[GradingController] Received grading request:`);
    console.log(`  Student: ${studentName || 'N/A'}`);
    console.log(`  Branch: ${branchName || 'default'}`);
    console.log(`  Repository: ${repoUrl}`);
    console.log(`  Custom Instructions: ${customInstructions ? 'Yes' : 'No'}`);
    
    // Validate required fields
    const validationError = validateRequestData(repoUrl, branchName, customInstructions);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError
      });
    }
    
    // Step 2: Clone the repository with specific branch
    console.log('[GradingController] Cloning repository...');
    const submitterName = studentName || 'submission';
    clonedPath = await cloneRepo(repoUrl, submitterName, branchName);
    
    // Step 3: Perform AI-based grading with custom instructions
    console.log(`[GradingController] Running AI-powered grading...`);
    const gradingResults = await performCustomGrading(clonedPath, customInstructions, branchName);
    
    // Step 4: Prepare response
    const response = {
      success: true,
      student: studentName || 'Unknown',
      branch: branchName,
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
    
    // Step 4.5: Save the review to the database
    console.log('[GradingController] Saving review to database...');
    const savedReview = await prisma.review.create({
      data: {
        repoName: repoUrl,
        branchName: branchName,
        studentName: studentName || null,
        reviewContent: JSON.stringify({
          feedback: gradingResults.codeQuality?.feedback || 'No feedback available',
          results: gradingResults,
          summary: response.summary
        }),
        score: `${response.summary.totalScore}/${response.summary.maxScore}`,
        status: 'PENDING'
      }
    });
    console.log(`[GradingController] Review saved successfully with ID: ${savedReview.id}`);
    
    // Add saved review details to response
    response.reviewId = savedReview.id;
    response.savedAt = savedReview.createdAt;
    
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
 * @param {string} branchName - Branch name
 * @param {string} customInstructions - Custom grading instructions
 * @returns {string|null} - Error message or null if valid
 */
function validateRequestData(repoUrl, branchName, customInstructions) {
  if (!repoUrl || typeof repoUrl !== 'string') {
    return 'Invalid or missing repoUrl';
  }
  
  if (!isValidGitHubUrl(repoUrl)) {
    return 'Invalid GitHub URL format';
  }
  
  if (!branchName || typeof branchName !== 'string' || branchName.trim() === '') {
    return 'Invalid or missing branchName';
  }
  
  if (!customInstructions || typeof customInstructions !== 'string' || customInstructions.trim() === '') {
    return 'Invalid or missing customInstructions';
  }
  
  return null;
}

/**
 * Performs custom AI-based grading using instructor-provided rules
 * @param {string} repoPath - Path to the cloned repository
 * @param {string} customInstructions - Custom grading criteria from instructor
 * @param {string} branchName - Branch being graded
 * @returns {Promise<Object>} - Grading results
 */
async function performCustomGrading(repoPath, customInstructions, branchName) {
  const { analyzeCodeWithCustomInstructions } = require('../grading-engine/utils/aiHelper');
  const fs = require('fs-extra');
  const path = require('path');
  
  try {
    // Read all relevant code files from the repository
    const codeFiles = await findCodeFiles(repoPath);
    
    if (codeFiles.length === 0) {
      throw new Error('No code files found in the repository');
    }
    
    // Concatenate code content for analysis
    let combinedCode = '';
    for (const file of codeFiles) {
      const content = await fs.readFile(file, 'utf-8');
      combinedCode += `\n\n// File: ${path.relative(repoPath, file)}\n${content}`;
    }
    
    // Perform AI analysis with custom instructions
    const aiResult = await analyzeCodeWithCustomInstructions(
      combinedCode,
      customInstructions,
      branchName
    );
    
    return {
      moduleName: `Branch: ${branchName}`,
      totalScore: aiResult.score,
      maxTotalScore: 100,
      codeQuality: {
        score: aiResult.score,
        maxScore: 100,
        feedback: aiResult.feedback
      },
      completeness: {
        score: aiResult.score > 60 ? 40 : Math.round(aiResult.score * 0.4),
        maxScore: 40,
        passed: aiResult.passed || [],
        errors: aiResult.errors || []
      },
      filesAnalyzed: codeFiles.length,
      customCriteria: customInstructions.substring(0, 200) + '...'
    };
    
  } catch (error) {
    console.error('[GradingController] Custom grading error:', error);
    throw error;
  }
}

/**
 * Finds all code files in a repository
 * @param {string} repoPath - Path to repository
 * @returns {Promise<Array>} - Array of file paths
 */
async function findCodeFiles(repoPath) {
  const fs = require('fs-extra');
  const path = require('path');
  
  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.sol', '.rs', '.go'];
  const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '__pycache__', 'target'];
  
  const files = [];
  
  async function scan(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !ignoreDirs.includes(entry.name)) {
        await scan(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (codeExtensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  await scan(repoPath);
  return files;
}

/**
 * Routes the grading request to the appropriate module handler (DEPRECATED - kept for backward compatibility)
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
    mode: 'Dynamic Rule-Based Engine',
    features: ['Branch-based grading', 'Custom instructions', 'AI-powered analysis'],
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  gradeSubmission,
  healthCheck
};
