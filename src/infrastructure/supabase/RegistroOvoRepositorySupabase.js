import { supabase } from './client';
import RegistroOvoRepository from '../../domain/repositories/RegistroOvoRepository';

class RegistroOvoRepositorySupabase extends RegistroOvoRepository {
    /**
     * Busca todos os registros de ovos com join na tabela Galinhas
     * @param {string|null} galinhaId - ID da galinha para filtrar (opcional)
     * @returns {Promise<Array>} Lista de registros com nome da galinha
     */
    async fetchAllRegistros(galinhaId = null) {
        // Primeira tentativa: com join (depende de FK configurada no banco)
        let query = supabase
            .from('registros_ovos')
            .select(`
                *,
                galinhas (
                    id,
                    nome,
                    raca
                )
            `)
            .order('data_postura', { ascending: false });

        // Filtro opcional por galinha específica
        if (galinhaId) {
            query = query.eq('galinha_id', galinhaId);
        }

        let { data, error } = await query;

        // Fallback: se não houver relação configurada (ou permissão), tenta sem join
        if (error) {
            // Tenta novamente sem join para não quebrar a aplicação
            let fallback = supabase
                .from('registros_ovos')
                .select('*')
                .order('data_postura', { ascending: false });

            if (galinhaId) {
                fallback = fallback.eq('galinha_id', galinhaId);
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
     * Cria um novo registro de ovo
     * @param {Object} dados - Dados do registro
     * @returns {Promise<Object>} Registro criado
     */
    async createRegistro(dados) {
        const { data, error } = await supabase
            .from('registros_ovos')
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
     * Atualiza um registro de ovo existente
     * @param {string} id - ID do registro
     * @param {Object} dados - Dados atualizados
     * @returns {Promise<Object>} Registro atualizado
     */
    async atualizarRegistro(id, dados) {
        const { data, error } = await supabase
            .from('registros_ovos')
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
     * Remove um registro de ovo
     * @param {string} id - ID do registro
     * @returns {Promise<Object>} Registro removido
     */
    async removerRegistro(id) {
        const { data, error } = await supabase
            .from('registros_ovos')
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

export default RegistroOvoRepositorySupabase;
