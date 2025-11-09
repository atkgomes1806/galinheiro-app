/**
 * Rotas da API de Clima
 * 
 * Endpoints para obter dados climáticos da API Embrapa
 */

import express from 'express';
import fetch from 'node-fetch';
import authService from '../services/embrapaAuth.js';

// Função para obter config dinamicamente (após dotenv)
function getConfig() {
  return {
    tokenURL: process.env.EMBRAPA_TOKEN_URL || 'https://api.cnptia.embrapa.br/token',
    apiURL: process.env.EMBRAPA_API_URL || 'https://api.cnptia.embrapa.br/climapi/v1',
    consumerKey: process.env.EMBRAPA_CONSUMER_KEY,
    consumerSecret: process.env.EMBRAPA_CONSUMER_SECRET,
    tokenCacheDuration: 55 * 60 * 1000,
    dataCacheDuration: 30 * 60 * 1000,
  };
}

const router = express.Router();

// Cache de dados climáticos
const dataCache = new Map();

/**
 * Gera dados climáticos simulados (fallback) quando API real falha
 */
function generateFallbackWeather(latitude, longitude) {
  const now = new Date();
  const hour = now.getHours();
  const baseTemp = 22;
  const tempVariation = Math.sin((hour / 24) * Math.PI * 2) * 5;
  const temperatura = baseTemp + tempVariation;
  const baseHumidity = 60;
  const humidityVariation = Math.cos((hour / 24) * Math.PI * 2) * 15;
  const umidade = baseHumidity + humidityVariation;
  return {
    temperatura: Number(temperatura.toFixed(1)),
    umidade: Number(umidade.toFixed(0)),
    localizacao: { latitude, longitude },
    modeloExecutado: 'SIMULATED',
    timestamp: now.toISOString(),
    fonte: 'Fallback Simulado (API Embrapa indisponível)',
    isDemoData: true
  };
}

/**
 * Helper: Limpa cache expirado
 */
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, value] of dataCache.entries()) {
    if (now > value.expiresAt) {
      dataCache.delete(key);
    }
  }
}

/**
 * Helper: Obtém dados do cache ou da API
 */
async function getCachedOrFetch(cacheKey, fetchFn) {
  // Limpar cache expirado
  cleanExpiredCache();
  
  // Verificar se existe em cache
  if (dataCache.has(cacheKey)) {
    const cached = dataCache.get(cacheKey);
    if (Date.now() < cached.expiresAt) {
      console.log('✅ Usando dados do cache');
      return cached.data;
    }
  }
  
  // Buscar dados novos
  console.log('🔄 Buscando dados da API Embrapa...');
  const data = await fetchFn();
  
  // Armazenar em cache
  dataCache.set(cacheKey, {
    data,
    expiresAt: Date.now() + getConfig().dataCacheDuration
  });
  
  return data;
}

/**
 * Helper: Formata data para API (YYYY-MM-DD) - Swagger especifica ISO 8601
 */
function getModelRunDate() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  
  // API Embrapa aceita data no formato ISO 8601 (YYYY-MM-DD)
  // Usa o dia atual por padrão
  return `${year}-${month}-${day}`;
}

/**
 * GET /api/weather/data
 * Obtém dados climáticos (temperatura e umidade)
 * 
 * Query params:
 * - lat: latitude (obrigatório)
 * - lon: longitude (obrigatório)
 */
