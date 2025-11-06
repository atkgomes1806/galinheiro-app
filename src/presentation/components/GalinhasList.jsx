import React from 'react';
import { removerGalinha } from '../../application/use-cases/removerGalinha';

const GalinhasList = ({ galinhas, onGalinhaRemovida, onEditarGalinha }) => {
    const handleRemover = async (id, nome) => {
        const confirmacao = window.confirm('Tem certeza que deseja remover a galinha "' + nome + '"?');
        if (!confirmacao) return;
        try {
            await removerGalinha(id);
            alert('Galinha removida com sucesso!');
            if (onGalinhaRemovida) onGalinhaRemovida(id);
        } catch (error) {
            alert('Erro ao remover galinha: ' + error.message);
        }
    };

    const handleEditar = (galinha) => {
        if (onEditarGalinha) onEditarGalinha(galinha);
    };

    const formatarData = (data) => {
        if (!data) return 'Não informada';
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const calcularIdade = (dataNascimento) => {
        if (!dataNascimento) return 'Desconhecida';
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        const diffMs = hoje - nascimento;
        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDias < 30) return diffDias + ' dias';
        if (diffDias < 365) return Math.floor(diffDias / 30) + ' meses';
        return Math.floor(diffDias / 365) + ' anos';
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Ativa': 'badge-success',
            'Inativa': 'badge-danger',
            'Em Tratamento': 'badge-warning'
        };
        return statusMap[status] || 'badge-info';
    };

    if (!galinhas || galinhas.length === 0) {
        return (
            <div>
                <h2>Lista de Galinhas</h2>
                <p style={{ color: 'var(--gray-500)' }}>Nenhuma galinha cadastrada ainda.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Lista de Galinhas ({galinhas.length})</h2>
            <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                {galinhas.map((galinha) => (
                    <div key={galinha.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--gray-900)' }}>{galinha.nome}</h3>
                                <p style={{ margin: '0.25rem 0', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                    {galinha.raca || 'Raça não especificada'}
                                </p>
                            </div>
                            <span className={'badge ' + getStatusBadge(galinha.status || 'Ativa')}>
                                {galinha.status || 'Ativa'}
                            </span>
                        </div>
                        
                        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-200)' }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                                    Data de Nascimento
                                </span>
                                <p style={{ margin: '0.25rem 0', color: 'var(--gray-700)' }}>
                                    {formatarData(galinha.data_nascimento)}
                                </p>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                                    Idade
                                </span>
                                <p style={{ margin: '0.25rem 0', color: 'var(--gray-700)' }}>
                                    {calcularIdade(galinha.data_nascimento)}
                                </p>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleEditar(galinha)} className="btn btn-secondary" style={{ flex: 1 }}>
                                Editar
                            </button>
                            <button onClick={() => handleRemover(galinha.id, galinha.nome)} className="btn btn-danger" style={{ flex: 1 }}>
                                Remover
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalinhasList;
