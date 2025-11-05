import { tratamentoRepository } from '../../infrastructure/config';

/**
 * Use Case: Criar um novo tratamento
 * @param {Object} dados - Dados do tratamento
 * @param {string} dados.galinha_id - ID da galinha (obrigatório)
 * @param {string} dados.tipo_tratamento - Tipo (Vacina, Remédio, etc.) (obrigatório)
 * @param {string} dados.data_inicio - Data de início (obrigatório)
 * @param {string} dados.data_fim_prevista - Data de fim prevista (opcional)
 * @param {string} dados.descricao - Descrição do tratamento (opcional)
 * @param {Object} repositorio - Repositório (opcional, usa injeção padrão)
 * @returns {Promise<Object>} Tratamento criado
 * @throws {Error} Se validação falhar
 */
export async function criarTratamento(dados, repositorio = tratamentoRepository) {
    // Validação Crítica 1: galinha_id obrigatório
    if (!dados.galinha_id || dados.galinha_id.trim() === '') {
        throw new Error('O ID da galinha é obrigatório.');
    }

    // Validação Crítica 2: tipo_tratamento obrigatório
    if (!dados.tipo_tratamento || dados.tipo_tratamento.trim() === '') {
        throw new Error('O tipo de tratamento é obrigatório.');
    }

    // Validação Crítica 3: data_inicio obrigatória
    if (!dados.data_inicio) {
        throw new Error('A data de início é obrigatória.');
    }

    // Regra de Negócio: Se data_fim_prevista for fornecida, deve ser >= data_inicio
    if (dados.data_fim_prevista) {
        const dataInicio = new Date(dados.data_inicio);
        const dataFimPrevista = new Date(dados.data_fim_prevista);

        if (dataFimPrevista < dataInicio) {
            throw new Error('A data de fim prevista deve ser posterior ou igual à data de início.');
        }
    }

    try {
        // Normaliza os dados
        const dadosNormalizados = {
            galinha_id: dados.galinha_id.trim(),
            tipo_tratamento: dados.tipo_tratamento.trim(),
            descricao: dados.descricao?.trim() || null,
            data_inicio: dados.data_inicio,
            data_fim_prevista: dados.data_fim_prevista || null,
            concluido: false, // Sempre começa como não concluído
            data_fim_real: null,
            notas_resultado: null
        };

        const tratamentoCriado = await repositorio.createTratamento(dadosNormalizados);
        return tratamentoCriado;
    } catch (error) {
        console.error('Erro ao criar tratamento:', error.message);
        throw new Error('Não foi possível criar o tratamento. Verifique os dados e tente novamente.');
    }
}
