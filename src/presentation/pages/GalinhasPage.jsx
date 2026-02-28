import React, { useEffect, useState } from 'react';
import GalinhasList from '../components/GalinhasList';
import GalinhaForm from '../components/GalinhaForm';
import { listarGalinhas } from '../../application/use-cases/listarGalinhas';

const GalinhasPage = () => {
    const [galinhas, setGalinhas] = useState([]);
    const [galinhaEmEdicao, setGalinhaEmEdicao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [abaAtiva, setAbaAtiva] = useState('overview');
    const [busca, setBusca] = useState('');
    const [filtroStatusReprodutivo, setFiltroStatusReprodutivo] = useState('todos');
    const [filtroStatusPlantel, setFiltroStatusPlantel] = useState('todos');
    const [ordenacao, setOrdenacao] = useState('nome-asc');
    const [modoVisualizacao, setModoVisualizacao] = useState('cards');

    // Carrega a lista de galinhas ao montar o componente
    useEffect(() => {
        carregarGalinhas();
    }, []);

    const carregarGalinhas = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await listarGalinhas();
            setGalinhas(data);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar galinhas:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handler: Quando uma nova galinha é criada
    const handleGalinhaCriada = (novaGalinha) => {
        setGalinhas((galinhasAtuais) => [...galinhasAtuais, novaGalinha]);
    };

    // Handler: Quando uma galinha é atualizada
    const handleGalinhaAtualizada = (galinhaAtualizada) => {
        setGalinhas((galinhasAtuais) =>
            galinhasAtuais.map((g) => 
                g.id === galinhaAtualizada.id ? galinhaAtualizada : g
            )
        );
        setGalinhaEmEdicao(null); // Limpa o modo de edição
    };

    // Handler: Quando uma galinha é removida
    const handleGalinhaRemovida = (idRemovido) => {
        setGalinhas((galinhasAtuais) => 
            galinhasAtuais.filter((g) => g.id !== idRemovido)
        );
    };

    // Handler: Quando o usuário clica em "Editar"
    const handleEditarGalinha = (galinha) => {
        setGalinhaEmEdicao(galinha);
        setAbaAtiva('add');
        // Scroll para o formulário
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handler: Quando o usuário cancela a edição
    const handleCancelarEdicao = () => {
        setGalinhaEmEdicao(null);
    };

    if (loading) {
        return (
            <div className="galinhas-page">
                <h1>Gerenciamento de Galinhas 🐔</h1>
                <p>Carregando...</p>
            </div>
        );
    }

    const galinhasFiltradas = galinhas
        .filter((galinha) => {
            const termo = busca.trim().toLowerCase();
            if (!termo) return true;

            const nome = (galinha.nome || '').toLowerCase();
            const raca = (galinha.raca || '').toLowerCase();
            const status = (galinha.status_reprodutivo || 'laying').toLowerCase();

            return nome.includes(termo) || raca.includes(termo) || status.includes(termo);
        })
        .filter((galinha) => {
            if (filtroStatusReprodutivo === 'todos') return true;
            return (galinha.status_reprodutivo || 'laying') === filtroStatusReprodutivo;
        })
        .filter((galinha) => {
            if (filtroStatusPlantel === 'todos') return true;
            const statusNormalizado = (galinha.status || 'Ativa').replace(/^'|'$/g, '').toLowerCase();
            return filtroStatusPlantel === 'ativas'
                ? statusNormalizado !== 'inativa'
                : statusNormalizado === 'inativa';
        })
        .sort((a, b) => {
            if (ordenacao === 'nome-asc') return (a.nome || '').localeCompare(b.nome || '');
            if (ordenacao === 'nome-desc') return (b.nome || '').localeCompare(a.nome || '');

            const idadeA = a.data_nascimento ? new Date(a.data_nascimento).getTime() : 0;
            const idadeB = b.data_nascimento ? new Date(b.data_nascimento).getTime() : 0;

            if (ordenacao === 'idade-mais-nova') return idadeB - idadeA;
            if (ordenacao === 'idade-mais-velha') return idadeA - idadeB;

            return 0;
        });

    const total = galinhas.length;
    const totalAtivas = galinhas.filter((g) => (g.status || 'Ativa').replace(/^'|'$/g, '').toLowerCase() !== 'inativa').length;
    const totalInativas = Math.max(0, total - totalAtivas);
    const totalChoco = galinhas.filter((g) => (g.status_reprodutivo || 'laying') === 'broody').length;
    const totalMuda = galinhas.filter((g) => (g.status_reprodutivo || 'laying') === 'molting').length;

    return (
        <div className="galinhas-page">
            <header className="card page-header">
                <h1 className="page-title">Gerenciamento de Galinhas 🐔</h1>
                <p className="page-subtitle">Organize seu plantel com busca, filtros e cadastro guiado</p>

                <div className="stage2-tabs">
                    <button
                        type="button"
                        className={`stage2-tab-btn ${abaAtiva === 'overview' ? 'active' : ''}`}
                        onClick={() => setAbaAtiva('overview')}
                    >
                        📊 Visão Geral
                    </button>
                    <button
                        type="button"
                        className={`stage2-tab-btn ${abaAtiva === 'add' ? 'active' : ''}`}
                        onClick={() => setAbaAtiva('add')}
                    >
                        ➕ {galinhaEmEdicao ? 'Editar Galinha' : 'Adicionar'}
                    </button>
                </div>
            </header>

            {error && (
                <div className="error-message">
                    <p>Erro ao carregar dados: {error}</p>
                    <button onClick={carregarGalinhas}>Tentar Novamente</button>
                </div>
            )}

            {abaAtiva === 'overview' && (
                <>
                    <div className="grid grid-cols-4 stage2-stats-grid">
                        <div className="card stage2-stat-card">
                            <div className="stage2-stat-title">Total</div>
                            <div className="stage2-stat-value">{total}</div>
                        </div>
                        <div className="card stage2-stat-card">
                            <div className="stage2-stat-title">Ativas</div>
                            <div className="stage2-stat-value stage2-stat-value--success">{totalAtivas}</div>
                        </div>
                        <div className="card stage2-stat-card">
                            <div className="stage2-stat-title">Em Choco</div>
                            <div className="stage2-stat-value stage2-stat-value--danger">{totalChoco}</div>
                        </div>
                        <div className="card stage2-stat-card">
                            <div className="stage2-stat-title">Em Muda</div>
                            <div className="stage2-stat-value stage2-stat-value--warning">{totalMuda}</div>
                        </div>
                    </div>

                    <div className="card stage2-toolbar">
                        <div className="stage2-toolbar-main">
                            <input
                                type="text"
                                className="stage2-search-input"
                                placeholder="🔍 Buscar por nome, raça ou status..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                            />

                            <div className="stage2-toolbar-selects">
                                <select value={filtroStatusReprodutivo} onChange={(e) => setFiltroStatusReprodutivo(e.target.value)}>
                                    <option value="todos">Status reprodutivo: Todos</option>
                                    <option value="laying">Em postura</option>
                                    <option value="broody">Em choco</option>
                                    <option value="molting">Em muda</option>
                                </select>

                                <select value={filtroStatusPlantel} onChange={(e) => setFiltroStatusPlantel(e.target.value)}>
                                    <option value="todos">Plantel: Todos</option>
                                    <option value="ativas">Apenas ativas</option>
                                    <option value="inativas">Apenas inativas</option>
                                </select>

                                <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
                                    <option value="nome-asc">Ordenar: Nome (A-Z)</option>
                                    <option value="nome-desc">Ordenar: Nome (Z-A)</option>
                                    <option value="idade-mais-nova">Idade: mais nova</option>
                                    <option value="idade-mais-velha">Idade: mais velha</option>
                                </select>
                            </div>
                        </div>

                        <div className="stage2-toolbar-footer">
                            <span className="muted-strong">
                                {galinhasFiltradas.length} de {galinhas.length} galinha(s)
                            </span>
                            <div className="stage2-view-toggle">
                                <button
                                    type="button"
                                    className={`btn btn-outline ${modoVisualizacao === 'cards' ? 'stage2-view-active' : ''}`}
                                    onClick={() => setModoVisualizacao('cards')}
                                >
                                    ▦ Cards
                                </button>
                                <button
                                    type="button"
                                    className={`btn btn-outline ${modoVisualizacao === 'list' ? 'stage2-view-active' : ''}`}
                                    onClick={() => setModoVisualizacao('list')}
                                >
                                    ≡ Lista
                                </button>
                            </div>
                        </div>
                    </div>

                    <GalinhasList
                        galinhas={galinhasFiltradas}
                        totalOriginal={galinhas.length}
                        onGalinhaRemovida={handleGalinhaRemovida}
                        onEditarGalinha={handleEditarGalinha}
                        modoVisualizacao={modoVisualizacao}
                    />

                    {totalInativas > 0 && (
                        <div className="card stage2-tip-card">
                            <strong>💡 Dica:</strong> você possui {totalInativas} galinha(s) inativa(s). Use os filtros para revisar e atualizar o plantel.
                        </div>
                    )}
                </>
            )}

            {abaAtiva === 'add' && (
                <GalinhaForm
                    galinhaParaEditar={galinhaEmEdicao}
                    onGalinhaCriada={handleGalinhaCriada}
                    onGalinhaAtualizada={handleGalinhaAtualizada}
                    onCancelar={handleCancelarEdicao}
                />
            )}
        </div>
    );
};

export default GalinhasPage;