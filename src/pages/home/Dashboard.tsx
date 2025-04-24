import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import './Dashboard.css';

// Lazy load components
// const SmtpSettings = React.lazy(() => import('./SmtpSettings'));
// const Reports = React.lazy(() => import('./Reports'));
// const Templates = React.lazy(() => import('./Templates'));
// const ApiKeys = React.lazy(() => import('./ApiKeys'));
// const Account = React.lazy(() => import('./Account'));

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content">
        {/* <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="smtp" element={<SmtpSettings />} />
            <Route path="reports" element={<Reports />} />
            <Route path="templates" element={<Templates />} />
            <Route path="api-keys" element={<ApiKeys />} />
            <Route path="account" element={<Account />} />
          </Routes>
        </React.Suspense> */}
      </main>
    </div>
  );
}

export default Dashboard;
