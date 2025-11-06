import { createClient } from '@supabase/supabase-js';

// Suporte tanto para Vite (import.meta.env) quanto Node (process.env)
const viteEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const supabaseUrl = viteEnv.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = viteEnv.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn('[Supabase] Variáveis de ambiente ausentes: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (ou correspondentes em process.env).');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');