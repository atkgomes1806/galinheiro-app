import React, { useState, useEffect } from 'react';
import { listarRegistrosOvos } from '../../application/use-cases/listarRegistrosOvos';
import { listarGalinhas } from '../../application/use-cases/listarGalinhas';
import RegistroOvoForm from '../components/RegistroOvoForm';

const HistoricoPosturaPage = () => {
    const [registros, setRegistros] = useState([]);
    const [galinhas, setGalinhas] = useState([]);
    const [filtroGalinhaId, setFiltroGalinhaId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Carrega galinhas e registros ao montar
    useEffect(() => {
        carregarDados();
    }, []);

    // Recarrega registros quando o filtro muda
    useEffect(() => {
        carregarRegistros();
    }, [filtroGalinhaId]);

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

    const carregarRegistros = async () => {
        try {
            const registrosData = await listarRegistrosOvos(filtroGalinhaId);
            setRegistros(registrosData);
        } catch (err) {
            console.error('Erro ao carregar registros:', err);
        }
    };

    const handleRegistroCriado = (novoRegistro) => {
        setRegistros((registrosAtuais) => [novoRegistro, ...registrosAtuais]);
    };

    const calcularTotais = () => {
        const totalOvos = registros.reduce((acc, reg) => acc + (reg.quantidade || 0), 0);
        const pesoMedio = registros
            .filter(reg => reg.peso_gramas)
            .reduce((acc, reg, _, arr) => acc + (reg.peso_gramas / arr.length), 0);
        
        return {
            totalOvos,
            pesoMedio: pesoMedio ? pesoMedio.toFixed(1) : 'N/A',
            totalRegistros: registros.length
        };
    };

    const totais = calcularTotais();

    if (loading) {
        return (
            <div>
                <div className="card">
                    <h1 style={{ margin: 0 }}>Histórico de Posturas 🥚</h1>
                    <p style={{ color: 'var(--gray-600)' }}>Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <header className="card" style={{ marginBottom: '1rem' }}>
                <h1 style={{ margin: 0 }}>Histórico de Posturas 🥚</h1>
                <p style={{ margin: 0, color: 'var(--gray-600)' }}>Registre e acompanhe a produção de ovos</p>
            </header>

            {error && (
                <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <p style={{ color: 'var(--danger)' }}>Erro ao carregar dados: {error}</p>
                    <button className="btn btn-secondary" onClick={carregarDados}>Tentar Novamente</button>
                </div>
            )}

            {/* Formulário de Registro */}
            <RegistroOvoForm
                galinhas={galinhas}
                onRegistroCriado={handleRegistroCriado}
            />

            {/* Filtros e Estatísticas */}
            <div className="form-container" style={{ marginTop: '1rem' }}>
                <div className="grid grid-cols-3">
                    <div>
                        <label htmlFor="filtroGalinha" className="form-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray-700)', fontSize: '0.875rem', textTransform: 'uppercase', fontWeight: 600 }}>Filtrar por Galinha</label>
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

                    <div className="card">
                        <span style={{ color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.75rem' }}>Total de Registros</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totais.totalRegistros}</div>
                    </div>
                    <div className="card">
                        <span style={{ color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.75rem' }}>Total de Ovos</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totais.totalOvos}</div>
                    </div>
                    <div className="card">
                        <span style={{ color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.75rem' }}>Peso Médio</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totais.pesoMedio}g</div>
                    </div>
                </div>
            </div>

            {/* Lista de Registros */}
            <div className="card" style={{ marginTop: '1rem' }}>
                <h2 style={{ marginTop: 0 }}>Registros de Postura</h2>

                {registros.length === 0 ? (
                    <p style={{ color: 'var(--gray-600)' }}>Nenhum registro de postura encontrado.</p>
                ) : (
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Galinha</th>
                                <th>Raça</th>
                                <th>Quantidade</th>
                                <th>Peso (g)</th>
                                <th>Qualidade da Casca</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((registro) => {
                                const qualidade = (registro.qualidade_casca || '').toLowerCase();
                                const badgeClass = qualidade === 'excelente' || qualidade === 'boa' ? 'badge-success' : (qualidade === 'regular' ? 'badge-warning' : (qualidade === 'ruim' ? 'badge-danger' : 'badge-gray'));
                                return (
                                    <tr key={registro.id}>
                                        <td>
                                            {new Date(registro.data_postura).toLocaleDateString('pt-BR')}
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
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default HistoricoPosturaPage;
