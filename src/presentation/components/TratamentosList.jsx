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
                                <div className="badge badge-warning" style={{ marginBottom: '0.5rem', width: 'fit-content' }}>
                                    ⚠️ {alerta.mensagem}
                                </div>
                            )}

                            {/* Cabeçalho do Card */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0 }}>{tratamento.galinhas?.nome || 'Galinha não encontrada'}</h3>
                                <span className="badge badge-info">
                                    {tratamento.tipo_tratamento}
                                </span>
                            </div>

                            {/* Corpo do Card */}
                            <div>
                                {tratamento.descricao && (
                                    <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>{tratamento.descricao}</p>
                                )}

                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Início:</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                        {new Date(tratamento.data_inicio).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>

                                {tratamento.data_fim_prevista && (
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Fim Previsto:</span>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                            {new Date(tratamento.data_fim_prevista).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                )}

                                {tratamento.concluido === 'true' && tratamento.data_fim_real && (
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Concluído em:</span>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                            {new Date(tratamento.data_fim_real).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                )}

                                {tratamento.concluido === 'true' && tratamento.notas_resultado && (
                                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                                        <strong style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>Resultado:</strong>
                                        <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>{tratamento.notas_resultado}</p>
                                    </div>
                                )}
                            </div>

                            {/* Ações */}
                            {tratamento.concluido === 'false' && (
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
                                    <button
                                        onClick={() => handleConcluir(tratamento)}
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
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
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
                        <h2 style={{ marginTop: 0 }}>Concluir Tratamento</h2>
                        <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                            <p style={{ margin: 0, marginBottom: '0.5rem' }}>
                                <strong>Galinha:</strong> {tratamentoSelecionado.galinhas?.nome || 'N/A'}
                            </p>
                            <p style={{ margin: 0 }}>
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
