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
        const ativos = tratamentos.filter(t => !t.concluido).length;
        const concluidos = tratamentos.filter(t => t.concluido).length;
        
        // Tratamentos com alerta (vencidos ou próximos do vencimento)
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        const comAlerta = tratamentos.filter(t => {
            if (t.concluido || !t.data_fim_prevista) return false;
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
            <div className="tratamentos-page">
                <h1>Gerenciamento de Tratamentos 💊</h1>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="tratamentos-page">
            <h1>Gerenciamento de Tratamentos 💊</h1>

            {error && (
                <div className="error-message">
                    <p>Erro ao carregar dados: {error}</p>
                    <button onClick={carregarTratamentos}>Tentar Novamente</button>
                </div>
            )}

            {/* Estatísticas */}
            <div className="estatisticas">
                <div className="stat-card">
                    <span className="stat-label">Ativos</span>
                    <span className="stat-value">{stats.ativos}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Concluídos</span>
                    <span className="stat-value">{stats.concluidos}</span>
                </div>
                <div className="stat-card alerta">
                    <span className="stat-label">⚠️ Com Alerta</span>
                    <span className="stat-value">{stats.comAlerta}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Total</span>
                    <span className="stat-value">{stats.total}</span>
                </div>
            </div>

            {/* Botão para mostrar/ocultar formulário */}
            <div className="page-actions">
                <button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className="btn-toggle-form"
                >
                    {mostrarFormulario ? '❌ Fechar Formulário' : '➕ Novo Tratamento'}
                </button>
            </div>

            {/* Formulário de Criação */}
            {mostrarFormulario && (
                <TratamentoForm
                    galinhas={galinhas}
                    onTratamentoCriado={handleTratamentoCriado}
                />
            )}

            {/* Filtros */}
            <div className="filtros">
                <div className="filtro-group">
                    <label>Status:</label>
                    <div className="filtro-tabs">
                        <button
                            className={filtroStatus === 'Ativo' ? 'active' : ''}
                            onClick={() => setFiltroStatus('Ativo')}
                        >
                            🟢 Ativos
                        </button>
                        <button
                            className={filtroStatus === 'Concluido' ? 'active' : ''}
                            onClick={() => setFiltroStatus('Concluido')}
                        >
                            ✅ Concluídos
                        </button>
                        <button
                            className={filtroStatus === 'Todos' ? 'active' : ''}
                            onClick={() => setFiltroStatus('Todos')}
                        >
                            📋 Todos
                        </button>
                    </div>
                </div>

                <div className="filtro-group">
                    <label htmlFor="filtroGalinha">Filtrar por Galinha:</label>
                    <select
                        id="filtroGalinha"
                        value={filtroGalinhaId || ''}
                        onChange={(e) => setFiltroGalinhaId(e.target.value || null)}
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

            {/* Lista de Tratamentos */}
            <div className="tratamentos-container">
                <h2>
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
