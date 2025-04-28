import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import './Dashboard.css';
import React from 'react';
import Account from './Account';
import SmtpAccounts from './SmtpAccounts';

// Lazy load components
const ApiKeys = React.lazy(() => import('./ApiKeys'));

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content">
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="api-keys" element={<ApiKeys />} />
            <Route path="account" element={<Account />} />
            <Route path="smtp" element={<SmtpAccounts />} />
          </Routes>
        </React.Suspense>
      </main>
    </div>
  );
}

export default Dashboard;
