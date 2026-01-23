import { useState, useEffect } from 'react';
import { getAllReviews, getActivePRs, getAllRepos } from '../services/api';
import { RefreshCw, LayoutDashboard, GitBranch, GitPullRequest, Copy, CheckCheck } from 'lucide-react';
import HistoryModal from './HistoryModal';
import ActivePRList from './ActivePRList';
import RepoTable from './RepoTable';

function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // GitHub data states
  const [activePRs, setActivePRs] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [githubLoading, setGithubLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    console.log("📊 Dashboard mounted");
    fetchReviews();
    fetchGitHubData();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllReviews();
      // Filter only GRADED reviews and sort by most recent
      const gradedReviews = (data.data || []).filter(r => r.status === 'GRADED');
      setReviews(gradedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError('Failed to fetch reviews. Make sure the backend is running on port 3000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGitHubData = async () => {
    try {
      setGithubLoading(true);
      
      // Fetch PRs and Repos in parallel
      const [prsResponse, reposResponse] = await Promise.all([
        getActivePRs(),
        getAllRepos()
      ]);
      
      setActivePRs(prsResponse.data || []);
      setRepositories(reposResponse.data || []);
    } catch (err) {
      console.error('Error fetching GitHub data:', err);
      // Don't show error - components will handle empty states
    } finally {
      setGithubLoading(false);
    }
  };

  const handleRefreshGitHub = async () => {
    setRefreshing(true);
    await fetchGitHubData();
    setRefreshing(false);
  };

  const handleOpenHistory = async () => {
    setIsHistoryModalOpen(true);
  };

  const handleCopyReport = (review) => {
    const reviewContent = JSON.parse(review.reviewContent || '{}');
    const summary = reviewContent.summary || {};
    const results = reviewContent.results || {};
    
    const reportText = `
📊 GRADING REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Student: ${review.studentName || 'Unknown'}
Branch: ${review.branchName}
Repository: ${review.repoName}
Score: ${review.score}
Status: ${review.status}

🤖 AI FEEDBACK:
${reviewContent.feedback || 'No feedback available'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date(review.createdAt).toLocaleString()}
Review ID: ${review.id}
    `.trim();
    
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-[#ccf621] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors">
      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Bar - Clean SaaS Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider">Active PRs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{activePRs.length}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider">Total Repos</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{repositories.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider">Graded Reviews</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{reviews.length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            onClick={handleOpenHistory}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-6 transition-all cursor-pointer hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md dark:hover:shadow-white/5 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider">View All</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1 group-hover:text-green-600 dark:group-hover:text-neon transition-colors">History</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-neon/10 transition-colors">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-neon transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg mb-6 overflow-hidden transition-colors">
          <div className="flex border-b border-gray-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === 'overview'
                  ? 'text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-500"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('repositories')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === 'repositories'
                  ? 'text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              All Repositories
              {activeTab === 'repositories' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-500"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('prs')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === 'prs'
                  ? 'text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <GitPullRequest className="w-4 h-4" />
              Active PRs
              {activeTab === 'prs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-500"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Activity Section */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-6 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                  <button
                    onClick={handleRefreshGitHub}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-white/20 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {githubLoading ? (
                  <div className="space-y-3">
                    <div className="animate-pulse h-16 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                    <div className="animate-pulse h-16 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                    <div className="animate-pulse h-16 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                  </div>
                ) : activePRs.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <GitPullRequest className="w-6 h-6 text-green-600 dark:text-green-500" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">No recent pull requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activePRs.slice(0, 3).map((pr, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
                              {pr.repoName}
                            </code>
                            {pr.labels && pr.labels.length > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                {pr.labels[0]}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{pr.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">by {pr.author}</p>
                        </div>
                        <a
                          href={pr.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors flex-shrink-0"
                        >
                          Review
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {activePRs.length > 3 && (
                  <button
                    onClick={() => setActiveTab('prs')}
                    className="mt-4 w-full px-4 py-2 text-sm text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 font-medium border border-green-200 dark:border-green-500/20 rounded-md hover:bg-green-50 dark:hover:bg-green-500/10 transition-all"
                  >
                    View All {activePRs.length} Pull Requests →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* All Repositories Tab */}
          {activeTab === 'repositories' && (
            <RepoTable 
              repos={repositories} 
              loading={githubLoading}
              onRefresh={handleRefreshGitHub}
            />
          )}

          {/* Active PRs Tab */}
          {activeTab === 'prs' && (
            <ActivePRList 
              prs={activePRs} 
              loading={githubLoading}
              onRefresh={handleRefreshGitHub}
            />
          )}
        </div>

        {/* Old Review System - Keep at bottom for now */}
        <div className="mt-8">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Grading History List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-5 transition-colors">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Recent Grading History</h2>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-500">No grading history yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Grade your first submission!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {reviews.slice(0, 20).map((review) => (
                    <div
                      key={review.id}
                      onClick={() => setSelectedReview(review)}
                      className={`p-3 rounded-md border cursor-pointer transition-all ${
                        selectedReview?.id === review.id
                          ? 'bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/20'
                          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <code className="text-xs font-mono text-gray-700 dark:text-gray-300 px-2 py-1 bg-gray-200 dark:bg-black/40 rounded">
                            {review.branchName}
                          </code>
                          {review.studentName && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{review.studentName}</p>
                          )}
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500 rounded border border-green-200 dark:border-green-500/20 flex-shrink-0">
                          {review.score}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
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
              <div className="bg-white dark:bg-gray-900 
                border border-gray-200 dark:border-white/10 
                rounded-lg overflow-hidden transition-colors">

                {/* Header */}
                <div className="bg-gray-100 dark:bg-gray-800/50 
                px-5 py-3 
                border-b border-gray-200 dark:border-white/10 
                transition-colors">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Grading Report</h2>
                    <button
                      onClick={() => setSelectedReview(null)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Student & Branch Info */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider block mb-2">Student</label>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-black/40 px-3 py-2 rounded-md">
                        {selectedReview.studentName || 'Anonymous'}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider block mb-2">Branch</label>
                      <code className="text-sm font-mono text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-black/40 px-3 py-2 rounded-md inline-block">
                        {selectedReview.branchName}
                      </code>
                    </div>
                  </div>

                  {/* Score Display */}
                  <div className="mb-5 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-500/5 dark:to-blue-500/5 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-500 mb-2">
                      {selectedReview.score}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Final Grade
                    </div>
                  </div>

                  {/* Repository Info */}
                  {selectedReview.repoName && (
                    <div className="mb-5">
                      <label className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider block mb-2">Repository</label>
                      <div className="text-sm text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-md font-mono text-xs break-all">
                        {selectedReview.repoName}
                      </div>
                    </div>
                  )}

                  {/* AI Feedback */}
                  <div className="mb-5">
                    <label className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider block mb-2">AI Feedback</label>
                    <div className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-md p-4 font-mono text-xs overflow-auto max-h-96">
                      <pre className="text-gray-900 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {(() => {
                          try {
                            const content = JSON.parse(selectedReview.reviewContent || '{}');
                            return content.feedback || content.summary?.feedback || 'No feedback available';
                          } catch (e) {
                            return selectedReview.feedbackContent || selectedReview.aiFeedback || 'No feedback available';
                          }
                        })()}
                      </pre>
                    </div>
                  </div>

                  {/* Action Button - Copy Only */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                    <button
                      onClick={() => handleCopyReport(selectedReview)}
                      className="flex-1 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-500 transition-colors"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {copied ? (
                          <>
                            <CheckCheck className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Report
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Timestamp */}
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-500 text-center">
                    Generated on {formatDate(selectedReview.createdAt)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-12 text-center transition-colors">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2\" />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-500">Select a review from the list to view details</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Custom Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5); 
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        reviews={reviews}
      />
    </div>
  );
}

export default Dashboard;
