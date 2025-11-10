// Carregando variáveis de ambiente
import dotenv from 'dotenv';
dotenv.config();

// Teste simples para verificar dados do banco de dados
import { supabase } from './src/infrastructure/supabase/client.js';

async function testarDadosGalinhas() {
    try {
        console.log('🧪 Testando dados das galinhas...');
        
        // Buscar todas as galinhas
        const { data: galinhas, error } = await supabase
            .from('galinhas')
            .select('*')
            .order('nome', { ascending: true });

        if (error) {
            throw new Error(error.message);
        }

        console.log('\n� Dados das Galinhas:');
        console.log('='.repeat(50));
        
        console.log(`\n🐔 Total de galinhas no banco: ${galinhas.length}`);
        
        if (galinhas.length > 0) {
            console.log('\n📋 Lista das galinhas:');
            galinhas.forEach((galinha, index) => {
                console.log(`${index + 1}. ${galinha.nome} - Status: "${galinha.status || 'undefined'}" - Raça: ${galinha.raca || 'N/A'}`);
            });
            
            // Contar por status
            const ativas = galinhas.filter(g => g.status === 'Ativa' || !g.status).length;
            const inativas = galinhas.filter(g => g.status === 'Inativa').length;
            const emTratamento = galinhas.filter(g => g.status === 'Em Tratamento').length;
            
            console.log('\n📈 Contagem por Status:');
            console.log(`✅ Ativas (status='Ativa' ou null/undefined): ${ativas}`);
            console.log(`❌ Inativas (status='Inativa'): ${inativas}`);
            console.log(`💊 Em Tratamento (status='Em Tratamento'): ${emTratamento}`);
            console.log(`🔍 Outros: ${galinhas.length - ativas - inativas - emTratamento}`);
            
            console.log('\n🎯 Verificação:');
            console.log(`Total: ${galinhas.length}`);
            console.log(`Soma: ${ativas + inativas + emTratamento} + outros`);
        } else {
            console.log('⚠️ Nenhuma galinha encontrada no banco de dados');
        }
        
        console.log('\n🎉 Teste concluído!');
        
    } catch (error) {
        console.error('❌ Erro ao testar dados:', error);
        console.error(error.stack);
    }
}

testarDadosGalinhas();