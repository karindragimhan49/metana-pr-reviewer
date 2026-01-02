const { PrismaClient } = require('@prisma/client');
const { Octokit } = require('@octokit/rest');

const prisma = new PrismaClient();

/**
 * Get all pending reviews
 * @route GET /api/reviews
 */
exports.getPendingReviews = async (req, res) => {
  try {
    const pendingReviews = await prisma.review.findMany({
      where: {
        status: 'PENDING'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: pendingReviews.length,
      data: pendingReviews
    });
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending reviews',
      error: error.message
    });
  }
};

/**
 * Approve a review and post comment to GitHub
 * @route POST /api/reviews/:id/approve
 */
exports.approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewId = parseInt(id);

    // Validate ID
    if (isNaN(reviewId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    // Find the review
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if already approved
    if (review.status === 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'Review is already approved'
      });
    }

    // Update status to APPROVED
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { status: 'APPROVED' }
    });

    // Post comment to GitHub if token is available
    let githubCommentPosted = false;
    let githubError = null;

    if (process.env.GITHUB_TOKEN) {
      try {
        // Extract owner, repo, and PR number from prLink
        // Expected format: https://github.com/owner/repo/pull/123
        const prUrlMatch = review.prLink.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
        
        if (prUrlMatch) {
          const [, owner, repo, pull_number] = prUrlMatch;
          
          const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
          });

          await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: parseInt(pull_number),
            body: `## ✅ Review Approved by Instructor\n\n${updatedReview.feedbackContent}\n\n---\n*This review was approved via the Instructor Dashboard*`
          });

          githubCommentPosted = true;
        } else {
          githubError = 'Invalid PR link format';
        }
      } catch (error) {
        console.error('Error posting to GitHub:', error);
        githubError = error.message;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: updatedReview,
      github: {
        commentPosted: githubCommentPosted,
        error: githubError
      }
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve review',
      error: error.message
    });
  }
};

/**
 * Reject a review and remove it from the database
 * @route POST /api/reviews/:id/reject
 */
exports.rejectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewId = parseInt(id);

    // Validate ID
    if (isNaN(reviewId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    // Find the review
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update status to REJECTED (or delete if preferred)
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { status: 'REJECTED' }
    });

    // Alternative: Delete the review entirely
    // await prisma.review.delete({
    //   where: { id: reviewId }
    // });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Review rejected successfully',
      data: updatedReview
    });
  } catch (error) {
    console.error('Error rejecting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject review',
      error: error.message
    });
  }
};
