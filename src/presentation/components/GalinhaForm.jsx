import React, { useState, useEffect } from 'react';
import { criarGalinha } from '../../application/use-cases/criarGalinha';
import { atualizarGalinha } from '../../application/use-cases/atualizarGalinha';

const GalinhaForm = ({ galinhaParaEditar, onGalinhaCriada, onGalinhaAtualizada, onCancelar }) => {
    const [nome, setNome] = useState('');
    const [raca, setRaca] = useState('');
    const [dataAquisicao, setDataAquisicao] = useState('');
    const [loading, setLoading] = useState(false);

    // Preenche o formulário quando há uma galinha para editar
    useEffect(() => {
        if (galinhaParaEditar) {
            setNome(galinhaParaEditar.nome || '');
            setRaca(galinhaParaEditar.raca || '');
            setDataAquisicao(galinhaParaEditar.data_aquisicao || '');
        } else {
            limparFormulario();
        }
    }, [galinhaParaEditar]);

    const limparFormulario = () => {
        setNome('');
        setRaca('');
        setDataAquisicao('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dados = {
            nome,
            raca,
            data_aquisicao: dataAquisicao
        };

        try {
            if (galinhaParaEditar) {
                // Modo Edição
                const galinhaAtualizada = await atualizarGalinha(galinhaParaEditar.id, dados);
                alert('Galinha atualizada com sucesso!');
                
                if (onGalinhaAtualizada) {
                    onGalinhaAtualizada(galinhaAtualizada);
                }
            } else {
                // Modo Criação
                const novaGalinha = await criarGalinha(dados);
                alert('Galinha cadastrada com sucesso!');
                
                if (onGalinhaCriada) {
                    onGalinhaCriada(novaGalinha);
                }
            }

            limparFormulario();
        } catch (error) {
            alert(`Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        limparFormulario();
        if (onCancelar) {
            onCancelar();
        }
    };

    return (
        <div className="galinha-form">
            <h2>{galinhaParaEditar ? 'Editar Galinha' : 'Cadastrar Nova Galinha'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nome">Nome: *</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        placeholder="Ex: Pintadinha"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="raca">Raça:</label>
                    <input
                        type="text"
                        id="raca"
                        value={raca}
                        onChange={(e) => setRaca(e.target.value)}
                        placeholder="Ex: Rhode Island Red"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dataAquisicao">Data de Aquisição:</label>
                    <input
                        type="date"
                        id="dataAquisicao"
                        value={dataAquisicao}
                        onChange={(e) => setDataAquisicao(e.target.value)}
                    />
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-submit"
                    >
                        {loading ? 'Salvando...' : (galinhaParaEditar ? 'Salvar Edição' : 'Cadastrar Galinha')}
                    </button>
                    
                    {galinhaParaEditar && (
                        <button 
                            type="button" 
                            onClick={handleCancelar}
                            className="btn-cancelar"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default GalinhaForm;