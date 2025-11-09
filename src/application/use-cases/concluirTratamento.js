import { tratamentoRepository } from '../../infrastructure/config';

/**
 * Use Case: Concluir um tratamento
 * @param {string} id - ID do tratamento a ser concluído
 * @param {Object} repositorio - Repositório (opcional, usa injeção padrão)
 * @returns {Promise<Object>} Tratamento concluído
 * @throws {Error} Se o ID não for fornecido ou se houver erro
 */
export async function concluirTratamento(id, repositorio = tratamentoRepository) {
    // Validação básica
    if (!id) {
        throw new Error('O ID do tratamento é obrigatório.');
    }

    try {
        const dadosAtualizacao = {
            concluido: 'true' // No Supabase, concluido é text, não boolean
        };

        const tratamentoConcluido = await repositorio.atualizarTratamento(id, dadosAtualizacao);
        return tratamentoConcluido;
    } catch (error) {
        console.error('Erro ao concluir tratamento:', error.message);
        throw new Error('Não foi possível concluir o tratamento. Tente novamente.');
    }
}
