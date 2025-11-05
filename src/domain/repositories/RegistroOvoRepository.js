/**
 * Interface do Repositório de Registros de Ovos
 * Define o contrato que deve ser implementado pela camada de infraestrutura
 */
class RegistroOvoRepository {
    /**
     * Busca todos os registros de ovos
     * @param {string|null} galinhaId - ID da galinha para filtrar (opcional)
     * @returns {Promise<Array>} Lista de registros de ovos
     */
    async fetchAllRegistros(galinhaId = null) {
        throw new Error('Método fetchAllRegistros() deve ser implementado');
    }

    /**
     * Cria um novo registro de ovo
     * @param {Object} dados - Dados do registro (galinha_id, data_postura, quantidade, etc.)
     * @returns {Promise<Object>} Registro criado
     */
    async createRegistro(dados) {
        throw new Error('Método createRegistro() deve ser implementado');
    }

    /**
     * Atualiza um registro de ovo existente
     * @param {string} id - ID do registro
     * @param {Object} dados - Dados atualizados
     * @returns {Promise<Object>} Registro atualizado
     */
    async atualizarRegistro(id, dados) {
        throw new Error('Método atualizarRegistro() deve ser implementado');
    }

    /**
     * Remove um registro de ovo
     * @param {string} id - ID do registro
     * @returns {Promise<Object>} Registro removido
     */
    async removerRegistro(id) {
        throw new Error('Método removerRegistro() deve ser implementado');
    }
}

export default RegistroOvoRepository;
