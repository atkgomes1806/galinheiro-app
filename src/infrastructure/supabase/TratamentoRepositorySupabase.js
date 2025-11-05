import { supabase } from './client';
import TratamentoRepository from '../../domain/repositories/TratamentoRepository';

class TratamentoRepositorySupabase extends TratamentoRepository {
    /**
     * Busca todos os tratamentos com join na tabela Galinhas
     * @param {string|null} galinhaId - ID da galinha para filtrar (opcional)
     * @param {string|null} status - Status: 'Ativo' ou 'Concluido' (opcional)
     * @returns {Promise<Array>} Lista de tratamentos com nome da galinha
     */
    async fetchAllTratamentos(galinhaId = null, status = null) {
        // Primeira tentativa: com join (depende de FK configurada no banco)
        let query = supabase
            .from('tratamentos')
            .select(`
                *,
                galinhas (
                    id,
                    nome,
                    raca
                )
            `)
            .order('data_inicio', { ascending: false });

        // Filtro por galinha específica
        if (galinhaId) {
            query = query.eq('galinha_id', galinhaId);
        }

        // Filtro por status (Ativo = não concluído, Concluído = concluído)
        // No Supabase, concluido é text: 'false' ou 'true'
        if (status === 'Ativo') {
            query = query.eq('concluido', 'false');
        } else if (status === 'Concluido') {
            query = query.eq('concluido', 'true');
        }

        let { data, error } = await query;

        // Fallback: se não houver relação configurada (ou permissão), tenta sem join
        if (error) {
            let fallback = supabase
                .from('tratamentos')
                .select('*')
                .order('data_inicio', { ascending: false });

            if (galinhaId) {
                fallback = fallback.eq('galinha_id', galinhaId);
            }

            if (status === 'Ativo') {
                fallback = fallback.eq('concluido', 'false');
            } else if (status === 'Concluido') {
                fallback = fallback.eq('concluido', 'true');
            }

            const res = await fallback;
            if (res.error) {
                throw new Error(res.error.message);
            }
            return res.data;
        }

        return data;
    }

    /**
     * Cria um novo tratamento
     * @param {Object} dados - Dados do tratamento
     * @returns {Promise<Object>} Tratamento criado
     */
    async createTratamento(dados) {
        const { data, error } = await supabase
            .from('tratamentos')
            .insert([dados])
            .select(`
                *,
                galinhas (
                    id,
                    nome,
                    raca
                )
            `)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /**
     * Atualiza um tratamento existente
     * @param {string} id - ID do tratamento
     * @param {Object} dados - Dados atualizados
     * @returns {Promise<Object>} Tratamento atualizado
     */
    async atualizarTratamento(id, dados) {
        const { data, error } = await supabase
            .from('tratamentos')
            .update(dados)
            .eq('id', id)
            .select(`
                *,
                galinhas (
                    id,
                    nome,
                    raca
                )
            `)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /**
     * Remove um tratamento
     * @param {string} id - ID do tratamento
     * @returns {Promise<Object>} Tratamento removido
     */
    async removerTratamento(id) {
        const { data, error } = await supabase
            .from('tratamentos')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}

export default TratamentoRepositorySupabase;
