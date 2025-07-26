import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import PageTitle from './components/common/PageTitle';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
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
import Profile from './pages/dashboard/Profile';
import Applicants from './pages/dashboard/Applicants';
import Analytics from './pages/dashboard/Analytics';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <PageTitle />
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Routes>
              {/* Routes with header and footer */}
              <Route path="/" element={
                <>
                  <Header />
                  <main className="flex-1"><Home /></main>
                  <Footer />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Header />
                  <main className="flex-1"><Login /></main>
                </>
              } />
              <Route path="/register" element={
                <>
                  <Header />
                  <main className="flex-1"><Register /></main>
                </>
              } />
              <Route path="/jobs" element={
                <>
                  <Header />
                  <main className="flex-1"><Jobs /></main>
                  <Footer />
                </>
              } />
              <Route path="/jobs/:id" element={
                <>
                  <Header />
                  <main className="flex-1"><JobDetail /></main>
                </>
              } />
              
              {/* Protected routes with header */}
              <Route path="/post-job" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <ProtectedRoute requiredRole="employer">
                      <PostJob />
                    </ProtectedRoute>
                  </main>
                </>
              } />
              
              {/* Dashboard routes (no header/footer - has its own layout) */}
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
              <Route path="/dashboard/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/applicants" element={
                <ProtectedRoute requiredRole="employer">
                  <Applicants />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/analytics" element={
                <ProtectedRoute requiredRole="employer">
                  <Analytics />
                </ProtectedRoute>
              } />
              
              {/* 404 page */}
              <Route path="*" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                        <p className="text-gray-600 mb-8">
                          The page you're looking for doesn't exist or has been moved.
                        </p>
                        <div className="space-x-4">
                          <a href="/" className="btn-primary">
                            Go Home
                          </a>
                          <a href="/jobs" className="btn-secondary">
                            Browse Jobs
                          </a>
                        </div>
                      </div>
                    </div>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;