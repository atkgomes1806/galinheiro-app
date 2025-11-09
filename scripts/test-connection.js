// Script de teste de conexão com Supabase
import { supabase } from './src/infrastructure/supabase/client.js';

async function testarConexao() {
    console.log('🔍 Testando conexão com Supabase...\n');

    try {
        // Teste 1: Buscar galinhas
        console.log('📊 Teste 1: Buscando galinhas...');
        const { data: galinhas, error: errorGalinhas } = await supabase
            .from('galinhas')
            .select('*')
            .limit(5);

        if (errorGalinhas) {
            console.error('❌ Erro ao buscar galinhas:', errorGalinhas.message);
        } else {
            console.log(`✅ Galinhas encontradas: ${galinhas.length}`);
            if (galinhas.length > 0) {
                console.log('   Exemplo:', galinhas[0]);
            }
        }

        // Teste 2: Buscar registros de ovos
        console.log('\n📊 Teste 2: Buscando registros de ovos...');
        const { data: registros, error: errorRegistros } = await supabase
            .from('registros_ovos')
            .select('*, galinhas(nome)')
            .limit(5);

        if (errorRegistros) {
            console.error('❌ Erro ao buscar registros:', errorRegistros.message);
        } else {
            console.log(`✅ Registros encontrados: ${registros.length}`);
            if (registros.length > 0) {
                console.log('   Exemplo:', registros[0]);
            }
        }

        // Teste 3: Buscar tratamentos
        console.log('\n📊 Teste 3: Buscando tratamentos...');
        const { data: tratamentos, error: errorTratamentos } = await supabase
            .from('tratamentos')
            .select('*, galinhas(nome)')
            .limit(5);

        if (errorTratamentos) {
            console.error('❌ Erro ao buscar tratamentos:', errorTratamentos.message);
        } else {
            console.log(`✅ Tratamentos encontrados: ${tratamentos.length}`);
            if (tratamentos.length > 0) {
                console.log('   Exemplo:', tratamentos[0]);
            }
        }

        console.log('\n🎉 Testes concluídos!');
    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

testarConexao();
