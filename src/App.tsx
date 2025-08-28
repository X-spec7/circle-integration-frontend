import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectsProvider } from './contexts/ProjectsContext';
import { useTokenExpiration } from './hooks/useTokenExpiration';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SMEDashboard from './components/SMEDashboard';
import ProjectDetail from './components/ProjectDetail';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

const AppContent = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [toast, setToast] = useState<{
    message: string;
    type: 'error' | 'warning' | 'success';
    isVisible: boolean;
  }>({
    message: '',
    type: 'warning',
    isVisible: false,
  });

  console.log('AppContent render:', { user, isAuthenticated, isLoading, location: window.location.pathname });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppContentWithRouter 
        user={user} 
        isAuthenticated={isAuthenticated} 
        toast={toast}
        setToast={setToast}
      />
    </Router>
  );
};

// Separate component that can use Router hooks
const AppContentWithRouter = ({ 
  user, 
  isAuthenticated, 
  toast, 
  setToast 
}: {
  user: any;
  isAuthenticated: boolean;
  toast: { message: string; type: 'error' | 'warning' | 'success'; isVisible: boolean };
  setToast: React.Dispatch<React.SetStateAction<{ message: string; type: 'error' | 'warning' | 'success'; isVisible: boolean }>>;
}) => {
  console.log('AppContentWithRouter render:', { isAuthenticated, user: user?.user_type });
  
  // Handle token expiration redirects - now inside Router context
  useTokenExpiration(() => {
    console.log('Token expiration callback triggered');
    setToast({
      message: 'Your session has expired. Please log in again.',
      type: 'warning',
      isVisible: true,
    });
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? (
        <ProjectsProvider>
          <Header />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                {user?.user_type === 'sme' ? <SMEDashboard /> : <Dashboard />}
              </ProtectedRoute>
            } />
            <Route path="/project/:id" element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProjectsProvider>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        duration={3000}
      />
    </div>
  );
};

function App() {
  console.log('App component rendering');
  
  try {
    return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    );
  } catch (error) {
    console.error('Error rendering App:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">App Error</h1>
          <p className="text-gray-600">Something went wrong loading the application.</p>
          <pre className="mt-4 text-sm text-gray-500">{error instanceof Error ? error.message : 'Unknown error'}</pre>
        </div>
      </div>
    );
  }
}

export default App;