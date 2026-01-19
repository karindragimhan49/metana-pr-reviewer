/**
 * Grading Routes
 * Defines API endpoints for the automated grading system
 */

const express = require('express');
const router = express.Router();
const { gradeSubmission, healthCheck } = require('../controllers/gradingController');

/**
 * POST /api/grade
 * Main grading endpoint
 * Body: { repoUrl: string, moduleNumber: number, studentName: string }
 */
router.post('/', gradeSubmission);

/**
 * GET /api/grade/health
 * Health check endpoint for the grading service
 */
router.get('/health', healthCheck);

module.exports = router;
