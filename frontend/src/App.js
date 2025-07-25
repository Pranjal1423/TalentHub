import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import ProtectedRoute from './components/common/ProtectedRoute';

// Import pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Jobs from './pages/jobs/Jobs';
import JobDetail from './pages/jobs/JobDetail';
import PostJob from './pages/jobs/PostJob';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';
import Applications from './pages/dashboard/Applications';
import MyJobs from './pages/dashboard/MyJobs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Routes with header */}
            <Route path="/" element={
              <>
                <Header />
                <main><Home /></main>
              </>
            } />
            <Route path="/login" element={
              <>
                <Header />
                <main><Login /></main>
              </>
            } />
            <Route path="/register" element={
              <>
                <Header />
                <main><Register /></main>
              </>
            } />
            <Route path="/jobs" element={
              <>
                <Header />
                <main><Jobs /></main>
              </>
            } />
            <Route path="/jobs/:id" element={
              <>
                <Header />
                <main><JobDetail /></main>
              </>
            } />
            
            {/* Protected routes with header */}
            <Route path="/post-job" element={
              <>
                <Header />
                <main>
                  <ProtectedRoute requiredRole="employer">
                    <PostJob />
                  </ProtectedRoute>
                </main>
              </>
            } />
            
            {/* Dashboard routes (no header - has its own layout) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/applications" element={
              <ProtectedRoute requiredRole="jobseeker">
                <Applications />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/jobs" element={
              <ProtectedRoute requiredRole="employer">
                <MyJobs />
              </ProtectedRoute>
            } />
            
            {/* 404 page */}
            <Route path="*" element={
              <>
                <Header />
                <main>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600">Page not found</p>
                    </div>
                  </div>
                </main>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;