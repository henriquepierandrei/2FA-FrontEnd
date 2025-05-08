import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../assets/img/logo.png';
import {
    faA,
    faCode,
    faKey,
    faMailBulk,
    faShieldHalved,
    faSortNumericAsc,
    faCircleInfo,
    faCircleExclamation,
    faFileCode
} from '@fortawesome/free-solid-svg-icons';
import './ApiDocumentation.css';

interface CodeBlockProps {
    code: string;
    language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {


    return (
        <div className="code-block-wrapper">
            <pre className="code-block">
                <code className={`language-${language}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
};

const codeTypes = [
    {
        type: 'NUMBERS_CODE',
        description: 'Tipo de código composto apenas por números',
        example: '123456',
        icon: faSortNumericAsc
    },
    {
        type: 'LETTERS_AND_NUMBERS_CODE',
        description: 'Tipo de código composto por letras e números',
        example: 'AB12CD',
        icon: faA
    },
    {
        type: 'SECURE_CODE',
        description: 'Tipo de código com segurança aprimorada',
        example: 'Ax9#Kp2$',
        icon: faShieldHalved
    }
];

const rules = [
    {
        type: 'validation',
        title: 'Validações',
        items: [
            {
                icon: faCircleInfo,
                text: 'codeSize deve ser menor ou igual a 10 caracteres, caso contrário, o código não será gerado!',
                example: 'codeSize <= 10'
            },
            {
                icon: faCircleExclamation,
                text: 'Se hasLink for true, o campo link é obrigatório, caso contrário, deve ser omitido!',
                example: 'hasLink: true → link: "url"'
            }
        ]
    },
    {
        type: 'template',
        title: 'Templates HTML',
        items: [
            {
                icon: faFileCode,
                text: 'Variáveis de substituição devem usar dupla chave, caso contrário, não serão substituídas!',
                example: `{{variableName}}`
            },
            {
                icon: faFileCode,
                text: 'Variáveis disponíveis, qualquer outra variável declarada sendo inexistente ou incorreta não será reconhecida!',
                variables: [
                    'name - Nome do destinatário',
                    'code - Código de verificação',
                    'expireAtInMinutes - Tempo de expiração',
                    'link - Link enviado para o destinatário'
                ]
            }
        ]
    }
];

const ApiDocumentation: React.FC = () => {
    const emailResponse = `{
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
}`;

    return (
        <div className="api-docs-container">
            <header className="docs-header">
                <div className="docs-header-content">
                    <div className="docs-title-section">
                        <img src={logo} alt="" width={"90px"} />
                        <div className="docs-title-container">
                            <h1>API - Documentação</h1>
                            <div className="badges">
                                <span className="badge version">v1.0.0</span>
                                <span className="badge status">Estável</span>
                            </div>
                        </div>
                    </div>
                    <div className="docs-features">
                        <div className="feature-item">
                            <FontAwesomeIcon icon={faShieldHalved} />
                            <span>2FA Autenticação</span>
                        </div>
                        <div className="feature-item">
                            <FontAwesomeIcon icon={faMailBulk} />
                            <span>Serviços de Email</span>
                        </div>
                        <div className="feature-item">
                            <FontAwesomeIcon icon={faCode} />
                            <span>RESTful API</span>
                        </div>
                    </div>
                </div>
            </header>

            <nav className="docs-nav">
                <ul>
                    <li><a href="#email">Email</a></li>
                    <li><a href="#apiKey">ApiKey</a></li>

                </ul>
            </nav>

            <main className="docs-content">
                <section id="codeTypes" className="docs-section">
                    <h2><FontAwesomeIcon icon={faCode} /> Tipos de Código</h2>
                    <div className="code-types-grid">
                        {codeTypes.map((codeType) => (
                            <div key={codeType.type} className="code-type-card">
                                <div className="code-type-header">
                                    <FontAwesomeIcon icon={codeType.icon} className="code-type-icon" />
                                    <h3>{codeType.type}</h3>
                                </div>
                                <p className="code-type-description">{codeType.description}</p>
                                <div className="code-type-example">
                                    <span>Exemplo:</span>
                                    <code>{codeType.example}</code>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section id="rules" className="docs-section">
                    <h2><FontAwesomeIcon icon={faCircleInfo} /> Regras de Uso</h2>
                    
                    {rules.map((ruleGroup) => (
                        <div key={ruleGroup.type} className="rules-card">
                            <h3>{ruleGroup.title}</h3>
                            <div className="rules-grid">
                                {ruleGroup.items.map((item, index) => (
                                    <div key={index} className="rule-item">
                                        <div className="rule-header">
                                            <FontAwesomeIcon icon={item.icon} className="rule-icon" />
                                            <p>{item.text}</p>
                                        </div>
                                        <div className="rule-example">
                                            {item.example && (
                                                <code>{item.example}</code>
                                            )}
                                            {item.variables && (
                                                <ul className="variables-list">
                                                    {item.variables.map((variable, vIndex) => (
                                                        <li key={vIndex}>{variable}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="template-example">
                        <h3>Exemplo de Template</h3>
                        <CodeBlock
                            code={`Olá, {{name}}

Recebemos uma solicitação de login na sua conta. Use o código de verificação 
abaixo para completar o processo de autenticação de dois fatores:

Seu código de verificação é:

{{code}}

Este código expira em {{expireAtInMinutes}} minutos.

Clique no link abaixo para continuar: {{link}}`
}
                            language="html"
                        />
                    </div>
                </section>

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
                            <CodeBlock code="Authorization: ApiKey key" language="bash" />

                            <h4>Corpo da Requisição</h4>
                            
                            
                            <CodeBlock
                                code={`{
  "name": "Template de Boas-Vindas",
  "to": "example@example.com",
  "subject": "Bem-vindo ao nosso serviço",
  "text": "Conteúdo alternativo do e-mail",
  "expireAtInMinutes": 60,
  "codeSize": 6,
  "codeType": "ALPHANUMERIC",
  "hasLink": true,
  "link": "https://exemplo.com/recuperar"
}`}
                                language="json"
                            />

                            <h4>Resposta</h4>
                            <CodeBlock code={emailResponse} language="json" />
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
                            <CodeBlock code="Authorization: ApiKey key" language="bash" />
                            <h4>Corpo da Requisição</h4>
                            <CodeBlock
                                code={`{
  "name": "Template de Boas-Vindas",
  "to": "example@example.com",
  "subject": "Bem-vindo ao nosso serviço",
  "file": "template.html",
  "expireAtInMinutes": 60,
  "codeSize": 6,
  "codeType": "ALPHANUMERIC",
  "hasLink": true,
  "link": "https://exemplo.com/recuperar"
}`}
                                language="json"
                            />

                            <h4>Resposta</h4>
                            <CodeBlock code={emailResponse} language="json" />
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
                            <CodeBlock code="Bearer Jwt-Token | Authenticated" language="bash" />
                            <h4>Resposta</h4>
                            <CodeBlock
                                code={`{
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
}`}
                                language="json"
                            />
                        </div>
                    </div>
                </section>



            </main>
        </div>
    );
};

export default ApiDocumentation;