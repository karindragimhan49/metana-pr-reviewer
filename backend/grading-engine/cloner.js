/**
 * Repository Cloner Module
 * Handles cloning of student GitHub repositories and cleanup operations
 */

const simpleGit = require('simple-git');
const fs = require('fs-extra');
const path = require('path');

/**
 * Clones a GitHub repository to a temporary local directory
 * @param {string} repoUrl - The GitHub repository URL
 * @param {string} studentName - Student identifier for folder naming
 * @returns {Promise<string>} - Path to the cloned repository
 * @throws {Error} - If cloning fails
 */
async function cloneRepo(repoUrl, studentName) {
  try {
    // Create timestamp for unique folder naming
    const timestamp = Date.now();
    const folderName = `${studentName}-${timestamp}`;
    
    // Define the temporary submission path
    const tempPath = path.join(process.cwd(), 'temp_submissions', folderName);
    
    // Ensure temp_submissions directory exists
    await fs.ensureDir(path.join(process.cwd(), 'temp_submissions'));
    
    console.log(`[Cloner] Cloning repository: ${repoUrl}`);
    console.log(`[Cloner] Target path: ${tempPath}`);
    
    // Initialize simple-git and clone the repository
    const git = simpleGit();
    await git.clone(repoUrl, tempPath);
    
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
