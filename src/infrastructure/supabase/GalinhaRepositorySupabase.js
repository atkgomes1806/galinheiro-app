import { supabase } from './client';
import GalinhaRepository from '../../domain/repositories/GalinhaRepository';

class GalinhaRepositorySupabase extends GalinhaRepository {
    async fetchAllGalinhas() {
        const { data, error } = await supabase
            .from('galinhas')
            .select('*')
            .order('nome', { ascending: true });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async createGalinha(dados) {
        const { data, error } = await supabase
            .from('galinhas')
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
            .from('galinhas')
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
            .from('galinhas')
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