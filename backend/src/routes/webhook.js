const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// GitHub webhook endpoint
router.post('/github', (req, res) => {
  webhookController.handleGitHubWebhook(req, res);
});

// Test endpoint for manual review generation (development only)
router.post('/test-review', (req, res) => {
  webhookController.testReview(req, res);
});

module.exports = router;
