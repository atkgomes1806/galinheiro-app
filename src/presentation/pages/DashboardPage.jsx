import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obterSumarioGalinheiro } from '../../application/use-cases/obterSumarioGalinheiro';

const DashboardPage = () => {
    const [sumario, setSumario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fabExpanded, setFabExpanded] = useState(false);

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

    // Função para gerar cor baseada no nome
    const getAvatarColor = (nome) => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        const index = nome.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };

    // Função para obter inicial do nome
    const getInitial = (nome) => {
        return nome.charAt(0).toUpperCase();
    };

    if (loading) {
        return (
            <div>
                <div className="card" style={{ marginBottom: '1rem' }}>
                    <h1 style={{ margin: 0 }}>Dashboard do Galinheiro 🐔</h1>
                    <p style={{ color: 'var(--gray-600)' }}>Carregando métricas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="card" style={{ marginBottom: '1rem' }}>
                    <h1 style={{ margin: 0 }}>Dashboard do Galinheiro 🐔</h1>
                    <p style={{ color: 'var(--danger)' }}>Erro ao carregar dados: {error}</p>
                    <button className="btn btn-secondary" onClick={carregarSumario}>Tentar Novamente</button>
                </div>
            </div>
        );
    }

    if (!sumario) {
        return null;
    }

    return (
        <div>
            <header className="card" style={{ marginBottom: '1rem' }}>
                <h1 style={{ margin: 0 }}>Dashboard do Galinheiro 🐔</h1>
                <p style={{ margin: 0, color: 'var(--gray-600)' }}>Visão geral atualizada do seu galinheiro</p>
            </header>

            {/* ALERTA CRÍTICO - Máxima Prioridade */}
            {sumario.tratamentos.emAlerta > 0 && (
                <div className="card" style={{ borderLeft: '4px solid var(--danger)', background: 'var(--danger-50)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                            <div>
                                <h3 style={{ margin: 0 }}>Atenção: Tratamentos Requerem Ação!</h3>
                                <p style={{ margin: 0, color: 'var(--gray-700)' }}>
                                    {sumario.tratamentos.vencidos > 0 && (
                                        <span style={{ color: 'var(--danger)', fontWeight: 600 }}>
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
                        </div>
                        <Link to="/tratamentos" className="btn btn-danger">
                            Ver Tratamentos →
                        </Link>
                    </div>
                </div>
            )}

            {/* KPIs Principais */}
            <div className="grid grid-cols-4" style={{ gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
                {/* KPI: Média de Postura (promoção do detalhe) */}
                <Link to="/historico" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={`card`} style={{ cursor: 'pointer', minHeight: '140px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#FFC72C',
                            color: '#1f2d3d',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            width: 'fit-content'
                        }}>
                            <span>🥚</span>
                            <span style={{ fontWeight: 600 }}>Média de Postura (7d)</span>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{Number(sumario.ovos.mediaPostura7Dias).toFixed(2)}</div>
                            <div style={{ color: 'var(--gray-600)' }}>ovos por galinha/dia</div>
                        </div>
                        <div style={{ marginTop: 'auto', fontSize: '0.875rem', color: 'var(--gray-500)' }}>Ver Histórico →</div>
                    </div>
                </Link>

                {/* KPI: Total de Galinhas */}
                <Link to="/galinhas" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{ cursor: 'pointer', minHeight: '140px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#2980b9',
                            color: 'white',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            width: 'fit-content'
                        }}>
                            <span>🐔</span>
                            <span style={{ fontWeight: 600 }}>Galinhas Ativas</span>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{sumario.galinhas.ativas}</div>
                            <div style={{ color: 'var(--gray-600)' }}>
                                {sumario.galinhas.inativas > 0 ? `${sumario.galinhas.inativas} inativa(s)` : 'Todas ativas'}
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto', fontSize: '0.875rem', color: 'var(--gray-500)' }}>Gerenciar Galinhas →</div>
                    </div>
                </Link>

                {/* KPI: Produção de Ovos (7 dias) */}
                <Link to="/historico" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{ cursor: 'pointer', minHeight: '140px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            width: 'fit-content'
                        }}>
                            <span>🥚</span>
                            <span style={{ fontWeight: 600 }}>Produção (7 dias)</span>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{sumario.ovos.ultimos7Dias} ovos</div>
                            <div style={{ color: 'var(--gray-600)' }}>Média: {sumario.ovos.mediaPostura7Dias} ovos/galinha</div>
                        </div>
                        <div style={{ marginTop: 'auto', fontSize: '0.875rem', color: 'var(--gray-500)' }}>Ver Histórico →</div>
                    </div>
                </Link>

                {/* KPI: Tratamentos Ativos */}
                <Link to="/tratamentos" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={`card ${sumario.tratamentos.emAlerta > 0 ? '' : ''}`} style={{ cursor: 'pointer', minHeight: '140px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#f1c40f',
                            color: '#1f2d3d',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            width: 'fit-content'
                        }}>
                            <span>💊</span>
                            <span style={{ fontWeight: 600 }}>Tratamentos Ativos</span>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{sumario.tratamentos.ativos}</div>
                            <div style={{ color: 'var(--gray-600)' }}>
                                {sumario.tratamentos.emAlerta > 0 ? `⚠️ ${sumario.tratamentos.emAlerta} em alerta` : 'Tudo em dia'}
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto', fontSize: '0.875rem', color: 'var(--gray-500)' }}>Gerenciar Tratamentos →</div>
                    </div>
                </Link>
            </div>

            {/* Seção: Top Performers */}
            {sumario.ovos.topProducers.length > 0 && (
                <div>
                    <h2 style={{ marginBottom: '0.75rem' }}>🏆 Top Produtoras (últimos 7 dias)</h2>
                    <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                        {sumario.ovos.topProducers.map((galinha, index) => (
                            <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: getAvatarColor(galinha.nome),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}>
                                    {getInitial(galinha.nome)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h4 style={{ margin: 0 }}>{galinha.nome}</h4>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>#{index + 1}</span>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--gray-600)' }}>{galinha.total} ovos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Seção: Métricas Detalhadas */}
            <div>
                <h2 style={{ marginTop: '1rem' }}>📊 Métricas Detalhadas</h2>
                <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                    {/* Card: Produção Mensal */}
                    <div className="card">
                        <h3>Produção de Ovos</h3>
                        <div><span style={{ color: 'var(--gray-500)' }}>Últimos 7 dias:</span> <span style={{ fontWeight: 600 }}>{sumario.ovos.ultimos7Dias} ovos</span></div>
                        <div><span style={{ color: 'var(--gray-500)' }}>Últimos 30 dias:</span> <span style={{ fontWeight: 600 }}>{sumario.ovos.ultimos30Dias} ovos</span></div>
                        <div><span style={{ color: 'var(--gray-500)' }}>Média 7 dias:</span> <span style={{ fontWeight: 600 }}>{sumario.ovos.mediaPostura7Dias} ovos/galinha</span></div>
                        <div><span style={{ color: 'var(--gray-500)' }}>Média 30 dias:</span> <span style={{ fontWeight: 600 }}>{sumario.ovos.mediaPostura30Dias} ovos/galinha</span></div>
                    </div>

                    {/* Card: Saúde */}
                    <div className="card">
                        <h3>Saúde do Galinheiro</h3>
                        <div><span style={{ color: 'var(--gray-500)' }}>Tratamentos ativos:</span> <span style={{ fontWeight: 600 }}>{sumario.tratamentos.ativos}</span></div>
                        <div><span style={{ color: 'var(--gray-500)' }}>Tratamentos concluídos:</span> <span style={{ fontWeight: 600 }}>{sumario.tratamentos.concluidos}</span></div>
                        <div><span style={{ color: 'var(--gray-500)' }}>Em alerta:</span> <span className="badge badge-warning">{sumario.tratamentos.emAlerta}</span></div>
                        {sumario.tratamentos.vencidos > 0 && (
                            <div><span style={{ color: 'var(--gray-500)' }}>Vencidos:</span> <span className="badge badge-danger">{sumario.tratamentos.vencidos}</span></div>
                        )}
                    </div>

                    {/* Card: Galinhas */}
                    <div className="card">
                        <h3>Plantel</h3>
                        <div><span style={{ color: 'var(--gray-500)' }}>Total de galinhas:</span> <span style={{ fontWeight: 600 }}>{sumario.galinhas.total}</span></div>
                        <div><span style={{ color: 'var(--gray-500)' }}>Ativas:</span> <span style={{ fontWeight: 600 }}>{sumario.galinhas.ativas}</span></div>
                        {sumario.galinhas.inativas > 0 && (
                            <div><span style={{ color: 'var(--gray-500)' }}>Inativas:</span> <span style={{ fontWeight: 600 }}>{sumario.galinhas.inativas}</span></div>
                        )}
                    </div>
                </div>
            </div>

            {/* Seção: Alertas de Tratamentos Detalhados */}
            {sumario.tratamentos.alertas.length > 0 && (
                <div>
                    <h2 style={{ marginTop: '1rem' }}>⚠️ Tratamentos que Requerem Atenção</h2>
                    <div className="grid" style={{ gap: '0.75rem' }}>
                        {sumario.tratamentos.alertas.map((alerta) => (
                            <div key={alerta.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600 }}>{alerta.galinha}</span>
                                <span className="badge badge-info">{alerta.tipo}</span>
                                <span style={{ color: 'var(--gray-600)' }}>
                                    Vence em: {new Date(alerta.dataFimPrevista).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Link to="/tratamentos" className="btn btn-secondary" style={{ marginTop: '0.75rem' }}>
                        Ver Todos os Tratamentos →
                    </Link>
                </div>
            )}

            {/* Ações Rápidas */}

            {/* FAB - Floating Action Button */}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1000
            }}>
                {/* Ações expandidas */}
                {fabExpanded && (
                    <div style={{
                        position: 'absolute',
                        bottom: '4.5rem',
                        right: '0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        alignItems: 'flex-end'
                    }}>
                        <Link
                            to="/galinhas"
                            className="btn"
                            style={{
                                backgroundColor: '#FFC72C',
                                color: 'black',
                                border: 'none',
                                padding: '0.75rem 1rem',
                                borderRadius: '50px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transform: 'translateY(10px)',
                                opacity: 0,
                                animation: 'fabSlideIn 0.3s ease-out forwards'
                            }}
                        >
                            <span>🐔</span>
                            <span>Cadastrar Galinha</span>
                        </Link>
                        <Link
                            to="/historico"
                            className="btn"
                            style={{
                                backgroundColor: '#FFC72C',
                                color: 'black',
                                border: 'none',
                                padding: '0.75rem 1rem',
                                borderRadius: '50px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transform: 'translateY(10px)',
                                opacity: 0,
                                animation: 'fabSlideIn 0.3s ease-out 0.1s forwards'
                            }}
                        >
                            <span>🥚</span>
                            <span>Registrar Ovos</span>
                        </Link>
                        <Link
                            to="/tratamentos"
                            className="btn"
                            style={{
                                backgroundColor: '#FFC72C',
                                color: 'black',
                                border: 'none',
                                padding: '0.75rem 1rem',
                                borderRadius: '50px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transform: 'translateY(10px)',
                                opacity: 0,
                                animation: 'fabSlideIn 0.3s ease-out 0.2s forwards'
                            }}
                        >
                            <span>💊</span>
                            <span>Novo Tratamento</span>
                        </Link>
                    </div>
                )}

                {/* Botão principal do FAB */}
                <button
                    onClick={() => setFabExpanded(!fabExpanded)}
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#FFC72C',
                        border: 'none',
                        color: 'black',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        transform: fabExpanded ? 'rotate(45deg)' : 'rotate(0deg)'
                    }}
                    aria-label="Ações rápidas"
                >
                    +
                </button>
            </div>

            {/* CSS para animação */}
            <style>{`
                @keyframes fabSlideIn {
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default DashboardPage;
