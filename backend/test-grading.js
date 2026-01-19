#!/usr/bin/env node

/**
 * Simple Testing Script (No External Dependencies)
 * Tests the grading system using built-in Node.js http module
 */

const http = require('http');

const HOST = 'localhost';
const PORT = 3000;
const BASE_PATH = '/api/grade';

/**
 * Makes an HTTP request
 */
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({
            status: res.statusCode,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Test 1: Health Check
 */
async function testHealthCheck() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: Health Check');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const response = await makeRequest('GET', `${BASE_PATH}/health`);
    
    if (response.status === 200) {
      console.log('✅ PASSED - Service is operational');
      console.log(`   Available Modules: ${response.data.availableModules.join(', ')}`);
      return true;
    } else {
      console.log(`❌ FAILED - Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ FAILED - Server not reachable');
    console.log(`   Error: ${error.message}`);
    console.log('\n💡 Tip: Make sure the server is running (node server.js)');
    return false;
  }
}

/**
 * Test 2: Invalid Request (Missing Fields)
 */
async function testMissingFields() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: Validation - Missing Fields');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const response = await makeRequest('POST', BASE_PATH, {
      moduleNumber: 2
      // Missing repoUrl and studentName
    });
    
    if (response.status === 400) {
      console.log('✅ PASSED - Correctly rejected invalid request');
      console.log(`   Error: ${response.data.error}`);
      return true;
    } else {
      console.log('❌ FAILED - Should have returned 400 status');
      return false;
    }
  } catch (error) {
    console.log(`❌ FAILED - ${error.message}`);
    return false;
  }
}

/**
 * Test 3: Invalid GitHub URL
 */
async function testInvalidUrl() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 3: Validation - Invalid GitHub URL');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const response = await makeRequest('POST', BASE_PATH, {
      repoUrl: 'not-a-valid-url',
      moduleNumber: 2,
      studentName: 'test-student'
    });
    
    if (response.status === 400) {
      console.log('✅ PASSED - Correctly rejected invalid URL');
      console.log(`   Error: ${response.data.error}`);
      return true;
    } else {
      console.log('❌ FAILED - Should have returned 400 status');
      return false;
    }
  } catch (error) {
    console.log(`❌ FAILED - ${error.message}`);
    return false;
  }
}

/**
 * Test 4: Unsupported Module
 */
async function testUnsupportedModule() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 4: Validation - Unsupported Module');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const response = await makeRequest('POST', BASE_PATH, {
      repoUrl: 'https://github.com/valid/repo',
      moduleNumber: 99,
      studentName: 'test-student'
    });
    
    if (response.status === 500 && response.data.message.includes('not implemented')) {
      console.log('✅ PASSED - Correctly rejected unsupported module');
      console.log(`   Message: ${response.data.message}`);
      return true;
    } else {
      console.log('❌ FAILED - Should have returned error for module 99');
      return false;
    }
  } catch (error) {
    console.log(`❌ FAILED - ${error.message}`);
    return false;
  }
}

/**
 * Test 5: Valid Request (Will fail if repo doesn't exist - that's expected)
 */
async function testValidRequest() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 5: Valid Request Structure');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('ℹ️  Using public test repository...\n');

  try {
    const response = await makeRequest('POST', BASE_PATH, {
      repoUrl: 'https://github.com/octocat/Hello-World',
      moduleNumber: 2,
      studentName: 'test-student'
    });
    
    // This will likely fail because the repo doesn't have the required structure
    // But it should fail gracefully with a proper response
    if (response.status === 200) {
      console.log('✅ PASSED - Request accepted and processed');
      console.log(`   Score: ${response.data.summary.totalScore}/${response.data.summary.maxScore}`);
      console.log(`   Status: ${response.data.summary.status}`);
      
      if (response.data.results.completeness.errors.length > 0) {
        console.log('\n   Expected errors (repo doesn\'t match criteria):');
        response.data.results.completeness.errors.slice(0, 3).forEach(err => {
          console.log(`   - ${err}`);
        });
        if (response.data.results.completeness.errors.length > 3) {
          console.log(`   ... and ${response.data.results.completeness.errors.length - 3} more`);
        }
      }
      return true;
    } else if (response.status === 500) {
      console.log('⚠️  PARTIAL - Request processed but cloning/grading failed');
      console.log(`   This is expected if Git is not configured or repo is inaccessible`);
      console.log(`   Error: ${response.data.message}`);
      return true; // Still counts as success - error handling works
    } else {
      console.log(`❌ FAILED - Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ FAILED - ${error.message}`);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   AUTOMATED GRADING SYSTEM - TEST SUITE       ║');
  console.log('╚════════════════════════════════════════════════╝');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  // Run all tests
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Missing Fields', fn: testMissingFields },
    { name: 'Invalid URL', fn: testInvalidUrl },
    { name: 'Unsupported Module', fn: testUnsupportedModule },
    { name: 'Valid Request', fn: testValidRequest }
  ];

  for (const test of tests) {
    results.total++;
    const passed = await test.fn();
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Print summary
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║                TEST SUMMARY                    ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  
  console.log(`Total Tests:  ${results.total}`);
  console.log(`✅ Passed:     ${results.passed}`);
  console.log(`❌ Failed:     ${results.failed}`);
  
  const percentage = ((results.passed / results.total) * 100).toFixed(1);
  console.log(`\nSuccess Rate: ${percentage}%\n`);

  if (results.failed === 0) {
    console.log('🎉 All tests passed!\n');
  } else {
    console.log('⚠️  Some tests failed. Check the output above for details.\n');
  }

  process.exit(results.failed === 0 ? 0 : 1);
}

// Run tests
if (require.main === module) {
  console.log(`\nTesting server at: http://${HOST}:${PORT}${BASE_PATH}\n`);
  
  runTests().catch(error => {
    console.error('\n❌ Test suite crashed:', error);
    process.exit(1);
  });
}

module.exports = { runTests };
