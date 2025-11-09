import React, { useState } from 'react';
import { concluirTratamento } from '../../application/use-cases/concluirTratamento';

const TratamentosList = ({ tratamentos, onTratamentoConcluido, filtroStatus }) => {
    const [tratamentoSelecionado, setTratamentoSelecionado] = useState(null);
    const [notasResultado, setNotasResultado] = useState('');
    const [loading, setLoading] = useState(false);

    // Verifica se um tratamento está vencido ou próximo do vencimento
    const verificarAlerta = (tratamento) => {
        // No Supabase, concluido é text: 'false' ou 'true'
        if (!tratamento.data_fim_prevista || tratamento.concluido === 'true') {
            return null;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataFim = new Date(tratamento.data_fim_prevista);
        dataFim.setHours(0, 0, 0, 0);
        
        const diffDias = Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24));

        if (diffDias < 0) {
            return { tipo: 'vencido', mensagem: `Vencido há ${Math.abs(diffDias)} dia(s)`, cor: 'red' };
        } else if (diffDias === 0) {
            return { tipo: 'hoje', mensagem: 'Vence hoje!', cor: 'orange' };
        } else if (diffDias <= 3) {
            return { tipo: 'proximo', mensagem: `Vence em ${diffDias} dia(s)`, cor: 'yellow' };
        }

        return null;
    };

    const handleConcluir = async (tratamento) => {
        setTratamentoSelecionado(tratamento);
    };

    const confirmarConclusao = async () => {
        if (!tratamentoSelecionado) return;

        setLoading(true);
        try {
            const tratamentoConcluido = await concluirTratamento(
                tratamentoSelecionado.id,
                notasResultado
            );
            
            alert('Tratamento concluído com sucesso! ✅');

            if (onTratamentoConcluido) {
                onTratamentoConcluido(tratamentoConcluido);
            }

            setTratamentoSelecionado(null);
            setNotasResultado('');
        } catch (error) {
            alert(`Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const cancelarConclusao = () => {
        setTratamentoSelecionado(null);
        setNotasResultado('');
    };

    if (!tratamentos || tratamentos.length === 0) {
        return (
            <div className="tratamentos-list">
                <p>
                    {filtroStatus === 'Ativo' 
                        ? 'Nenhum tratamento ativo no momento.'
                        : 'Nenhum tratamento encontrado.'}
                </p>
            </div>
        );
    }

    return (
        <div className="tratamentos-list">
            <div className="grid grid-cols-3">
                {tratamentos.map((tratamento) => {
                    const alerta = verificarAlerta(tratamento);
                    
                    return (
                        <div 
                            key={tratamento.id} 
                            className={`card ${tratamento.concluido === 'true' ? '' : ''}`}
                        >
                            {/* Badge de Alerta */}
                            {alerta && (
                                <div className="badge badge-warning badge-fit">
                                    ⚠️ {alerta.mensagem}
                                </div>
                            )}

                            {/* Cabeçalho do Card */}
                            <div className="card-header">
                                <h3 className="h3-card">{tratamento.galinhas?.nome || 'Galinha não encontrada'}</h3>
                                <span className="badge badge-info">
                                    {tratamento.tipo_tratamento}
                                </span>
                            </div>

                            {/* Corpo do Card */}
                            <div className="card-section">
                                {tratamento.descricao && (
                                    <p className="p-muted">{tratamento.descricao}</p>
                                )}

                                <div className="card-section-item">
                                    <span className="card-section-title">Início:</span>
                                    <span className="card-section-value">
                                        {new Date(tratamento.data_inicio).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>

                                {tratamento.data_fim_prevista && (
                                    <div className="card-section-item">
                                        <span className="card-section-title">Fim Previsto:</span>
                                        <span className="card-section-value">
                                            {new Date(tratamento.data_fim_prevista).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                )}

                                {tratamento.concluido === 'true' && tratamento.data_fim_real && (
                                    <div className="card-section-item">
                                        <span className="card-section-title">Concluído em:</span>
                                        <span className="card-section-value">
                                            {new Date(tratamento.data_fim_real).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                )}

                                {tratamento.concluido === 'true' && tratamento.notas_resultado && (
                                    <div className="card-result">
                                        <strong className="card-result-title">Resultado:</strong>
                                        <p className="card-result-text">{tratamento.notas_resultado}</p>
                                    </div>
                                )}
                            </div>

                            {/* Ações */}
                            {tratamento.concluido === 'false' && (
                                <div className="card-actions">
                                    <button
                                        onClick={() => handleConcluir(tratamento)}
                                        className="btn btn-primary"
                                    >
                                        ✅ Concluir Tratamento
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal de Conclusão */}
            {tratamentoSelecionado && (
                <div className="modal-overlay">
                    <div className="card modal-content">
                        <h2>Concluir Tratamento</h2>
                        <div className="modal-info">
                            <p>
                                <strong>Galinha:</strong> {tratamentoSelecionado.galinhas?.nome || 'N/A'}
                            </p>
                            <p>
                                <strong>Tipo:</strong> {tratamentoSelecionado.tipo_tratamento}
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="notasResultado">Notas sobre o resultado:</label>
                            <textarea
                                id="notasResultado"
                                className="form-input"
                                value={notasResultado}
                                onChange={(e) => setNotasResultado(e.target.value)}
                                rows="4"
                                placeholder="Descreva os resultados, observações finais, etc."
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                onClick={confirmarConclusao}
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                {loading ? 'Concluindo...' : '✅ Confirmar Conclusão'}
                            </button>
                            <button
                                onClick={cancelarConclusao}
                                disabled={loading}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TratamentosList;
