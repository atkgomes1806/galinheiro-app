import React from 'react';
import { removerGalinha } from '../../application/use-cases/removerGalinha';

const GalinhasList = ({
    galinhas,
    totalOriginal = 0,
    onGalinhaRemovida,
    onEditarGalinha,
    modoVisualizacao = 'cards'
}) => {
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

    const getStatusReprodutivoLabel = (status) => {
        const map = {
            laying: { label: '🟢 Em Postura', badge: 'badge-success' },
            broody: { label: '🔴 Em Choco', badge: 'badge-danger' },
            molting: { label: '🟡 Em Muda', badge: 'badge-warning' }
        };
        return map[status || 'laying'] || map.laying;
    };

    const getStatusProducaoTexto = (status) => {
        const normalizado = normalizeStatus(status).toLowerCase();
        return normalizado === 'inativa' ? '⚫ Inativa' : '✅ Ativa';
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
        <div className="stage2-list-container">
            <h2 className="h2-mb-1-5">Lista de Galinhas ({galinhas.length}{totalOriginal > galinhas.length ? ` de ${totalOriginal}` : ''})</h2>
            <div className={modoVisualizacao === 'list' ? 'stage2-hens-list' : 'grid grid-cols-3 grid-gap-1-5'}>
                {galinhas.map((galinha) => (
                    <div key={galinha.id} className={`card stage2-hen-card ${modoVisualizacao === 'list' ? 'stage2-hen-card--list' : ''}`}>
                        <div className="stage2-hen-card-top">
                            <div>
                                <h3 className="h3-card stage2-hen-name">{galinha.nome}</h3>
                                <p className="p-muted">{galinha.raca || 'Raça não especificada'}</p>
                                <p className="p-muted stage2-hen-meta">
                                    {calcularIdade(galinha.data_nascimento)} • {getStatusProducaoTexto(galinha.status)}
                                </p>
                            </div>
                            <div className="stage2-hen-badges">
                                <span className={'badge ' + getStatusBadge(galinha.status || 'Ativa')}>
                                    {normalizeStatus(galinha.status)}
                                </span>
                                <span className={`badge ${getStatusReprodutivoLabel(galinha.status_reprodutivo).badge}`}>
                                    {getStatusReprodutivoLabel(galinha.status_reprodutivo).label}
                                </span>
                            </div>
                        </div>

                        <div className="stage2-hen-summary">
                            <div className="stage2-hen-summary-item">
                                <span className="text-label">Nascimento</span>
                                <span className="text-value">{formatarData(galinha.data_nascimento)}</span>
                            </div>
                            <div className="stage2-hen-summary-item">
                                <span className="text-label">Início do status</span>
                                <span className="text-value">{formatarData(galinha.data_inicio_status)}</span>
                            </div>
                            <div className="stage2-hen-summary-item">
                                <span className="text-label">Notas</span>
                                <span className="text-value stage2-hen-note-text">
                                    {galinha.notas_status ? galinha.notas_status : 'Sem observações'}
                                </span>
                            </div>
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
