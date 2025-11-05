import { galinhaRepository } from '../../infrastructure/config';

/**
 * Use Case: Remover uma galinha
 * @param {number|string} id - ID da galinha a ser removida
 * @param {Object} repositorio - Repositório de galinhas (opcional, usa injeção padrão)
 * @returns {Promise<Object>} Galinha removida
 * @throws {Error} Se o ID não for fornecido ou se houver erro na remoção
 */
export async function removerGalinha(id, repositorio = galinhaRepository) {
    // Validação básica
    if (!id) {
        throw new Error('O ID da galinha é obrigatório para remoção.');
    }

    try {
        const galinhaRemovida = await repositorio.removerGalinha(id);
        return galinhaRemovida;
    } catch (error) {
        console.error('Erro ao remover galinha:', error.message);
        throw new Error('Não foi possível remover a galinha. Tente novamente.');
    }
}