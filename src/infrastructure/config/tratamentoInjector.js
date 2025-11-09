import TratamentoRepositorySupabase from '../supabase/TratamentoRepositorySupabase';

// Instância única do repositório (Singleton Pattern)
export const tratamentoRepository = new TratamentoRepositorySupabase();
