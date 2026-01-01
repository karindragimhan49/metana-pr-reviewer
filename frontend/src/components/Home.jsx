import { useNavigate } from 'react-router-dom';
import metanaLogo from '../assets/images.png';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden">
      {/* Enhanced Background with Radial Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-neon/5 via-transparent to-transparent opacity-30"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(208, 252, 3, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(208, 252, 3, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Professional Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Wrapped in white container for visibility */}
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-2 shadow-lg hover:shadow-neon/20 transition-shadow">
                <img src={metanaLogo} alt="Metana" className="h-8 w-auto" />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-neon transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-neon transition-colors font-medium">
                How it Works
              </a>
              <a href="#docs" className="text-gray-300 hover:text-neon transition-colors font-medium">
                Docs
              </a>
              <button className="px-6 py-2 border-2 border-neon/50 text-neon rounded-lg hover:bg-neon/10 hover:border-neon transition-all font-semibold">
                Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo/Icon with Glow */}
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-dark-800 border-2 border-neon shadow-neon animate-pulse">
            <svg className="w-12 h-12 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Main Headline with Gradient Text */}
          <h1 className="text-6xl md:text-7xl lg:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-neon via-neon to-green-400 bg-clip-text text-transparent">
              Automated
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">Pull Request Reviewer</span>
          </h1>

          {/* Subtext with Enhanced Typography */}
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            AI-powered code analysis and seamless GitHub integration for <span className="text-neon font-semibold">DevOps teams</span>
          </p>

          {/* CTA Button with Enhanced Glow */}
          <button
            onClick={() => navigate('/dashboard')}
            className="group relative inline-flex items-center gap-3 px-8 py-6 text-2xl font-bold text-black bg-neon rounded-xl hover:bg-neon-hover transition-all duration-300 shadow-neon-lg hover:shadow-[0_0_40px_rgba(208,252,3,0.6)] transform hover:scale-110"
          >
            <span>Launch Dashboard</span>
            <svg 
              className="w-7 h-7 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {/* Feature Pills with Icons */}
          <div className="mt-20 flex flex-wrap justify-center gap-6">
            {[
              { name: 'Real-time Analysis', icon: '⚡' },
              { name: 'GitHub Integration', icon: '🔗' },
              { name: 'Smart Approvals', icon: '✓' }
            ].map((feature) => (
              <div 
                key={feature.name}
                className="group px-8 py-4 bg-dark-800/80 backdrop-blur-sm border border-dark-600 rounded-2xl text-base text-gray-300 hover:border-neon hover:bg-dark-700 transition-all cursor-pointer hover:scale-105"
              >
                <span className="text-neon mr-2 text-xl">{feature.icon}</span>
                {feature.name}
              </div>
            ))}
          </div>

          {/* Trusted By Section */}
          <div className="mt-20">
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">Trusted by Modern Development Teams</p>
            <div className="flex justify-center items-center gap-8 opacity-40">
              <div className="text-gray-600 font-bold text-lg">STARTUP</div>
              <div className="text-gray-600 font-bold text-lg">ENTERPRISE</div>
              <div className="text-gray-600 font-bold text-lg">AGENCY</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-neon/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-neon rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
