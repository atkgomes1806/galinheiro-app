import { galinhaRepository } from '../../infrastructure/config';

/**
 * Use Case: Atualizar uma galinha existente
 * @param {number|string} id - ID da galinha a ser atualizada
 * @param {Object} dados - Dados atualizados da galinha
 * @param {Object} repositorio - Repositório de galinhas (opcional, usa injeção padrão)
 * @returns {Promise<Object>} Galinha atualizada
 * @throws {Error} Se o ID não for fornecido ou se houver erro na atualização
 */
export async function atualizarGalinha(id, dados, repositorio = galinhaRepository) {
    // Validação básica
    if (!id) {
        throw new Error('O ID da galinha é obrigatório para atualização.');
    }

    // Validação do nome (se fornecido)
    if (dados.nome !== undefined && (!dados.nome || dados.nome.trim() === '')) {
        throw new Error('O nome da galinha não pode ser vazio.');
    }

    try {
        const galinhaAtualizada = await repositorio.atualizarGalinha(id, dados);
        return galinhaAtualizada;
    } catch (error) {
        console.error('Erro ao atualizar galinha:', error.message);
        throw new Error('Não foi possível atualizar a galinha. Verifique os dados e tente novamente.');
    }
}