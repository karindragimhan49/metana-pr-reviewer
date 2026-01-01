import { useState, useEffect } from 'react';
import { getPendingReviews, approveReview } from '../services/api';
import metanaLogo from '../assets/images.png';

function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingReviews();
      setReviews(data.data || []);
    } catch (err) {
      setError('Failed to fetch reviews. Make sure the backend is running on port 3000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    if (!confirm('Are you sure you want to approve this review and post it to GitHub?')) {
      return;
    }

    try {
      setApprovingId(reviewId);
      const result = await approveReview(reviewId);
      
      if (result.success) {
        alert('Review approved successfully!' + 
          (result.github.commentPosted 
            ? '\n✓ Comment posted to GitHub.' 
            : '\n⚠ Note: Could not post to GitHub. Check your GITHUB_TOKEN in .env')
        );
        
        setReviews(reviews.filter(review => review.id !== reviewId));
        setSelectedReview(null);
      }
    } catch (err) {
      alert('Failed to approve review: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-dark-700 border-t-neon mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Navbar */}
      <nav className="bg-dark-800 border-b border-dark-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Styled consistently with Home page */}
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg p-2 shadow-lg hover:shadow-neon/20 transition-shadow">
                <img src={metanaLogo} alt="Metana" className="h-8 w-auto" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-gray-300">
                  DevOps <span className="text-neon">Reviewer</span>
                </h1>
                <p className="text-xs text-gray-500">Instructor Dashboard</p>
              </div>
            </div>

            {/* User Profile & Status */}
            <div className="flex items-center gap-6">
              {/* Status Indicator */}
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-dark-700 rounded-lg border border-neon/30">
                <span className="w-2 h-2 bg-neon rounded-full animate-pulse"></span>
                <span className="text-sm text-neon font-semibold">LIVE</span>
              </div>
              
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-300">Instructor</p>
                  <p className="text-xs text-gray-500">Admin Access</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-neon to-green-400 rounded-full flex items-center justify-center border-2 border-dark-700 shadow-lg">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-neon/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide">Pending Reviews</p>
                <p className="text-3xl font-bold text-neon mt-2">{reviews.length}</p>
              </div>
              <div className="w-12 h-12 bg-neon/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide">Total Processed</p>
                <p className="text-3xl font-bold text-white mt-2">--</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide">System Status</p>
                <p className="text-xl font-bold text-neon mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-neon rounded-full animate-pulse"></span>
                  ONLINE
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Reviews List */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-neon">▶</span> Pending Reviews
              </h2>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-dark-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">No pending reviews</p>
                  <p className="text-sm text-gray-600 mt-2">All caught up! 🎉</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      onClick={() => setSelectedReview(review)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedReview?.id === review.id
                          ? 'bg-neon/10 border-neon shadow-neon'
                          : 'bg-dark-700 border-dark-600 hover:border-neon/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <code className="text-sm font-mono text-neon px-2 py-1 bg-dark-900 rounded">
                          {review.branchName}
                        </code>
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30 animate-pulse">
                          PENDING
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review Inspector Panel */}
          <div className="lg:col-span-2">
            {selectedReview ? (
              <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-dark-700 px-6 py-4 border-b border-dark-600">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <span className="text-neon">●</span> Code Inspector
                    </h2>
                    <button
                      onClick={() => setSelectedReview(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Branch Info */}
                  <div className="mb-6">
                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Branch</label>
                    <code className="text-lg font-mono text-neon bg-dark-900 px-4 py-2 rounded-lg inline-block">
                      {selectedReview.branchName}
                    </code>
                  </div>

                  {/* PR Link */}
                  {selectedReview.prUrl && (
                    <div className="mb-6">
                      <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Pull Request</label>
                      <a
                        href={selectedReview.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline flex items-center gap-2"
                      >
                        View on GitHub
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}

                  {/* AI Feedback Terminal */}
                  <div className="mb-6">
                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      AI Analysis Output
                    </label>
                    <div className="bg-dark-900 border border-dark-700 rounded-lg p-6 font-mono text-sm overflow-auto max-h-96">
                      <div className="text-gray-500 mb-2">$ ai-review --analyze</div>
                      <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {selectedReview.aiFeedback}
                      </pre>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-dark-700">
                    {/* Approve Button (Hero) */}
                    <button
                      onClick={() => handleApprove(selectedReview.id)}
                      disabled={approvingId === selectedReview.id}
                      className="flex-1 group relative px-8 py-4 bg-neon text-black font-bold text-lg rounded-lg hover:bg-neon-hover transition-all duration-300 shadow-neon hover:shadow-neon-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <span className="flex items-center justify-center gap-3">
                        {approvingId === selectedReview.id ? (
                          <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve & Post to GitHub
                          </>
                        )}
                      </span>
                    </button>

                    {/* Reject Button */}
                    <button
                      disabled={approvingId === selectedReview.id}
                      className="px-8 py-4 bg-transparent border-2 border-red-500/50 text-red-400 font-semibold rounded-lg hover:bg-red-500/10 hover:border-red-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-12 text-center">
                <svg className="w-24 h-24 text-dark-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p className="text-gray-500 text-lg">Select a review from the list to begin analysis</p>
                <p className="text-gray-600 text-sm mt-2">Inspector panel will display here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1F2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d0fc03;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
