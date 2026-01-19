/**
 * Module 02 Grading Handler
 * HTML/CSS Basics - Deterministic Rule Engine
 * 
 * Criteria:
 * - Folder Structure (Critical): Styles/, Scripts/, Assets/
 * - Required Files: index.html, Styles/index.css, Scripts/index.js, 
 *                   Styles/loginForm.css, Styles/moodSelecter.css
 * - Max Score: 40 points (Completeness)
 */

const path = require('path');
const fs = require('fs-extra');
const {
  checkDirectoryExists,
  checkFileExists,
  checkMultipleDirectories,
  checkMultipleFiles
} = require('../utils/fileChecker');
const { analyzeJavaScript } = require('../utils/aiHelper');

// Grading configuration for Module 02
const GRADING_CONFIG = {
  MAX_COMPLETENESS_SCORE: 40,
  DIRECTORY_POINTS: 5,   // Points per correct directory
  FILE_POINTS: 5,        // Points per correct file
  REQUIRED_DIRECTORIES: ['Styles', 'Scripts', 'Assets'],
  REQUIRED_FILES: [
    'index.html',
    'Styles/index.css',
    'Scripts/index.js',
    'Styles/loginForm.css',
    'Styles/moodSelecter.css'
  ]
};

/**
 * Main grading function for Module 02
 * @param {string} repoPath - Path to the cloned repository
 * @returns {Promise<Object>} - Grading results with scores and feedback
 */
async function grade(repoPath) {
  console.log(`[Module02] Starting grading for: ${repoPath}`);
  
  const results = {
    moduleNumber: 2,
    moduleName: 'HTML/CSS Basics',
    completeness: {
      score: 0,
      maxScore: GRADING_CONFIG.MAX_COMPLETENESS_SCORE,
      passed: [],
      errors: [],
      warnings: []
    },
    codeQuality: {
      score: 0,
      maxScore: 0,
      feedback: 'AI code quality analysis not yet implemented'
    },
    totalScore: 0,
    maxTotalScore: GRADING_CONFIG.MAX_COMPLETENESS_SCORE,
    gradedAt: new Date().toISOString()
  };
  
  try {
    // Step 1: Check folder structure (Critical)
    await checkFolderStructure(repoPath, results);
    
    // Step 2: Check required files
    await checkRequiredFiles(repoPath, results);
    
    // Step 3: Placeholder for AI code quality analysis
    const codeQualityResult = await checkCodeQualityWithAI(repoPath);
    results.codeQuality = codeQualityResult;
    
    // Calculate total score
    results.totalScore = results.completeness.score + results.codeQuality.score;
    results.maxTotalScore = GRADING_CONFIG.MAX_COMPLETENESS_SCORE + results.codeQuality.maxScore;
    
    console.log(`[Module02] Grading completed. Total Score: ${results.totalScore}/${results.maxTotalScore}`);
    
    return results;
  } catch (error) {
    console.error(`[Module02] Grading error: ${error.message}`);
    results.completeness.errors.push(`Critical error during grading: ${error.message}`);
    return results;
  }
}

/**
 * Checks if required folder structure exists
 * @param {string} repoPath - Path to the repository
 * @param {Object} results - Results object to update
 */
async function checkFolderStructure(repoPath, results) {
  console.log('[Module02] Checking folder structure...');
  
  const directoryChecks = await checkMultipleDirectories(
    repoPath,
    GRADING_CONFIG.REQUIRED_DIRECTORIES
  );
  
  for (const [dirName, exists] of Object.entries(directoryChecks)) {
    if (exists) {
      results.completeness.score += GRADING_CONFIG.DIRECTORY_POINTS;
      results.completeness.passed.push(`✓ Directory found: ${dirName}/`);
      console.log(`[Module02] ✓ Directory exists: ${dirName}/`);
    } else {
      results.completeness.errors.push(`✗ Missing critical directory: ${dirName}/`);
      console.log(`[Module02] ✗ Missing directory: ${dirName}/`);
    }
  }
}

/**
 * Checks if required files exist
 * @param {string} repoPath - Path to the repository
 * @param {Object} results - Results object to update
 */
