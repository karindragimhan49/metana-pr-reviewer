const { Octokit } = require('@octokit/rest');

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const GITHUB_ORG = process.env.GITHUB_ORG_NAME;

// Mock data for development/fallback
const MOCK_PRS = [
  {
    title: "Add user authentication feature",
    author: "student1",
    repoName: "student1-project",
    createdAt: "2026-01-15T10:30:00Z",
    url: "https://github.com/metana/student1-project/pull/1",
    labels: ["feature", "in-progress"]
  },
  {
    title: "Fix navigation bug",
    author: "student2",
    repoName: "student2-project",
    createdAt: "2026-01-18T14:20:00Z",
    url: "https://github.com/metana/student2-project/pull/3",
    labels: ["bug", "urgent"]
  },
  {
    title: "Update README documentation",
    author: "student3",
    repoName: "student3-project",
    createdAt: "2026-01-19T09:15:00Z",
    url: "https://github.com/metana/student3-project/pull/2",
    labels: ["documentation"]
  }
];

const MOCK_REPOS = [
  {
    name: "solidity-sol-74-poppy",
    url: "https://github.com/karindragimhan49/solidity-sol-74-poppy.git",
    lastUpdated: "2026-01-19T08:30:00Z",
    language: "Solidity"
  },
  {
    name: "fullstack-fsd20b-mousa",
    url: "https://github.com/metana/fullstack-fsd20b-mousa.git",
    lastUpdated: "2026-01-18T16:45:00Z",
    language: "JavaScript"
  },
  {
    name: "seca-seca04-timothy",
    url: "https://github.com/metana/seca-seca04-timothy.git",
    lastUpdated: "2026-01-19T11:20:00Z",
    language: "Python"
  },
  {
    name: "rust-bootcamp-v1",
    url: "https://github.com/metana/rust-bootcamp-v1.git",
    lastUpdated: "2026-01-20T14:15:00Z",
    language: "Rust"
  },
  {
    name: "python-automation-script",
    url: "https://github.com/metana/python-automation-script.git",
    lastUpdated: "2026-01-17T13:00:00Z",
    language: "Python"
  }
];

/**
 * Get all open Pull Requests from the organization
 * @route GET /api/github/prs
 */
const getActivePRs = async (req, res) => {
  try {
    // Validate environment variables
    if (!process.env.GITHUB_TOKEN || !GITHUB_ORG) {
      console.warn('⚠️  GitHub credentials not configured. Using mock data.');
      return res.status(200).json({
        success: true,
        source: 'mock',
        count: MOCK_PRS.length,
        data: MOCK_PRS
      });
    }

    // Fetch all repositories in the organization
    const { data: repos } = await octokit.repos.listForOrg({
      org: GITHUB_ORG,
      per_page: 100
    });

    // Fetch open PRs for each repository
    const allPRs = [];
    
    for (const repo of repos) {
      try {
        const { data: prs } = await octokit.pulls.list({
          owner: GITHUB_ORG,
          repo: repo.name,
          state: 'open',
          per_page: 100
        });

        // Transform PR data to match our format
        const transformedPRs = prs.map(pr => ({
          title: pr.title,
          author: pr.user.login,
          repoName: repo.name,
          createdAt: pr.created_at,
          url: pr.html_url,
          labels: pr.labels.map(label => label.name)
        }));

        allPRs.push(...transformedPRs);
      } catch (repoError) {
        console.error(`Error fetching PRs for ${repo.name}:`, repoError.message);
        // Continue with other repos even if one fails
      }
    }

    res.status(200).json({
      success: true,
      source: 'github',
      count: allPRs.length,
      data: allPRs
    });

  } catch (error) {
    console.error('❌ Error fetching PRs from GitHub:', error.message);
    
    // Return mock data if API fails
    return res.status(200).json({
      success: true,
      source: 'mock',
      count: MOCK_PRS.length,
      data: MOCK_PRS,
      warning: 'GitHub API unavailable. Showing sample data.'
    });
  }
};

/**
 * Get all repositories from the organization
 * @route GET /api/github/repos
 */
const getAllRepos = async (req, res) => {
  try {
    // Validate environment variables
    if (!process.env.GITHUB_TOKEN || !GITHUB_ORG) {
      console.warn('⚠️  GitHub credentials not configured. Using mock data.');
      return res.status(200).json({
        success: true,
        source: 'mock',
        count: MOCK_REPOS.length,
        data: MOCK_REPOS
      });
    }

    // Fetch all repositories in the organization
    const { data: repos } = await octokit.repos.listForOrg({
      org: GITHUB_ORG,
      type: 'all',
      per_page: 100,
      sort: 'updated',
      direction: 'desc'
    });

    // Transform repository data
    const transformedRepos = repos.map(repo => ({
      name: repo.name,
      url: repo.html_url,
      lastUpdated: repo.updated_at,
      language: repo.language || 'N/A'
    }));

    res.status(200).json({
      success: true,
      source: 'github',
      count: transformedRepos.length,
      data: transformedRepos
    });

  } catch (error) {
    console.error('❌ Error fetching repositories from GitHub:', error.message);
    
    // Return mock data if API fails
    return res.status(200).json({
      success: true,
      source: 'mock',
      count: MOCK_REPOS.length,
      data: MOCK_REPOS,
      warning: 'GitHub API unavailable. Showing sample data.'
    });
  }
};

/**
 * Get all branches for a specific repository
 * @route GET /api/github/branches/:owner/:repo
 */
const getBranches = async (req, res) => {
  try {
    const { owner, repo } = req.params;

    console.log(`[GitHub] Fetching branches for ${owner}/${repo}`);

    if (!process.env.GITHUB_TOKEN) {
      console.warn('⚠️  GitHub token not configured.');
      return res.status(200).json({
        success: true,
        source: 'mock',
        data: [
          { name: 'main', protected: true },
          { name: 'module-1', protected: false },
          { name: 'module-2', protected: false },
          { name: 'module-3', protected: false }
        ]
      });
    }

    // Fetch branches from GitHub
    const { data: branches } = await octokit.repos.listBranches({
      owner,
      repo,
      per_page: 100
    });

    const transformedBranches = branches.map(branch => ({
      name: branch.name,
      protected: branch.protected
    }));

    res.status(200).json({
      success: true,
      source: 'github',
      count: transformedBranches.length,
      data: transformedBranches
    });

  } catch (error) {
    console.error('❌ Error fetching branches:', error.message);
    
    // Return mock data if API fails
    return res.status(200).json({
      success: true,
      source: 'mock',
      data: [
        { name: 'main', protected: true },
        { name: 'module-1', protected: false },
        { name: 'module-2', protected: false }
      ],
      warning: 'GitHub API unavailable. Showing sample data.'
    });
  }
};

/**
 * Health check for GitHub API connection
 * @route GET /api/github/health
 */
const checkGitHubHealth = async (req, res) => {
  try {
    if (!process.env.GITHUB_TOKEN || !GITHUB_ORG) {
      return res.status(200).json({
        success: false,
        configured: false,
        message: 'GitHub credentials not configured in .env file'
      });
    }

    // Test API connection by fetching org info
    await octokit.orgs.get({ org: GITHUB_ORG });

    res.status(200).json({
      success: true,
      configured: true,
      organization: GITHUB_ORG,
      message: 'GitHub API connection successful'
    });

  } catch (error) {
    res.status(200).json({
      success: false,
      configured: true,
      error: error.message,
      message: 'GitHub API connection failed. Check your token and organization name.'
    });
  }
};

module.exports = {
  getActivePRs,
  getAllRepos,
  getBranches,
  checkGitHubHealth
};
