/**
 * Caso de Uso: Obter Dados Climáticos da Embrapa
 * 
 * Camada de Aplicação - Clean Architecture
 * 
 * Responsável por:
 * - Orquestrar busca de dados climáticos
 * - Aplicar regras de negócio da aplicação
 * - Fornecer interface simples para a camada de apresentação
 */

import embrapaWeatherService from '../../infrastructure/embrapa/EmbrapaWeatherService';

/**
 * Obtém dados climáticos para o galinheiro
 * @returns {Promise<Object>} Dados climáticos formatados
 */
export async function obterDadosClimaEmbrapa() {
  try {
    // Obter coordenadas da localização do galinheiro
    const latitude = parseFloat(import.meta.env.VITE_LOCATION_LATITUDE || '-23.5505');
    const longitude = parseFloat(import.meta.env.VITE_LOCATION_LONGITUDE || '-46.6333');
    const locationName = import.meta.env.VITE_LOCATION_NAME || 'Localização';

    console.log(`🌍 Buscando clima para: ${locationName} (${latitude}, ${longitude})`);

    // Buscar dados via serviço de infraestrutura
    const dados = await embrapaWeatherService.getWeatherData(latitude, longitude);

    // Adicionar informações adicionais
    return {
      ...dados,
      localizacao: locationName,
      coordenadas: {
        latitude,
        longitude
      }
    };
  } catch (error) {
    console.error('❌ Erro no caso de uso obterDadosClimaEmbrapa:', error);
    throw new Error(`Não foi possível obter dados climáticos: ${error.message}`);
  }
}

/**
 * Força atualização dos dados climáticos (ignora cache)
 * @returns {Promise<Object>} Dados climáticos atualizados
 */
export async function atualizarDadosClimaEmbrapa() {
  console.log('🔄 Forçando atualização dos dados climáticos...');
  embrapaWeatherService.clearCache();
  return await obterDadosClimaEmbrapa();
}
