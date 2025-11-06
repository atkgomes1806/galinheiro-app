import React, { useState, useEffect } from 'react';
import { criarGalinha } from '../../application/use-cases/criarGalinha';
import { atualizarGalinha } from '../../application/use-cases/atualizarGalinha';

const RACAS_GALINHAS = [
    'Rhode Island Red',
    'Plymouth Rock',
    'Leghorn',
    'Sussex',
    'Orpington',
    'Wyandotte',
    'Brahma',
    'Australorp',
    'Marans',
    'Cochim',
    'Caipira',
    'Garnisé',
    'New Hampshire',
    'Outra'
];

const GalinhaForm = ({ galinhaParaEditar, onGalinhaCriada, onGalinhaAtualizada, onCancelar }) => {
    const [nome, setNome] = useState('');
    const [raca, setRaca] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (galinhaParaEditar) {
            setNome(galinhaParaEditar.nome || '');
            setRaca(galinhaParaEditar.raca || '');
            setDataNascimento(galinhaParaEditar.data_nascimento || '');
        } else {
            limparFormulario();
        }
    }, [galinhaParaEditar]);

    const limparFormulario = () => {
        setNome('');
        setRaca('');
        setDataNascimento('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dados = {
            nome,
            raca,
            data_nascimento: dataNascimento
        };

        try {
            if (galinhaParaEditar) {
                const galinhaAtualizada = await atualizarGalinha(galinhaParaEditar.id, dados);
                alert('Galinha atualizada com sucesso!');
                
                if (onGalinhaAtualizada) {
                    onGalinhaAtualizada(galinhaAtualizada);
                }
            } else {
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
        <div className="form-container">
            <h2>{galinhaParaEditar ? 'Editar Galinha' : 'Cadastrar Nova Galinha'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nome">Nome: *</label>
                    <input
                        className="form-input"
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
                    <select
                        className="form-input"
                        id="raca"
                        value={raca}
                        onChange={(e) => setRaca(e.target.value)}
                    >
                        <option value="">Selecione uma raça</option>
                        {RACAS_GALINHAS.map((racaOpcao) => (
                            <option key={racaOpcao} value={racaOpcao}>
                                {racaOpcao}
                            </option>
                        ))}
                    </select>
                    <small style={{ color: 'var(--gray-500)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                        Escolha a raça que mais se aproxima da sua galinha
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="dataNascimento">Data de Nascimento:</label>
                    <input
                        className="form-input"
                        type="date"
                        id="dataNascimento"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                    />
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Salvando...' : (galinhaParaEditar ? 'Salvar Edição' : 'Cadastrar Galinha')}
                    </button>
                    
                    {galinhaParaEditar && (
                        <button 
                            type="button" 
                            onClick={handleCancelar}
                            className="btn btn-secondary"
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
