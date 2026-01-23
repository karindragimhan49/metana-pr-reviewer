import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Award, 
  GitBranch, 
  Copy, 
  CheckCheck,
  AlertCircle,
  Sparkles,
  Search,
  FileCode,
  BookOpen
} from 'lucide-react';

// Course detection logic based on repository name (case-insensitive)
const detectCourse = (repoName) => {
  const name = repoName.toLowerCase();
  
  // Check for Solidity patterns
  if (name.startsWith('solidity-') || name.startsWith('sol-') || name.includes('solidity')) {
    return { name: 'Solidity Bootcamp', color: 'bg-blue-100 text-blue-800', icon: '⚡' };
  }
  
  // Check for Full Stack patterns
  if (name.startsWith('fullstack-') || name.startsWith('fsd-') || name.startsWith('fsd2')) {
    return { name: 'Full Stack Web3', color: 'bg-purple-100 text-purple-800', icon: '🌐' };
  }
  
  // Check for Cyber Security patterns
  if (name.startsWith('seca-') || name.includes('security')) {
    return { name: 'Cyber Security', color: 'bg-red-100 text-red-800', icon: '🔒' };
  }
  
  // Check for Rust patterns
  if (name.startsWith('rust-') || name.includes('rust')) {
    return { name: 'Rust Bootcamp', color: 'bg-orange-100 text-orange-800', icon: '🦀' };
  }
  
  // Default fallback
  return { name: 'General Engineering', color: 'bg-gray-100 text-gray-800', icon: '💻' };
};

