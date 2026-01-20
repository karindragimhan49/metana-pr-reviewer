import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import GradingAssistant from './components/GradingAssistant';
import StudentDashboard from './components/StudentDashboard';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import './App.css';

// Instructor emails with full access
export const INSTRUCTOR_EMAILS = [
  'karindragimhan49@gmail.com',
  'thinal@metana.io',
];

// Helper: Check if user is an instructor (case-insensitive)
export const isInstructor = (userEmail) => {
  if (!userEmail) return false;
  return INSTRUCTOR_EMAILS.some(email => email.toLowerCase() === userEmail.toLowerCase());
};

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-[#ccf621] mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 text-lg">Checking Auth...</p>
    </div>
  </div>
);

// Instructor-Only Route Guard
function InstructorRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  console.log("🔐 InstructorRoute Check:", { 
    user: user?.email, 
    loading, 
    isInstructor: user ? isInstructor(user.email) : false 
  });

  if (loading) return <LoadingScreen />;
  
  if (!user) {
    console.log("❌ No user, redirecting to /login");
    return <Navigate to="/login" replace />;
  }
  
  if (!isInstructor(user.email)) {
    console.log("❌ Not an instructor, redirecting to /student-dashboard");
    return <Navigate to="/student-dashboard" replace />;
  }
  
  console.log("✅ Instructor access granted");
  return <Layout>{children}</Layout>;
}

// Student-Only Route Guard
function StudentRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  console.log("🔐 StudentRoute Check:", { 
    user: user?.email, 
    loading, 
    isInstructor: user ? isInstructor(user.email) : false 
  });

  if (loading) return <LoadingScreen />;
  
  if (!user) {
    console.log("❌ No user, redirecting to /login");
    return <Navigate to="/login" replace />;
  }
  
  if (isInstructor(user.email)) {
    console.log("❌ Instructor detected, redirecting to /dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("✅ Student access granted");
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Instructor-Only Routes (with Layout/Sidebar) */}
        <Route 
          path="/dashboard" 
          element={
            <InstructorRoute>
              <Dashboard />
            </InstructorRoute>
          } 
        />
        <Route 
          path="/grading-assistant" 
          element={
            <InstructorRoute>
              <GradingAssistant />
            </InstructorRoute>
          } 
        />
        <Route 
          path="/grading" 
          element={
            <InstructorRoute>
              <GradingAssistant />
            </InstructorRoute>
          } 
        />
        
        {/* Student-Only Route (no sidebar) */}
        <Route 
          path="/student-dashboard" 
          element={
            <StudentRoute>
              <StudentDashboard />
            </StudentRoute>
          } 
        />
        
        {/* Catch all - redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

