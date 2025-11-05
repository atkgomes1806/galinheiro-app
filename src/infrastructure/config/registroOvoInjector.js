import RegistroOvoRepositorySupabase from '../supabase/RegistroOvoRepositorySupabase';

// Instância única do repositório (Singleton Pattern)
export const registroOvoRepository = new RegistroOvoRepositorySupabase();
