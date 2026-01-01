const crypto = require('crypto');
const reviewService = require('../services/reviewService');
const prisma = require('../config/database');

/**
 * Webhook Controller - Handles GitHub webhook events
 */
class WebhookController {
  /**
   * Verify GitHub webhook signature
   * @param {string} payload - Raw request body
   * @param {string} signature - GitHub signature from headers
   * @returns {boolean} - Whether signature is valid
   */
  verifyGitHubSignature(payload, signature) {
    if (!signature) {
      return false;
    }

    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      console.error('GITHUB_WEBHOOK_SECRET is not set in environment variables');
      return false;
    }

    // GitHub sends signature as 'sha256=<hash>'
    const signatureHash = signature.split('=')[1];
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signatureHash, 'hex'),
      Buffer.from(digest, 'hex')
    );
  }

  /**
   * Handle GitHub webhook events
   */
  async handleGitHubWebhook(req, res) {
    try {
      // Get raw body for signature verification
      const signature = req.headers['x-hub-signature-256'];
      const payload = JSON.stringify(req.body);

      // Verify webhook signature
      if (!this.verifyGitHubSignature(payload, signature)) {
        console.error('Invalid webhook signature');
        return res.status(401).json({
          status: 'error',
          message: 'Invalid signature'
        });
      }

      // Get event type
      const event = req.headers['x-github-event'];
      
      // Only process pull_request events
      if (event !== 'pull_request') {
        return res.status(200).json({
          status: 'success',
          message: `Event '${event}' received but not processed`
        });
      }

      // Process pull request event
      const { action, pull_request, repository } = req.body;

      // Only process 'opened' and 'synchronize' actions
      if (action !== 'opened' && action !== 'synchronize') {
        return res.status(200).json({
          status: 'success',
          message: `PR action '${action}' received but not processed`
        });
      }

      console.log(`Processing PR #${pull_request.number}: ${action}`);

      // Extract PR details
      const prLink = pull_request.html_url;
      const branchName = pull_request.head.ref;
      const prNumber = pull_request.number;
      const repoName = repository.full_name;

      // Mock code diff (in real implementation, fetch from GitHub API)
      const mockCodeDiff = `
function newFeature() {
  console.log('New feature added');
}

const handleRequest = async (req, res) => {
  return res.json({ success: true });
}

describe('newFeature', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
      `.trim();

      // Generate review feedback using reviewService
      const reviewResult = reviewService.analyzeChanges(branchName, mockCodeDiff);

      // Save review to database
      const review = await prisma.review.create({
        data: {
          prLink,
          branchName,
          feedbackContent: reviewResult.feedback,
          status: 'PENDING'
        }
      });

      console.log(`Review saved to database with ID: ${review.id}`);
      console.log(`Review status: ${reviewResult.status}, Severity: ${reviewResult.severity}`);

      // Return success response to GitHub
      return res.status(200).json({
        status: 'success',
        message: 'Pull request review generated and saved',
        data: {
          reviewId: review.id,
          prNumber,
          branchName,
          repoName,
          reviewStatus: reviewResult.status,
          severity: reviewResult.severity,
          approved: reviewResult.approved
        }
      });

    } catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Test endpoint to manually trigger review (for development)
   */
  async testReview(req, res) {
    try {
      const { branchName, prLink } = req.body;

      if (!branchName || !prLink) {
        return res.status(400).json({
          status: 'error',
          message: 'branchName and prLink are required'
        });
      }

      // Mock code diff for testing
      const mockCodeDiff = `
function testFunction() {
  return 'Hello World';
}
      `.trim();

      // Generate review
      const reviewResult = reviewService.analyzeChanges(branchName, mockCodeDiff);

      // Save to database
      const review = await prisma.review.create({
        data: {
          prLink,
          branchName,
          feedbackContent: reviewResult.feedback,
          status: 'PENDING'
        }
      });

      return res.status(200).json({
        status: 'success',
        message: 'Test review generated',
        data: {
          reviewId: review.id,
          branchName,
          reviewStatus: reviewResult.status,
          feedback: reviewResult.feedback
        }
      });

    } catch (error) {
      console.error('Error in test review:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new WebhookController();
