#!/usr/bin/env node

/**
 * Quick Test Script for AI Integration
 * Tests the OpenAI connection and code analysis
 */

require('dotenv').config();
const { analyzeJavaScript, checkAPIHealth } = require('./grading-engine/utils/aiHelper');

async function testAIIntegration() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   AI INTEGRATION TEST                          ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  // Test 1: Check API configuration
  console.log('TEST 1: Checking OpenAI API Configuration...');
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ FAILED - OPENAI_API_KEY not found in .env file\n');
    console.log('Please add your OpenAI API key to the .env file:');
    console.log('OPENAI_API_KEY=your-api-key-here\n');
    return;
  }
  console.log('✅ PASSED - API key is configured\n');

  // Test 2: Check API connectivity
  console.log('TEST 2: Testing OpenAI API Connectivity...');
  try {
    const isHealthy = await checkAPIHealth();
    if (isHealthy) {
      console.log('✅ PASSED - Successfully connected to OpenAI API\n');
    } else {
      console.log('❌ FAILED - Could not connect to OpenAI API');
      console.log('Please check your API key and internet connection\n');
      return;
    }
  } catch (error) {
    console.log('❌ FAILED - API health check error:', error.message);
    return;
  }

  // Test 3: Analyze sample JavaScript code
  console.log('TEST 3: Analyzing Sample JavaScript Code...');
  console.log('─────────────────────────────────────────────\n');

  const sampleCode = `
// Sample JavaScript code for testing
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

const cart = [
  { name: 'Book', price: 15.99 },
  { name: 'Pen', price: 2.50 }
];

console.log('Total:', calculateTotal(cart));
`;

  console.log('Analyzing code snippet...\n');

  try {
    const result = await analyzeJavaScript(sampleCode);

    if (result.error) {
      console.log('❌ FAILED - Analysis returned error');
      console.log('Error:', result.feedback);
      console.log('Details:', result.errorMessage);
      return;
    }

    console.log('✅ PASSED - Code analysis completed successfully!\n');
    console.log('─────────────────────────────────────────────');
    console.log('ANALYSIS RESULTS:');
    console.log('─────────────────────────────────────────────');
    console.log(`Score: ${result.score}/60`);
    console.log(`Model: ${result.model}`);
    console.log(`Tokens Used: ${result.tokensUsed}`);
    console.log('\nFeedback:');
    console.log(result.feedback);
    console.log('─────────────────────────────────────────────\n');

  } catch (error) {
    console.log('❌ FAILED - Unexpected error during analysis');
    console.log('Error:', error.message);
    return;
  }

  // Summary
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   ✅ ALL TESTS PASSED                          ║');
  console.log('║   AI Integration is working correctly!         ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  console.log('You can now use the AI-powered grading system!\n');
}

// Run tests
if (require.main === module) {
  testAIIntegration().catch(error => {
    console.error('\n❌ Test suite crashed:', error);
    process.exit(1);
  });
}

module.exports = { testAIIntegration };
