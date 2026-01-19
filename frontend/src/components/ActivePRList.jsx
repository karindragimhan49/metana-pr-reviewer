import { GitPullRequest, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ActivePRList({ prs, loading, onRefresh }) {
  const navigate = useNavigate();

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-8 transition-colors">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg transition-colors overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
            <GitPullRequest className="w-5 h-5 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Pull Requests</h2>
            <p className="text-xs text-gray-500 dark:text-gray-500">{prs.length} open PRs waiting for review</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-white/20 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
        >
          Refresh
        </button>
      </div>

      {/* Content */}
      {prs.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <GitPullRequest className="w-8 h-8 text-green-600 dark:text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">All caught up! 🎉</h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">No open pull requests at the moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-white/10">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                  Repository
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                  PR Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                  Labels
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {prs.map((pr, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* Repository Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <code className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
                        {pr.repoName}
                      </code>
                    </div>
                  </td>

                  {/* PR Title */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300 max-w-md truncate">
                      {pr.title}
                    </div>
                  </td>

                  {/* Student (Author) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {pr.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{pr.author}</span>
                    </div>
                  </td>

                  {/* Time */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTimeAgo(pr.createdAt)}
                    </div>
                  </td>

                  {/* Labels */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {pr.labels && pr.labels.length > 0 ? (
                        pr.labels.slice(0, 2).map((label, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10"
                          >
                            {label}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-600">-</span>
                      )}
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                    >
                      Review
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ActivePRList;
