/**
 * Notion Service
 * Handles all interactions with the Notion API
 */

const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

/**
 * Fetches and extracts text content from a Notion page (with recursive children)
 * @param {string} pageId - The Notion page ID
 * @returns {Promise<string>} - The combined text content
 */
async function fetchPageContent(pageId) {
  try {
    console.log(`[NotionService] Fetching content for page: ${pageId}`);
    
    // Fetch all blocks recursively
    const textContent = await fetchBlocksRecursively(pageId);
    
    const combinedText = textContent.join('\n\n');
    console.log(`[NotionService] Extracted ${combinedText.length} characters (with nested content)`);
    
    return combinedText;
    
  } catch (error) {
    console.error('[NotionService] Error fetching page content:', error.message);
    throw new Error(`Failed to fetch Notion page: ${error.message}`);
  }
}

/**
 * Recursively fetches all blocks and their children
 * @param {string} blockId - The block ID to fetch children from
 * @param {number} depth - Current recursion depth (for logging)
 * @returns {Promise<Array<string>>} - Array of text content
 */
async function fetchBlocksRecursively(blockId, depth = 0) {
  const textContent = [];
  const indent = '  '.repeat(depth); // For nested list items
  
  try {
    // Fetch blocks from this level
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100
    });
    
    console.log(`${indent}[NotionService] Found ${response.results.length} blocks at depth ${depth}`);
    
    for (const block of response.results) {
      // Extract text from current block
      const text = extractTextFromBlock(block, depth);
      if (text) {
        textContent.push(text);
      }
      
      // If block has children, recursively fetch them
      if (block.has_children) {
        console.log(`${indent}[NotionService] Block ${block.type} has children, fetching recursively...`);
        const childrenText = await fetchBlocksRecursively(block.id, depth + 1);
        
        // Append children content with proper indentation
        if (childrenText.length > 0) {
          textContent.push(...childrenText);
        }
      }
    }
    
    return textContent;
    
  } catch (error) {
    console.error(`[NotionService] Error fetching blocks at depth ${depth}:`, error.message);
    return textContent; // Return what we have so far
  }
}

/**
 * Extracts plain text from a Notion block
 * @param {Object} block - The Notion block object
 * @param {number} depth - Nesting depth for indentation
 * @returns {string|null} - The extracted text or null
 */
function extractTextFromBlock(block, depth = 0) {
  try {
    const blockType = block.type;
    const indent = '  '.repeat(depth); // Two spaces per depth level
    
    // Handle paragraph blocks
    if (blockType === 'paragraph' && block.paragraph?.rich_text) {
      const text = extractRichText(block.paragraph.rich_text);
      return text ? `${indent}${text}` : null;
    }
    
    // Handle heading blocks
    if (blockType === 'heading_1' && block.heading_1?.rich_text) {
      return `${indent}# ${extractRichText(block.heading_1.rich_text)}`;
    }
    if (blockType === 'heading_2' && block.heading_2?.rich_text) {
      return `${indent}## ${extractRichText(block.heading_2.rich_text)}`;
    }
    if (blockType === 'heading_3' && block.heading_3?.rich_text) {
      return `${indent}### ${extractRichText(block.heading_3.rich_text)}`;
    }
    
    // Handle bulleted list items
    if (blockType === 'bulleted_list_item' && block.bulleted_list_item?.rich_text) {
      return `${indent}• ${extractRichText(block.bulleted_list_item.rich_text)}`;
    }
    
    // Handle numbered list items
    if (blockType === 'numbered_list_item' && block.numbered_list_item?.rich_text) {
      return `${indent}- ${extractRichText(block.numbered_list_item.rich_text)}`;
    }
    
    // Handle toggle blocks (collapsible sections)
    if (blockType === 'toggle' && block.toggle?.rich_text) {
      return `${indent}▶ ${extractRichText(block.toggle.rich_text)}`;
    }
    
    // Handle code blocks
    if (blockType === 'code' && block.code?.rich_text) {
      const language = block.code.language || '';
      return `${indent}\`\`\`${language}\n${extractRichText(block.code.rich_text)}\n${indent}\`\`\``;
    }
    
    // Handle quote blocks
    if (blockType === 'quote' && block.quote?.rich_text) {
      return `${indent}> ${extractRichText(block.quote.rich_text)}`;
    }
    
    // Handle callout blocks
    if (blockType === 'callout' && block.callout?.rich_text) {
      const icon = block.callout.icon?.emoji || '💡';
      return `${indent}${icon} ${extractRichText(block.callout.rich_text)}`;
    }
    
    // Handle to-do items
    if (blockType === 'to_do' && block.to_do?.rich_text) {
      const checked = block.to_do.checked ? '[x]' : '[ ]';
      return `${indent}${checked} ${extractRichText(block.to_do.rich_text)}`;
    }
    
    // Handle dividers
    if (blockType === 'divider') {
      return `${indent}---`;
    }
    
    // Handle table of contents
    if (blockType === 'table_of_contents') {
      return `${indent}[Table of Contents]`;
    }
    
    // Handle columns (just indicate presence, children will be fetched recursively)
    if (blockType === 'column_list') {
      return `${indent}[Columns]`;
    }
    if (blockType === 'column') {
      return null; // Columns themselves don't have text, their children do
    }
    
    // Handle child pages
    if (blockType === 'child_page') {
      return `${indent}📄 ${block.child_page?.title || 'Untitled Page'}`;
    }
    
    // Handle child databases
    if (blockType === 'child_database') {
      return `${indent}🗂️ ${block.child_database?.title || 'Untitled Database'}`;
    }
    
    return null;
  } catch (error) {
    console.error('[NotionService] Error extracting text from block:', error.message);
    return null;
  }
}

/**
 * Extracts plain text from Notion rich_text array
 * @param {Array} richTextArray - Array of rich text objects
 * @returns {string} - Combined plain text
 */
function extractRichText(richTextArray) {
  if (!Array.isArray(richTextArray)) {
    return '';
  }
  
  return richTextArray
    .map(textObj => textObj.plain_text || '')
    .join('');
}

/**
 * Checks if Notion API is configured and accessible
 * @returns {Promise<boolean>}
 */
async function checkNotionHealth() {
  try {
    if (!process.env.NOTION_API_KEY) {
      return false;
    }
    
    // Try a simple API call to verify connection
    await notion.users.me();
    return true;
  } catch (error) {
    console.error('[NotionService] Health check failed:', error.message);
    return false;
  }
}

module.exports = {
  fetchPageContent,
  checkNotionHealth
};
