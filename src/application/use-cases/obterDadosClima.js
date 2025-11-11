/**
 * Use Case: Obter Dados Climáticos Open-Meteo
 * 
 * Substitui o use case da Embrapa pela Open-Meteo API
 * Suporta geolocalização dinâmica do usuário
 * 
 * @description Obtém dados meteorológicos para suporte ao manejo do galinheiro
 */

import openMeteoWeatherService from '../../infrastructure/openmeteo/OpenMeteoWeatherService.js';

/**
 * Obtém dados climáticos atuais da Open-Meteo API
 * @param {Object} customLocation - Coordenadas opcionais {latitude, longitude, locationName}
 * @returns {Promise<Object>} Dados climáticos e recomendações
 */
export async function obterDadosClima(customLocation = null) {
    try {
        console.log('🌦️ Iniciando obtenção de dados climáticos...');

        // Se coordenadas personalizadas foram fornecidas, atualizar serviço
        if (customLocation?.latitude && customLocation?.longitude) {
            console.log(`📍 Usando localização personalizada: ${customLocation.locationName || 'GPS'}`);
        }

        // Buscar dados meteorológicos
        const dadosClima = await openMeteoWeatherService.obterDadosClimaticos(customLocation);
        
        // Obter recomendações baseadas no clima
        const recomendacoes = openMeteoWeatherService.obterRecomendacoes(dadosClima);
        
        // Combinar dados e recomendações
        const resultado = {
            ...dadosClima,
            recomendacoes: recomendacoes.recomendacoes,
            alerta: recomendacoes.alerta,
            corAlerta: recomendacoes.cor,
            pontuacaoClima: recomendacoes.pontuacao,
            dataConsulta: new Date().toISOString(),
            usingGPS: !!customLocation // Indicador se está usando GPS
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
            dataConsulta: new Date().toISOString(),
            usingGPS: false
        };
    }
}

/**
 * Força atualização dos dados climáticos (ignora cache)
 * @param {Object} customLocation - Coordenadas opcionais
 * @returns {Promise<Object>} Dados climáticos atualizados
 */
export async function atualizarDadosClima(customLocation = null) {
    try {
        console.log('🔄 Forçando atualização dos dados climáticos...');
        
        // A Open-Meteo sempre retorna dados frescos, não tem cache local
        return await obterDadosClima(customLocation);
        
    } catch (error) {
        console.error('❌ Erro ao atualizar dados climáticos:', error);
        throw error;
    }
}

/**
 * Obtém dados climáticos usando coordenadas GPS do usuário
 * @param {number} latitude - Latitude GPS
 * @param {number} longitude - Longitude GPS  
 * @param {string} locationName - Nome da localização
 * @returns {Promise<Object>} Dados climáticos da localização GPS
 */
export async function obterDadosClimaPorGPS(latitude, longitude, locationName = null) {
    const customLocation = {
        latitude,
        longitude,
        locationName: locationName || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
    };
    
    return await obterDadosClima(customLocation);
}