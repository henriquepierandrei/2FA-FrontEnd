import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldHalved, 
    faEnvelope, 
    faCode, 
    faServer,
    faArrowRight,
    faCheckCircle,
    faMoneyBill,
    faUser
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
                            <span className="stat-number">Conta SMTP segura</span>
                            <span className="stat-label">Criptografia</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">500 envios p/dia</span>
                            <span className="stat-label">Limite por Conta</span>
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
                    <p>Integração simplificada com documentação</p>
                    <button className="feature-button">
                        Ver docs <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </section>

            <section className="metrics-section">
                <div className="metrics-content">
                    <h2>Métricas da nossa API</h2>
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <FontAwesomeIcon icon={faServer} className="metric-icon" />
                            <div className="metric-info">
                                <span className="metric-value">2.5k</span>
                                <span className="metric-label">Envios por dia a cada usuário.</span>
                            </div>

                            <FontAwesomeIcon icon={faMoneyBill} className="metric-icon" />
                            <div className="metric-info">
                                <span className="metric-value">Grátis</span>
                                <span className="metric-label">API funcionando sem nenhum plano de Deploy</span>
                            </div>

                            <FontAwesomeIcon icon={faUser} className="metric-icon" />
                            <div className="metric-info">
                                <span className="metric-value">Contas Smtps</span>
                                <span className="metric-label">Utilize contas SMTPs fornecidas pelo Google</span>
                            </div>
                        </div>
                        {/* Add more metric cards as needed */}
                    </div>
                </div>
            </section>

            <section className="template-preview-section">
                <div className="template-preview-content">
                    <div className="template-text">
                        <h2>Template de Verificação</h2>
                        <p>Design moderno e responsivo para seus emails de autenticação</p>
                        <ul className="template-features">
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-check" />
                                Layout adaptável para todos os dispositivos
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-check" />
                                Código de verificação em destaque
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-check" />
                                Compatível com principais clientes de email
                            </li>
                        </ul>
                    </div>
                    <div className="template-image">
                        <img 
                            src="https://res.cloudinary.com/dvadwwvub/image/upload/v1746546610/dryp7yttfnb2ivfmeycv.png" 
                            alt="Template de Email 2FA" 
                            className="template-screenshot"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;