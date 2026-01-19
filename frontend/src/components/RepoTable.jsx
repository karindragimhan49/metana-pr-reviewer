import { useState } from 'react';
import { GitBranch, Search, ExternalLink, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RepoTable({ repos, loading, onRefresh }) {
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
    navigate('/grading', { state: { repoUrl } });
  };

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': 'bg-yellow-500',
      'TypeScript': 'bg-blue-500',
      'Python': 'bg-green-500',
      'Java': 'bg-red-500',
      'Go': 'bg-cyan-500',
      'Rust': 'bg-orange-500',
      'Ruby': 'bg-red-600',
      'PHP': 'bg-purple-500',
      'C++': 'bg-pink-500',
      'C#': 'bg-purple-600'
    };
    return colors[language] || 'bg-gray-500';
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
              <p className="text-xs text-gray-500 dark:text-gray-500">{repos.length} total repositories</p>
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

      {/* Table Content */}
      {filteredRepos.length === 0 ? (
        <div className="text-center py-12 px-4">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {searchTerm ? `No repositories found matching "${searchTerm}"` : 'No repositories available'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-white/10">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Repository Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {filteredRepos.map((repo, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {/* Repository Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                        <code className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
                          {repo.name}
                        </code>
                      </div>
                    </td>

                    {/* Language */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {repo.language && repo.language !== 'N/A' ? (
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{repo.language}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-600">-</span>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(repo.lastUpdated)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleGradeClick(repo.url)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                        >
                          Grade This
                        </button>
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          title="View on GitHub"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer with count */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-white/10 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Showing {filteredRepos.length} of {repos.length} repositories
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default RepoTable;
