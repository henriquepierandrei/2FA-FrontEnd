import React, { useEffect, useState, useCallback } from 'react';
import { LogsResponse, LogEntry } from '../../types/logTypes';
import { api } from '../../api/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
    faSpinner,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import './LogsPage.css';

const Logs: React.FC = () => {
    const [logs, setLogs] = useState<LogsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchLogs = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/key/log?page=${page}&size=10`);
            setLogs(response.data);
        } catch (err: any) {
            console.error('Error fetching logs:', err);
            setError(err.response?.data?.message || 'Erro ao carregar logs');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs(currentPage);
    }, [currentPage, fetchLogs]);

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
            locale: ptBR
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="logs-loading">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Carregando logs...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="logs-error">
                <p>{error}</p>
                <button onClick={() => fetchLogs(currentPage)}>Tentar novamente</button>
            </div>
        );
    }

    // No data state
    if (!logs?.logsDtoPageable?.content) {
        return (
            <div className="logs-error">
                <p>Nenhum log encontrado</p>
                <button onClick={() => fetchLogs(0)}>Atualizar</button>
            </div>
        );
    }

    return (
        <div className="logs-container">
            <header className="logs-header">
                <h1>
                    <FontAwesomeIcon icon={faEnvelope} /> Logs de Envio
                </h1>
                <p style={{color: "white"}}>Histórico de emails enviados</p>
            </header>

            <div className="logs-table-container">
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>ID do Log</th>
                            <th>Destinatário</th>
                            <th>Remetente</th>
                            <th>Nº do Email</th>
                            <th>Data de Envio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.logsDtoPageable.content.map((log: LogEntry) => (
                            <tr key={`${log.keyId}-${log.emailNumber}-${log.sentAt}`}>
                                <td>{log.keyId}</td>
                                <td>{log.emailSentTo}</td>
                                <td>{log.emailSentFrom}</td>
                                <td>{log.emailNumber}</td>
                                <td>{formatDate(log.sentAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="logs-pagination">
                <button
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 0}
                    className="pagination-button"
                >
                    <FontAwesomeIcon icon={faChevronLeft} /> Anterior
                </button>
                <span className="page-info">
                    Página {currentPage + 1} de {logs.logsDtoPageable.totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={logs.logsDtoPageable.last}
                    className="pagination-button"
                >
                    Próxima <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
    );
};

export default Logs;