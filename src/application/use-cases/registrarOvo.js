import { registroOvoRepository } from '../../infrastructure/config';

/**
 * Use Case: Registrar um novo ovo
 * @param {Object} dados - Dados do registro de ovo
 * @param {string} dados.galinha_id - ID da galinha (obrigatório)
 * @param {string} dados.data_postura - Data da postura (obrigatório)
 * @param {number} dados.quantidade - Quantidade de ovos (obrigatório, > 0)
 * @param {number} dados.peso_gramas - Peso em gramas (opcional)
 * @param {string} dados.qualidade_casca - Qualidade da casca (opcional)
 * @param {Object} repositorio - Repositório (opcional, usa injeção padrão)
 * @returns {Promise<Object>} Registro criado
 * @throws {Error} Se validação falhar
 */
export async function registrarOvo(dados, repositorio = registroOvoRepository) {
    // Validação Crítica 1: galinha_id obrigatório
    if (!dados.galinha_id || dados.galinha_id.trim() === '') {
        throw new Error('O ID da galinha é obrigatório.');
    }

    // Validação Crítica 2: data_postura obrigatória
    if (!dados.data_postura) {
        throw new Error('A data da postura é obrigatória.');
    }

    // Validação Crítica 3: quantidade obrigatória e deve ser inteiro > 0
    if (!dados.quantidade) {
        throw new Error('A quantidade de ovos é obrigatória.');
    }

    const quantidade = parseInt(dados.quantidade, 10);
    if (isNaN(quantidade) || quantidade <= 0) {
        throw new Error('A quantidade deve ser um número inteiro maior que zero.');
    }

    // Validação Opcional: peso_gramas (se fornecido, deve ser > 0)
    if (dados.peso_gramas !== undefined && dados.peso_gramas !== null && dados.peso_gramas !== '') {
        const peso = parseFloat(dados.peso_gramas);
        if (isNaN(peso) || peso <= 0) {
            throw new Error('O peso deve ser um número maior que zero.');
        }
    }

    try {
        // Normaliza os dados
        const dadosNormalizados = {
            galinha_id: dados.galinha_id.trim(),
            data_postura: dados.data_postura,
            quantidade: quantidade,
            peso_gramas: dados.peso_gramas ? parseFloat(dados.peso_gramas) : null,
            qualidade_casca: dados.qualidade_casca || null
        };

        const registroCriado = await repositorio.createRegistro(dadosNormalizados);
        return registroCriado;
    } catch (error) {
        console.error('Erro ao registrar ovo:', error.message);
        throw new Error('Não foi possível registrar o ovo. Verifique os dados e tente novamente.');
    }
}
