import { supabase } from './client';
import GalinhaRepository from '../../domain/repositories/GalinhaRepository';

class GalinhaRepositorySupabase extends GalinhaRepository {
    async fetchAllGalinhas() {
        const { data, error } = await supabase
            .from('Galinhas')
            .select('*')
            .order('nome', { ascending: true });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async createGalinha(dados) {
        const { data, error } = await supabase
            .from('Galinhas')
            .insert([dados])
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async atualizarGalinha(id, dados) {
        const { data, error } = await supabase
            .from('Galinhas')
            .update(dados)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async removerGalinha(id) {
        const { data, error } = await supabase
            .from('Galinhas')
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

export default GalinhaRepositorySupabase;