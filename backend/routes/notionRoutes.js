/**
 * Notion Routes
 * API routes for fetching grading rules from Notion
 */

const express = require('express');
const router = express.Router();
const { getGradingRules, checkHealth } = require('../controllers/notionController');

/**
 * @route   POST /api/notion/rules
 * @desc    Fetch grading rules from Notion based on repo and branch
 * @access  Public
 * @body    { repoName: string, branchName: string }
 */
router.post('/rules', getGradingRules);

/**
 * @route   GET /api/notion/health
 * @desc    Check Notion API connection health
 * @access  Public
 */
router.get('/health', checkHealth);

module.exports = router;
