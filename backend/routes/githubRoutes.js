const express = require('express');
const router = express.Router();
const { getActivePRs, getAllRepos, checkGitHubHealth } = require('../controllers/githubController');

/**
 * @route   GET /api/github/prs
 * @desc    Get all open Pull Requests from the organization
 * @access  Public
 */
router.get('/prs', getActivePRs);

/**
 * @route   GET /api/github/repos
 * @desc    Get all repositories from the organization
 * @access  Public
 */
router.get('/repos', getAllRepos);

/**
 * @route   GET /api/github/health
 * @desc    Check GitHub API connection health
 * @access  Public
 */
router.get('/health', checkGitHubHealth);

module.exports = router;
