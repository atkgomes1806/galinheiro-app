import GalinhaRepositorySupabase from '../supabase/GalinhaRepositorySupabase';

// Instância única do repositório (Singleton Pattern)
export const galinhaRepository = new GalinhaRepositorySupabase();
