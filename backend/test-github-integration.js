/**
 * Test script for GitHub API integration
 * Tests both /api/github/prs and /api/github/repos endpoints
 * 
 * Usage: node test-github-integration.js
 */

const BASE_URL = 'http://localhost:3000';

async function testGitHubIntegration() {
  console.log('🚀 Testing GitHub API Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing GitHub API Health...');
    const healthResponse = await fetch(`${BASE_URL}/api/github/health`);
    const healthData = await healthResponse.json();
    console.log('   Status:', healthData.success ? '✅' : '⚠️');
    console.log('   Configured:', healthData.configured);
    console.log('   Message:', healthData.message);
    if (healthData.organization) {
      console.log('   Organization:', healthData.organization);
    }
    console.log();

    // Test 2: Get Active PRs
    console.log('2️⃣  Testing Active PRs Endpoint...');
    const prsResponse = await fetch(`${BASE_URL}/api/github/prs`);
    const prsData = await prsResponse.json();
    console.log('   Status:', prsData.success ? '✅' : '❌');
    console.log('   Source:', prsData.source);
    console.log('   Total PRs:', prsData.count);
    if (prsData.warning) {
      console.log('   Warning:', prsData.warning);
    }
    if (prsData.data && prsData.data.length > 0) {
      console.log('\n   Sample PR:');
      const samplePR = prsData.data[0];
      console.log('   - Title:', samplePR.title);
      console.log('   - Author:', samplePR.author);
      console.log('   - Repo:', samplePR.repoName);
      console.log('   - Labels:', samplePR.labels.join(', ') || 'none');
      console.log('   - URL:', samplePR.url);
    }
    console.log();

    // Test 3: Get All Repos
    console.log('3️⃣  Testing Repositories Endpoint...');
    const reposResponse = await fetch(`${BASE_URL}/api/github/repos`);
    const reposData = await reposResponse.json();
    console.log('   Status:', reposData.success ? '✅' : '❌');
    console.log('   Source:', reposData.source);
    console.log('   Total Repos:', reposData.count);
    if (reposData.warning) {
      console.log('   Warning:', reposData.warning);
    }
    if (reposData.data && reposData.data.length > 0) {
      console.log('\n   Sample Repo:');
      const sampleRepo = reposData.data[0];
      console.log('   - Name:', sampleRepo.name);
      console.log('   - Language:', sampleRepo.language);
      console.log('   - Last Updated:', new Date(sampleRepo.lastUpdated).toLocaleDateString());
      console.log('   - URL:', sampleRepo.url);
    }
    console.log();

    console.log('✅ All tests completed successfully!\n');

    // Print summary
    console.log('📊 Summary:');
    console.log('   - API Health:', healthData.configured ? '✅ Configured' : '⚠️  Not Configured');
    console.log('   - PRs Data Source:', prsData.source === 'github' ? '✅ Live GitHub' : '⚠️  Mock Data');
    console.log('   - Repos Data Source:', reposData.source === 'github' ? '✅ Live GitHub' : '⚠️  Mock Data');
    console.log();

    if (prsData.source === 'mock' || reposData.source === 'mock') {
      console.log('💡 Tip: To use live GitHub data, configure GITHUB_TOKEN and GITHUB_ORG_NAME in .env file');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3000');
    console.log('   Run: npm run dev');
  }
}

// Run tests
testGitHubIntegration();
