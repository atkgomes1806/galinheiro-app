import { supabase } from './client';
import RegistroOvoRepository from '../../domain/repositories/RegistroOvoRepository';

class RegistroOvoRepositorySupabase extends RegistroOvoRepository {
    /**
     * Busca todos os registros de ovos com join na tabela Galinhas
     * @param {string|null} galinhaId - ID da galinha para filtrar (opcional)
     * @returns {Promise<Array>} Lista de registros com nome da galinha
     */
    async fetchAllRegistros(galinhaId = null) {
        let query = supabase
            .from('Registros_Ovos')
            .select(`
                *,
                Galinhas (
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

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
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
            .from('Registros_Ovos')
            .insert([dados])
            .select(`
                *,
                Galinhas (
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
            .from('Registros_Ovos')
            .update(dados)
            .eq('id', id)
            .select(`
                *,
                Galinhas (
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
            .from('Registros_Ovos')
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
