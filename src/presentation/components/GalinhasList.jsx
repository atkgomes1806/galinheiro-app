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
            "'Ativa'": 'badge-success',
            'Inativa': 'badge-danger',
            "'Inativa'": 'badge-danger',
            'Em Tratamento': 'badge-warning',
            "'Em Tratamento'": 'badge-warning'
        };
        return statusMap[status] || 'badge-info';
    };

    const normalizeStatus = (status) => {
        if (!status) return 'Ativa';
        // Remove aspas simples literais se existirem
        return status.replace(/^'|'$/g, '');
    };

    if (!galinhas || galinhas.length === 0) {
        return (
            <div>
                <h2>Lista de Galinhas</h2>
                <p className="muted">Nenhuma galinha cadastrada ainda.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="h2-mb-1-5">Lista de Galinhas ({galinhas.length})</h2>
            <div className="grid grid-cols-3 grid-gap-1-5">
                {galinhas.map((galinha) => (
                    <div key={galinha.id} className="card">
                        <div className="card-header">
                            <div>
                                <h3 className="h3-card">{galinha.nome}</h3>
                                <p className="p-muted">
                                    {galinha.raca || 'Raça não especificada'}
                                </p>
                            </div>
                            <span className={'badge ' + getStatusBadge(galinha.status || 'Ativa')}>
                                {normalizeStatus(galinha.status)}
                            </span>
                        </div>
                        
                        <div className="card-section">
                            <div className="card-section-title">
                                Data de Nascimento
                            </div>
                            <p className="card-section-value">
                                {formatarData(galinha.data_nascimento)}
                            </p>
                            <div className="card-section-title">
                                Idade
                            </div>
                            <p className="card-section-value">
                                {calcularIdade(galinha.data_nascimento)}
                            </p>
                        </div>
                        
                        <div className="card-actions">
                            <button onClick={() => handleEditar(galinha)} className="btn btn-secondary">
                                Editar
                            </button>
                            <button onClick={() => handleRemover(galinha.id, galinha.nome)} className="btn btn-danger">
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
