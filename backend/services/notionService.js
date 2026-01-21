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
 * Fetches and extracts text content from a Notion page
 * @param {string} pageId - The Notion page ID
 * @returns {Promise<string>} - The combined text content
 */
async function fetchPageContent(pageId) {
  try {
    console.log(`[NotionService] Fetching content for page: ${pageId}`);
    
    // Fetch all blocks (content) from the page
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100
    });
    
    console.log(`[NotionService] Found ${response.results.length} blocks`);
    
    // Extract text from blocks
    const textContent = [];
    
    for (const block of response.results) {
      const text = extractTextFromBlock(block);
      if (text) {
        textContent.push(text);
      }
    }
    
    const combinedText = textContent.join('\n\n');
    console.log(`[NotionService] Extracted ${combinedText.length} characters`);
    
    return combinedText;
    
  } catch (error) {
    console.error('[NotionService] Error fetching page content:', error.message);
    throw new Error(`Failed to fetch Notion page: ${error.message}`);
  }
}

/**
 * Extracts plain text from a Notion block
 * @param {Object} block - The Notion block object
 * @returns {string|null} - The extracted text or null
 */
function extractTextFromBlock(block) {
  try {
    const blockType = block.type;
    
    // Handle paragraph blocks
    if (blockType === 'paragraph' && block.paragraph?.rich_text) {
      return extractRichText(block.paragraph.rich_text);
    }
    
    // Handle heading blocks
    if (blockType === 'heading_1' && block.heading_1?.rich_text) {
      return '# ' + extractRichText(block.heading_1.rich_text);
    }
    if (blockType === 'heading_2' && block.heading_2?.rich_text) {
      return '## ' + extractRichText(block.heading_2.rich_text);
    }
    if (blockType === 'heading_3' && block.heading_3?.rich_text) {
      return '### ' + extractRichText(block.heading_3.rich_text);
    }
    
    // Handle bulleted list items
    if (blockType === 'bulleted_list_item' && block.bulleted_list_item?.rich_text) {
      return '• ' + extractRichText(block.bulleted_list_item.rich_text);
    }
    
    // Handle numbered list items
    if (blockType === 'numbered_list_item' && block.numbered_list_item?.rich_text) {
      return '- ' + extractRichText(block.numbered_list_item.rich_text);
    }
    
    // Handle code blocks
    if (blockType === 'code' && block.code?.rich_text) {
      return '```\n' + extractRichText(block.code.rich_text) + '\n```';
    }
    
    // Handle quote blocks
    if (blockType === 'quote' && block.quote?.rich_text) {
      return '> ' + extractRichText(block.quote.rich_text);
    }
    
    // Handle callout blocks
    if (blockType === 'callout' && block.callout?.rich_text) {
      return '💡 ' + extractRichText(block.callout.rich_text);
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
