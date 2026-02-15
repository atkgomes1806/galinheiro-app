import { tratamentoRepository } from '../../infrastructure/config';

/**
 * Use Case: Concluir um tratamento
 * @param {string} id - ID do tratamento a ser concluído
 * @param {string} notasResultado - Notas sobre o resultado (opcional)
 * @param {Object} repositorio - Repositório (opcional, usa injeção padrão)
 * @returns {Promise<Object>} Tratamento concluído
 * @throws {Error} Se o ID não for fornecido ou se houver erro
 */
export async function concluirTratamento(id, notasResultado = '', repositorio = tratamentoRepository) {
    // Validação básica
    if (!id) {
        throw new Error('O ID do tratamento é obrigatório.');
    }

    try {
        const repositorioFinal =
            notasResultado &&
            typeof notasResultado === 'object' &&
            typeof notasResultado.atualizarTratamento === 'function'
                ? notasResultado
                : repositorio;

        const notasFinal = repositorioFinal === notasResultado ? '' : notasResultado;
        const dataConclusao = new Date().toISOString().split('T')[0];
        const dadosAtualizacao = {
            concluido: 'true', // No Supabase, concluido é text, não boolean
            data_conclusao: dataConclusao,
            comentarios_tratamento: notasFinal?.trim() || null
        };

        const tratamentoConcluido = await repositorioFinal.atualizarTratamento(id, dadosAtualizacao);
        return tratamentoConcluido;
    } catch (error) {
        console.error('Erro ao concluir tratamento:', error.message);
        throw new Error('Não foi possível concluir o tratamento. Tente novamente.');
    }
}
