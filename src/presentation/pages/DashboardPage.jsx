import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obterSumarioGalinheiro } from '../../application/use-cases/obterSumarioGalinheiro';
import { listarRegistrosOvos } from '../../application/use-cases/listarRegistrosOvos';
import { listarGalinhas } from '../../application/use-cases/listarGalinhas';
import { getAvatarColor, getInitial, toDateLocalNoTZ } from '../../utils';
import WeatherCard from '../components/WeatherCard';
import TimeSeriesChart from '../components/TimeSeriesChart';
import CalendarHeatmap from '../components/CalendarHeatmap';
import ReproductiveStatusWidget from '../components/ReproductiveStatusWidget';

const DashboardPage = () => {
    const [sumario, setSumario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registrosOvos, setRegistrosOvos] = useState([]);
    const [galinhas, setGalinhas] = useState([]);
    const [fabExpanded, setFabExpanded] = useState(false);

    // Filtros do gráfico
    const anoAtual = new Date().getFullYear();
    const [filtroGalinha, setFiltroGalinha] = useState('todas');
    const [filtroAno, setFiltroAno] = useState(anoAtual);
    const [filtroMes, setFiltroMes] = useState(''); // vazio = visão anual
    const [serieTemporal, setSerieTemporal] = useState([]);
    const [resumoPeriodo, setResumoPeriodo] = useState({ total: 0, mediaDiaria: 0 });
    const [heatmapDias, setHeatmapDias] = useState([]);

    // Função para saudação dinâmica
    const getSaudacao = () => {
        const hora = new Date().getHours();
        if (hora < 12) return { emoji: '☀️', texto: 'Bom dia' };
        if (hora < 18) return { emoji: '🌤️', texto: 'Boa tarde' };
        return { emoji: '🌙', texto: 'Boa noite' };
    };

    useEffect(() => {
        carregarSumario();
        carregarDadosRegistros();
    }, []);

    useEffect(() => {
        if (!registrosOvos || registrosOvos.length === 0) {
            setSerieTemporal([]);
            setResumoPeriodo({ total: 0, mediaDiaria: 0 });
            setHeatmapDias([]);
            return;
        }
        const { serie, total, mediaDiaria, heatmap } = calcularSerie(
            registrosOvos,
            filtroGalinha,
            filtroAno,
            filtroMes,
            galinhas
        );
        setSerieTemporal(serie);
        setResumoPeriodo({ total, mediaDiaria });
        setHeatmapDias(heatmap);
    }, [registrosOvos, filtroGalinha, filtroAno, filtroMes, galinhas]);

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

    const carregarDadosRegistros = async () => {
        try {
            const [regs, gals] = await Promise.all([
                listarRegistrosOvos(),
                listarGalinhas()
            ]);
            setRegistrosOvos(regs || []);
            setGalinhas(gals || []);
        } catch (err) {
            console.error('Erro ao carregar registros/galinhas:', err);
        }
    };

    // avatar helpers foram centralizados em src/utils/index.js

    const calcularSerie = (registros, galinhaId, ano, mes, galinhasList = []) => {
        const filtered = registros.filter((r) => {
            const d = toDateLocalNoTZ(r.data_postura);
            const sameYear = d.getFullYear() === Number(ano);
            const sameHen = galinhaId === 'todas' || r.galinha_id === galinhaId;
            const sameMonth = !mes || d.getMonth() + 1 === Number(mes);
            return sameYear && sameHen && sameMonth;
        });

        if (!mes) {
            // visão anual: 12 meses
            const serie = Array.from({ length: 12 }, (_, idx) => {
                const month = idx + 1;
                const total = filtered
                    .filter((r) => toDateLocalNoTZ(r.data_postura).getMonth() + 1 === month)
                    .reduce((acc, r) => acc + (r.quantidade || 0), 0);
                return { label: String(month).padStart(2, '0'), value: total };
            });

            const total = serie.reduce((acc, p) => acc + p.value, 0);
            const diasAno = 365;
            return { serie, total, mediaDiaria: (total / diasAno).toFixed(2), heatmap: [] };
        }

        // visão mensal: dias do mês selecionado
        const diasNoMes = new Date(ano, mes, 0).getDate();
        const serie = Array.from({ length: diasNoMes }, (_, idx) => {
            const dia = idx + 1;
            const total = filtered
                .filter((r) => toDateLocalNoTZ(r.data_postura).getDate() === dia)
                .reduce((acc, r) => acc + (r.quantidade || 0), 0);
            return { label: String(dia).padStart(2, '0'), value: total };
        });

        const heatmap = buildHeatmapDays(diasNoMes, ano, mes, filtered, galinhasList, galinhaId);

        const total = serie.reduce((acc, p) => acc + p.value, 0);
        const diasConsiderados = diasNoMes;
        return { serie, total, mediaDiaria: (total / diasConsiderados).toFixed(2), heatmap };
    };

    const buildHeatmapDays = (diasNoMes, ano, mes, registros, galinhasList = [], galinhaId) => {
        const firstDay = new Date(ano, mes - 1, 1);
        const startWeekday = firstDay.getDay(); // 0 domingo
        const days = [];

        // preencher espaços antes do dia 1
        for (let i = 0; i < startWeekday; i++) {
            days.push({ label: '', value: 0 });
        }

        const totalAtivas = galinhaId === 'todas' ? getTotalGalinhasAtivas(galinhasList) : 1;

        for (let dia = 1; dia <= diasNoMes; dia++) {
            const dateStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            const matching = registros.filter((r) => toDateLocalNoTZ(r.data_postura).getDate() === dia);
            const value = matching.reduce((acc, r) => acc + (r.quantidade || 0), 0);
            const peso = matching.reduce((acc, r) => acc + (r.peso_gramas || 0), 0);
            const hens = Array.from(
                new Set(
                    matching
                        .map((r) => resolveHenName(r))
                        .filter(Boolean)
                )
            );
            const percent = totalAtivas > 0 ? Math.min(100, (hens.length / totalAtivas) * 100) : 0;

            days.push({
                label: dia,
                value,
                peso: peso > 0 ? peso.toFixed(1) : null,
                date: dateStr,
                galinhas: hens,
                percent
            });
        }

        // completar para múltiplos de 7
        while (days.length % 7 !== 0) {
            days.push({ label: '', value: 0 });
        }

        return days;
    };

    if (loading) {
        return (
            <div>
                <div className="card page-header">
                    <h1 className="page-title">Dashboard do Galinheiro 🐔</h1>
                    <p className="page-subtitle">Carregando métricas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="card page-header">
                    <h1 className="page-title">Dashboard do Galinheiro 🐔</h1>
                    <p className="error-text">Erro ao carregar dados: {error}</p>
                    <button className="btn btn-secondary" onClick={carregarSumario}>Tentar Novamente</button>
                </div>
            </div>
        );
    }

    if (!sumario) {
        return null;
    }

    const anosDisponiveis = Array.from(new Set(registrosOvos.map((r) => toDateLocalNoTZ(r.data_postura).getFullYear())));
    if (!anosDisponiveis.includes(filtroAno)) anosDisponiveis.push(filtroAno);
    anosDisponiveis.sort((a, b) => b - a);

    const meses = [
        { value: '', label: 'Ano inteiro' },
        { value: 1, label: 'Jan' },
        { value: 2, label: 'Fev' },
        { value: 3, label: 'Mar' },
        { value: 4, label: 'Abr' },
        { value: 5, label: 'Mai' },
        { value: 6, label: 'Jun' },
        { value: 7, label: 'Jul' },
        { value: 8, label: 'Ago' },
        { value: 9, label: 'Set' },
        { value: 10, label: 'Out' },
        { value: 11, label: 'Nov' },
        { value: 12, label: 'Dez' }
    ];

    return (
        <div>
            {/* Hero Section com Saudação Dinâmica */}
            <div className="hero-section">
                <div className="hero-greeting">
                    <span className="hero-emoji">{getSaudacao().emoji}</span>
                    <div className="hero-text">
                        <h1 className="hero-title">{getSaudacao().texto}!</h1>
                        <p className="hero-subtitle">Aqui está o resumo do seu galinheiro</p>
                    </div>
                </div>
                
                {sumario && (
                    <div className="hero-quick-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-icon">🐔</span>
                            <div>
                                <div className="hero-stat-value">{sumario.galinhas.ativas}</div>
                                <div className="hero-stat-label">Galinhas ativas</div>
                            </div>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-icon">🥚</span>
                            <div>
                                <div className="hero-stat-value">{sumario.ovos.ultimos7Dias}</div>
                                <div className="hero-stat-label">Ovos (7 dias)</div>
                            </div>
                        </div>
                        {sumario.tratamentos.emAlerta > 0 ? (
                            <div className="hero-stat hero-stat--alert">
                                <span className="hero-stat-icon">⚠️</span>
                                <div>
                                    <div className="hero-stat-value">{sumario.tratamentos.emAlerta}</div>
                                    <div className="hero-stat-label">Precisam atenção</div>
                                </div>
                            </div>
                        ) : (
                            <div className="hero-stat hero-stat--success">
                                <span className="hero-stat-icon">✅</span>
                                <div>
                                    <div className="hero-stat-value">Tudo certo</div>
                                    <div className="hero-stat-label">Sem pendências</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ALERTA CRÍTICO - Máxima Prioridade */}
            {sumario.tratamentos.emAlerta > 0 && (
                <div className={`alert-banner ${sumario.tratamentos.vencidos > 0 ? 'alert-banner--critical' : 'alert-banner--warning'}`}>
                    <div className="alert-banner-icon">
                        {sumario.tratamentos.vencidos > 0 ? '🚨' : '⚠️'}
                    </div>
                    <div className="alert-banner-content">
                        <h3 className="alert-banner-title">
                            {sumario.tratamentos.vencidos > 0 ? 'Ação Urgente Necessária!' : 'Atenção: Tratamentos Requerem Acompanhamento'}
                        </h3>
                        <p className="alert-banner-text">
                            {sumario.tratamentos.vencidos > 0 && (
                                <strong>{sumario.tratamentos.vencidos} tratamento(s) vencido(s)</strong>
                            )}
                            {sumario.tratamentos.vencidos > 0 && sumario.tratamentos.emAlerta > sumario.tratamentos.vencidos && ' • '}
                            {sumario.tratamentos.emAlerta > sumario.tratamentos.vencidos && (
                                <span>
                                    {sumario.tratamentos.emAlerta - sumario.tratamentos.vencidos} próximo(s) do vencimento
                                </span>
                            )}
                        </p>
                    </div>
                    <Link to="/tratamentos" className="alert-banner-btn">
                        {sumario.tratamentos.vencidos > 0 ? 'Resolver Agora →' : 'Ver Tratamentos →'}
                    </Link>
                </div>
            )}

            {/* Alertas de Atenção (não críticos) */}
            {sumario.tratamentos.emAlerta === 0 && sumario.ovos.ultimos7Dias === 0 && sumario.galinhas.ativas > 0 && (
                <div className="alert-banner alert-banner--info">
                    <div className="alert-banner-icon">💡</div>
                    <div className="alert-banner-content">
                        <h3 className="alert-banner-title">Nenhum ovo registrado nos últimos 7 dias</h3>
                        <p className="alert-banner-text">
                            Você tem {sumario.galinhas.ativas} galinhas ativas. Não esqueça de registrar a produção!
                        </p>
                    </div>
                    <Link to="/historico" className="alert-banner-btn">
                        Registrar Ovos →
                    </Link>
                </div>
            )}

            {/* KPIs Principais */}
            <div className="kpi-grid-modern">
                {/* Card: Clima no Galinheiro (Open-Meteo API) */}
                <WeatherCard />

                {/* KPI: Total de Galinhas */}
                <Link to="/galinhas" className="kpi-card-modern">
                    <div className="kpi-card-header">
                        <span className="kpi-icon">🐔</span>
                        <span className="kpi-label">Plantel</span>
                    </div>
                    <div className="kpi-main">
                        <div className="kpi-value">{sumario.galinhas.ativas}</div>
                        <div className="kpi-unit">Galinhas ativas</div>
                    </div>
                    <div className="kpi-footer">
                        <div className="kpi-metric">
                            <span className="kpi-metric-icon">📊</span>
                            <span>
                                {((sumario.galinhas.ativas / sumario.galinhas.total) * 100).toFixed(0)}% ativas
                            </span>
                        </div>
                        {sumario.galinhas.inativas > 0 && (
                            <div className="kpi-metric kpi-metric--muted">
                                <span>{sumario.galinhas.inativas} inativas</span>
                            </div>
                        )}
                    </div>
                    <div className="kpi-cta">Ver plantel →</div>
                </Link>

                {/* KPI: Produção de Ovos (7 dias) */}
                <Link to="/historico" className="kpi-card-modern">
                    <div className="kpi-card-header">
                        <span className="kpi-icon">🥚</span>
                        <span className="kpi-label">Produção</span>
                    </div>
                    <div className="kpi-main">
                        <div className="kpi-value">{sumario.ovos.ultimos7Dias}</div>
                        <div className="kpi-unit">Ovos (7 dias)</div>
                    </div>
                    <div className="kpi-footer">
                        <div className="kpi-metric">
                            <span className="kpi-metric-icon">
                                {sumario.ovos.mediaPostura7Dias >= sumario.ovos.mediaPostura30Dias ? '↗️' : '↘️'}
                            </span>
                            <span>{sumario.ovos.mediaPostura7Dias} ovos/galinha</span>
                        </div>
                        <div className="kpi-metric kpi-metric--muted">
                            <span>30d: {sumario.ovos.ultimos30Dias}</span>
                        </div>
                    </div>
                    <div className="kpi-cta">Ver histórico →</div>
                </Link>

                {/* KPI: Tratamentos Ativos */}
                <Link to="/tratamentos" className={`kpi-card-modern ${sumario.tratamentos.vencidos > 0 ? 'kpi-card-modern--alert' : ''}`}>
                    <div className="kpi-card-header">
                        <span className="kpi-icon">💊</span>
                        <span className="kpi-label">Saúde</span>
                        {sumario.tratamentos.vencidos > 0 && (
                            <span className="kpi-badge-alert">!</span>
                        )}
                    </div>
                    <div className="kpi-main">
                        <div className="kpi-value">
                            {sumario.tratamentos.ativos === 0 ? 'Nenhum' : sumario.tratamentos.ativos}
                        </div>
                        <div className="kpi-unit">
                            {sumario.tratamentos.ativos === 0 ? 'Tratamento ativo' : 
                             sumario.tratamentos.ativos === 1 ? 'Tratamento ativo' : 'Tratamentos ativos'}
                        </div>
                    </div>
                    <div className="kpi-footer">
                        {sumario.tratamentos.vencidos > 0 ? (
                            <div className="kpi-metric kpi-metric--danger">
                                <span className="kpi-metric-icon">🚨</span>
                                <span>{sumario.tratamentos.vencidos} vencido(s)</span>
                            </div>
                        ) : sumario.tratamentos.emAlerta > 0 ? (
                            <div className="kpi-metric kpi-metric--warning">
                                <span className="kpi-metric-icon">⚠️</span>
                                <span>{sumario.tratamentos.emAlerta} em alerta</span>
                            </div>
                        ) : (
                            <div className="kpi-metric kpi-metric--success">
                                <span className="kpi-metric-icon">✅</span>
                                <span>Todos em dia</span>
                            </div>
                        )}
                        {sumario.tratamentos.concluidos > 0 && (
                            <div className="kpi-metric kpi-metric--muted">
                                <span>{sumario.tratamentos.concluidos} concluídos</span>
                            </div>
                        )}
                    </div>
                    <div className="kpi-cta">
                        {sumario.tratamentos.vencidos > 0 ? 'Urgente →' : 'Ver tratamentos →'}
                    </div>
                </Link>
            </div>

            {/* Status Reprodutivo/Fisiológico (Choco/Muda) */}
            {galinhas.length > 0 && (
                <ReproductiveStatusWidget galinhas={galinhas} />
            )}

            {/* Série temporal de postura */}
            <div className="card timeseries-card">
                <div className="timeseries-header">
                    <div>
                        <h3>Evolução da Postura</h3>
                        <p>Produção agregada por período para monitorar desempenho.</p>
                    </div>
                    <div className="timeseries-filters">
                        <div className="filter-group">
                            <label>Galinha</label>
                            <select value={filtroGalinha} onChange={(e) => setFiltroGalinha(e.target.value)}>
                                <option value="todas">Todas</option>
                                {galinhas.map((g) => (
                                    <option key={g.id} value={g.id}>{g.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Ano</label>
                            <select value={filtroAno} onChange={(e) => setFiltroAno(Number(e.target.value))}>
                                {anosDisponiveis.map((ano) => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Período</label>
                            <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
                                {meses.map((m) => (
                                    <option key={m.value ?? 'ano'} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="timeseries-summary">
                    <div>
                        <span className="label">Total no período</span>
                        <h2>{resumoPeriodo.total} ovos</h2>
                    </div>
                    <div>
                        <span className="label">Média diária</span>
                        <h2>{resumoPeriodo.mediaDiaria} ovos/dia</h2>
                    </div>
                </div>

                {filtroMes
                    ? <CalendarHeatmap days={heatmapDias} month={filtroMes || ''} year={filtroAno} />
                    : <TimeSeriesChart data={serieTemporal} />}
            </div>

            {/* Seção: Top Performers */}
            {sumario.ovos.topProducers.length > 0 && (
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="section-icon">🏆</span>
                            Top Produtoras
                        </h2>
                        <span className="section-subtitle">Últimos 7 dias</span>
                    </div>
                    <div className="top-performers-grid">
                        {sumario.ovos.topProducers.map((galinha, index) => (
                            <div key={index} className={`top-performer-card ${index === 0 ? 'top-performer-card--gold' : index === 1 ? 'top-performer-card--silver' : index === 2 ? 'top-performer-card--bronze' : ''}`}>
                                <div className="top-performer-rank-badge">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </div>
                                <div className="top-performer-avatar" style={{ backgroundColor: getAvatarColor(galinha.nome) }}>
                                    {getInitial(galinha.nome)}
                                </div>
                                <div className="top-performer-content">
                                    <h4 className="top-performer-name">{galinha.nome}</h4>
                                    <div className="top-performer-stats">
                                        <span className="top-performer-value">{galinha.total}</span>
                                        <span className="top-performer-unit">ovos</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Seção: Métricas Detalhadas */}
            <div>
                <h2 className="metrics-title">📊 Métricas Detalhadas</h2>
                <div className="grid grid-cols-3 metrics-grid">
                    {/* Card: Produção Mensal */}
                    <div className="card">
                        <h3>Produção de Ovos</h3>
                        <div><span className="metric-label">Últimos 7 dias:</span> <span className="metric-value">{sumario.ovos.ultimos7Dias} ovos</span></div>
                        <div><span className="metric-label">Últimos 30 dias:</span> <span className="metric-value">{sumario.ovos.ultimos30Dias} ovos</span></div>
                        <div><span className="metric-label">Média 7 dias:</span> <span className="metric-value">{sumario.ovos.mediaPostura7Dias} ovos/galinha</span></div>
                        <div><span className="metric-label">Média 30 dias:</span> <span className="metric-value">{sumario.ovos.mediaPostura30Dias} ovos/galinha</span></div>
                    </div>

                    {/* Card: Saúde */}
                    <div className="card">
                        <h3>Saúde do Galinheiro</h3>
                        <div><span className="metric-label">Tratamentos ativos:</span> <span className="metric-value">{sumario.tratamentos.ativos}</span></div>
                        <div><span className="metric-label">Tratamentos concluídos:</span> <span className="metric-value">{sumario.tratamentos.concluidos}</span></div>
                        <div><span className="metric-label">Em alerta:</span> <span className="badge badge-warning">{sumario.tratamentos.emAlerta}</span></div>
                        {sumario.tratamentos.vencidos > 0 && (
                            <div><span className="metric-label">Vencidos:</span> <span className="badge badge-danger">{sumario.tratamentos.vencidos}</span></div>
                        )}
                    </div>

                    {/* Card: Galinhas */}
                    <div className="card">
                        <h3>Plantel</h3>
                        <div><span className="metric-label">Total de galinhas:</span> <span className="metric-value">{sumario.galinhas.total}</span></div>
                        <div><span className="metric-label">Ativas:</span> <span className="metric-value">{sumario.galinhas.ativas}</span></div>
                        {sumario.galinhas.inativas > 0 && (
                            <div><span className="metric-label">Inativas:</span> <span className="metric-value">{sumario.galinhas.inativas}</span></div>
                        )}
                    </div>
                </div>
            </div>

            {/* Seção: Alertas de Tratamentos Detalhados */}
            {sumario.tratamentos.alertas.length > 0 && (
                <div>
                    <h2 className="alerts-title">⚠️ Tratamentos que Requerem Atenção</h2>
                    <div className="alerts-grid">
                        {sumario.tratamentos.alertas.map((alerta) => (
                            <div key={alerta.id} className="card alert-item">
                                <span className="alert-item-title">{alerta.galinha}</span>
                                <span className="badge badge-info">{alerta.tipo}</span>
                                <span className="alert-item-date">
                                    Vence em: {new Date(alerta.dataFimPrevista).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Link to="/tratamentos" className="btn btn-secondary alerts-link">
                        Ver Todos os Tratamentos →
                    </Link>
                </div>
            )}

            {/* FAB - Floating Action Button */}
            <div className="fab-root">
                {fabExpanded && (
                    <div className="fab-actions">
                        <Link to="/galinhas" className="fab-action-btn" style={{ animation: 'fabSlideIn 0.3s ease-out forwards' }}>
                            <span>�</span>
                            <span>Cadastrar Galinha</span>
                        </Link>
                        <Link to="/historico" className="fab-action-btn" style={{ animation: 'fabSlideIn 0.3s ease-out 0.1s forwards' }}>
                            <span>🥚</span>
                            <span>Registrar Ovos</span>
                        </Link>
                        <Link to="/tratamentos" className="fab-action-btn" style={{ animation: 'fabSlideIn 0.3s ease-out 0.2s forwards' }}>
                            <span>💊</span>
                            <span>Novo Tratamento</span>
                        </Link>
                    </div>
                )}

                <button onClick={() => setFabExpanded(!fabExpanded)} className={`fab-btn ${fabExpanded ? 'fab-rotate' : ''}`} aria-label="Ações rápidas">
                    +
                </button>
            </div>
        </div>
    );
};

function getTotalGalinhasAtivas(lista = []) {
    if (!Array.isArray(lista) || lista.length === 0) return 0;
    const ativas = lista.filter((g) => g.ativa !== false && g.status !== 'inativa');
    return ativas.length > 0 ? ativas.length : lista.length;
}

function resolveHenName(registro) {
    if (!registro) return null;
    return registro.galinha_nome || registro.nome_galinha || registro?.galinhas?.nome || registro.nome || null;
}

export default DashboardPage;
