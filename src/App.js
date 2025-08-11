import React from 'react';
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

function App() {
  return (
    <AuthProvider>
      <PrintJobProvider>
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
      </PrintJobProvider>
    </AuthProvider>
  );
}

export default App;
