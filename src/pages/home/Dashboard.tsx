import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import './Dashboard.css';
import React from 'react';
import Account from './Account';
import SmtpAccounts from '../../components/smtp/SmtpAccounts';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiDocumentation from '../../components/documentation/ApiDocumentation';
import Logs from '../../components/log/LogsPage';
import Home from './Home';

// Lazy load components
const ApiKeys = React.lazy(() => import('./ApiKeys'));

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content">
        <React.Suspense fallback={LoadingSpinner()}>
          <Routes>
            <Route path="api-keys" element={<ApiKeys />} />
            <Route path="account" element={<Account />} />
            <Route path="smtp" element={<SmtpAccounts />} />
            <Route path="docs" element={<ApiDocumentation />} />
            <Route path="logs" element={<Logs />} />
            <Route path="" element={<Home />} />
          </Routes>
        </React.Suspense>
      </main>
      
    </div>
  );
}

export default Dashboard;
