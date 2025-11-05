import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obterSumarioGalinheiro } from '../../application/use-cases/obterSumarioGalinheiro';

const DashboardPage = () => {
    const [sumario, setSumario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        carregarSumario();
    }, []);

    const carregarSumario = async () => {
        try {
            setLoading(true);
            setError(null);
            const dados = await obterSumarioGalinheiro();
            setSumario(dados);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar sumário:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <h1>Dashboard do Galinheiro 🐔</h1>
                <div className="loading-spinner">
                    <p>Carregando métricas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <h1>Dashboard do Galinheiro 🐔</h1>
                <div className="error-message">
                    <p>Erro ao carregar dados: {error}</p>
                    <button onClick={carregarSumario}>Tentar Novamente</button>
                </div>
            </div>
        );
    }

    if (!sumario) {
        return null;
    }

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1>Dashboard do Galinheiro 🐔</h1>
                <p className="subtitle">Visão geral do seu galinheiro em tempo real</p>
                <button onClick={carregarSumario} className="btn-refresh">
                    🔄 Atualizar Dados
                </button>
            </header>

            {/* ALERTA CRÍTICO - Máxima Prioridade */}
            {sumario.tratamentos.emAlerta > 0 && (
                <div className="alerta-critico">
                    <div className="alerta-content">
                        <span className="alerta-icon">⚠️</span>
                        <div className="alerta-info">
                            <h3>Atenção: Tratamentos Requerem Ação!</h3>
                            <p>
                                {sumario.tratamentos.vencidos > 0 && (
                                    <span className="destaque-critico">
                                        {sumario.tratamentos.vencidos} tratamento(s) vencido(s)
                                    </span>
                                )}
                                {sumario.tratamentos.vencidos > 0 && sumario.tratamentos.emAlerta > sumario.tratamentos.vencidos && ' • '}
                                {sumario.tratamentos.emAlerta > sumario.tratamentos.vencidos && (
                                    <span>
                                        {sumario.tratamentos.emAlerta - sumario.tratamentos.vencidos} próximo(s) do vencimento
                                    </span>
                                )}
                            </p>
                        </div>
                        <Link to="/tratamentos" className="btn-alerta">
                            Ver Tratamentos →
                        </Link>
                    </div>
                </div>
            )}

            {/* KPIs Principais */}
            <div className="kpis-container">
                {/* KPI: Saúde Geral */}
                <div className={`kpi-card saude-geral saude-${sumario.saudeGeral.cor}`}>
                    <div className="kpi-icon">💚</div>
                    <div className="kpi-content">
                        <h3>Saúde Geral</h3>
                        <div className="kpi-value-large">{sumario.saudeGeral.pontuacao}%</div>
                        <div className="kpi-status">{sumario.saudeGeral.status}</div>
                    </div>
                </div>

                {/* KPI: Total de Galinhas */}
                <div className="kpi-card">
                    <div className="kpi-icon">🐔</div>
                    <div className="kpi-content">
                        <h3>Galinhas Ativas</h3>
                        <div className="kpi-value">{sumario.galinhas.ativas}</div>
                        {sumario.galinhas.inativas > 0 && (
                            <div className="kpi-detail">
                                {sumario.galinhas.inativas} inativa(s)
                            </div>
                        )}
                        <Link to="/galinhas" className="kpi-link">
                            Gerenciar →
                        </Link>
                    </div>
                </div>

                {/* KPI: Produção de Ovos (7 dias) */}
                <div className="kpi-card produtividade">
                    <div className="kpi-icon">🥚</div>
                    <div className="kpi-content">
                        <h3>Produção (7 dias)</h3>
                        <div className="kpi-value">{sumario.ovos.ultimos7Dias} ovos</div>
                        <div className="kpi-detail">
                            Média: {sumario.ovos.mediaPostura7Dias} ovos/galinha
                        </div>
                        <Link to="/ovos" className="kpi-link">
                            Ver Histórico →
                        </Link>
                    </div>
                </div>

                {/* KPI: Tratamentos Ativos */}
                <div className={`kpi-card tratamentos ${sumario.tratamentos.emAlerta > 0 ? 'com-alerta' : ''}`}>
                    <div className="kpi-icon">💊</div>
                    <div className="kpi-content">
                        <h3>Tratamentos Ativos</h3>
                        <div className="kpi-value">{sumario.tratamentos.ativos}</div>
                        {sumario.tratamentos.emAlerta > 0 && (
                            <div className="kpi-alert">
                                ⚠️ {sumario.tratamentos.emAlerta} em alerta
                            </div>
                        )}
                        <Link to="/tratamentos" className="kpi-link">
                            Gerenciar →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Seção: Top Performers */}
            {sumario.ovos.topProducers.length > 0 && (
                <div className="secao-top-performers">
                    <h2>🏆 Top Produtoras (últimos 7 dias)</h2>
                    <div className="top-performers-grid">
                        {sumario.ovos.topProducers.map((galinha, index) => (
                            <div key={index} className="performer-card">
                                <div className="performer-rank">#{index + 1}</div>
                                <div className="performer-info">
                                    <h4>{galinha.nome}</h4>
                                    <p className="performer-producao">{galinha.total} ovos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Seção: Métricas Detalhadas */}
            <div className="metricas-detalhadas">
                <h2>📊 Métricas Detalhadas</h2>
                
                <div className="metricas-grid">
                    {/* Card: Produção Mensal */}
                    <div className="metrica-card">
                        <h3>Produção de Ovos</h3>
                        <div className="metrica-item">
                            <span className="metrica-label">Últimos 7 dias:</span>
                            <span className="metrica-valor">{sumario.ovos.ultimos7Dias} ovos</span>
                        </div>
                        <div className="metrica-item">
                            <span className="metrica-label">Últimos 30 dias:</span>
                            <span className="metrica-valor">{sumario.ovos.ultimos30Dias} ovos</span>
                        </div>
                        <div className="metrica-item">
                            <span className="metrica-label">Média 7 dias:</span>
                            <span className="metrica-valor">{sumario.ovos.mediaPostura7Dias} ovos/galinha</span>
                        </div>
                        <div className="metrica-item">
                            <span className="metrica-label">Média 30 dias:</span>
                            <span className="metrica-valor">{sumario.ovos.mediaPostura30Dias} ovos/galinha</span>
                        </div>
                    </div>

                    {/* Card: Saúde */}
                    <div className="metrica-card">
                        <h3>Saúde do Galinheiro</h3>
                        <div className="metrica-item">
                            <span className="metrica-label">Tratamentos ativos:</span>
                            <span className="metrica-valor">{sumario.tratamentos.ativos}</span>
                        </div>
                        <div className="metrica-item">
                            <span className="metrica-label">Tratamentos concluídos:</span>
                            <span className="metrica-valor">{sumario.tratamentos.concluidos}</span>
                        </div>
                        <div className="metrica-item alerta">
                            <span className="metrica-label">Em alerta:</span>
                            <span className="metrica-valor destaque">{sumario.tratamentos.emAlerta}</span>
                        </div>
                        {sumario.tratamentos.vencidos > 0 && (
                            <div className="metrica-item critico">
                                <span className="metrica-label">Vencidos:</span>
                                <span className="metrica-valor destaque-critico">{sumario.tratamentos.vencidos}</span>
                            </div>
                        )}
                    </div>

                    {/* Card: Galinhas */}
                    <div className="metrica-card">
                        <h3>Plantel</h3>
                        <div className="metrica-item">
                            <span className="metrica-label">Total de galinhas:</span>
                            <span className="metrica-valor">{sumario.galinhas.total}</span>
                        </div>
                        <div className="metrica-item">
                            <span className="metrica-label">Ativas:</span>
                            <span className="metrica-valor">{sumario.galinhas.ativas}</span>
                        </div>
                        {sumario.galinhas.inativas > 0 && (
                            <div className="metrica-item">
                                <span className="metrica-label">Inativas:</span>
                                <span className="metrica-valor">{sumario.galinhas.inativas}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Seção: Alertas de Tratamentos Detalhados */}
            {sumario.tratamentos.alertas.length > 0 && (
                <div className="secao-alertas-detalhados">
                    <h2>⚠️ Tratamentos que Requerem Atenção</h2>
                    <div className="alertas-lista">
                        {sumario.tratamentos.alertas.map((alerta) => (
                            <div key={alerta.id} className="alerta-item">
                                <span className="alerta-galinha">{alerta.galinha}</span>
                                <span className="alerta-tipo">{alerta.tipo}</span>
                                <span className="alerta-data">
                                    Vence em: {new Date(alerta.dataFimPrevista).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Link to="/tratamentos" className="btn-ver-todos">
                        Ver Todos os Tratamentos →
                    </Link>
                </div>
            )}

            {/* Ações Rápidas */}
            <div className="acoes-rapidas">
                <h2>⚡ Ações Rápidas</h2>
                <div className="acoes-grid">
                    <Link to="/galinhas" className="acao-card">
                        <span className="acao-icon">🐔</span>
                        <span className="acao-titulo">Cadastrar Galinha</span>
                    </Link>
                    <Link to="/ovos" className="acao-card">
                        <span className="acao-icon">🥚</span>
                        <span className="acao-titulo">Registrar Ovos</span>
                    </Link>
                    <Link to="/tratamentos" className="acao-card">
                        <span className="acao-icon">💊</span>
                        <span className="acao-titulo">Novo Tratamento</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
