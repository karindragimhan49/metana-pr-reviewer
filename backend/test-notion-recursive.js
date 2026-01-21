/**
 * Test Script for Notion Recursive Fetching
 * Run this to verify nested content extraction works correctly
 */

require('dotenv').config();
const { fetchPageContent } = require('./services/notionService');

async function testRecursiveFetch() {
  console.log('='.repeat(60));
  console.log('🧪 Testing Notion Recursive Fetching');
  console.log('='.repeat(60));
  
  // Check if API key is configured
  if (!process.env.NOTION_API_KEY) {
    console.error('❌ NOTION_API_KEY not found in .env');
    console.log('\nPlease add to backend/.env:');
    console.log('NOTION_API_KEY=secret_your_token_here');
    process.exit(1);
  }
  
  console.log('✅ NOTION_API_KEY configured');
  console.log('');
  
  // Test with the fullstack module-02 page (update with your actual Page ID)
  const testPageId = '1fc10bb6c03980fd9dcfe2dfa9b4be9f';
  
  console.log(`📄 Fetching page: ${testPageId}`);
  console.log('');
  
  try {
    const startTime = Date.now();
    const content = await fetchPageContent(testPageId);
    const endTime = Date.now();
    
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ SUCCESS! Content fetched');
    console.log('='.repeat(60));
    console.log('');
    console.log(`⏱️  Fetch time: ${endTime - startTime}ms`);
    console.log(`📊 Content length: ${content.length} characters`);
    console.log(`📄 Lines: ${content.split('\n').length}`);
    console.log('');
    console.log('='.repeat(60));
    console.log('📝 EXTRACTED CONTENT (First 1000 chars):');
    console.log('='.repeat(60));
    console.log(content.substring(0, 1000));
    console.log('');
    if (content.length > 1000) {
      console.log(`... (${content.length - 1000} more characters)`);
    }
    console.log('');
    console.log('='.repeat(60));
    console.log('🔍 VERIFICATION CHECKLIST:');
    console.log('='.repeat(60));
    console.log('');
    
    // Check for nested content indicators
    const hasIndentation = content.includes('  •') || content.includes('  -');
    const hasToggles = content.includes('▶');
    const hasNestedContent = content.split('\n').some(line => line.startsWith('  '));
    
    console.log(`${hasIndentation ? '✅' : '❌'} Indented list items found`);
    console.log(`${hasToggles ? '✅' : '❌'} Toggle blocks found (▶)`);
    console.log(`${hasNestedContent ? '✅' : '❌'} Nested content detected`);
    console.log('');
    
    if (hasNestedContent) {
      console.log('🎉 Recursive fetching is working correctly!');
      console.log('   Nested content has been extracted with proper indentation.');
    } else {
      console.log('⚠️  No nested content detected in this page.');
      console.log('   Try adding toggle lists or nested bullets in Notion.');
    }
    
    console.log('');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('❌ ERROR');
    console.error('='.repeat(60));
    console.error('');
    console.error(`Message: ${error.message}`);
    console.error('');
    console.error('Possible issues:');
    console.error('1. Page ID is incorrect');
    console.error('2. Page not shared with integration');
    console.error('3. NOTION_API_KEY is invalid');
    console.error('4. Network connectivity issue');
    console.error('');
    process.exit(1);
  }
}

// Run the test
console.log('');
testRecursiveFetch().then(() => {
  console.log('');
  console.log('✨ Test complete!');
  console.log('');
  process.exit(0);
});
