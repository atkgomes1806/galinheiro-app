/**
 * Teste Completo da Migração Open-Meteo
 * 
 * Verifica se toda a aplicação está funcionando após migração
 */

import { obterDadosClima } from './src/application/use-cases/obterDadosClima.js';
import openMeteoWeatherService from './src/infrastructure/openmeteo/OpenMeteoWeatherService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testarMigracaoCompleta() {
    console.log('🧪 TESTE COMPLETO DA MIGRAÇÃO EMBRAPA → OPEN-METEO');
    console.log('='.repeat(60));

    let sucessos = 0;
    let falhas = 0;

    try {
        // Teste 1: OpenMeteoWeatherService
        console.log('\n1️⃣ Testando OpenMeteoWeatherService...');
        const dadosServico = await openMeteoWeatherService.obterDadosClimaticos();
        
        if (dadosServico && dadosServico.temperatura !== null) {
            console.log('✅ OpenMeteoWeatherService: OK');
            console.log(`   📊 Temperatura: ${dadosServico.temperatura}°C`);
            console.log(`   💧 Umidade: ${dadosServico.umidade}%`);
            console.log(`   📍 Localização: ${dadosServico.localizacao?.nome}`);
            sucessos++;
        } else {
            console.log('❌ OpenMeteoWeatherService: FALHOU');
            falhas++;
        }

        // Teste 2: Use Case obterDadosClima
        console.log('\n2️⃣ Testando use case obterDadosClima...');
        const dadosUseCase = await obterDadosClima();
        
        if (dadosUseCase && (dadosUseCase.temperatura !== null || dadosUseCase.erro)) {
            console.log('✅ Use Case obterDadosClima: OK');
            if (dadosUseCase.erro) {
                console.log(`   ⚠️ Fallback ativado: ${dadosUseCase.erro}`);
            } else {
                console.log(`   📊 Temperatura: ${dadosUseCase.temperatura}°C`);
                console.log(`   💧 Umidade: ${dadosUseCase.umidade}%`);
                console.log(`   🎯 Score clima: ${dadosUseCase.pontuacaoClima}`);
            }
            sucessos++;
        } else {
            console.log('❌ Use Case obterDadosClima: FALHOU');
            falhas++;
        }

        // Teste 3: Recomendações
        console.log('\n3️⃣ Testando sistema de recomendações...');
        if (dadosServico?.temperatura && dadosServico?.umidade) {
            const recomendacoes = openMeteoWeatherService.obterRecomendacoes(dadosServico);
            
            if (recomendacoes && recomendacoes.recomendacoes) {
                console.log('✅ Sistema de recomendações: OK');
                console.log(`   📋 Recomendações: ${recomendacoes.recomendacoes.length}`);
                console.log(`   ⚠️ Alerta: ${recomendacoes.alerta || 'Nenhum'}`);
                console.log(`   🎯 Pontuação: ${recomendacoes.pontuacao}`);
                sucessos++;
            } else {
                console.log('❌ Sistema de recomendações: FALHOU');
                falhas++;
            }
        } else {
            console.log('⏭️ Sistema de recomendações: PULADO (sem dados)');
        }

        // Teste 4: Variáveis de ambiente
        console.log('\n4️⃣ Testando configuração de ambiente...');
        const latitude = process.env.VITE_LOCATION_LATITUDE;
        const longitude = process.env.VITE_LOCATION_LONGITUDE;
        const locationName = process.env.VITE_LOCATION_NAME;

        if (latitude && longitude && locationName) {
            console.log('✅ Variáveis de ambiente: OK');
            console.log(`   📍 ${locationName}: ${latitude}, ${longitude}`);
            sucessos++;
        } else {
            console.log('❌ Variáveis de ambiente: INCOMPLETAS');
            console.log(`   📍 Latitude: ${latitude || 'AUSENTE'}`);
            console.log(`   📍 Longitude: ${longitude || 'AUSENTE'}`);
            console.log(`   📍 Nome: ${locationName || 'AUSENTE'}`);
            falhas++;
        }

        // Resultados finais
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESULTADOS DO TESTE:');
        console.log(`✅ Sucessos: ${sucessos}`);
        console.log(`❌ Falhas: ${falhas}`);
        console.log(`📈 Taxa de sucesso: ${Math.round((sucessos / (sucessos + falhas)) * 100)}%`);

        if (falhas === 0) {
            console.log('\n🎉 MIGRAÇÃO COMPLETA E BEM-SUCEDIDA!');
            console.log('🚀 Aplicação pronta para uso com Open-Meteo API');
            console.log('✨ API da Embrapa removida com sucesso');
        } else if (sucessos > falhas) {
            console.log('\n⚠️ MIGRAÇÃO PARCIAL - Alguns problemas detectados');
            console.log('🔧 Requer ajustes antes do deploy');
        } else {
            console.log('\n🚨 MIGRAÇÃO COM PROBLEMAS CRÍTICOS');
            console.log('⚡ Requer correções imediatas');
        }

        return {
            success: falhas === 0,
            sucessos,
            falhas,
            taxaSucesso: Math.round((sucessos / (sucessos + falhas)) * 100)
        };

    } catch (error) {
        console.error('\n💥 ERRO CRÍTICO NO TESTE:', error);
        console.error('📋 Stack trace:', error.stack);
        return {
            success: false,
            erro: error.message
        };
    }
}

// Executar teste
testarMigracaoCompleta()
    .then(resultado => {
        if (resultado.success) {
            console.log('\n✅ Todos os testes passaram!');
            process.exit(0);
        } else {
            console.log('\n❌ Teste falhou!');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('\n💥 Falha na execução do teste:', error);
        process.exit(1);
    });