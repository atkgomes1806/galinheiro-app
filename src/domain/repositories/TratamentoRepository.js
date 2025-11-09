/**
 * Interface do Repositório de Tratamentos
 * Define o contrato que deve ser implementado pela camada de infraestrutura
 */
class TratamentoRepository {
    /**
     * Busca todos os tratamentos com filtros opcionais
     * @param {string|null} galinhaId - ID da galinha para filtrar (opcional)
     * @param {string|null} status - Status do tratamento: 'Ativo' ou 'Concluido' (opcional)
     * @returns {Promise<Array>} Lista de tratamentos
     */
    async fetchAllTratamentos(galinhaId = null, status = null) {
        throw new Error('Método fetchAllTratamentos() deve ser implementado');
    }

    /**
     * Cria um novo tratamento
     * @param {Object} dados - Dados do tratamento
     * @returns {Promise<Object>} Tratamento criado
     */
    async createTratamento(dados) {
        throw new Error('Método createTratamento() deve ser implementado');
    }

    /**
     * Atualiza um tratamento existente
     * @param {string} id - ID do tratamento
     * @param {Object} dados - Dados atualizados
     * @returns {Promise<Object>} Tratamento atualizado
     */
    async atualizarTratamento(id, dados) {
        throw new Error('Método atualizarTratamento() deve ser implementado');
    }

    /**
     * Remove um tratamento
     * @param {string} id - ID do tratamento
     * @returns {Promise<Object>} Tratamento removido
     */
    async removerTratamento(id) {
        throw new Error('Método removerTratamento() deve ser implementado');
    }
}

export default TratamentoRepository;
