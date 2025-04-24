import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faChevronRight,
  faEnvelope,
  faChartBar,
  faFileAlt,
  faKey,
  faUser,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/img/logo.png';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src={Logo} alt="Logo" className="logo" />
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard/smtp" className="nav-item">
          <FontAwesomeIcon icon={faEnvelope} />
          <span>SMTP</span>
        </Link>
        <Link to="/dashboard/reports" className="nav-item">
          <FontAwesomeIcon icon={faChartBar} />
          <span>Relatórios</span>
        </Link>
        <Link to="/dashboard/templates" className="nav-item">
          <FontAwesomeIcon icon={faFileAlt} />
          <span>Templates</span>
        </Link>
        <Link to="/dashboard/api-keys" className="nav-item">
          <FontAwesomeIcon icon={faKey} />
          <span>API Keys</span>
        </Link>
        <Link to="/dashboard/account" className="nav-item">
          <FontAwesomeIcon icon={faUser} />
          <span>Conta</span>
        </Link>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span>Sair</span>
      </button>
    </div>
  );
};

export default Sidebar;