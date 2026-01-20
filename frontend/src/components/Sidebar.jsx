import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  LayoutDashboard, 
  GitBranch, 
  GitPullRequest, 
  GraduationCap,
  LogOut, 
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import metanaLogo from '../assets/images.png';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = auth.currentUser;

  // Navigation items for instructors
  const navItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      description: 'Dashboard overview'
    },
    {
      name: 'Grading Assistant',
      path: '/grading-assistant',
      icon: GraduationCap,
      description: 'Grade submissions'
    }
  ];

  const handleLogout = async () => {
    try {
      console.log("🚪 Instructor logged out");
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
      alert('Failed to logout: ' + err.message);
    }
  };

  const handleNavigation = (item) => {
    navigate(item.path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-white/10
        flex flex-col transition-all duration-300 z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-white/90 rounded-lg p-1.5 shadow-sm border border-gray-200 dark:border-transparent">
              <img src={metanaLogo} alt="Metana" className="h-8 w-auto" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Metana DevOps
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-500">Instructor Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                  ${active 
                    ? 'bg-[#ccf621]/10 text-gray-900 dark:text-white border border-[#ccf621]/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-[#ccf621]' : ''}`} />
                <div className="flex-1 text-left">
                  <div className={`text-sm font-medium ${active ? 'text-gray-900 dark:text-white' : ''}`}>
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {item.description}
                  </div>
                </div>
                {active && (
                  <ChevronRight className="w-4 h-4 text-[#ccf621]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 space-y-3">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
            <ThemeToggle />
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ccf621] to-green-500 flex items-center justify-center text-black font-semibold shadow-md flex-shrink-0">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="User" 
                  className="w-full h-full rounded-full"
                />
              ) : (
                user?.email?.[0]?.toUpperCase() || 'I'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.displayName || 'Instructor'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
