/**
 * Grading Controller
 * Handles HTTP requests for automated grading submissions
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { cloneRepo, cleanupRepo, isValidGitHubUrl } = require('../grading-engine/cloner');
const module02Handler = require('../grading-engine/module-handlers/module02');

/**
 * Main grading endpoint handler - Refactored with Check-First Logic
 * POST /api/grade
 * Body: { repoName, branchName, studentName, customInstructions (optional) }
 * 
 * Flow:
 * 1. Extract inputs (repoName, branchName, studentName)
 * 2. Check database for existing review (CACHE CHECK)
 * 3. If found: return cached data immediately (NO OpenAI call)
 * 4. If not found: call OpenAI, save to DB, return new data
 */
async function gradeSubmission(req, res) {
  let clonedPath = null;
  
  try {
    // ============================================================
    // STEP 1: RECEIVE INPUTS
    // ============================================================
    const { repoName, branchName, studentName, customInstructions } = req.body;
    
    console.log(`[GradingController] Received grading request:`);
    console.log(`  Repository: ${repoName || 'N/A'}`);
    console.log(`  Branch/Module: ${branchName || 'N/A'}`);
    console.log(`  Student: ${studentName || 'N/A'}`);
    
    // Validate required fields
    if (!repoName || typeof repoName !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid or missing repoName'
      });
    }
    
    if (!branchName || typeof branchName !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid or missing branchName (Module)'
      });
    }
    
    // ============================================================
    // STEP 2: CHECK CACHE (DATABASE) - PREVENT WASTING CREDITS
    // ============================================================
    console.log('[GradingController] Checking database for existing review...');
    
    const whereClause = {
      repoName: repoName,
      branchName: branchName,
      studentName: studentName || null
    };
    
    const existingReview = await prisma.review.findFirst({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // ============================================================
    // STEP 3: CACHE HIT - RETURN EXISTING DATA (NO OpenAI CALL)
    // ============================================================
    if (existingReview) {
      console.log(`[GradingController] ✅ CACHE HIT - Review found (ID: ${existingReview.id})`);
      console.log('[GradingController] Returning cached data (NO OpenAI call)');
      
      // Parse the stored review content
      const parsedContent = JSON.parse(existingReview.reviewContent);
      
      return res.status(200).json({
        success: true,
        source: 'database', // Debug flag
        student: existingReview.studentName || 'Unknown',
        branch: existingReview.branchName,
        repository: existingReview.repoName,
        results: parsedContent.results,
        summary: parsedContent.summary,
        reviewId: existingReview.id,
        createdAt: existingReview.createdAt,
        timestamp: existingReview.createdAt
      });
    }
    
    // ============================================================
    // STEP 4: CACHE MISS - CALL OpenAI AND SAVE TO DATABASE
    // ============================================================
    console.log('[GradingController] ❌ CACHE MISS - No existing review found');
    console.log('[GradingController] Proceeding with new grading (OpenAI will be called)...');
    
    // Validate custom instructions if we're calling OpenAI
    if (!customInstructions || typeof customInstructions !== 'string' || customInstructions.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'customInstructions required for new grading'
      });
    }
    
    // Validate GitHub URL
    if (!isValidGitHubUrl(repoName)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid GitHub URL format'
      });
    }
    
    // Clone the repository
    console.log('[GradingController] Cloning repository...');
    const submitterName = studentName || 'submission';
    clonedPath = await cloneRepo(repoName, submitterName, branchName);
    
    // Perform AI-based grading
    console.log('[GradingController] Calling OpenAI API for grading...');
    const gradingResults = await performCustomGrading(clonedPath, customInstructions, branchName);
    
    // Prepare the response structure
    const summary = {
      totalScore: gradingResults.totalScore,
      maxScore: gradingResults.maxTotalScore,
      percentage: ((gradingResults.totalScore / gradingResults.maxTotalScore) * 100).toFixed(2),
      status: getGradingStatus(gradingResults.totalScore, gradingResults.maxTotalScore)
    };
    
    // Save to database IMMEDIATELY after getting AI response
    console.log('[GradingController] Saving new review to database...');
    const savedReview = await prisma.review.create({
      data: {
        repoName: repoName,
        branchName: branchName,
        studentName: studentName || null,
        reviewContent: JSON.stringify({
          feedback: gradingResults.codeQuality?.feedback || 'No feedback available',
          results: gradingResults,
          summary: summary
        }),
        score: `${summary.totalScore}/${summary.maxScore}`,
        status: 'COMPLETED'
      }
    });
    console.log(`[GradingController] ✅ Review saved to database (ID: ${savedReview.id})`);
    
    // Return the new AI result
    const response = {
      success: true,
      source: 'openai', // Debug flag - indicates this was a new AI call
      student: studentName || 'Unknown',
      branch: branchName,
      repository: repoName,
      results: gradingResults,
      summary: summary,
      reviewId: savedReview.id,
      createdAt: savedReview.createdAt,
      timestamp: new Date().toISOString()
    };
    
    console.log(`[GradingController] Grading completed successfully`);
    console.log(`  Score: ${summary.totalScore}/${summary.maxScore} (${summary.percentage}%)`);
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error(`[GradingController] ❌ Error during grading: ${error.message}`);
    console.error(error.stack);
    
    res.status(500).json({
      success: false,
      error: 'Grading failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
    
  } finally {
    // Always cleanup the cloned repository (if it exists)
    if (clonedPath) {
      try {
        console.log('[GradingController] Cleaning up cloned repository...');
        await cleanupRepo(clonedPath);
        console.log('[GradingController] Cleanup completed');
      } catch (cleanupError) {
        console.error(`[GradingController] Cleanup failed: ${cleanupError.message}`);
      }
    }
  }
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
