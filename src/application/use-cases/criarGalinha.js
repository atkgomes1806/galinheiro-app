import { galinhaRepository } from '../../infrastructure/config';

/**
 * Use Case: Criar uma nova galinha
 * @param {Object} dados - Dados da galinha (nome, raca, data_aquisicao, etc.)
 * @param {Object} repositorio - Repositório de galinhas (opcional, usa injeção padrão)
 * @returns {Promise<Object>} Galinha criada
 * @throws {Error} Se o nome não for fornecido
 */
export async function criarGalinha(dados, repositorio = galinhaRepository) {
    // Regra de negócio: validar campo obrigatório
    if (!dados.nome || dados.nome.trim() === '') {
        throw new Error('O nome da galinha é obrigatório.');
    }

    try {
        const galinhaCriada = await repositorio.createGalinha(dados);
        return galinhaCriada;
    } catch (error) {
        console.error('Erro ao criar galinha:', error.message);
        throw new Error('Não foi possível criar a galinha. Verifique os dados e tente novamente.');
    }
}