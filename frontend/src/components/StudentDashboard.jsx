import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { getActivePRs } from '../services/api';
import { RefreshCw, GitPullRequest, LogOut, ExternalLink } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import metanaLogo from '../assets/images.png';

function StudentDashboard() {
  const navigate = useNavigate();
  const [myPRs, setMyPRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("📚 Student Dashboard mounted. User:", auth.currentUser?.email);
    fetchMyPRs();
  }, []);

  const fetchMyPRs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getActivePRs();
      const allPRs = response.data || [];
      
      // Filter PRs for current user
      const userEmail = auth.currentUser?.email;
      const filteredPRs = allPRs.filter(pr => 
        pr.author?.toLowerCase() === userEmail?.toLowerCase().split('@')[0] ||
        pr.author?.toLowerCase().includes(userEmail?.toLowerCase().split('@')[0])
      );
      
      setMyPRs(filteredPRs);
    } catch (err) {
      console.error('Error fetching PRs:', err);
      setError('Failed to load your pull requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMyPRs();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 Student logged out");
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
      alert('Failed to logout: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-[#ccf621] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading Your Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-white/90 rounded-lg p-1.5 shadow-sm border border-gray-200 dark:border-transparent">
                <img src={metanaLogo} alt="Metana" className="h-7 w-auto" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student Portal
                </h1>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Status */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-white/10">
                <span className="w-1.5 h-1.5 bg-[#ccf621] rounded-full"></span>
                <span className="text-xs text-gray-600 dark:text-gray-400">Student</span>
              </div>
              
              <ThemeToggle />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-white/20 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-300 dark:hover:border-red-500/20 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {auth.currentUser?.email}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-300 dark:border-white/10">
                  {auth.currentUser?.photoURL ? (
                    <img 
                      src={auth.currentUser.photoURL} 
                      alt="User" 
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, <span className="relative inline-block">
              <span className="relative z-10">{auth.currentUser?.displayName || 'Student'}</span>
              <span className="absolute bottom-1 left-0 w-full h-2 bg-[#ccf621] -z-10"></span>
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Track your pull requests and submissions</p>
        </div>

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

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider">My Pull Requests</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-1">{myPRs.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#ccf621]/10 rounded-lg flex items-center justify-center">
                <GitPullRequest className="w-6 h-6 text-[#ccf621]" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider">Status</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">Active</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* My PRs Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg transition-colors">
          <div className="p-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Pull Requests</h3>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-white/20 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            {myPRs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GitPullRequest className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-500 font-medium mb-2">No pull requests yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-600">Your pull requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myPRs.map((pr, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
                          {pr.repoName}
                        </code>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          pr.state === 'open' 
                            ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {pr.state || 'open'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{pr.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {pr.createdAt ? new Date(pr.createdAt).toLocaleDateString() : 'Recently created'}
                      </p>
                    </div>
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 inline-flex items-center gap-2 px-4 py-2 bg-[#ccf621] hover:bg-[#b8de1e] text-black text-sm font-medium rounded-md transition-colors flex-shrink-0"
                    >
                      View PR
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
