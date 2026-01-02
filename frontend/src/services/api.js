import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Get all pending reviews
 * @returns {Promise} Array of pending reviews
 */
export const getPendingReviews = async () => {
  try {
    const response = await api.get('/reviews');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    throw error;
  }
};

/**
 * Approve a review and post to GitHub
 * @param {number} reviewId - The ID of the review to approve
 * @returns {Promise} Updated review data
 */
export const approveReview = async (reviewId) => {
  try {
    const response = await api.post(`/reviews/${reviewId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving review:', error);
    throw error;
  }
};

/**
 * Reject a review
 * @param {number} reviewId - The ID of the review to reject
 * @returns {Promise} Updated review data
 */
export const rejectReview = async (reviewId) => {
  try {
    const response = await api.post(`/reviews/${reviewId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting review:', error);
    throw error;
  }
};

export default api;
