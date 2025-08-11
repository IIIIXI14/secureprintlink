import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Dashboard from './pages/Dashboard';
import PrintJobSubmission from './pages/PrintJobSubmission';
import PrintJobQueue from './pages/PrintJobQueue';
import PrinterManagement from './pages/PrinterManagement';
import UserManagement from './pages/UserManagement';
import Authentication from './pages/Authentication';
import PrintRelease from './pages/PrintRelease';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { PrintJobProvider } from './context/PrintJobContext';

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RedirectIfAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <AuthProvider>
      <PrintJobProvider>
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route
                path="/login"
                element={
                  <RedirectIfAuth>
                    <Authentication />
                  </RedirectIfAuth>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />

              <Route
                path="/print-job-submission"
                element={
                  <RequireAuth>
                    <PrintJobSubmission />
                  </RequireAuth>
                }
              />

              <Route
                path="/submit-job"
                element={
                  <RequireAuth>
                    <PrintJobSubmission />
                  </RequireAuth>
                }
              />

              <Route
                path="/print-job-queue"
                element={
                  <RequireAuth>
                    <PrintJobQueue />
                  </RequireAuth>
                }
              />

              <Route
                path="/printer-management"
                element={
                  <RequireAuth>
                    <PrinterManagement />
                  </RequireAuth>
                }
              />

              <Route
                path="/print-release"
                element={
                  <RequireAuth>
                    <PrintRelease />
                  </RequireAuth>
                }
              />

              <Route
                path="/reports"
                element={
                  <RequireAuth>
                    <Reports />
                  </RequireAuth>
                }
              />

              <Route
                path="/user-management"
                element={
                  <RequireAuth>
                    <UserManagement />
                  </RequireAuth>
                }
              />

              <Route
                path="/settings"
                element={
                  <RequireAuth>
                    <Settings />
                  </RequireAuth>
                }
              />

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
          <ToastContainer />
        </ErrorBoundary>
      </PrintJobProvider>
    </AuthProvider>
  );
}

export default App;
