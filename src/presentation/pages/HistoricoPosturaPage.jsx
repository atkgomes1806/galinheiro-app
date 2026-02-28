import React, { useState, useEffect } from 'react';
import { listarRegistrosOvos } from '../../application/use-cases/listarRegistrosOvos';
import { listarGalinhas } from '../../application/use-cases/listarGalinhas';
import { removerRegistroOvo } from '../../application/use-cases/removerRegistroOvo';
import { formatDateBRFromString } from '../../utils';
import RegistroOvoForm from '../components/RegistroOvoForm';

const HistoricoPosturaPage = () => {
    const [registros, setRegistros] = useState([]);
    const [galinhas, setGalinhas] = useState([]);
    const [filtroGalinhaId, setFiltroGalinhaId] = useState('');
    const [filtroPeriodo, setFiltroPeriodo] = useState('30');
    const [abaAtiva, setAbaAtiva] = useState('overview');
    const [modoExibicao, setModoExibicao] = useState('tabela');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Carrega galinhas e registros ao montar
    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);

            // Carrega galinhas e registros em paralelo
            const [galinhasData, registrosData] = await Promise.all([
                listarGalinhas(),
                listarRegistrosOvos()
            ]);

            setGalinhas(galinhasData);
            setRegistros(registrosData);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar dados:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoverRegistro = async (id) => {
        if (!id) return;
        const confirmar = window.confirm('Deseja remover este registro de ovo?');
        if (!confirmar) return;
        try {
            await removerRegistroOvo(id);
            setRegistros((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            alert(`Erro ao remover: ${err.message}`);
        }
    };

    const handleRegistroCriado = (novoRegistro) => {
        setRegistros((registrosAtuais) => [novoRegistro, ...registrosAtuais]);
    };

    const getRegistrosFiltrados = () => {
        const hoje = new Date();
        const diasPeriodo = Number(filtroPeriodo);

        return registros
            .filter((registro) => {
                if (!filtroGalinhaId) return true;
                return registro.galinha_id === filtroGalinhaId || registro.galinhas?.id === filtroGalinhaId;
            })
            .filter((registro) => {
                if (filtroPeriodo === 'all') return true;
                const dataRegistro = new Date(registro.data_postura);
                const diffMs = hoje - dataRegistro;
                const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                return diffDias <= diasPeriodo;
            })
            .sort((a, b) => new Date(b.data_postura) - new Date(a.data_postura));
    };

    const calcularTotais = (baseRegistros) => {
        const totalOvos = baseRegistros.reduce((acc, reg) => acc + (reg.quantidade || 0), 0);
        const pesoMedio = baseRegistros
            .filter(reg => reg.peso_gramas)
            .reduce((acc, reg, _, arr) => acc + (reg.peso_gramas / arr.length), 0);

        const diasComRegistro = new Set(
            baseRegistros.map((reg) => (reg.data_postura || '').split('T')[0])
        ).size;

        const mediaDiaria = diasComRegistro > 0 ? (totalOvos / diasComRegistro).toFixed(1) : '0.0';

        const metaReferencia = filtroPeriodo === '7' ? 80 : filtroPeriodo === '30' ? 350 : 500;
        const percentualMeta = metaReferencia > 0 ? Math.min(100, Math.round((totalOvos / metaReferencia) * 100)) : 0;

        const topProdutorasMap = baseRegistros.reduce((acc, registro) => {
            const nome = registro.galinhas?.nome || 'Sem nome';
            acc[nome] = (acc[nome] || 0) + (registro.quantidade || 0);
            return acc;
        }, {});

        const topProdutoras = Object.entries(topProdutorasMap)
            .map(([nome, ovos]) => ({ nome, ovos }))
            .sort((a, b) => b.ovos - a.ovos)
            .slice(0, 5);
        
        return {
            totalOvos,
            pesoMedio: pesoMedio ? pesoMedio.toFixed(1) : 'N/A',
            totalRegistros: baseRegistros.length,
            mediaDiaria,
            percentualMeta,
            metaReferencia,
            topProdutoras
        };
    };

    const registrosFiltrados = getRegistrosFiltrados();
    const totais = calcularTotais(registrosFiltrados);

    const registrosPorData = registrosFiltrados.reduce((acc, registro) => {
        const data = (registro.data_postura || '').split('T')[0];
        if (!acc[data]) acc[data] = [];
        acc[data].push(registro);
        return acc;
    }, {});

    if (loading) {
        return (
            <div>
                <div className="card">
                    <h1 className="page-title">Histórico de Posturas 🥚</h1>
                    <p className="page-subtitle">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <header className="card page-header">
                <h1 className="page-title">Histórico de Posturas 🥚</h1>
                <p className="page-subtitle">Registre e acompanhe a produção de ovos</p>

                <div className="stage3-tabs">
                    <button
                        type="button"
                        className={`stage3-tab-btn ${abaAtiva === 'overview' ? 'active' : ''}`}
                        onClick={() => setAbaAtiva('overview')}
                    >
                        📊 Visão Geral
                    </button>
                    <button
                        type="button"
                        className={`stage3-tab-btn ${abaAtiva === 'register' ? 'active' : ''}`}
                        onClick={() => setAbaAtiva('register')}
                    >
                        📝 Registrar
                    </button>
                </div>
            </header>

            {error && (
                <div className="card error-card">
                    <p className="error-text">Erro ao carregar dados: {error}</p>
                    <button className="btn btn-secondary" onClick={carregarDados}>Tentar Novamente</button>
                </div>
            )}

            {abaAtiva === 'register' && (
                <>
                    <RegistroOvoForm
                        galinhas={galinhas}
                        onRegistroCriado={handleRegistroCriado}
                    />
                    <div className="card stage3-tip-card">
                        <strong>💡 Registro rápido:</strong> use o modo “Múltiplos Ovos” para lançar vários dias de uma só vez.
                    </div>
                </>
            )}

            {abaAtiva === 'overview' && (
                <>
                    <div className="card stage3-toolbar">
                        <div className="stage3-toolbar-grid">
                            <div>
                                <label htmlFor="filtroGalinha" className="filter-label">Galinha</label>
                                <select
                                    id="filtroGalinha"
                                    value={filtroGalinhaId}
                                    onChange={(e) => setFiltroGalinhaId(e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">Todas as galinhas</option>
                                    {galinhas.map((galinha) => (
                                        <option key={galinha.id} value={galinha.id}>
                                            {galinha.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="filtroPeriodo" className="filter-label">Período</label>
                                <select
                                    id="filtroPeriodo"
                                    value={filtroPeriodo}
                                    onChange={(e) => setFiltroPeriodo(e.target.value)}
                                    className="form-input"
                                >
                                    <option value="7">Últimos 7 dias</option>
                                    <option value="30">Últimos 30 dias</option>
                                    <option value="all">Todo período</option>
                                </select>
                            </div>

                            <div>
                                <label className="filter-label">Visualização</label>
                                <div className="stage3-view-toggle">
                                    <button
                                        type="button"
                                        className={`btn btn-outline ${modoExibicao === 'tabela' ? 'stage3-view-active' : ''}`}
                                        onClick={() => setModoExibicao('tabela')}
                                    >
                                        📋 Tabela
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn btn-outline ${modoExibicao === 'timeline' ? 'stage3-view-active' : ''}`}
                                        onClick={() => setModoExibicao('timeline')}
                                    >
                                        🕒 Timeline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 stage3-summary-grid">
                        <div className="card stage3-summary-card">
                            <span className="stats-card-title">Total de Registros</span>
                            <div className="stats-card-value">{totais.totalRegistros}</div>
                        </div>
                        <div className="card stage3-summary-card">
                            <span className="stats-card-title">Total de Ovos</span>
                            <div className="stats-card-value">{totais.totalOvos}</div>
                        </div>
                        <div className="card stage3-summary-card">
                            <span className="stats-card-title">Média por Dia</span>
                            <div className="stats-card-value">{totais.mediaDiaria}</div>
                        </div>
                        <div className="card stage3-summary-card">
                            <span className="stats-card-title">Meta ({totais.metaReferencia})</span>
                            <div className="stats-card-value">{totais.percentualMeta}%</div>
                            <div className="stage3-progress">
                                <div className="stage3-progress-fill" style={{ width: `${totais.percentualMeta}%` }} />
                            </div>
                        </div>
                    </div>

                    {totais.topProdutoras.length > 0 && (
                        <div className="card stage3-top-card">
                            <h3 className="records-title">🏆 Top Produtoras do Período</h3>
                            <div className="stage3-top-list">
                                {totais.topProdutoras.map((item, index) => (
                                    <div className="stage3-top-item" key={`${item.nome}-${index}`}>
                                        <span className="stage3-top-rank">#{index + 1}</span>
                                        <span className="stage3-top-name">{item.nome}</span>
                                        <span className="stage3-top-value">{item.ovos} ovos</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="card records-section">
                        <h2 className="records-title">Registros de Postura</h2>

                        {registrosFiltrados.length === 0 ? (
                            <p className="records-empty">Nenhum registro de postura encontrado para os filtros selecionados.</p>
                        ) : modoExibicao === 'timeline' ? (
                            <div className="stage3-timeline">
                                {Object.entries(registrosPorData).map(([data, itens]) => {
                                    const totalDia = itens.reduce((acc, item) => acc + (item.quantidade || 0), 0);
                                    return (
                                        <div key={data} className="stage3-timeline-day">
                                            <div className="stage3-timeline-header">
                                                <h4>{formatDateBRFromString(data)}</h4>
                                                <span className="badge badge-info">{totalDia} ovos</span>
                                            </div>
                                            <div className="stage3-timeline-items">
                                                {itens.map((registro) => {
                                                    const qualidade = (registro.qualidade_casca || '').toLowerCase();
                                                    const badgeClass = qualidade === 'excelente' || qualidade === 'boa' ? 'badge-success' : (qualidade === 'regular' ? 'badge-warning' : (qualidade === 'ruim' ? 'badge-danger' : 'badge-gray'));
                                                    return (
                                                        <div key={registro.id} className="stage3-timeline-item">
                                                            <div>
                                                                <strong>{registro.galinhas?.nome || 'N/A'}</strong>
                                                                <span className="ml-1 muted">{registro.galinhas?.raca || 'Raça não especificada'}</span>
                                                            </div>
                                                            <div className="stage3-timeline-metrics">
                                                                <span className="badge badge-info">{registro.quantidade} ovo(s)</span>
                                                                {registro.peso_gramas && <span className="badge badge-gray">{registro.peso_gramas}g</span>}
                                                                <span className={`badge ${badgeClass}`}>{registro.qualidade_casca || 'N/A'}</span>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleRemoverRegistro(registro.id)}
                                                                >
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <table className="records-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Galinha</th>
                                        <th>Raça</th>
                                        <th>Quantidade</th>
                                        <th>Peso (g)</th>
                                        <th>Qualidade da Casca</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrosFiltrados.map((registro) => {
                                        const qualidade = (registro.qualidade_casca || '').toLowerCase();
                                        const badgeClass = qualidade === 'excelente' || qualidade === 'boa' ? 'badge-success' : (qualidade === 'regular' ? 'badge-warning' : (qualidade === 'ruim' ? 'badge-danger' : 'badge-gray'));
                                        return (
                                            <tr key={registro.id}>
                                                <td>
                                                    {formatDateBRFromString(registro.data_postura)}
                                                </td>
                                                <td>{registro.galinhas?.nome || 'N/A'}</td>
                                                <td>{registro.galinhas?.raca || 'Não especificada'}</td>
                                                <td className="text-center">
                                                    <strong>{registro.quantidade}</strong>
                                                </td>
                                                <td className="text-center">
                                                    {registro.peso_gramas ? `${registro.peso_gramas}g` : '-'}
                                                </td>
                                                <td>
                                                    <span className={`badge ${badgeClass}`}>
                                                        {registro.qualidade_casca || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleRemoverRegistro(registro.id)}
                                                    >
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default HistoricoPosturaPage;
