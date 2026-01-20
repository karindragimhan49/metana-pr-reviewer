import { useNavigate } from 'react-router-dom';
import { Zap, Bot, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import metanaLogo from '../assets/images.png';

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Graded in seconds, not days. Students get immediate insights into their code quality.',
      color: 'text-yellow-500'
    },
    {
      icon: Bot,
      title: 'AI Code Analysis',
      description: 'Deep insights into code quality, best practices, and potential improvements using advanced AI.',
      color: 'text-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Instructor Dashboard',
      description: 'Track student progress in real-time with comprehensive analytics and reporting.',
      color: 'text-green-500'
    }
  ];

  const benefits = [
    'Automated pull request reviews',
    'Code quality scoring',
    'Best practices recommendations',
    'Real-time student tracking',
    'Customizable grading criteria',
    'Integration with GitHub'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* CSS Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(20px, -20px) rotate(120deg); }
          66% { transform: translate(-15px, 15px) rotate(240deg); }
        }
        
        @keyframes float-slow-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, 20px) rotate(120deg); }
          66% { transform: translate(15px, -15px) rotate(240deg); }
        }
        
        @keyframes float-slow-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, -30px) rotate(180deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-slow-2 {
          animation: float-slow-2 25s ease-in-out infinite;
        }
        
        .animate-float-slow-3 {
          animation: float-slow-3 30s ease-in-out infinite;
        }
      `}</style>
      
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-1.5 shadow-sm border border-gray-200">
                <img src={metanaLogo} alt="Metana" className="h-8 w-auto" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Automated PR Reviewer</h1>
                <p className="text-xs text-gray-500"></p>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large Circle - Top Left */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ccf621] rounded-full opacity-10 blur-3xl animate-float-slow"></div>
          
          {/* Medium Circle - Top Right */}
          <div className="absolute -top-20 right-20 w-80 h-80 bg-[#ccf621] rounded-full opacity-15 blur-2xl animate-float-slow-2"></div>
          
          {/* Hexagon-like Shape - Middle Left */}
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-[#ccf621] opacity-10 blur-2xl animate-float-slow-3" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
          
          {/* Large Blob - Bottom Right */}
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ccf621] rounded-full opacity-10 blur-3xl animate-float-slow"></div>
          
          {/* Small Circle - Middle Right */}
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#ccf621] rounded-full opacity-20 blur-xl animate-float-slow-2"></div>
          
          {/* Abstract Shape - Bottom Left */}
          <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-[#ccf621] opacity-10 blur-2xl animate-float-slow-3" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ccf621]/10 border border-[#ccf621]/20 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#ccf621] rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-900">AI-Powered Code Review</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Automate Your Code
            <br />
            <span className="relative inline-block">
              Grading with AI
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C80 3 220 3 298 10" stroke="#ccf621" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Instant feedback on student Pull Requests. Save time and ensure code quality with our AI-powered grading assistant.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/login')}
              className="group px-8 py-4 bg-[#ccf621] text-black font-bold text-lg rounded-lg hover:bg-[#b8de1e] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold text-lg rounded-lg hover:border-gray-900 hover:text-gray-900 transition-all duration-200"
            >
              Learn More
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Trusted by instructors at leading bootcamps</p>
            <div className="flex justify-center items-center gap-8 opacity-50">
              <div className="text-2xl font-bold text-gray-400">Metana</div>
              <div className="text-2xl font-bold text-gray-400">DevOps</div>
              <div className="text-2xl font-bold text-gray-400">Academy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your code review process with powerful AI-driven features
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-[#ccf621] hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Benefits List */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-8 text-center">
                Everything You Need to Grade Efficiently
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#ccf621] flex-shrink-0" />
                    <span className="text-lg text-gray-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Grading Process?
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Join instructors who are saving hours every week with automated code reviews
          </p>
          <button
            onClick={() => navigate('/login')}
            className="group px-10 py-5 bg-[#ccf621] text-black font-bold text-xl rounded-lg hover:bg-[#b8de1e] transition-all duration-200 shadow-2xl hover:shadow-3xl inline-flex items-center gap-3"
          >
            Get Started Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-1.5 shadow-sm border border-gray-200">
                <img src={metanaLogo} alt="Metana" className="h-6 w-auto" />
              </div>
              <div className="text-sm text-gray-600">
                © {new Date().getFullYear()} Metana DevOps. All rights reserved.
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-8 text-sm text-gray-600">
              <button 
                onClick={() => navigate('/login')}
                className="hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <a href="#features" className="hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="mailto:support@metana.io" className="hover:text-gray-900 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
