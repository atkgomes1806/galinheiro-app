import { registroOvoRepository } from '../../infrastructure/config';

/**
 * Use Case: Remover registro de ovo
 * @param {string} id - ID do registro
 * @param {Object} repositorio - opcional (injeção)
 */
export async function removerRegistroOvo(id, repositorio = registroOvoRepository) {
    if (!id) {
        throw new Error('ID do registro é obrigatório.');
    }
    return repositorio.removerRegistro(id);
}

export default removerRegistroOvo;
