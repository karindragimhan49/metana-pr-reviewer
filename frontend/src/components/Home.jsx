import { useNavigate } from 'react-router-dom';
import WaveBackground from './WaveBackground';
import ThemeToggle from './ThemeToggle';
import metanaLogo from '../assets/images.png';
import pdfReport from '../pp/Metana_DevOps_Assessment_karindra_gimhan.pdf';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors">
      {/* Animated Wave Background */}
      <WaveBackground />

      {/* Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-white rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-transparent">
                <img src={metanaLogo} alt="Metana" className="h-8 w-auto" />
              </div>
               </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <a 
                href="#features" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                Pricing
              </a>
              <a 
                href={pdfReport}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                Documentation
              </a>
              <ThemeToggle />
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 bg-transparent border-2 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/40 transition-all font-semibold"
              >
                Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle />
              <button className="text-gray-900 dark:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-[#d0fc03] dark:bg-[#d0fc03] animate-pulse"></span>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">AI-Powered Code Review</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Automated Pull
            <br />
            <span className="text-green-600 dark:text-[#d0fc03]">Request Reviewer</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered code analysis that catches bugs, enforces best practices, 
            and accelerates your development workflow—automatically.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative px-8 py-4 bg-green-600 dark:bg-[#d0fc03] text-white dark:text-black rounded-lg font-bold text-lg hover:bg-green-700 dark:hover:bg-[#e0ff20] transition-all shadow-lg shadow-green-600/20 dark:shadow-[#d0fc03]/20 hover:shadow-green-600/40 dark:hover:shadow-[#d0fc03]/40 hover:scale-105 transform"
            >
              Get Started
              <span className="absolute inset-0 rounded-lg bg-green-600 dark:bg-[#d0fc03] blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10"></span>
            </button>
            <a
              href={pdfReport}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent border-2 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white rounded-lg font-semibold text-lg hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/40 transition-all inline-block text-center"
            >
              View Demo
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-12 border-t border-gray-200 dark:border-white/10">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">10k+</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">5min</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Avg Review</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 sm:py-32 px-6 lg:px-8" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Developers <span className="text-green-600 dark:text-[#d0fc03]">Love Us</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features that help you ship better code, faster
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-green-300 dark:hover:border-[#d0fc03]/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-[#d0fc03]/10 flex items-center justify-center mb-6 group-hover:bg-green-200 dark:group-hover:bg-[#d0fc03]/20 transition-colors">
                <svg className="w-6 h-6 text-green-600 dark:text-[#d0fc03]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Get comprehensive code reviews in minutes, not hours. Our AI analyzes your PRs instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-green-300 dark:hover:border-[#d0fc03]/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-[#d0fc03]/10 flex items-center justify-center mb-6 group-hover:bg-green-200 dark:group-hover:bg-[#d0fc03]/20 transition-colors">
                <svg className="w-6 h-6 text-green-600 dark:text-[#d0fc03]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Security First</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Identify security vulnerabilities and potential bugs before they reach production.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-green-300 dark:hover:border-[#d0fc03]/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-[#d0fc03]/10 flex items-center justify-center mb-6 group-hover:bg-green-200 dark:group-hover:bg-[#d0fc03]/20 transition-colors">
                <svg className="w-6 h-6 text-green-600 dark:text-[#d0fc03]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customizable</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Configure rules and standards that match your team's coding practices and style guides.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 dark:text-gray-500">
            © 2026 Metana PR Reviewer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
