// Teste usando fetch direto para o Supabase REST API
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function testarDadosGalinhas() {
    try {
        console.log('🧪 Testando dados das galinhas...');
        
        // Buscar todas as galinhas via REST API
        const response = await fetch(`${SUPABASE_URL}/rest/v1/galinhas?order=nome.asc`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const galinhas = await response.json();

        console.log('\n📊 Dados das Galinhas:');
        console.log('='.repeat(50));
        
        console.log(`\n🐔 Total de galinhas no banco: ${galinhas.length}`);
        
        if (galinhas.length > 0) {
            console.log('\n📋 Lista das galinhas:');
            galinhas.forEach((galinha, index) => {
                console.log(`${index + 1}. ${galinha.nome} - Status: "${galinha.status || 'undefined'}" - Raça: ${galinha.raca || 'N/A'}`);
            });
            
            // Contar por status (considerando aspas simples literais)
            const ativas = galinhas.filter(g => 
                g.status === 'Ativa' || 
                g.status === "'Ativa'" || 
                !g.status
            ).length;
            const inativas = galinhas.filter(g => 
                g.status === 'Inativa' || 
                g.status === "'Inativa'"
            ).length;
            const emTratamento = galinhas.filter(g => 
                g.status === 'Em Tratamento' || 
                g.status === "'Em Tratamento'"
            ).length;
            
            console.log('\n📈 Contagem por Status (lógica corrigida):');
            console.log(`✅ Ativas (status='Ativa' ou null/undefined): ${ativas}`);
            console.log(`❌ Inativas (status='Inativa'): ${inativas}`);
            console.log(`💊 Em Tratamento (status='Em Tratamento'): ${emTratamento}`);
            console.log(`🔍 Outros: ${galinhas.length - ativas - inativas - emTratamento}`);
            
            console.log('\n🎯 Verificação da correção aplicada:');
            console.log(`Total de galinhas: ${galinhas.length}`);
            console.log(`Galinhas ativas: ${ativas}`);
            console.log(`Galinhas inativas: ${inativas}`);
            
            // Simular o que o dashboard vai mostrar agora
            console.log('\n🖥️ O que o dashboard vai exibir:');
            console.log(`📊 Total: ${galinhas.length}`);
            console.log(`✅ Ativas: ${ativas}`);
            console.log(`❌ Inativas: ${inativas}`);
            
            if (ativas !== galinhas.length) {
                console.log('✅ CORREÇÃO APLICADA: Agora as contagens de ativas e total são diferentes!');
            } else {
                console.log('⚠️ ATENÇÃO: Todas as galinhas são ativas ou a lógica ainda precisa ajuste');
            }
            
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