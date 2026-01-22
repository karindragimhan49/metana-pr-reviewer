/**
 * Repository Cloner Module
 * Handles cloning of student GitHub repositories and cleanup operations
 */

const simpleGit = require('simple-git');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

// Use system temp directory for Vercel compatibility
// Vercel's serverless environment has read-only filesystem except /tmp
const TEMP_DIR = path.join(os.tmpdir(), 'metana-submissions');

/**
 * Clones a GitHub repository to a temporary local directory
 * @param {string} repoUrl - The GitHub repository URL
 * @param {string} studentName - Student identifier for folder naming
 * @param {string} branchName - Optional branch name to clone (defaults to repo's default branch)
 * @returns {Promise<string>} - Path to the cloned repository
 * @throws {Error} - If cloning fails
 */
async function cloneRepo(repoUrl, studentName, branchName = null) {
  try {
    // Create timestamp for unique folder naming
    const timestamp = Date.now();
    const folderName = `${studentName}-${timestamp}`;
    
    // Define the temporary submission path using system temp directory
    const tempPath = path.join(TEMP_DIR, folderName);
    
    // Ensure temp directory exists
    await fs.ensureDir(TEMP_DIR);
    
    console.log(`[Cloner] Using temp directory: ${TEMP_DIR}`);
    console.log(`[Cloner] Cloning repository: ${repoUrl}`);
    if (branchName) {
      console.log(`[Cloner] Target branch: ${branchName}`);
    }
    console.log(`[Cloner] Target path: ${tempPath}`);
    
    // Initialize simple-git and clone the repository
    const git = simpleGit();
    
    // Clone with specific branch if provided
    if (branchName) {
      await git.clone(repoUrl, tempPath, ['--branch', branchName, '--single-branch']);
    } else {
      await git.clone(repoUrl, tempPath);
    }
    
    console.log(`[Cloner] Successfully cloned repository to: ${tempPath}`);
    
    return tempPath;
  } catch (error) {
    console.error(`[Cloner] Failed to clone repository: ${error.message}`);
    throw new Error(`Repository cloning failed: ${error.message}`);
  }
}

/**
 * Removes the cloned repository directory
 * @param {string} repoPath - Path to the repository to be deleted
 * @returns {Promise<void>}
 * @throws {Error} - If cleanup fails
 */
async function cleanupRepo(repoPath) {
  try {
    // Check if the path exists before attempting to remove
    const exists = await fs.pathExists(repoPath);
    
    if (!exists) {
      console.log(`[Cloner] Path does not exist, skipping cleanup: ${repoPath}`);
      return;
    }
    
    console.log(`[Cloner] Cleaning up repository at: ${repoPath}`);
    
    // Remove the directory and all its contents
    await fs.remove(repoPath);
    
    console.log(`[Cloner] Successfully cleaned up: ${repoPath}`);
  } catch (error) {
    console.error(`[Cloner] Cleanup failed: ${error.message}`);
    throw new Error(`Repository cleanup failed: ${error.message}`);
  }
}

/**
 * Validates if a GitHub URL is properly formatted
 * @param {string} url - The URL to validate
 * @returns {boolean}
 */
function isValidGitHubUrl(url) {
  const githubPattern = /^https?:\/\/(www\.)?github\.com\/.+\/.+/;
  return githubPattern.test(url);
}

module.exports = {
  cloneRepo,
  cleanupRepo,
  isValidGitHubUrl
};
