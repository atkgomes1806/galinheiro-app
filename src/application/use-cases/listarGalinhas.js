import { galinhaRepository } from '../../infrastructure/config';

/**
 * Use Case: Listar todas as galinhas
 * @param {Object} repositorio - Repositório de galinhas (opcional, usa injeção padrão)
 * @returns {Promise<Array>} Lista de galinhas ordenadas por nome
 */
export async function listarGalinhas(repositorio = galinhaRepository) {
    try {
        const galinhas = await repositorio.fetchAllGalinhas();
        return galinhas;
    } catch (error) {
        console.error('Erro ao listar galinhas:', error.message);
        throw new Error('Não foi possível listar as galinhas. Tente novamente.');
    }
}