router.get('/data', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    // Validação
    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Parâmetros obrigatórios faltando',
        required: ['lat', 'lon']
      });
    }
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Parâmetros inválidos',
        message: 'lat e lon devem ser números válidos'
      });
    }
    
    console.log(`📍 Buscando clima para: lat=${latitude}, lon=${longitude}`);
    
    // Data do modelo
    const modelDate = getModelRunDate();
    console.log(`📅 Data do modelo: ${modelDate}`);
    
    // Cache key
    const cacheKey = `weather-${latitude}-${longitude}-${modelDate}`;
    
    // Buscar dados (cache ou API)
    const weatherData = await getCachedOrFetch(cacheKey, async () => {
      console.log('🔐 Obtendo token de acesso...');
      const token = await authService.getValidToken();
      console.log('✅ Token obtido:', token ? 'PRESENTE' : 'AUSENTE');
      
      // Buscar temperatura (usando tmpsfc conforme Swagger)
      const tempURL = `${getConfig().apiURL}/ncep-gfs/tmpsfc/${modelDate}/${longitude}/${latitude}`;
      console.log('🌡️ Buscando temperatura:', tempURL);
      
      const tempResponse = await fetch(tempURL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('🌡️ Status da resposta de temperatura:', tempResponse.status);
      
      if (!tempResponse.ok) {
        const errorText = await tempResponse.text();
        console.error('❌ Erro na resposta de temperatura:', errorText);
        throw new Error(`Erro ao buscar temperatura: ${tempResponse.status}`);
      }
      
      const tempData = await tempResponse.json();
      console.log('🌡️ Dados de temperatura recebidos:', tempData);
      
      // Buscar umidade (ordem correta: longitude, latitude)
      const humidityURL = `${getConfig().apiURL}/ncep-gfs/rh2m/${modelDate}/${longitude}/${latitude}`;
      console.log('💧 Buscando umidade:', humidityURL);
      
      const humidityResponse = await fetch(humidityURL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('💧 Status da resposta de umidade:', humidityResponse.status);
      
      if (!humidityResponse.ok) {
        const errorText = await humidityResponse.text();
        console.error('❌ Erro na resposta de umidade:', errorText);
        throw new Error(`Erro ao buscar umidade: ${humidityResponse.status}`);
      }
      
      const humidityData = await humidityResponse.json();
      console.log('💧 Dados de umidade recebidos:', humidityData);
      
      // Processar dados
      const tempKelvin = tempData[0]?.valor || tempData[0]?.temperatura;
      const tempCelsius = tempKelvin - 273.15;
      const humidity = humidityData[0]?.valor || humidityData[0]?.umidade;
      
      console.log('🔄 Processando dados:', { tempKelvin, tempCelsius, humidity });
      
      return {
        temperatura: Number(tempCelsius.toFixed(1)),
        umidade: Number(humidity.toFixed(0)),
        localizacao: { latitude, longitude },
        modeloExecutado: modelDate,
        timestamp: new Date().toISOString()
      };
    });
    
    console.log('✅ Dados climáticos obtidos com sucesso');
    res.json(weatherData);
    
  } catch (error) {
    console.error('❌ Erro ao obter dados climáticos:', error.message);
    // Fallback: retornar dados simulados para não quebrar UI
    try {
      const { lat, lon } = req.query;
      if (lat && lon) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        const simulated = generateFallbackWeather(latitude, longitude);
        console.warn('⚠️ Retornando dados simulados de fallback.');
        return res.status(200).json(simulated);
      }
    } catch (e) {
      console.error('Erro ao gerar fallback simulado:', e.message);
    }
    res.status(500).json({
      error: 'Erro ao obter dados climáticos',
      message: error.message,
      fallbackDisponivel: false
    });
  }
});

/**
 * GET /api/weather/test-alternatives
 * Testa estruturas alternativas da API Embrapa
 */
