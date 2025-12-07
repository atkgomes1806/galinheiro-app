import React, { useState, useEffect } from 'react';
import { registrarOvo } from '../../application/use-cases/registrarOvo';
import { registrarMultiplosOvos } from '../../application/use-cases/registrarMultiplosOvos';
import CalendarioSeletor from './CalendarioSeletor';
import ModalDetalhesOvos from './ModalDetalhesOvos';

const RegistroOvoForm = ({ galinhas, onRegistroCriado }) => {
    const [modo, setModo] = useState('unico'); // 'unico' ou 'multiplo'
    
    // Estado para modo ÚNICO
    const [galinhaId, setGalinhaId] = useState('');
    const [dataPostura, setDataPostura] = useState('');
    const [pesoGramas, setPesoGramas] = useState('');
    const [qualidadeCasca, setQualidadeCasca] = useState('');
    
    // Estado para modo MÚLTIPLO
    const [mostrarCalendario, setMostrarCalendario] = useState(false);
    const [datasConfirmadas, setDatasConfirmadas] = useState([]);
    const [mostrarModalDetalhes, setMostrarModalDetalhes] = useState(false);
    
    const [loading, setLoading] = useState(false);

    // Define a data padrão como hoje (usando timezone local)
    useEffect(() => {
        const hoje = getDataLocalFormatada(new Date());
        setDataPostura(hoje);
    }, []);

    const limparFormulario = () => {
        setGalinhaId('');
        const hoje = getDataLocalFormatada(new Date());
        setDataPostura(hoje);
        setPesoGramas('');
        setQualidadeCasca('');
        // Modo múltiplo
        setDatasConfirmadas([]);
        setModo('unico');
    };

    // HANDLER: Modo Único
    const handleSubmitUnico = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dados = {
            galinha_id: galinhaId,
            data_postura: dataPostura,
            quantidade: 1, // Sempre 1 ovo por dia
            peso_gramas: pesoGramas || null,
            qualidade_casca: qualidadeCasca || null
        };

        try {
            const novoRegistro = await registrarOvo(dados);
            alert('✅ Ovo registrado com sucesso! 🥚');

            if (onRegistroCriado) {
                onRegistroCriado(novoRegistro);
            }

            limparFormulario();
        } catch (error) {
            alert(`❌ Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // HANDLER: Calendário - datas confirmadas
    const handleDatasConfirmadas = (datas) => {
        setDatasConfirmadas(datas);
        setMostrarCalendario(false);
        setMostrarModalDetalhes(true);
    };

    // HANDLER: Modo Múltiplo - modal de detalhes
    const handleSubmitMultiplo = async (detalhesOvos) => {
        setLoading(true);
        setMostrarModalDetalhes(false);

        try {
            const resultado = await registrarMultiplosOvos(galinhaId, detalhesOvos);
            
            if (resultado.sucesso > 0) {
                alert(`✅ ${resultado.sucesso} ovo${resultado.sucesso !== 1 ? 's' : ''} registrado${resultado.sucesso !== 1 ? 's' : ''} com sucesso! 🥚`);
                
                if (onRegistroCriado) {
                    resultado.registros.forEach(reg => onRegistroCriado(reg));
                }

                limparFormulario();
            }

            if (resultado.falhas.length > 0) {
                const mensagens = resultado.falhas
                    .map(f => `${f.data}: ${f.erro}`)
                    .join('\n');
                alert(`⚠️ Algumas datas falharam:\n${mensagens}`);
            }

        } catch (error) {
            alert(`❌ Erro ao registrar múltiplos ovos: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!galinhas || galinhas.length === 0) {
        return (
            <div className="form-container">
                <h2>Registrar Postura de Ovos 🥚</h2>
                <p className="text-warning">
                    ⚠️ Você precisa cadastrar pelo menos uma galinha antes de registrar ovos.
                </p>
            </div>
        );
    }

    const galinhaAtual = galinhas.find(g => g.id === galinhaId);

    return (
        <div className="form-container">
            <h2>Registrar Postura de Ovos 🥚</h2>
            
            {/* Seletor de Modo */}
            <div className="modo-selector">
                <button
                    className={`btn-modo ${modo === 'unico' ? 'ativo' : ''}`}
                    onClick={() => {
                        setModo('unico');
                        setDatasConfirmadas([]);
                        setMostrarCalendario(false);
                        setMostrarModalDetalhes(false);
                    }}
                >
                    📝 Um Ovo
                </button>
                <button
                    className={`btn-modo ${modo === 'multiplo' ? 'ativo' : ''}`}
                    onClick={() => {
                        setModo('multiplo');
                        setPesoGramas('');
                        setQualidadeCasca('');
                    }}
                >
                    📅 Múltiplos Ovos
                </button>
            </div>

            {/* MODO ÚNICO */}
            {modo === 'unico' && (
                <form onSubmit={handleSubmitUnico}>
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
                        <label htmlFor="pesoGramas">Peso (gramas):</label>
                        <input
                            type="number"
                            id="pesoGramas"
                            value={pesoGramas}
                            onChange={(e) => setPesoGramas(e.target.value)}
                            min="0"
                            max="200"
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
                            <option value="Excelente">Excelente ⭐</option>
                            <option value="Boa">Boa ✓</option>
                            <option value="Regular">Regular ◐</option>
                            <option value="Ruim">Ruim ✗</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Registrando...' : '✅ Registrar Ovo'}
                        </button>
                    </div>
                </form>
            )}

            {/* MODO MÚLTIPLO */}
            {modo === 'multiplo' && (
                <form onSubmit={(e) => { e.preventDefault(); setMostrarCalendario(true); }}>
                    <div className="form-group">
                        <label htmlFor="galinhaMulti">Galinha: *</label>
                        <select
                            id="galinhaMulti"
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

                    {/* Resumo de datas selecionadas */}
                    {datasConfirmadas.length > 0 && (
                        <div className="datas-selecionadas-resumo">
                            <h4>📅 Datas Selecionadas: {datasConfirmadas.length}</h4>
                            <div className="dates-list">
                                {datasConfirmadas.map((data) => (
                                    <span key={data} className="date-tag">
                                        {formatDisplayDate(data)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => setMostrarCalendario(true)}
                            className="btn btn-secondary"
                        >
                            📅 {datasConfirmadas.length === 0 ? 'Selecionar Datas' : 'Alterar Datas'}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || datasConfirmadas.length === 0 || !galinhaId}
                            className="btn btn-primary"
                        >
                            {loading ? 'Registrando...' : `✅ Próximo (${datasConfirmadas.length})`}
                        </button>
                    </div>
                </form>
            )}

            {/* CALENDÁRIO MODAL */}
            {mostrarCalendario && (
                <CalendarioSeletor
                    onDatasConfirmadas={handleDatasConfirmadas}
                    onCancelar={() => setMostrarCalendario(false)}
                    initialMonth={new Date()}
                />
            )}

            {/* MODAL DETALHES OVOS */}
            {mostrarModalDetalhes && galinhaAtual && (
                <ModalDetalhesOvos
                    datas={datasConfirmadas}
                    galinhaInfo={galinhaAtual}
                    onConfirmar={handleSubmitMultiplo}
                    onCancelar={() => {
                        setMostrarModalDetalhes(false);
                        setMostrarCalendario(true);
                    }}
                />
            )}
        </div>
    );
};

/**
 * Formata data para exibição DD/MM
 */
function formatDisplayDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}`;
}

/**
 * Converte data JS para formato YYYY-MM-DD usando timezone local
 * Evita offset de timezone ao salvar no banco
 */
function getDataLocalFormatada(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default RegistroOvoForm;
