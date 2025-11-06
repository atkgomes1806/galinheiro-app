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
                    <h1 style={{ margin: 0 }}>Gerenciamento de Tratamentos 💊</h1>
                    <p style={{ color: 'var(--gray-600)' }}>Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <header className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Gerenciamento de Tratamentos 💊</h1>
                    <p style={{ margin: 0, color: 'var(--gray-600)' }}>Acompanhe e conclua os tratamentos das galinhas</p>
                </div>
                <button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className="btn btn-primary"
                >
                    {mostrarFormulario ? '❌ Fechar Formulário' : '➕ Novo Tratamento'}
                </button>
            </header>

            {error && (
                <div className="card" style={{ borderLeft: '4px solid var(--danger)', marginBottom: '1rem' }}>
                    <p style={{ color: 'var(--danger)', margin: 0 }}>Erro ao carregar dados: {error}</p>
                    <button className="btn btn-secondary" onClick={carregarTratamentos} style={{ marginTop: '0.5rem' }}>Tentar Novamente</button>
                </div>
            )}

            {/* Estatísticas */}
            <div className="grid grid-cols-4" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="card">
                    <span style={{ color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.75rem' }}>Ativos</span>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.ativos}</div>
                </div>
                <div className="card">
                    <span style={{ color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.75rem' }}>Concluídos</span>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gray-700)' }}>{stats.concluidos}</div>
                </div>
                <div className="card" style={{ borderLeft: stats.comAlerta > 0 ? '4px solid var(--warning)' : 'none' }}>
                    <span style={{ color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.75rem' }}>⚠️ Com Alerta</span>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: stats.comAlerta > 0 ? 'var(--warning)' : 'var(--gray-700)' }}>{stats.comAlerta}</div>
                </div>
                <div className="card">
                    <span style={{ color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.75rem' }}>Total</span>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.total}</div>
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
            <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.5rem', alignItems: 'start' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray-700)', fontSize: '0.875rem', textTransform: 'uppercase', fontWeight: 600 }}>Status</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                        <label htmlFor="filtroGalinha" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray-700)', fontSize: '0.875rem', textTransform: 'uppercase', fontWeight: 600 }}>Filtrar por Galinha</label>
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
                <h2 style={{ marginBottom: '1rem' }}>
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
