import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
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

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

// Root App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthProvider>
      <PrintJobProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route 
                path="/login" 
                element={
                  !isAuthenticated ? (
                    <Authentication onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  isAuthenticated ? (
                    <Dashboard onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/print-job-submission" 
                element={
                  isAuthenticated ? (
                    <PrintJobSubmission />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/print-job-queue" 
                element={
                  isAuthenticated ? (
                    <PrintJobQueue />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/printer-management" 
                element={
                  isAuthenticated ? (
                    <PrinterManagement />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/print-release" 
                element={
                  isAuthenticated ? (
                    <PrintRelease />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/reports" 
                element={
                  isAuthenticated ? (
                    <Reports />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/user-management" 
                element={
                  isAuthenticated ? (
                    <UserManagement />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/settings" 
                element={
                  isAuthenticated ? (
                    <Settings />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
        <ToastContainer />
      </PrintJobProvider>
    </AuthProvider>
  );
}

export default App;