async function checkRequiredFiles(repoPath, results) {
  console.log('[Module02] Checking required files...');
  
  const fileChecks = await checkMultipleFiles(
    repoPath,
    GRADING_CONFIG.REQUIRED_FILES
  );
  
  for (const [fileName, exists] of Object.entries(fileChecks)) {
    if (exists) {
      results.completeness.score += GRADING_CONFIG.FILE_POINTS;
      results.completeness.passed.push(`✓ File found: ${fileName}`);
      console.log(`[Module02] ✓ File exists: ${fileName}`);
    } else {
      results.completeness.errors.push(`✗ Missing required file: ${fileName}`);
      console.log(`[Module02] ✗ Missing file: ${fileName}`);
    }
  }
  
  // Cap the score at maximum
  if (results.completeness.score > GRADING_CONFIG.MAX_COMPLETENESS_SCORE) {
    results.completeness.score = GRADING_CONFIG.MAX_COMPLETENESS_SCORE;
  }
}

/**
 * AI-based code quality analysis using OpenAI
 * Analyzes JavaScript code for clean code principles, naming, and modularity
 * @param {string} repoPath - Path to the repository
 * @returns {Promise<Object>} - Code quality assessment
 */
async function checkCodeQualityWithAI(repoPath) {
  console.log('[Module02] Running AI code quality check...');
  
  try {
    // Path to the JavaScript file
    const jsFilePath = path.join(repoPath, 'Scripts', 'index.js');
    
    // Check if the file exists
    const fileExists = await checkFileExists(jsFilePath);
    
    if (!fileExists) {
      console.log('[Module02] Scripts/index.js not found, skipping AI analysis');
      return {
        score: 0,
        maxScore: 60,
        feedback: 'JavaScript file (Scripts/index.js) not found. Cannot perform code quality analysis.',
        details: {
          error: 'File not found',
          filePath: 'Scripts/index.js'
        }
      };
    }
    
    // Read the JavaScript file content
    console.log('[Module02] Reading Scripts/index.js...');
    const jsContent = await fs.readFile(jsFilePath, 'utf-8');
    
    // Check if file is empty or too small
    if (!jsContent || jsContent.trim().length < 10) {
      console.log('[Module02] JavaScript file is empty or too small');
      return {
        score: 0,
        maxScore: 60,
        feedback: 'JavaScript file is empty or contains minimal code. Cannot perform meaningful analysis.',
        details: {
          warning: 'File too small',
          fileSize: jsContent.length
        }
      };
    }
    
    console.log(`[Module02] Analyzing ${jsContent.length} characters of JavaScript code...`);
    
    // Call AI analysis with specific criteria
    const aiResult = await analyzeJavaScript(jsContent);
    
    // Check if AI analysis failed
    if (aiResult.error) {
      console.error('[Module02] AI analysis failed:', aiResult.errorMessage);
      return {
        score: 0,
        maxScore: 60,
        feedback: aiResult.feedback,
        details: {
          error: true,
          message: aiResult.errorMessage
        }
      };
    }
    
    // Return successful AI analysis
    console.log(`[Module02] AI analysis complete. Score: ${aiResult.score}/60`);
    return {
      score: aiResult.score,
      maxScore: 60,
      feedback: aiResult.feedback,
      details: {
        model: aiResult.model,
        tokensUsed: aiResult.tokensUsed,
        analyzedFile: 'Scripts/index.js',
        codeLength: jsContent.length
      }
    };
    
  } catch (error) {
    console.error('[Module02] Error during AI code quality check:', error.message);
    
    // Return error response
    return {
      score: 0,
      maxScore: 60,
      feedback: `Code quality analysis failed: ${error.message}`,
      details: {
        error: true,
        message: error.message,
        stack: error.stack
      }
    };
  }
}

/**
 * Validates the grading configuration
 * @returns {boolean}
 */
function validateConfig() {
  const totalPossiblePoints = 
    (GRADING_CONFIG.REQUIRED_DIRECTORIES.length * GRADING_CONFIG.DIRECTORY_POINTS) +
    (GRADING_CONFIG.REQUIRED_FILES.length * GRADING_CONFIG.FILE_POINTS);
  
  if (totalPossiblePoints !== GRADING_CONFIG.MAX_COMPLETENESS_SCORE) {
    console.warn(
      `[Module02] Warning: Grading config mismatch. ` +
      `Total possible: ${totalPossiblePoints}, Max configured: ${GRADING_CONFIG.MAX_COMPLETENESS_SCORE}`
    );
    return false;
  }
  
  return true;
}

// Validate configuration on module load
validateConfig();

module.exports = {
  grade,
  GRADING_CONFIG
};