const GradingAssistant = () => {
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    studentName: '',
    repoUrl: '',
    branchName: '',
    customInstructions: ''
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
  
  // Branch dropdown states
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  
  // Detected course
  const [detectedCourse, setDetectedCourse] = useState(null);
  
  // Notion fetching state
  const [fetchingRules, setFetchingRules] = useState(false);

  // Fetch repositories on mount
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setReposLoading(true);
        const response = await axios.get('/api/github/repos');
        setRepositories(response.data.data || []);
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

  // Auto-fill form from navigation state (when coming from PR list)
  useEffect(() => {
    if (location.state?.repoUrl && location.state?.branchName) {
      console.log('🔗 Auto-filling form from PR navigation:', location.state);
      
      const { repoUrl, branchName, studentName } = location.state;
      
      // Extract repo name from URL for display
      const repoMatch = repoUrl.match(/github\.com\/[^\/]+\/([^\/\.]+)/);
      const repoName = repoMatch ? repoMatch[1] : 'selected-repo';
      
      // Set form data
      setFormData({
        repoUrl,
        branchName,
        studentName: studentName || '',
        customInstructions: ''
      });
      
      // Set search term and selected repo for display
      setSearchTerm(repoName);
      setSelectedRepo({
        name: repoName,
        url: repoUrl
      });
      
      // Detect course and fetch branches
      const course = detectCourse(repoName);
      setDetectedCourse(course);
      fetchBranches(repoUrl);
      
      // Clear the state to prevent re-filling on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch branches when a repository is selected
  const fetchBranches = async (repoUrl) => {
    try {
      setBranchesLoading(true);
      setBranches([]);
      
      // Extract owner and repo name from GitHub URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
      if (!match) {
        throw new Error('Invalid GitHub URL format');
      }
      
      const [, owner, repo] = match;
      
      const response = await axios.get(`/api/github/branches/${owner}/${repo}`);
      setBranches(response.data.data || []);
      
    } catch (err) {
      console.error('Error fetching branches:', err);
      setBranches([{ name: 'main', protected: true }]); // Fallback
    } finally {
      setBranchesLoading(false);
    }
  };
  
  // Fetch grading rules from Notion when both repo and branch are selected
  const fetchGradingRules = async (repoName, branchName) => {
    if (!repoName || !branchName) return;
    
    try {
      setFetchingRules(true);
      setFormData(prev => ({ ...prev, customInstructions: 'Fetching rules from Notion...' }));
      
      console.log('📚 Fetching grading rules from Notion:', { repoName, branchName });
      
      const response = await axios.post('/api/notion/rules', {
        repoName,
        branchName
      });
      
      if (response.data.success) {
        console.log('✅ Successfully fetched rules from Notion');
        setFormData(prev => ({
          ...prev,
          customInstructions: response.data.gradingInstructions
        }));
      } else {
        throw new Error(response.data.error || 'Failed to fetch rules');
      }
    } catch (err) {
      console.error('❌ Error fetching grading rules:', err);
      
      // Show error message in textarea
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch grading rules from Notion';
      setFormData(prev => ({
        ...prev,
        customInstructions: `❌ ${errorMsg}\n\n` +
          'Please enter grading instructions manually or check:\n' +
          '1. NOTION_API_KEY is set in backend .env\n' +
          '2. Notion Page ID is configured in notionMap.js\n' +
          '3. The Notion page contains content'
      }));
    } finally {
      setFetchingRules(false);
    }
  };
  
  // Handle repository selection from dropdown
  const handleRepoSelect = (repo) => {
    // Ensure URL ends with .git for proper cloning
    const repoUrl = repo.url.endsWith('.git') ? repo.url : `${repo.url}.git`;
    
    console.log('🎯 Repository selected:', { name: repo.name, url: repoUrl });
    
    setFormData(prev => ({
      ...prev,
      repoUrl: repoUrl,
      branchName: '' // Reset branch when repo changes
    }));
    setSearchTerm(repo.name);
    setSelectedRepo(repo);
    setIsDropdownOpen(false);
    
    // Detect course from repo name
    const course = detectCourse(repo.name);
    setDetectedCourse(course);
    
    // Fetch branches for this repository
    fetchBranches(repoUrl);
  };
  
  // Filter repositories based on search term
  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-fetch grading rules when both repo and branch are selected
  useEffect(() => {
    if (selectedRepo && formData.branchName) {
      // Extract repo name from selected repo
      const repoName = selectedRepo.name;
      
      console.log('🔄 Repo and branch selected, fetching grading rules...');
      fetchGradingRules(repoName, formData.branchName);
    }
  }, [selectedRepo, formData.branchName]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!formData.repoUrl || formData.repoUrl === 'undefined') {
      setError('Please select a repository from the dropdown');
      return;
    }
    
    if (!formData.branchName) {
      setError('Please select a branch (module) to grade');
      return;
    }
    
    if (!formData.customInstructions || formData.customInstructions.trim() === '') {
      setError('Please provide grading instructions');
      return;
    }
    
    console.log('📤 Submitting grading request:', formData);
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/grade', formData);

      if (response.data.success) {
        setResult(response.data);
      } else {
        throw new Error(response.data.error || 'Grading failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while grading');
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
Branch: ${result.branch}
Course: ${detectedCourse?.name || 'N/A'}
Repository: ${result.repository || 'N/A'}
Score: ${result.summary.totalScore}/${result.summary.maxScore} (${result.summary.percentage}%)
Status: ${result.summary.status}

📝 GRADING CRITERIA:
${formData.customInstructions.substring(0, 300)}...

${result.results.completeness.passed.length > 0 ? `✅ PASSED (${result.results.completeness.passed.length}):\n${result.results.completeness.passed.map(item => `  ✓ ${item}`).join('\n')}\n` : ''}

${result.results.completeness.errors.length > 0 ? `❌ ERRORS (${result.results.completeness.errors.length}):\n${result.results.completeness.errors.map(item => `  ✗ ${item}`).join('\n')}\n` : ''}

🤖 AI FEEDBACK:
${result.results.codeQuality.feedback}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date().toLocaleString()}
Files Analyzed: ${result.results.filesAnalyzed || 'N/A'}
Review ID: ${result.reviewId || 'N/A'}
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Grading Assistant
          </h1>
          <p className="text-gray-600">
            AI-powered grading with custom criteria - Generate, Save, and Copy reports
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Repository Selection */}
            <div className="relative repo-dropdown-container">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GitBranch className="inline-block w-4 h-4 mr-1" />
                1. Select Repository
              </label>
              {reposLoading ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading repositories...
                </div>
              ) : repositories.length === 0 ? (
                <div className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-yellow-50 text-yellow-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>No repositories available. Check GitHub connection.</span>
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
                      {filteredRepos.map((repo, index) => (
                        <button
                          key={index}
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
                  
                  {/* Show selected repository with detected course badge */}
                  {formData.repoUrl && selectedRepo && (
                    <div className="mt-3 flex items-center justify-between text-sm bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-green-700">Selected:</span>
                          <span className="ml-2 text-green-600">{selectedRepo.name}</span>
                        </div>
                        {detectedCourse && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${detectedCourse.color} flex items-center gap-1 flex-shrink-0`}>
                            <span>{detectedCourse.icon}</span>
                            {detectedCourse.name}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, repoUrl: '', branchName: '' }));
                          setSearchTerm('');
                          setSelectedRepo(null);
                          setDetectedCourse(null);
                          setBranches([]);
                        }}
                        className="ml-3 text-red-500 hover:text-red-700 flex-shrink-0 text-lg"
                        title="Clear selection"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Row 2: Branch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileCode className="inline-block w-4 h-4 mr-1" />
                2. Select Module (Branch)
              </label>
              {!formData.repoUrl ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
                  Select a repository first
                </div>
              ) : branchesLoading ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading branches...
                </div>
              ) : (
                <select
                  value={formData.branchName}
                  onChange={(e) => setFormData(prev => ({ ...prev, branchName: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">-- Select a branch --</option>
                  {branches.map((branch, index) => (
                    <option key={index} value={branch.name}>
                      {branch.name} {branch.protected ? '(protected)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Row 3: Student Name (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. Student Name (Optional)
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                placeholder="john-doe (optional identifier)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Row 4: Custom Grading Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline-block w-4 h-4 mr-1" />
                4. Grading Instructions / Custom Rubric
                {fetchingRules && (
                  <span className="ml-2 text-xs text-blue-600 animate-pulse">
                    🔄 Fetching from Notion...
                  </span>
                )}
              </label>
              <textarea
                value={formData.customInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, customInstructions: e.target.value }))}
                placeholder="Example:&#10;- Check for gas optimization in smart contracts&#10;- Verify re-entrancy guard is implemented&#10;- Ensure proper event emission&#10;- Check for appropriate access controls&#10;- Verify error handling&#10;&#10;Award points based on:&#10;- Gas efficiency (30 points)&#10;- Security best practices (40 points)&#10;- Code quality and documentation (30 points)"
                required
                rows={10}
                disabled={fetchingRules}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm disabled:bg-gray-50 disabled:cursor-wait"
              />
              <p className="mt-2 text-xs text-gray-500">
                {fetchingRules ? (
                  '⏳ Loading grading rules from Notion database...'
                ) : (
                  '💡 Tip: Be specific about what you want to check. The AI will follow these instructions strictly.'
                )}
              </p>
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
                  Analyzing code and grading...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Start AI Grading
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
                    {result.student} • Branch: {result.branch}
                    {detectedCourse && (
                      <span className={`ml-3 px-2 py-1 rounded text-xs font-semibold ${detectedCourse.color}`}>
                        {detectedCourse.icon} {detectedCourse.name}
                      </span>
                    )}
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
                {/* Left Column - Completeness */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Requirements Met
                    </h3>
                    <span className="text-sm font-semibold text-gray-600">
                      {result.results.completeness.score}/{result.results.completeness.maxScore} pts
                    </span>
                  </div>

                  {/* Passed Checks */}
                  {result.results.completeness.passed.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-semibold text-green-700 mb-2">✓ Passed:</h4>
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
                      <h4 className="text-sm font-semibold text-red-700 mb-2">✗ Issues Found:</h4>
                      {result.results.completeness.errors.map((item, index) => (
                        <div key={`error-${index}`} className="flex items-start gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
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
                      AI Analysis
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

                  {/* Additional Info */}
                  {result.results.filesAnalyzed && (
                    <div className="text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Files Analyzed:</span>
                        <span className="font-semibold">{result.results.filesAnalyzed}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Criteria Used */}
              {result.results.customCriteria && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">📋 Grading Criteria Used:</h4>
                  <div className="bg-gray-50 rounded p-3 text-xs text-gray-600 font-mono">
                    {result.results.customCriteria}
                  </div>
                </div>
              )}

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
