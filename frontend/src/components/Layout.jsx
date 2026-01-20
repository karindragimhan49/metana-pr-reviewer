import Sidebar from './Sidebar';

/**
 * Layout Component - Wraps instructor pages with Sidebar
 * Student pages should NOT use this layout
 */
function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      {/* Sidebar - Only for instructors */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}

export default Layout;
