import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import { useAuth } from '../../contexts/AuthContext';
import { 
  faChevronLeft, 
  faChevronRight,
  faEnvelope,
  faChartBar,
  faFileAlt,
  faKey,
  faUser,
  faSignOutAlt,
  
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Remove tokens from cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    
    // Use auth context logout
    logout();
    
    // Navigate to login
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
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
        <Link to="/dashboard/docs" className="nav-item">
          <FontAwesomeIcon icon={faFileAlt} />
          <span>Documentação</span>
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