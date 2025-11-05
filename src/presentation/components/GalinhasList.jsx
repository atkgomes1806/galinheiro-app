import React from 'react';
import { removerGalinha } from '../../application/use-cases/removerGalinha';

const GalinhasList = ({ galinhas, onGalinhaRemovida, onEditarGalinha }) => {
    const handleRemover = async (id, nome) => {
        const confirmacao = window.confirm(`Tem certeza que deseja remover a galinha "${nome}"?`);
        
        if (!confirmacao) {
            return;
        }

        try {
            await removerGalinha(id);
            alert('Galinha removida com sucesso!');
            
            // Notifica o componente pai para atualizar a lista
            if (onGalinhaRemovida) {
                onGalinhaRemovida(id);
            }
        } catch (error) {
            alert(`Erro ao remover galinha: ${error.message}`);
        }
    };

    const handleEditar = (galinha) => {
        if (onEditarGalinha) {
            onEditarGalinha(galinha);
        }
    };

    if (!galinhas || galinhas.length === 0) {
        return (
            <div className="galinhas-list">
                <h2>Lista de Galinhas</h2>
                <p>Nenhuma galinha cadastrada ainda.</p>
            </div>
        );
    }

    return (
        <div className="galinhas-list">
            <h2>Lista de Galinhas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Raça</th>
                        <th>Data de Aquisição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {galinhas.map((galinha) => (
                        <tr key={galinha.id}>
                            <td>{galinha.nome}</td>
                            <td>{galinha.raca || 'Não especificada'}</td>
                            <td>{galinha.data_aquisicao ? new Date(galinha.data_aquisicao).toLocaleDateString('pt-BR') : 'N/A'}</td>
                            <td>
                                <button 
                                    onClick={() => handleEditar(galinha)}
                                    className="btn-editar"
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleRemover(galinha.id, galinha.nome)}
                                    className="btn-remover"
                                >
                                    Remover
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GalinhasList;