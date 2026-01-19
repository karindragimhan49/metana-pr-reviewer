import { useState } from 'react';
import { GitBranch, Search, ExternalLink, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RepoList({ repos, loading, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleGradeClick = (repoUrl) => {
    // Navigate to grading assistant and pass repo URL as state
    navigate('/grading', { state: { repoUrl } });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-8 transition-colors">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg transition-colors overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Repositories</h2>
              <p className="text-xs text-gray-500 dark:text-gray-500">{repos.length} student repositories</p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-white/20 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Refresh
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/50 transition-all"
          />
        </div>
      </div>

      {/* Content */}
      {filteredRepos.length === 0 ? (
        <div className="text-center py-12 px-4">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {searchTerm ? `No repositories found matching "${searchTerm}"` : 'No repositories available'}
          </p>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md dark:hover:shadow-white/5 transition-all group"
              >
                {/* Repo Name */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white font-mono truncate mb-1">
                      {repo.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {repo.language && repo.language !== 'N/A' && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          {repo.language}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  Updated {formatDate(repo.lastUpdated)}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGradeClick(repo.url)}
                    className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    Grade This
                  </button>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                    title="View on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer with count */}
      {filteredRepos.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-white/10 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Showing {filteredRepos.length} of {repos.length} repositories
          </p>
        </div>
      )}
    </div>
  );
}

export default RepoList;
