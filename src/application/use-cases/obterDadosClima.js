/**
 * Use Case: Obter Dados Climáticos Open-Meteo
 * 
 * Substitui o use case da Embrapa pela Open-Meteo API
 * 
 * @description Obtém dados meteorológicos para suporte ao manejo do galinheiro
 */

import openMeteoWeatherService from '../../infrastructure/openmeteo/OpenMeteoWeatherService.js';

/**
 * Obtém dados climáticos atuais da Open-Meteo API
 * @returns {Promise<Object>} Dados climáticos e recomendações
 */
export async function obterDadosClima() {
    try {
        console.log('🌦️ Iniciando obtenção de dados climáticos...');

        // Buscar dados meteorológicos
        const dadosClima = await openMeteoWeatherService.obterDadosClimaticos();
        
        // Obter recomendações baseadas no clima
        const recomendacoes = openMeteoWeatherService.obterRecomendacoes(dadosClima);
        
        // Combinar dados e recomendações
        const resultado = {
            ...dadosClima,
            recomendacoes: recomendacoes.recomendacoes,
            alerta: recomendacoes.alerta,
            corAlerta: recomendacoes.cor,
            pontuacaoClima: recomendacoes.pontuacao,
            dataConsulta: new Date().toISOString()
        };

        console.log('✅ Dados climáticos obtidos com sucesso');
        return resultado;

    } catch (error) {
        console.error('❌ Erro ao obter dados climáticos:', error);
        
        // Retornar dados de fallback em caso de erro
        return {
            temperatura: null,
            umidade: null,
            erro: 'Não foi possível obter dados climáticos no momento',
            fonte: 'Erro na consulta',
            status: 'error',
            dataConsulta: new Date().toISOString()
        };
    }
}

/**
 * Força atualização dos dados climáticos (ignora cache)
 * @returns {Promise<Object>} Dados climáticos atualizados
 */
export async function atualizarDadosClima() {
    try {
        console.log('🔄 Forçando atualização dos dados climáticos...');
        
        // A Open-Meteo sempre retorna dados frescos, não tem cache local
        return await obterDadosClima();
        
    } catch (error) {
        console.error('❌ Erro ao atualizar dados climáticos:', error);
        throw error;
    }
}