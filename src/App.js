import React, { useState, useEffect } from 'react';
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Main App Component
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/auth" element={<Authentication />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <AppContainer>
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <MainContent>
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <ContentArea>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/submit-job" element={<PrintJobSubmission />} />
              <Route path="/job-queue" element={<PrintJobQueue />} />
              <Route path="/printers" element={<PrinterManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/release" element={<PrintRelease />} />
              <Route path="/release/:jobId" element={<PrintRelease />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ContentArea>
        </MainContent>
      </AppContainer>
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
};

// Root App Component
function App() {
  return (
    <AuthProvider>
      <PrintJobProvider>
        <AppContent />
      </PrintJobProvider>
    </AuthProvider>
  );
}

export default App;
