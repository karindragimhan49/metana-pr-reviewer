/**
 * File Checker Utility Module
 * Provides helper functions for validating file and directory existence
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * Checks if a directory exists at the specified path
 * @param {string} dirPath - The directory path to check
 * @returns {Promise<boolean>}
 */
async function checkDirectoryExists(dirPath) {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a file exists at the specified path
 * @param {string} filePath - The file path to check
 * @returns {Promise<boolean>}
 */
async function checkFileExists(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

/**
 * Checks if multiple files exist in a directory
 * @param {string} basePath - The base directory path
 * @param {string[]} files - Array of file paths relative to basePath
 * @returns {Promise<Object>} - Object with file paths as keys and boolean existence as values
 */
async function checkMultipleFiles(basePath, files) {
  const results = {};
  
  for (const file of files) {
    const fullPath = path.join(basePath, file);
    results[file] = await checkFileExists(fullPath);
  }
  
  return results;
}

/**
 * Checks if multiple directories exist
 * @param {string} basePath - The base directory path
 * @param {string[]} directories - Array of directory paths relative to basePath
 * @returns {Promise<Object>} - Object with directory paths as keys and boolean existence as values
 */
async function checkMultipleDirectories(basePath, directories) {
  const results = {};
  
  for (const dir of directories) {
    const fullPath = path.join(basePath, dir);
    results[dir] = await checkDirectoryExists(fullPath);
  }
  
  return results;
}

/**
 * Checks if a path exists (file or directory)
 * @param {string} targetPath - The path to check
 * @returns {Promise<boolean>}
 */
async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Gets the file extension of a file
 * @param {string} filePath - The file path
 * @returns {string} - The file extension (including the dot)
 */
function getFileExtension(filePath) {
  return path.extname(filePath);
}

/**
 * Lists all files in a directory (non-recursive)
 * @param {string} dirPath - The directory path
 * @returns {Promise<string[]>} - Array of file names
 */
async function listFilesInDirectory(dirPath) {
  try {
    const exists = await checkDirectoryExists(dirPath);
    if (!exists) {
      return [];
    }
    
    const items = await fs.readdir(dirPath);
    const files = [];
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const isFile = await checkFileExists(itemPath);
      if (isFile) {
        files.push(item);
      }
    }
    
    return files;
  } catch (error) {
    console.error(`[FileChecker] Error listing files: ${error.message}`);
    return [];
  }
}

module.exports = {
  checkDirectoryExists,
  checkFileExists,
  checkMultipleFiles,
  checkMultipleDirectories,
  pathExists,
  getFileExtension,
  listFilesInDirectory
};
