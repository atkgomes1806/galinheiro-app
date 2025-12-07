import React, { useState } from 'react';

/**
 * Modal para definir peso e qualidade de casca para cada ovo registrado
 */
const ModalDetalhesOvos = ({ datas, galinhaInfo, onConfirmar, onCancelar }) => {
    // Estado para cada data: { data_postura: { peso_gramas, qualidade_casca } }
    const [detalhes, setDetalhes] = useState(() => {
        const inicial = {};
        datas.forEach((data) => {
            inicial[data] = {
                peso_gramas: '',
                qualidade_casca: ''
            };
        });
        return inicial;
    });

    const [erros, setErros] = useState({});

    const handlePesoChange = (data, valor) => {
        setDetalhes({
            ...detalhes,
            [data]: {
                ...detalhes[data],
                peso_gramas: valor
            }
        });
        // Limpar erro se houver
        if (erros[data]) {
            setErros({
                ...erros,
                [data]: null
            });
        }
    };

    const handleQualidadeChange = (data, valor) => {
        setDetalhes({
            ...detalhes,
            [data]: {
                ...detalhes[data],
                qualidade_casca: valor
            }
        });
    };

    const validarDetalhes = () => {
        const novosErros = {};
        let temErro = false;

        Object.entries(detalhes).forEach(([data, detalhe]) => {
            // Peso é opcional, mas se fornecido deve ser válido
            if (detalhe.peso_gramas) {
                const peso = parseFloat(detalhe.peso_gramas);
                if (isNaN(peso) || peso <= 0 || peso > 200) {
                    novosErros[data] = 'Peso deve estar entre 0 e 200g';
                    temErro = true;
                }
            }
        });

        setErros(novosErros);
        return !temErro;
    };

    const handleConfirmar = () => {
        if (validarDetalhes()) {
            onConfirmar(detalhes);
        }
    };

    const formatDisplayDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-detalhes-ovos">
                <div className="modal-header">
                    <h3>🥚 Detalhes dos Ovos</h3>
                    <button className="close-btn" onClick={onCancelar}>✕</button>
                </div>

                <div className="modal-info">
                    <p>
                        <strong>Galinha:</strong> {galinhaInfo.nome}
                        {galinhaInfo.raca && ` (${galinhaInfo.raca})`}
                    </p>
                    <p>
                        <strong>Datas:</strong> {datas.length} dia{datas.length !== 1 ? 's' : ''} selecionado{datas.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="modal-form-scroll">
                    {datas.map((data, index) => (
                        <div key={data} className="detalhe-ovo-card">
                            <div className="detalhe-data">
                                <span className="badge-numero">#{index + 1}</span>
                                <strong>📅 {formatDisplayDate(data)}</strong>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor={`peso-${data}`}>
                                        Peso (gramas):
                                    </label>
                                    <input
                                        type="number"
                                        id={`peso-${data}`}
                                        value={detalhes[data].peso_gramas}
                                        onChange={(e) => handlePesoChange(data, e.target.value)}
                                        min="0"
                                        max="200"
                                        step="0.1"
                                        placeholder="Ex: 55.5"
                                        className={erros[data] ? 'input-error' : ''}
                                    />
                                    {erros[data] && (
                                        <small className="error-text">⚠️ {erros[data]}</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`qualidade-${data}`}>
                                        Qualidade da Casca:
                                    </label>
                                    <select
                                        id={`qualidade-${data}`}
                                        value={detalhes[data].qualidade_casca}
                                        onChange={(e) => handleQualidadeChange(data, e.target.value)}
                                    >
                                        <option value="">Não especificada</option>
                                        <option value="Excelente">Excelente ⭐</option>
                                        <option value="Boa">Boa ✓</option>
                                        <option value="Regular">Regular ◐</option>
                                        <option value="Ruim">Ruim ✗</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="modal-actions">
                    <button
                        onClick={onCancelar}
                        className="btn btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirmar}
                        className="btn btn-primary"
                    >
                        ✅ Confirmar {datas.length} Ovo{datas.length !== 1 ? 's' : ''}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDetalhesOvos;
