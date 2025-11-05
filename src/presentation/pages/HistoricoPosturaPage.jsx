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
            <div className="historico-postura-page">
                <h1>Histórico de Posturas 🥚</h1>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="historico-postura-page">
            <h1>Histórico de Posturas 🥚</h1>

            {error && (
                <div className="error-message">
                    <p>Erro ao carregar dados: {error}</p>
                    <button onClick={carregarDados}>Tentar Novamente</button>
                </div>
            )}

            {/* Formulário de Registro */}
            <RegistroOvoForm
                galinhas={galinhas}
                onRegistroCriado={handleRegistroCriado}
            />

            {/* Filtros e Estatísticas */}
            <div className="filtros-e-stats">
                <div className="filtros">
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

                <div className="estatisticas">
                    <div className="stat-card">
                        <span className="stat-label">Total de Registros:</span>
                        <span className="stat-value">{totais.totalRegistros}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Total de Ovos:</span>
                        <span className="stat-value">{totais.totalOvos}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Peso Médio:</span>
                        <span className="stat-value">{totais.pesoMedio}g</span>
                    </div>
                </div>
            </div>

            {/* Lista de Registros */}
            <div className="registros-list">
                <h2>Registros de Postura</h2>

                {registros.length === 0 ? (
                    <p>Nenhum registro de postura encontrado.</p>
                ) : (
                    <table>
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
                            {registros.map((registro) => (
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
                                        <span className={`badge badge-${registro.qualidade_casca?.toLowerCase()}`}>
                                            {registro.qualidade_casca || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default HistoricoPosturaPage;
