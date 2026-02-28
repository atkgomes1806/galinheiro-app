import React, { useState, useEffect } from 'react';
import { listarTratamentos } from '../../application/use-cases/listarTratamentos';
import { listarGalinhas } from '../../application/use-cases/listarGalinhas';
import TratamentoForm from '../components/TratamentoForm';
import TratamentosList from '../components/TratamentosList';

const TratamentosPage = () => {
    const [tratamentos, setTratamentos] = useState([]);
    const [galinhas, setGalinhas] = useState([]);
    const [filtroStatus, setFiltroStatus] = useState('Ativo'); // 'Ativo', 'Concluido', 'Todos'
    const [filtroGalinhaId, setFiltroGalinhaId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [abaAtiva, setAbaAtiva] = useState('visao-geral'); // 'visao-geral' ou 'novo'

    // Carrega dados ao montar
    useEffect(() => {
        carregarGalinhas();
    }, []);

    // Recarrega tratamentos quando filtros mudam
    useEffect(() => {
        carregarTratamentos();
    }, [filtroStatus, filtroGalinhaId]);

    const carregarGalinhas = async () => {
        try {
            const galinhasData = await listarGalinhas();
            setGalinhas(galinhasData);
        } catch (err) {
            console.error('Erro ao carregar galinhas:', err);
        }
    };

    const carregarTratamentos = async () => {
        try {
            setLoading(true);
            setError(null);

            const statusFiltro = filtroStatus === 'Todos' ? null : filtroStatus;
            const tratamentosData = await listarTratamentos(filtroGalinhaId, statusFiltro);
            setTratamentos(tratamentosData);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar tratamentos:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTratamentoCriado = (novoTratamento) => {
        setTratamentos((tratamentosAtuais) => [novoTratamento, ...tratamentosAtuais]);
        setAbaAtiva('visao-geral');
    };

    const handleTratamentoConcluido = (tratamentoConcluido) => {
        setTratamentos((tratamentosAtuais) =>
            tratamentosAtuais.map((t) =>
                t.id === tratamentoConcluido.id ? tratamentoConcluido : t
            )
        );
    };

    // Categoriza tratamentos por criticidade
    const categorizarTratamentos = () => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const criticos = [];
        const atencao = [];
        const emDia = [];

        tratamentos.forEach(tratamento => {
            // Só categoriza tratamentos ativos
            if (tratamento.concluido === 'true' || !tratamento.data_fim_prevista) {
                return;
            }

            const dataFim = new Date(tratamento.data_fim_prevista);
            dataFim.setHours(0, 0, 0, 0);
            const diffDias = Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24));

            if (diffDias < 0) {
                // Vencido
                criticos.push({ ...tratamento, diasRestantes: diffDias });
            } else if (diffDias <= 3) {
                // Vence nos próximos 3 dias
                atencao.push({ ...tratamento, diasRestantes: diffDias });
            } else {
                // Em dia
                emDia.push({ ...tratamento, diasRestantes: diffDias });
            }
        });

        return { criticos, atencao, emDia };
    };

    const calcularEstatisticas = () => {
        const ativos = tratamentos.filter(t => t.concluido === 'false' || !t.concluido).length;
        const concluidos = tratamentos.filter(t => t.concluido === 'true').length;
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        const comAlerta = tratamentos.filter(t => {
            if ((t.concluido === 'true') || !t.data_fim_prevista) return false;
            const dataFim = new Date(t.data_fim_prevista);
            dataFim.setHours(0, 0, 0, 0);
            const diffDias = Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24));
            return diffDias <= 3;
        }).length;

        return { ativos, concluidos, comAlerta, total: tratamentos.length };
    };

    const stats = calcularEstatisticas();
    const categorias = categorizarTratamentos();

    if (loading && tratamentos.length === 0) {
        return (
            <div>
                <div className="card">
                    <h1 className="page-header-main">Gerenciamento de Tratamentos 💊</h1>
                    <p className="page-subtitle-main">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Cabeçalho com Abas */}
            <header className="card page-header-flex">
                <div>
                    <h1 className="page-header-main">Gerenciamento de Tratamentos 💊</h1>
                    <p className="page-subtitle-main">Acompanhe e conclua os tratamentos das galinhas</p>
                </div>
            </header>

            {/* Sistema de Abas */}
            <div className="stage4-tabs">
                <button
                    className={`stage4-tab-btn ${abaAtiva === 'visao-geral' ? 'active' : ''}`}
                    onClick={() => setAbaAtiva('visao-geral')}
                >
                    📊 Visão Geral
                </button>
                <button
                    className={`stage4-tab-btn ${abaAtiva === 'novo' ? 'active' : ''}`}
                    onClick={() => setAbaAtiva('novo')}
                >
                    ➕ Novo Tratamento
                </button>
            </div>

            {error && (
                <div className="card error-card">
                    <p className="error-text">Erro ao carregar dados: {error}</p>
                    <button className="btn btn-secondary btn-retry" onClick={carregarTratamentos}>Tentar Novamente</button>
                </div>
            )}

            {/* Conteúdo da Aba Visão Geral */}
            {abaAtiva === 'visao-geral' && (
                <>
                    {/* Cards de Resumo por Criticidade */}
                    <div className="stage4-summary-cards">
                        <div className="stage4-summary-card stage4-card-critical">
                            <div className="stage4-summary-header">
                                <span className="stage4-summary-icon">🚨</span>
                                <span className="stage4-summary-title">Crítico</span>
                            </div>
                            <div className="stage4-summary-value">{categorias.criticos.length}</div>
                            <div className="stage4-summary-label">Vencidos</div>
                        </div>

                        <div className="stage4-summary-card stage4-card-warning">
                            <div className="stage4-summary-header">
                                <span className="stage4-summary-icon">⚠️</span>
                                <span className="stage4-summary-title">Atenção</span>
                            </div>
                            <div className="stage4-summary-value">{categorias.atencao.length}</div>
                            <div className="stage4-summary-label">Próximos 3 dias</div>
                        </div>

                        <div className="stage4-summary-card stage4-card-success">
                            <div className="stage4-summary-header">
                                <span className="stage4-summary-icon">✅</span>
                                <span className="stage4-summary-title">Em Dia</span>
                            </div>
                            <div className="stage4-summary-value">{categorias.emDia.length}</div>
                            <div className="stage4-summary-label">Ativos ok</div>
                        </div>

                        <div className="stage4-summary-card">
                            <div className="stage4-summary-header">
                                <span className="stage4-summary-icon">✔️</span>
                                <span className="stage4-summary-title">Concluídos</span>
                            </div>
                            <div className="stage4-summary-value">{stats.concluidos}</div>
                            <div className="stage4-summary-label">Total</div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="card filters-section">
                        <div className="filters-grid">
                            <div>
                                <label className="filters-label">Status</label>
                                <div className="filters-btn-group">
                                    <button
                                        className={`btn ${filtroStatus === 'Ativo' ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setFiltroStatus('Ativo')}
                                        type="button"
                                    >
                                        🟢 Ativos
                                    </button>
                                    <button
                                        className={`btn ${filtroStatus === 'Concluido' ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setFiltroStatus('Concluido')}
                                        type="button"
                                    >
                                        ✅ Concluídos
                                    </button>
                                    <button
                                        className={`btn ${filtroStatus === 'Todos' ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setFiltroStatus('Todos')}
                                        type="button"
                                    >
                                        📋 Todos
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="filtroGalinha" className="filters-label">Filtrar por Galinha</label>
                                <select
                                    id="filtroGalinha"
                                    value={filtroGalinhaId || ''}
                                    onChange={(e) => setFiltroGalinhaId(e.target.value || null)}
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
                        </div>
                    </div>

                    {/* Visualização Kanban por Criticidade */}
                    {filtroStatus === 'Ativo' && (
                        <div className="stage4-kanban">
                            {/* Coluna Crítico */}
                            <div className="stage4-kanban-column stage4-kanban-critical">
                                <div className="stage4-kanban-header">
                                    <span className="stage4-kanban-icon">🚨</span>
                                    <h3 className="stage4-kanban-title">Crítico ({categorias.criticos.length})</h3>
                                </div>
                                <div className="stage4-kanban-content">
                                    {categorias.criticos.map(tratamento => (
                                        <div key={tratamento.id} className="stage4-treatment-card stage4-card-critical">
                                            <div className="stage4-treatment-banner">
                                                VENCIDO HÁ {Math.abs(tratamento.diasRestantes)} DIA(S)
                                            </div>
                                            <div className="stage4-treatment-header">
                                                <span className="stage4-treatment-icon">💊</span>
                                                <span className="stage4-treatment-type">{tratamento.tipo_tratamento}</span>
                                            </div>
                                            {tratamento.descricao && (
                                                <p className="stage4-treatment-desc">{tratamento.descricao}</p>
                                            )}
                                            <div className="stage4-treatment-chicken">
                                                <span className="stage4-chicken-icon">🐔</span>
                                                <span className="stage4-chicken-name">{tratamento.galinhas?.nome || 'N/A'}</span>
                                            </div>
                                            <div className="stage4-treatment-dates">
                                                <div className="stage4-date-item">
                                                    <span className="stage4-date-label">📅 Início:</span>
                                                    <span className="stage4-date-value">
                                                        {new Date(tratamento.data_inicio).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                                <div className="stage4-date-item">
                                                    <span className="stage4-date-label">⏰ Fim:</span>
                                                    <span className="stage4-date-value stage4-date-overdue">
                                                        {new Date(tratamento.data_fim_prevista).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className="stage4-btn-conclude stage4-btn-critical"
                                                onClick={() => handleTratamentoConcluir(tratamento)}
                                            >
                                                ✓ CONCLUIR AGORA
                                            </button>
                                        </div>
                                    ))}
                                    {categorias.criticos.length === 0 && (
                                        <p className="stage4-kanban-empty">Nenhum tratamento vencido</p>
                                    )}
                                </div>
                            </div>

                            {/* Coluna Atenção */}
                            <div className="stage4-kanban-column stage4-kanban-warning">
                                <div className="stage4-kanban-header">
                                    <span className="stage4-kanban-icon">⚠️</span>
                                    <h3 className="stage4-kanban-title">Atenção ({categorias.atencao.length})</h3>
                                </div>
                                <div className="stage4-kanban-content">
                                    {categorias.atencao.map(tratamento => (
                                        <div key={tratamento.id} className="stage4-treatment-card stage4-card-warning">
                                            <div className="stage4-treatment-header">
                                                <span className="stage4-treatment-icon">💊</span>
                                                <span className="stage4-treatment-type">{tratamento.tipo_tratamento}</span>
                                            </div>
                                            {tratamento.descricao && (
                                                <p className="stage4-treatment-desc">{tratamento.descricao}</p>
                                            )}
                                            <div className="stage4-treatment-chicken">
                                                <span className="stage4-chicken-icon">🐔</span>
                                                <span className="stage4-chicken-name">{tratamento.galinhas?.nome || 'N/A'}</span>
                                            </div>
                                            <div className="stage4-alert-box">
                                                <span className="stage4-alert-icon">⏰</span>
                                                <span className="stage4-alert-text">
                                                    Vence em {tratamento.diasRestantes} dia(s)
                                                </span>
                                            </div>
                                            <div className="stage4-treatment-dates">
                                                <div className="stage4-date-item">
                                                    <span className="stage4-date-label">📅 Início:</span>
                                                    <span className="stage4-date-value">
                                                        {new Date(tratamento.data_inicio).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                                <div className="stage4-date-item">
                                                    <span className="stage4-date-label">⏰ Fim:</span>
                                                    <span className="stage4-date-value">
                                                        {new Date(tratamento.data_fim_prevista).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className="stage4-btn-conclude stage4-btn-warning"
                                                onClick={() => handleTratamentoConcluir(tratamento)}
                                            >
                                                ✓ Concluir
                                            </button>
                                        </div>
                                    ))}
                                    {categorias.atencao.length === 0 && (
                                        <p className="stage4-kanban-empty">Nenhum tratamento próximo do vencimento</p>
                                    )}
                                </div>
                            </div>

                            {/* Coluna Em Dia */}
                            <div className="stage4-kanban-column stage4-kanban-success">
                                <div className="stage4-kanban-header">
                                    <span className="stage4-kanban-icon">✅</span>
                                    <h3 className="stage4-kanban-title">Em Dia ({categorias.emDia.length})</h3>
                                </div>
                                <div className="stage4-kanban-content">
                                    {categorias.emDia.map(tratamento => (
                                        <div key={tratamento.id} className="stage4-treatment-card stage4-card-success">
                                            <div className="stage4-treatment-header">
                                                <span className="stage4-treatment-icon">💊</span>
                                                <span className="stage4-treatment-type">{tratamento.tipo_tratamento}</span>
                                            </div>
                                            {tratamento.descricao && (
                                                <p className="stage4-treatment-desc">{tratamento.descricao}</p>
                                            )}
                                            <div className="stage4-treatment-chicken">
                                                <span className="stage4-chicken-icon">🐔</span>
                                                <span className="stage4-chicken-name">{tratamento.galinhas?.nome || 'N/A'}</span>
                                            </div>
                                            <div className="stage4-treatment-dates">
                                                <div className="stage4-date-item">
                                                    <span className="stage4-date-label">📅 Início:</span>
                                                    <span className="stage4-date-value">
                                                        {new Date(tratamento.data_inicio).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                                <div className="stage4-date-item">
                                                    <span className="stage4-date-label">⏰ Fim previsto:</span>
                                                    <span className="stage4-date-value">
                                                        {new Date(tratamento.data_fim_prevista).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                                <div className="stage4-date-item">
                                                    <span className="stage4-date-label">⏱️ Faltam:</span>
                                                    <span className="stage4-date-value">{tratamento.diasRestantes} dia(s)</span>
                                                </div>
                                            </div>
                                            <button
                                                className="stage4-btn-conclude stage4-btn-success"
                                                onClick={() => handleTratamentoConcluir(tratamento)}
                                            >
                                                ✓ Concluir
                                            </button>
                                        </div>
                                    ))}
                                    {categorias.emDia.length === 0 && (
                                        <p className="stage4-kanban-empty">Nenhum tratamento em andamento</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lista Tradicional para Concluídos e Todos */}
                    {(filtroStatus === 'Concluido' || filtroStatus === 'Todos') && (
                        <div>
                            <h2 className="records-title">
                                {filtroStatus === 'Ativo' && '🟢 Tratamentos Ativos'}
                                {filtroStatus === 'Concluido' && '✅ Tratamentos Concluídos'}
                                {filtroStatus === 'Todos' && '📋 Todos os Tratamentos'}
                            </h2>

                            <TratamentosList
                                tratamentos={tratamentos}
                                onTratamentoConcluido={handleTratamentoConcluido}
                                filtroStatus={filtroStatus}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Conteúdo da Aba Novo Tratamento */}
            {abaAtiva === 'novo' && (
                <TratamentoForm
                    galinhas={galinhas}
                    onTratamentoCriado={handleTratamentoCriado}
                />
            )}
        </div>
    );

    // Handler para concluir tratamento
    function handleTratamentoConcluir(tratamento) {
        // Delega para o TratamentosList passando o tratamento
        // Precisamos renderizar o modal ou usar o sistema do TratamentosList
        // Por simplicidade, vamos adicionar um alerta
        const confirmar = window.confirm(
            `Deseja concluir o tratamento de ${tratamento.tipo_tratamento} para ${tratamento.galinhas?.nome || 'N/A'}?`
        );
        
        if (confirmar) {
            // Importa e usa o concluirTratamento diretamente
            import('../../application/use-cases/concluirTratamento').then(({ concluirTratamento }) => {
                const notas = prompt('Observações sobre o resultado (opcional):');
                concluirTratamento(tratamento.id, notas || '')
                    .then(tratamentoConcluido => {
                        alert('Tratamento concluído com sucesso! ✅');
                        handleTratamentoConcluido(tratamentoConcluido);
                    })
                    .catch(error => {
                        alert(`Erro ao concluir tratamento: ${error.message}`);
                    });
            });
        }
    }
};

export default TratamentosPage;
