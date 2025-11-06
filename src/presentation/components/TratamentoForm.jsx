import React, { useState, useEffect } from 'react';
import { criarTratamento } from '../../application/use-cases/criarTratamento';

const TratamentoForm = ({ galinhas, onTratamentoCriado }) => {
    const [galinhaId, setGalinhaId] = useState('');
    const [tipoTratamento, setTipoTratamento] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFimPrevista, setDataFimPrevista] = useState('');
    const [loading, setLoading] = useState(false);

    // Define a data de início padrão como hoje
    useEffect(() => {
        const hoje = new Date().toISOString().split('T')[0];
        setDataInicio(hoje);
    }, []);

    const limparFormulario = () => {
        setGalinhaId('');
        setTipoTratamento('');
        setDescricao('');
        const hoje = new Date().toISOString().split('T')[0];
        setDataInicio(hoje);
        setDataFimPrevista('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dados = {
            galinha_id: galinhaId,
            tipo_tratamento: tipoTratamento,
            descricao: descricao,
            data_inicio: dataInicio,
            data_fim_prevista: dataFimPrevista || null
        };

        try {
            const novoTratamento = await criarTratamento(dados);
            alert('Tratamento registrado com sucesso! 💊');

            if (onTratamentoCriado) {
                onTratamentoCriado(novoTratamento);
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
            <div className="form-container">
                <h2>Registrar Tratamento 💊</h2>
                <p style={{ color: 'var(--warning)' }}>
                    ⚠️ Você precisa cadastrar pelo menos uma galinha antes de registrar tratamentos.
                </p>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h2>Registrar Novo Tratamento 💊</h2>
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
                    <label htmlFor="tipoTratamento">Tipo de Tratamento: *</label>
                    <select
                        id="tipoTratamento"
                        value={tipoTratamento}
                        onChange={(e) => setTipoTratamento(e.target.value)}
                        required
                    >
                        <option value="">Selecione o tipo</option>
                        <option value="Vacina">💉 Vacina</option>
                        <option value="Remédio">💊 Remédio</option>
                        <option value="Suplemento">🌿 Suplemento</option>
                        <option value="Vermífugo">🦠 Vermífugo</option>
                        <option value="Antibiótico">💉 Antibiótico</option>
                        <option value="Outro">📝 Outro</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="descricao">Descrição:</label>
                    <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows="3"
                        placeholder="Descreva o tratamento, dosagem, observações, etc."
                    />
                </div>

                <div className="form-row" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <div className="form-group">
                        <label htmlFor="dataInicio">Data de Início: *</label>
                        <input
                            type="date"
                            id="dataInicio"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dataFimPrevista">Data de Fim Prevista:</label>
                        <input
                            type="date"
                            id="dataFimPrevista"
                            value={dataFimPrevista}
                            onChange={(e) => setDataFimPrevista(e.target.value)}
                            min={dataInicio}
                        />
                        <small>Deixe em branco se não houver previsão</small>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Registrando...' : '✅ Registrar Tratamento'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TratamentoForm;