router.get('/test-alternatives', async (req, res) => {
  try {
    const token = await authService.getValidToken();
    const results = [];
    
    // Testar diferentes versões e estruturas
    const baseUrls = [
      'https://api.cnptia.embrapa.br/climapi/v1',
      'https://api.cnptia.embrapa.br/climapi/v2',
      'https://api.cnptia.embrapa.br/agritecapi/v1',
      'https://api.cnptia.embrapa.br/clima/v1',
      'https://api.cnptia.embrapa.br'
    ];
    
    const endpoints = [
      '',
      '/info',
      '/status',
      '/health',
      '/swagger',
      '/doc',
      '/api-docs'
    ];
    
    for (const baseUrl of baseUrls) {
      for (const endpoint of endpoints) {
        try {
          const url = `${baseUrl}${endpoint}`;
          console.log(`🧪 Testando: ${url}`);
          
          const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          const contentType = response.headers.get('content-type') || '';
          let responseData = null;
          
          if (response.ok) {
            try {
              if (contentType.includes('json')) {
                responseData = await response.json();
              } else {
                responseData = await response.text();
              }
            } catch (e) {
              responseData = 'Erro ao ler resposta';
            }
          }
          
          results.push({
            url,
            status: response.status,
            success: response.ok,
            contentType,
            data: response.ok ? responseData : await response.text()
          });
          
          console.log(`📊 ${url}: Status ${response.status} - ${response.ok ? 'OK' : 'FAIL'}`);
          
          // Se encontrou algo que funciona, para de testar
          if (response.ok && responseData) {
            console.log(`✅ SUCESSO encontrado em: ${url}`);
            break;
          }
        } catch (error) {
          results.push({
            url: `${baseUrl}${endpoint}`,
            status: 'ERROR',
            success: false,
            error: error.message
          });
          console.error(`❌ ${baseUrl}${endpoint}: ${error.message}`);
        }
      }
    }
    
    res.json({
      message: 'Teste de estruturas alternativas concluído',
      timestamp: new Date().toISOString(),
      totalTested: results.length,
      successful: results.filter(r => r.success).length,
      results: results.filter(r => r.success || r.status !== 404) // Mostrar só resultados interessantes
    });
    
  } catch (error) {
    console.error('❌ Erro nos testes alternativos:', error.message);
    res.status(500).json({
      error: 'Erro nos testes alternativos',
      message: error.message
    });
  }
});

/**
 * POST /api/weather/clear-cache
 * Limpa cache (forçar atualização de dados)
 */
