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
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

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
        setMostrarFormulario(false);
    };

    const handleTratamentoConcluido = (tratamentoConcluido) => {
        setTratamentos((tratamentosAtuais) =>
            tratamentosAtuais.map((t) =>
                t.id === tratamentoConcluido.id ? tratamentoConcluido : t
            )
        );
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
            <header className="card page-header-flex">
                <div>
                    <h1 className="page-header-main">Gerenciamento de Tratamentos 💊</h1>
                    <p className="page-subtitle-main">Acompanhe e conclua os tratamentos das galinhas</p>
                </div>
                <button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className="btn btn-primary"
                >
                    {mostrarFormulario ? '❌ Fechar Formulário' : '➕ Novo Tratamento'}
                </button>
            </header>

            {error && (
                <div className="card error-card">
                    <p className="error-text">Erro ao carregar dados: {error}</p>
                    <button className="btn btn-secondary btn-retry" onClick={carregarTratamentos}>Tentar Novamente</button>
                </div>
            )}

            {/* Estatísticas */}
            <div className="grid grid-cols-4 stats-grid">
                <div className="card">
                    <span className="stats-title">Ativos</span>
                    <div className="stats-value stats-value-primary">{stats.ativos}</div>
                </div>
                <div className="card">
                    <span className="stats-title">Concluídos</span>
                    <div className="stats-value">{stats.concluidos}</div>
                </div>
                <div className={`card ${stats.comAlerta > 0 ? 'error-card' : ''}`}>
                    <span className="stats-title">⚠️ Com Alerta</span>
                    <div className={`stats-value ${stats.comAlerta > 0 ? 'stats-value-warning' : ''}`}>{stats.comAlerta}</div>
                </div>
                <div className="card">
                    <span className="stats-title">Total</span>
                    <div className="stats-value">{stats.total}</div>
                </div>
            </div>

            {/* Formulário de Criação */}
            {mostrarFormulario && (
                <TratamentoForm
                    galinhas={galinhas}
                    onTratamentoCriado={handleTratamentoCriado}
                />
            )}

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

            {/* Lista de Tratamentos */}
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
        </div>
    );
};

export default TratamentosPage;
