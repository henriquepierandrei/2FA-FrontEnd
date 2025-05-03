import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldHalved, 
    faEnvelope, 
    faCode, 
    faServer,
    faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import './Home.css';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Autenticação 2FA Spring</h1>
                    <p className="hero-subtitle">
                        Solução robusta e segura para autenticação de dois fatores
                    </p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">0.5s</span>
                            <span className="stat-label">Latência</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="feature-card">
                    <FontAwesomeIcon icon={faShieldHalved} className="feature-icon" />
                    <h3>Autenticação Segura</h3>
                    <p>Proteção robusta com tokens JWT e códigos de verificação únicos</p>
                    <button className="feature-button">
                        Saiba mais <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>

                <div className="feature-card">
                    <FontAwesomeIcon icon={faEnvelope} className="feature-icon" />
                    <h3>Templates Personalizados</h3>
                    <p>Envie emails profissionais com templates HTML personalizáveis</p>
                    <button className="feature-button">
                        Ver templates <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>

                <div className="feature-card">
                    <FontAwesomeIcon icon={faCode} className="feature-icon" />
                    <h3>API RESTful</h3>
                    <p>Integração simplificada com documentação completa</p>
                    <button className="feature-button">
                        Ver docs <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </section>

            <section className="metrics-section">
                <div className="metrics-content">
                    <h2>Métricas em Tempo Real</h2>
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <FontAwesomeIcon icon={faServer} className="metric-icon" />
                            <div className="metric-info">
                                <span className="metric-value">10k+</span>
                                <span className="metric-label">Requisições/hora</span>
                            </div>
                        </div>
                        {/* Add more metric cards as needed */}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;