router.post('/clear-cache', (req, res) => {
  dataCache.clear();
  authService.clearToken();
  console.log('🗑️ Cache limpo manualmente');
  res.json({
    message: 'Cache limpo com sucesso',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/weather/test-swagger
 * Testa estrutura correta da API baseada na documentação Swagger encontrada
 */
router.get('/test-swagger', async (req, res) => {
  try {
    console.log('\n🎯 === TESTE #4: ESTRUTURA CORRETA SWAGGER ===');
    
    const latitude = '-23.5505';  // São Paulo
    const longitude = '-46.6333'; // São Paulo
    const modelDate = getModelRunDate(); // Agora retorna YYYY-MM-DD
    
    console.log(`📋 Teste baseado no Swagger encontrado`);
    console.log(`📍 Local: São Paulo (lat: ${latitude}, lon: ${longitude})`);
    console.log(`📅 Data formatada (ISO 8601): ${modelDate}`);
    console.log(`🔄 Estrutura correta: /ncep-gfs/{variavel}/{data}/{longitude}/{latitude}`);
    
    // Obter token
    console.log('\n🔐 Obtendo token de acesso...');
    const token = await authService.getValidToken();
    
    if (!token) {
      throw new Error('Falha na autenticação');
    }
    
    console.log(`✅ Token obtido com sucesso!`);
    
    // URLs corretas baseadas no Swagger
    const tempURL = `${getConfig().apiURL}/ncep-gfs/tmpsfc/${modelDate}/${longitude}/${latitude}`;
    const humidityURL = `${getConfig().apiURL}/ncep-gfs/rh2m/${modelDate}/${longitude}/${latitude}`;
    const healthURL = `${getConfig().apiURL}/health`;
    const variablesURL = `${getConfig().apiURL}/ncep-gfs`;
    
    const testResults = [];
    
    // Teste 1: Health Check
    console.log('\n🏥 Testando Health Check...');
    try {
      const healthResponse = await fetch(healthURL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`🏥 Health Status: ${healthResponse.status}`);
      testResults.push({
        endpoint: 'health',
        url: healthURL,
        status: healthResponse.status,
        success: healthResponse.ok
      });
    } catch (error) {
      console.error('❌ Erro no health check:', error.message);
      testResults.push({
        endpoint: 'health',
        url: healthURL,
        status: 'ERROR',
        error: error.message,
        success: false
      });
    }
    
    // Teste 2: Lista de variáveis NCEP-GFS
    console.log('\n📋 Testando lista de variáveis...');
    try {
      const variablesResponse = await fetch(variablesURL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`📋 Variables Status: ${variablesResponse.status}`);
      
      if (variablesResponse.ok) {
        const variablesData = await variablesResponse.text();
        console.log('📋 Variáveis disponíveis:', variablesData.substring(0, 200) + '...');
      }
      
      testResults.push({
        endpoint: 'variables',
        url: variablesURL,
        status: variablesResponse.status,
        success: variablesResponse.ok
      });
    } catch (error) {
      console.error('❌ Erro na lista de variáveis:', error.message);
      testResults.push({
        endpoint: 'variables',
        url: variablesURL,
        status: 'ERROR',
        error: error.message,
        success: false
      });
    }
    
    // Teste 3: Temperatura com estrutura correta
    console.log('\n🌡️ Testando temperatura (tmpsfc)...');
    try {
      const tempResponse = await fetch(tempURL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`🌡️ Temperature Status: ${tempResponse.status}`);
      
      if (tempResponse.ok) {
        const tempData = await tempResponse.text();
        console.log('🌡️ Dados de temperatura:', tempData.substring(0, 200) + '...');
      } else {
        const errorText = await tempResponse.text();
        console.log('🌡️ Erro temperatura:', errorText.substring(0, 200) + '...');
      }
      
      testResults.push({
        endpoint: 'temperature',
        url: tempURL,
        status: tempResponse.status,
        success: tempResponse.ok
      });
    } catch (error) {
      console.error('❌ Erro na temperatura:', error.message);
      testResults.push({
        endpoint: 'temperature',
        url: tempURL,
        status: 'ERROR',
        error: error.message,
        success: false
      });
    }
    
    // Teste 4: Umidade com estrutura correta
    console.log('\n💧 Testando umidade (rh2m)...');
    try {
      const humidityResponse = await fetch(humidityURL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`💧 Humidity Status: ${humidityResponse.status}`);
      
      if (humidityResponse.ok) {
        const humidityData = await humidityResponse.text();
        console.log('💧 Dados de umidade:', humidityData.substring(0, 200) + '...');
      } else {
        const errorText = await humidityResponse.text();
        console.log('💧 Erro umidade:', errorText.substring(0, 200) + '...');
      }
      
      testResults.push({
        endpoint: 'humidity',
        url: humidityURL,
        status: humidityResponse.status,
        success: humidityResponse.ok
      });
    } catch (error) {
      console.error('❌ Erro na umidade:', error.message);
      testResults.push({
        endpoint: 'humidity',
        url: humidityURL,
        status: 'ERROR',
        error: error.message,
        success: false
      });
    }
    
    console.log('\n📊 Resumo dos testes:');
    testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.endpoint}: ${result.status} - ${result.url}`);
    });
    
    const successCount = testResults.filter(r => r.success).length;
    console.log(`\n🎯 Resultado final: ${successCount}/${testResults.length} testes bem-sucedidos`);
    
    res.json({
      message: 'Teste com estrutura Swagger concluído',
      testInfo: {
        date: modelDate,
        location: { latitude, longitude },
        structure: '/ncep-gfs/{variavel}/{data}/{longitude}/{latitude}'
      },
      results: testResults,
      successRate: `${successCount}/${testResults.length}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro geral no teste Swagger:', error);
    res.status(500).json({
      error: 'Erro no teste Swagger',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/weather/data-real
 * Obtém dados climáticos REAIS usando token Bearer (não OAuth)
 * 
 * Query params:
 * - lat: latitude (obrigatório)
 * - lon: longitude (obrigatório)
 */
router.get('/data-real', async (req, res) => {
  try {
    const { lat: latitude, lon: longitude } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Parâmetros lat e lon são obrigatórios',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('\n🎯 === DADOS REAIS COM TOKEN BEARER ===');
    console.log(`📍 Buscando clima REAL para: lat=${latitude}, lon=${longitude}`);
    
    const modelDate = getModelRunDate(); // YYYY-MM-DD
    console.log(`📅 Data do modelo: ${modelDate}`);
    
    // Token Bearer fornecido pelo usuário
    const bearerToken = '724ecc90-70b1-36c1-b573-c5b01d6173ea';
    
    // URLs corretas baseadas no Swagger
    const tempURL = `${getConfig().apiURL}/ncep-gfs/tmpsfc/${modelDate}/${longitude}/${latitude}`;
    const humidityURL = `${getConfig().apiURL}/ncep-gfs/rh2m/${modelDate}/${longitude}/${latitude}`;
    
    console.log('🌡️ Buscando temperatura:', tempURL);
    console.log('💧 Buscando umidade:', humidityURL);
    
    // Buscar temperatura
    const tempResponse = await fetch(tempURL, {
      headers: { 'Authorization': `Bearer ${bearerToken}` }
    });
    
    console.log('🌡️ Status da resposta de temperatura:', tempResponse.status);
    
    if (!tempResponse.ok) {
      console.error('❌ Erro na temperatura:', tempResponse.status);
      throw new Error(`Erro ao buscar temperatura: ${tempResponse.status}`);
    }
    
    const tempData = await tempResponse.json();
    console.log('🌡️ Dados de temperatura:', tempData);
    
    // Buscar umidade
    const humidityResponse = await fetch(humidityURL, {
      headers: { 'Authorization': `Bearer ${bearerToken}` }
    });
    
    console.log('💧 Status da resposta de umidade:', humidityResponse.status);
    
    if (!humidityResponse.ok) {
      console.error('❌ Erro na umidade:', humidityResponse.status);
      throw new Error(`Erro ao buscar umidade: ${humidityResponse.status}`);
    }
    
    const humidityData = await humidityResponse.json();
    console.log('💧 Dados de umidade:', humidityData);
    
    // Processar dados (pegar o valor mais recente ou atual)
    const currentTemp = tempData && tempData.length > 0 ? tempData[0].valor : null;
    const currentHumidity = humidityData && humidityData.length > 0 ? humidityData[0].valor : null;
    
    if (currentTemp === null || currentHumidity === null) {
      throw new Error('Dados incompletos recebidos da API');
    }
    
    const weatherData = {
      temperatura: Number(currentTemp.toFixed(1)),
      umidade: Number(currentHumidity.toFixed(0)),
      localizacao: { 
        latitude: Number(latitude), 
        longitude: Number(longitude) 
      },
      modeloExecutado: modelDate,
      timestamp: new Date().toISOString(),
      fonte: 'API Embrapa ClimAPI (Dados Reais)',
      isDemoData: false,
      rawData: {
        temperatura: tempData,
        umidade: humidityData
      }
    };
    
    console.log('✅ Dados climáticos REAIS processados:', {
      temperatura: weatherData.temperatura,
      umidade: weatherData.umidade,
      fonte: weatherData.fonte
    });
    
    res.json(weatherData);
    
  } catch (error) {
    console.error('❌ Erro ao obter dados climáticos REAIS:', error.message);
    
    // Em caso de erro, retornar fallback simulado
    const fallbackData = generateFallbackWeather(
      parseFloat(req.query.lat), 
      parseFloat(req.query.lon)
    );
    
    console.log('⚠️ Retornando dados simulados de fallback.');
    
    res.json({
      ...fallbackData,
      error: 'Erro ao acessar dados reais',
      errorDetails: error.message
    });
  }
});

export default router;
