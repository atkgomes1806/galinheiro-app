import React, { useState, useEffect } from 'react';
import { registrarOvo } from '../../application/use-cases/registrarOvo';

const RegistroOvoForm = ({ galinhas, onRegistroCriado }) => {
    const [galinhaId, setGalinhaId] = useState('');
    const [dataPostura, setDataPostura] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [pesoGramas, setPesoGramas] = useState('');
    const [qualidadeCasca, setQualidadeCasca] = useState('');
    const [loading, setLoading] = useState(false);

    // Define a data padrão como hoje
    useEffect(() => {
        const hoje = new Date().toISOString().split('T')[0];
        setDataPostura(hoje);
    }, []);

    const limparFormulario = () => {
        setGalinhaId('');
        const hoje = new Date().toISOString().split('T')[0];
        setDataPostura(hoje);
        setQuantidade(1);
        setPesoGramas('');
        setQualidadeCasca('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dados = {
            galinha_id: galinhaId,
            data_postura: dataPostura,
            quantidade: quantidade,
            peso_gramas: pesoGramas || null,
            qualidade_casca: qualidadeCasca || null
        };

        try {
            const novoRegistro = await registrarOvo(dados);
            alert('Ovo registrado com sucesso! 🥚');

            if (onRegistroCriado) {
                onRegistroCriado(novoRegistro);
            }

            limparFormulario();
        } catch (error) {
            alert(`Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!galinhas || galinhas.length === 0) {
        return (
            <div className="registro-ovo-form">
                <h2>Registrar Postura de Ovos 🥚</h2>
                <p className="warning">
                    ⚠️ Você precisa cadastrar pelo menos uma galinha antes de registrar ovos.
                </p>
            </div>
        );
    }

    return (
        <div className="registro-ovo-form">
            <h2>Registrar Postura de Ovos 🥚</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="galinha">Galinha: *</label>
                    <select
                        id="galinha"
                        value={galinhaId}
                        onChange={(e) => setGalinhaId(e.target.value)}
                        required
                    >
                        <option value="">Selecione uma galinha</option>
                        {galinhas.map((galinha) => (
                            <option key={galinha.id} value={galinha.id}>
                                {galinha.nome} {galinha.raca ? `(${galinha.raca})` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="dataPostura">Data da Postura: *</label>
                    <input
                        type="date"
                        id="dataPostura"
                        value={dataPostura}
                        onChange={(e) => setDataPostura(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quantidade">Quantidade: *</label>
                    <input
                        type="number"
                        id="quantidade"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        min="1"
                        step="1"
                        required
                        placeholder="Ex: 2"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="pesoGramas">Peso (gramas):</label>
                    <input
                        type="number"
                        id="pesoGramas"
                        value={pesoGramas}
                        onChange={(e) => setPesoGramas(e.target.value)}
                        min="0"
                        step="0.1"
                        placeholder="Ex: 55.5"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="qualidadeCasca">Qualidade da Casca:</label>
                    <select
                        id="qualidadeCasca"
                        value={qualidadeCasca}
                        onChange={(e) => setQualidadeCasca(e.target.value)}
                    >
                        <option value="">Não especificada</option>
                        <option value="Excelente">Excelente</option>
                        <option value="Boa">Boa</option>
                        <option value="Regular">Regular</option>
                        <option value="Ruim">Ruim</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-submit"
                    >
                        {loading ? 'Registrando...' : '✅ Registrar Ovo'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistroOvoForm;
