import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
};

const mainStyle = {
  flex: 1,
  padding: '24px',
  background: '#f5f7fa',
};

const Layout = ({ children }) => (
  <div>
    <Header />
    <div style={layoutStyle}>
      <Sidebar />
      <main style={mainStyle}>{children}</main>
    </div>
  </div>
);

export default Layout;
