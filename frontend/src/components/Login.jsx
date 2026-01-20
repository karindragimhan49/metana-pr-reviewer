import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Mail, Lock, Chrome } from 'lucide-react';
import metanaLogo from '../assets/images.png';

// List of instructor emails with full dashboard access
const INSTRUCTOR_EMAILS = [
  'karindra@gmail.com',
  'thinal@metana.io',
  // Add more instructor emails here
];

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is an instructor
  const isInstructor = (userEmail) => {
    return INSTRUCTOR_EMAILS.includes(userEmail.toLowerCase());
  };

  // Handle role-based redirect
  const handlePostLogin = (user) => {
    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify({
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
      role: isInstructor(user.email) ? 'instructor' : 'student',
    }));

    // Redirect based on role
    if (isInstructor(user.email)) {
      console.log('✅ Instructor login detected, redirecting to /dashboard');
      navigate('/dashboard');
    } else {
      console.log('✅ Student login detected, redirecting to /student-dashboard');
      navigate('/student-dashboard');
    }
  };

  // Google Sign In
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      handlePostLogin(result.user);
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign In (with auto sign-up)
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Try to sign in first
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        handlePostLogin(result.user);
      } catch (signInError) {
        // If user doesn't exist (auth/user-not-found), create account
        if (signInError.code === 'auth/user-not-found') {
          console.log('User not found, creating new account...');
          const result = await createUserWithEmailAndPassword(auth, email, password);
          handlePostLogin(result.user);
        } else {
          throw signInError;
        }
      }
    } catch (err) {
      console.error('Email login error:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Invalid password');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError(err.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Branding Side */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-gradient-to-br from-gray-50 via-yellow-50 to-green-50 p-12 flex-col justify-between">
        {/* Logo */}
        <div>
          <div className="bg-white rounded-lg p-2 shadow-sm inline-block border border-gray-200">
            <img src={metanaLogo} alt="Metana" className="h-10 w-auto" />
          </div>
        </div>

        {/* Testimonial */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-4xl font-bold text-gray-800 leading-tight">
              "What makes Metana different is how{' '}
              <span className="text-yellow-600">hands-on</span> it is..."
            </div>
            <p className="text-lg text-gray-600">
              Experience personalized learning with industry experts and build real-world projects.
            </p>
          </div>

          {/* User Avatar & Name */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-green-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
              DS
            </div>
            <div>
              <div className="font-semibold text-gray-800">David Seibold</div>
              <div className="text-sm text-gray-500">Metana Graduate</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="opacity-10">
          <svg className="w-32 h-32" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" className="text-yellow-600" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="2" className="text-green-600" />
            <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="2" className="text-yellow-600" />
          </svg>
        </div>
      </div>

      {/* Right Column - Form Side */}
      <div className="w-full md:w-1/2 lg:w-3/5 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-8">
            <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
              <img src={metanaLogo} alt="Metana" className="h-10 w-auto" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to <span className="relative inline-block">
                <span className="relative z-10">Metana</span>
                <span className="absolute bottom-1 left-0 w-full h-2 bg-[#ccf621] -z-10"></span>
              </span>!
            </h1>
            <p className="text-gray-600">Let's sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ccf621] hover:bg-[#b8de1e] text-black font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome className="w-5 h-5 text-blue-600" />
            Sign in with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
