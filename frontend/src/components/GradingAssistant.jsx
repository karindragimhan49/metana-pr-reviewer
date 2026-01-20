import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllRepos } from '../services/api';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Award, 
  GitBranch, 
  User, 
  Copy, 
  CheckCheck,
  AlertCircle,
  Sparkles,
  Search
} from 'lucide-react';

const GradingAssistant = () => {
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    studentName: '',
    repoUrl: '',
    moduleNumber: 2
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Repository dropdown states
  const [repositories, setRepositories] = useState([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch repositories on mount
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setReposLoading(true);
        const response = await getAllRepos();
        setRepositories(response.data || []);
      } catch (err) {
        console.error('Error fetching repositories:', err);
        setRepositories([]);
      } finally {
        setReposLoading(false);
      }
    };
    
    fetchRepositories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.repo-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pre-fill repo URL from navigation state
  useEffect(() => {
    if (location.state?.repoUrl) {
      setFormData(prev => ({
        ...prev,
        repoUrl: location.state.repoUrl
      }));
    }
  }, [location]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'moduleNumber' ? parseInt(value) : value
    }));
  };
  
  // Handle repository selection from dropdown
  const handleRepoSelect = (repo) => {
    // Ensure URL ends with .git for proper cloning
    const repoUrl = repo.url.endsWith('.git') ? repo.url : `${repo.url}.git`;
    
    console.log('🎯 Repository selected:', { name: repo.name, url: repoUrl });
    
    setFormData(prev => ({
      ...prev,
      repoUrl: repoUrl
    }));
    setSearchTerm(repo.name);
    setIsDropdownOpen(false);
  };
  
  // Filter repositories based on search term
  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate repository URL
    if (!formData.repoUrl || formData.repoUrl === 'undefined') {
      setError('Please select a repository from the dropdown');
      return;
    }
    
    console.log('📤 Submitting grading request:', formData);
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Grading failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while grading');
      console.error('Grading error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Copy summary to clipboard
  const handleCopySummary = () => {
    if (!result) return;

    const summary = `
📊 GRADING REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Student: ${result.student}
Module: ${result.moduleNumber} - ${result.results.moduleName}
Score: ${result.summary.totalScore}/${result.summary.maxScore} (${result.summary.percentage}%)
Status: ${result.summary.status}

✅ COMPLETENESS (${result.results.completeness.score}/${result.results.completeness.maxScore})
${result.results.completeness.passed.map(item => `  ✓ ${item}`).join('\n')}

${result.results.completeness.errors.length > 0 ? `❌ ERRORS:\n${result.results.completeness.errors.map(item => `  ✗ ${item}`).join('\n')}\n` : ''}

🤖 CODE QUALITY (${result.results.codeQuality.score}/${result.results.codeQuality.maxScore})
${result.results.codeQuality.feedback}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date().toLocaleString()}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      'Excellent': 'bg-green-100 text-green-800',
      'Good': 'bg-blue-100 text-blue-800',
      'Satisfactory': 'bg-yellow-100 text-yellow-800',
      'Needs Improvement': 'bg-orange-100 text-orange-800',
      'Unsatisfactory': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get score color based on percentage
  const getScoreColor = (percentage) => {
    const percent = parseFloat(percentage);
    if (percent >= 90) return 'text-green-600';
    if (percent >= 80) return 'text-blue-600';
    if (percent >= 70) return 'text-yellow-600';
    if (percent >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Automated Grading Assistant
          </h1>
          <p className="text-gray-600">
            Submit student repositories for automated grading with AI-powered code analysis
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline-block w-4 h-4 mr-1" />
                  Student Name
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="john-doe"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* GitHub Repository Dropdown */}
              <div className="relative repo-dropdown-container">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GitBranch className="inline-block w-4 h-4 mr-1" />
                  GitHub Repository
                </label>
                {reposLoading ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading repositories...
                  </div>
                ) : repositories.length === 0 ? (
                  <div className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-yellow-50 text-yellow-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>No repositories available. Using mock data or check GitHub connection.</span>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="Search repositories..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Dropdown List */}
                    {isDropdownOpen && filteredRepos.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredRepos.map((repo) => (
                          <button
                            key={repo.id}
                            type="button"
                            onClick={() => handleRepoSelect(repo)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                          >
                            <GitBranch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {repo.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {repo.url}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* No results message */}
                    {isDropdownOpen && searchTerm && filteredRepos.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
                        No repositories found
                      </div>
                    )}
                    
                    {/* Hidden input to hold the actual URL for form validation */}
                    <input
                      type="hidden"
                      name="repoUrl"
                      value={formData.repoUrl}
                      required
                    />
                    
                    {/* Show selected repository URL */}
                    {formData.repoUrl && formData.repoUrl !== '' && (
                      <div className="mt-2 flex items-center justify-between text-xs bg-green-50 border border-green-200 px-3 py-2 rounded">
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-green-700">✓ Selected:</span>
                          <span className="ml-2 text-green-600 truncate block">{formData.repoUrl}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, repoUrl: '' }));
                            setSearchTerm('');
                          }}
                          className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                          title="Clear selection"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Module Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award className="inline-block w-4 h-4 mr-1" />
                  Module Number
                </label>
                <select
                  name="moduleNumber"
                  value={formData.moduleNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {[...Array(11)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Module {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Grading in progress...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Start Grading
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-semibold mb-1">Grading Failed</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && result.success && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Grading Report
                  </h2>
                  <p className="text-gray-600">
                    {result.student} • Module {result.moduleNumber}: {result.results.moduleName}
                  </p>
                </div>
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Report
                    </>
                  )}
                </button>
              </div>

              {/* Score Display */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 text-center mb-6">
                <div className="mb-4">
                  <div className={`text-6xl font-bold ${getScoreColor(result.summary.percentage)} mb-2`}>
                    {result.summary.totalScore}
                    <span className="text-4xl text-gray-400">/{result.summary.maxScore}</span>
                  </div>
                  <div className="text-2xl text-gray-600 font-semibold">
                    {result.summary.percentage}%
                  </div>
                </div>
                <span className={`inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold ${getStatusColor(result.summary.status)}`}>
                  {result.summary.status}
                </span>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Completeness (Rule Engine) */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Structural Completeness
                    </h3>
                    <span className="text-sm font-semibold text-gray-600">
                      {result.results.completeness.score}/{result.results.completeness.maxScore} pts
                    </span>
                  </div>

                  {/* Passed Checks */}
                  {result.results.completeness.passed.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {result.results.completeness.passed.map((item, index) => (
                        <div key={`pass-${index}`} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Errors */}
                  {result.results.completeness.errors.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-red-700 mb-2">Issues Found:</h4>
                      {result.results.completeness.errors.map((item, index) => (
                        <div key={`error-${index}`} className="flex items-start gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.results.completeness.warnings && result.results.completeness.warnings.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-yellow-700 mb-2">Warnings:</h4>
                      {result.results.completeness.warnings.map((item, index) => (
                        <div key={`warning-${index}`} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column - AI Feedback */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      AI Code Quality
                    </h3>
                    <span className="text-sm font-semibold text-gray-600">
                      {result.results.codeQuality.score}/{result.results.codeQuality.maxScore} pts
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {result.results.codeQuality.feedback}
                    </div>
                  </div>

                  {/* AI Details (if available) */}
                  {result.results.codeQuality.details && (
                    <div className="space-y-2 text-xs text-gray-600">
                      {result.results.codeQuality.details.model && (
                        <div className="flex justify-between">
                          <span>Model:</span>
                          <span className="font-semibold">{result.results.codeQuality.details.model}</span>
                        </div>
                      )}
                      {result.results.codeQuality.details.tokensUsed && (
                        <div className="flex justify-between">
                          <span>Tokens Used:</span>
                          <span className="font-semibold">{result.results.codeQuality.details.tokensUsed}</span>
                        </div>
                      )}
                      {result.results.codeQuality.details.analyzedFile && (
                        <div className="flex justify-between">
                          <span>Analyzed File:</span>
                          <span className="font-semibold">{result.results.codeQuality.details.analyzedFile}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                Graded on {new Date(result.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradingAssistant;
