import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faKey,
    faEnvelope,
    faServer,
    faCog,
    faShield,
    faMailBulk
} from '@fortawesome/free-solid-svg-icons';
import './ApiDocumentation.css';

const ApiDocumentation: React.FC = () => {
    return (
        <div className="api-docs-container">
            <header className="docs-header">
                <h1>Documentação da API 2FA</h1>
                <p>Sistema de Autenticação e Serviço de Email</p>
            </header>

            <nav className="docs-nav">
                <ul>
                    <li><a href="#email">Email</a></li>
                    <li><a href="#apiKey">ApiKey</a></li>

                </ul>
            </nav>

            <main className="docs-content">
                <section id="email" className="docs-section">
                    <h2><FontAwesomeIcon icon={faMailBulk} /> Email</h2>
                    <div className="endpoint-card">
                        <div className="endpoint-header">
                            <span className="method post">POST</span>
                            <code>/api/v1/email/send</code>
                        </div>
                        <h3>Enviar Email sem Template</h3>
                        <div className="endpoint-content">
                            <h4>Header</h4>
                            <pre>Authorization: ApiKey key </pre>
                            <h4>Corpo da Requisição</h4>
                            <pre>{`Body | form-data:

  "name": "Template de Boas-Vindas",
  "to": "example@example.com",
  "subject": "Bem-vindo ao nosso serviço",
  "text": "Conteúdo alternativo do e-mail",
  "expireAtInMinutes": 60,
  "codeSize": 6,
  "codeType": "ALPHANUMERIC",
  "hasLink": true,
  "link": "https://exemplo.com/recuperar"
`}</pre>

                            <h4>Resposta</h4>
                            <pre>{`{
  "status": "OK",
  "emailInfo": {
    "name": "John Doe",
    "to": "john.doe@example.com",
    "from": "no-reply@example.com",
    "hasLink": true,
    "link": "https://example.com/recuperar"
  },
  "verification": {
    "code": "123456",
    "expireAtInMinutes": 15
  },
  "emailLog": {
    "mailSent": true,
    "hasTemplate": false,
    "secondsToSend": "2"
  },
  "timestamps": {
    "codeSentAt": "2025-05-01T12:00:00Z",
    "codeExpireAt": "2025-05-01T12:15:00Z"
  }
}`}</pre>


                        </div>
                    </div>

                    <div className="endpoint-card">
                        <div className="endpoint-header">
                            <span className="method post">POST</span>
                            <code>/api/v1/email/send/template</code>
                        </div>
                        <h3>Enviar Email com Template</h3>
                        <div className="endpoint-content">
                            <h4>Header</h4>
                            <pre>Authorization: ApiKey key </pre>
                            <h4>Corpo da Requisição</h4>
                            <pre>{`Body | form-data:

  "name": "Template de Boas-Vindas",
  "to": "example@example.com",
  "subject": "Bem-vindo ao nosso serviço",
  "file": "template.html",
  "expireAtInMinutes": 60,
  "codeSize": 6,
  "codeType": "ALPHANUMERIC",
  "hasLink": true,
  "link": "https://exemplo.com/recuperar"
`}</pre>

                            <h4>Resposta</h4>
                            <pre>{`{
  "status": "OK",
  "emailInfo": {
    "name": "John Doe",
    "to": "john.doe@example.com",
    "from": "no-reply@example.com",
    "hasLink": true,
    "link": "https://example.com/recuperar"
  },
  "verification": {
    "code": "123456",
    "expireAtInMinutes": 15
  },
  "emailLog": {
    "mailSent": true,
    "hasTemplate": true,
    "secondsToSend": "2"
  },
  "timestamps": {
    "codeSentAt": "2025-05-01T12:00:00Z",
    "codeExpireAt": "2025-05-01T12:15:00Z"
  }
}`}</pre>


                        </div>
                    </div>
                </section>

                <section id="apiKey" className="docs-section">
                    <h2><FontAwesomeIcon icon={faKey} /> API Key</h2>
                    <div className="endpoint-card">
                        <div className="endpoint-header">
                            <span className="method post">POST</span>
                            <code>/api/v1/key/generate</code>
                        </div>
                        <h3>Gerar Chave da API</h3>
                        <div className="endpoint-content">
                            <h4>Corpo da Requisição</h4>
                            <pre>Bearer Jwt-Token | Authenticated</pre>
                            <h4>Resposta</h4>
                            <pre>{`{
  "status": "OK",
  "uuidInfo": {
    "userOwnerId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "keyInfo": {
    "key": "minha-chave-gerada",
    "label": "Chave de acesso API",
  },
  "timeInfo": {
    "createdAt": "2025-05-01T12:00:00Z",
    "availableForNewKeyAt": "2025-06-01T12:00:00Z"
  }
}`}</pre>

                        </div>
                    </div>
                </section>



                {/* ... outras seções ... */}
            </main>
        </div>
    );
};

export default ApiDocumentation;