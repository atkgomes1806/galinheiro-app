import { registroOvoRepository } from '../../infrastructure/config';

/**
 * Use Case: Listar registros de ovos
 * @param {string|null} galinhaId - ID da galinha para filtrar (opcional)
 * @param {Object} repositorio - Repositório (opcional, usa injeção padrão)
 * @returns {Promise<Array>} Lista de registros de ovos
 */
export async function listarRegistrosOvos(galinhaId = null, repositorio = registroOvoRepository) {
    try {
        const registros = await repositorio.fetchAllRegistros(galinhaId);
        return registros;
    } catch (error) {
        console.error('Erro ao listar registros de ovos:', error.message);
        throw new Error('Não foi possível listar os registros de ovos. Tente novamente.');
    }
}
