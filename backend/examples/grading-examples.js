/**
 * Example Usage & Testing Script
 * Demonstrates how to use the grading API
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/grade';

/**
 * Example 1: Grade a Module 02 submission
 */
async function exampleGradeModule02() {
  console.log('=== Example: Grading Module 02 Submission ===\n');
  
  try {
    const response = await axios.post(BASE_URL, {
      repoUrl: 'https://github.com/student-name/html-css-project',
      moduleNumber: 2,
      studentName: 'john-doe'
    });
    
    console.log('✅ Grading completed successfully!\n');
    console.log('Student:', response.data.student);
    console.log('Module:', response.data.moduleNumber);
    console.log('\nResults:');
    console.log('  Total Score:', response.data.summary.totalScore);
    console.log('  Max Score:', response.data.summary.maxScore);
    console.log('  Percentage:', response.data.summary.percentage + '%');
    console.log('  Status:', response.data.summary.status);
    
    console.log('\nCompleteness Details:');
    console.log('  Score:', response.data.results.completeness.score + '/' + 
                response.data.results.completeness.maxScore);
    console.log('  Passed checks:', response.data.results.completeness.passed.length);
    console.log('  Errors:', response.data.results.completeness.errors.length);
    
    if (response.data.results.completeness.errors.length > 0) {
      console.log('\n❌ Errors found:');
      response.data.results.completeness.errors.forEach(error => {
        console.log('  -', error);
      });
    }
    
    if (response.data.results.completeness.passed.length > 0) {
      console.log('\n✅ Passed checks:');
      response.data.results.completeness.passed.forEach(pass => {
        console.log('  -', pass);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

/**
 * Example 2: Health check
 */
async function exampleHealthCheck() {
  console.log('\n\n=== Example: Health Check ===\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Service is operational');
    console.log('Available modules:', response.data.availableModules);
  } catch (error) {
    console.error('❌ Service unavailable:', error.message);
  }
}

/**
 * Example 3: Error handling - Invalid URL
 */
async function exampleInvalidUrl() {
  console.log('\n\n=== Example: Error Handling (Invalid URL) ===\n');
  
  try {
    const response = await axios.post(BASE_URL, {
      repoUrl: 'not-a-valid-url',
      moduleNumber: 2,
      studentName: 'test-student'
    });
  } catch (error) {
    console.log('Expected error caught:');
    console.log('  Status:', error.response?.status);
    console.log('  Error:', error.response?.data?.error);
  }
}

/**
 * Example 4: Error handling - Unsupported module
 */
async function exampleUnsupportedModule() {
  console.log('\n\n=== Example: Error Handling (Unsupported Module) ===\n');
  
  try {
    const response = await axios.post(BASE_URL, {
      repoUrl: 'https://github.com/valid/repo',
      moduleNumber: 99,
      studentName: 'test-student'
    });
  } catch (error) {
    console.log('Expected error caught:');
    console.log('  Status:', error.response?.status);
    console.log('  Message:', error.response?.data?.message);
  }
}

/**
 * Example 5: Batch grading (multiple students)
 */
async function exampleBatchGrading() {
  console.log('\n\n=== Example: Batch Grading ===\n');
  
  const students = [
    {
      repoUrl: 'https://github.com/student1/project',
      moduleNumber: 2,
      studentName: 'alice'
    },
    {
      repoUrl: 'https://github.com/student2/project',
      moduleNumber: 2,
      studentName: 'bob'
    },
    {
      repoUrl: 'https://github.com/student3/project',
      moduleNumber: 2,
      studentName: 'charlie'
    }
  ];
  
  console.log(`Grading ${students.length} students sequentially...\n`);
  
  for (const student of students) {
    try {
      const response = await axios.post(BASE_URL, student);
      console.log(`✅ ${student.studentName}: ${response.data.summary.totalScore}/${response.data.summary.maxScore} (${response.data.summary.percentage}%)`);
    } catch (error) {
      console.log(`❌ ${student.studentName}: Failed - ${error.response?.data?.message || error.message}`);
    }
  }
}

/**
 * Run all examples
 */
async function runExamples() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  Automated Grading System - Examples      ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  // Check if server is running
  try {
    await axios.get(`${BASE_URL}/health`);
  } catch (error) {
    console.error('❌ Server is not running!');
    console.error('Please start the server first: node server.js\n');
    return;
  }
  
  // Run examples
  await exampleHealthCheck();
  await exampleGradeModule02();
  await exampleInvalidUrl();
  await exampleUnsupportedModule();
  // await exampleBatchGrading(); // Uncomment to test batch grading
  
  console.log('\n\n✅ All examples completed!\n');
}

// Run if executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  exampleGradeModule02,
  exampleHealthCheck,
  exampleInvalidUrl,
  exampleUnsupportedModule,
  exampleBatchGrading
};
