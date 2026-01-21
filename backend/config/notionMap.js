/**
 * Notion Course-Module Mapping
 * Maps course types and branch names to specific Notion Page IDs
 * 
 * Structure:
 * COURSE_MAP[courseKey][branchName] = notionPageId
 */

const COURSE_MAP = {
  fullstack: {
    "module-01": "replace_with_actual_notion_page_id",
    "module-02": "2ef472e311e080339332c548a1b2b043", // Real Notion Page ID
    "module-03": "replace_with_actual_notion_page_id",
    "module-04": "replace_with_actual_notion_page_id",
    "module-05": "replace_with_actual_notion_page_id",
    "main": "replace_with_actual_notion_page_id"
  },
  
  solidity: {
    "module-01": "replace_with_actual_notion_page_id",
    "module-02": "2ef472e311e080339332c548a1b2b043",
    "module-03": "replace_with_actual_notion_page_id",
    "module-04": "replace_with_actual_notion_page_id",
    "main": "replace_with_actual_notion_page_id"
  },
  
  seca: {
    "module-01": "replace_with_actual_notion_page_id",
    "module-02": "replace_with_actual_notion_page_id",
    "module-03": "replace_with_actual_notion_page_id",
    "module-04": "replace_with_actual_notion_page_id",
    "main": "replace_with_actual_notion_page_id"
  },
  
  rust: {
    "module-01": "replace_with_actual_notion_page_id",
    "module-02": "replace_with_actual_notion_page_id",
    "module-03": "replace_with_actual_notion_page_id",
    "main": "replace_with_actual_notion_page_id"
  }
};

/**
 * Detects the course type from a repository name
 * @param {string} repoName - The repository name
 * @returns {string|null} - The course key or null if not found
 */
function detectCourseType(repoName) {
  const name = repoName.toLowerCase();
  
  // Check for Solidity
  if (name.includes('solidity') || name.startsWith('sol-')) {
    return 'solidity';
  }
  
  // Check for Full Stack
  if (name.includes('fullstack') || name.startsWith('fsd-') || name.startsWith('fsd2')) {
    return 'fullstack';
  }
  
  // Check for Cyber Security
  if (name.includes('seca') || name.includes('security')) {
    return 'seca';
  }
  
  // Check for Rust
  if (name.includes('rust')) {
    return 'rust';
  }
  
  return null;
}

/**
 * Gets the Notion Page ID for a specific course and module
 * @param {string} repoName - The repository name
 * @param {string} branchName - The branch/module name
 * @returns {string|null} - The Notion Page ID or null if not found
 */
function getNotionPageId(repoName, branchName) {
  const courseKey = detectCourseType(repoName);
  
  if (!courseKey) {
    return null;
  }
  
  const courseBranches = COURSE_MAP[courseKey];
  if (!courseBranches) {
    return null;
  }
  
  return courseBranches[branchName] || null;
}

module.exports = {
  COURSE_MAP,
  detectCourseType,
  getNotionPageId
};
