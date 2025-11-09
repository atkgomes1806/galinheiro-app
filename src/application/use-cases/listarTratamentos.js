import { tratamentoRepository } from '../../infrastructure/config';

/**
 * Use Case: Listar tratamentos
 * @param {string|null} galinhaId - ID da galinha para filtrar (opcional)
 * @param {string|null} status - Status: 'Ativo' ou 'Concluido' (opcional)
 * @param {Object} repositorio - Repositório (opcional, usa injeção padrão)
 * @returns {Promise<Array>} Lista de tratamentos
 */
export async function listarTratamentos(galinhaId = null, status = null, repositorio = tratamentoRepository) {
    try {
        const tratamentos = await repositorio.fetchAllTratamentos(galinhaId, status);
        return tratamentos;
    } catch (error) {
        console.error('Erro ao listar tratamentos:', error.message);
        throw new Error('Não foi possível listar os tratamentos. Tente novamente.');
    }
}
