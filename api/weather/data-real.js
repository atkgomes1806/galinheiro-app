/**
 * Vercel Serverless Function - Weather API
 * Converte o backend Express para Serverless Function do Vercel
 */

import fetch from 'node-fetch';

// Cache global (será mantido enquanto a function estiver "quente")
let tokenCache = { token: null, expiresAt: null };

/**
 * Configuração OAuth para Embrapa API
 */
const CONFIG = {
  tokenURL: process.env.EMBRAPA_TOKEN_URL || 'https://api.cnptia.embrapa.br/token',
  apiURL: process.env.EMBRAPA_API_URL || 'https://api.cnptia.embrapa.br/climapi/v1',
  consumerKey: process.env.EMBRAPA_CONSUMER_KEY,
  consumerSecret: process.env.EMBRAPA_CONSUMER_SECRET,
};

/**
 * Obter token OAuth 2.0 da API Embrapa
 */
async function getOAuthToken() {
  if (tokenCache.token && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  try {
    const credentials = Buffer.from(`${CONFIG.consumerKey}:${CONFIG.consumerSecret}`).toString('base64');
    
    const response = await fetch(CONFIG.tokenURL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`OAuth failed: ${response.status}`);
    }

    const tokenData = await response.json();
    
    // Cache token por 55 minutos (tokens expiram em 1 hora)
    tokenCache = {
      token: tokenData.access_token,
      expiresAt: Date.now() + (55 * 60 * 1000)
    };

    return tokenCache.token;
  } catch (error) {
    console.error('🔴 Erro OAuth:', error);
    throw error;
  }
}

/**
 * Estratégia de fallback: Bearer → OAuth
 */
async function fetchWithFallback(url) {
  // 1. Tentar Bearer Token primeiro (mais rápido)
  const bearerToken = '724ecc90-70b1-36c1-b573-c5b01d6173ea';
  
  try {
    console.log('🔑 Tentando Bearer Token...');
    const bearerResponse = await fetch(url, {
      headers: { 'Authorization': `Bearer ${bearerToken}` }
    });
    
    if (bearerResponse.ok) {
      console.log('✅ Bearer Token funcionou!');
      return bearerResponse;
    } else {
      console.log(`⚠️ Bearer falhou (${bearerResponse.status}), tentando OAuth...`);
    }
  } catch (error) {
    console.log('⚠️ Bearer Token falhou, tentando OAuth...');
  }

  // 2. Fallback para OAuth se Bearer falhar
  try {
    console.log('🔐 Obtendo token OAuth...');
    const oauthToken = await getOAuthToken();
    
    console.log('🔐 Token OAuth obtido, fazendo requisição...');
    const oauthResponse = await fetch(url, {
      headers: { 'Authorization': `Bearer ${oauthToken}` }
    });
    
    if (oauthResponse.ok) {
      console.log('✅ OAuth funcionou!');
      return oauthResponse;
    } else {
      throw new Error(`OAuth request failed: ${oauthResponse.status}`);
    }
  } catch (error) {
    console.error('🔴 Fallback OAuth falhou:', error);
    throw error;
  }
}

/**
 * Buscar dados de temperatura
 */
async function fetchTemperature(lat, lon, date) {
  const url = `${CONFIG.apiURL}/ncep-gfs/tmpsfc/${date}/${lon}/${lat}`;
  const response = await fetchWithFallback(url);
  return await response.json();
}

/**
 * Buscar dados de umidade
 */
async function fetchHumidity(lat, lon, date) {
  const url = `${CONFIG.apiURL}/ncep-gfs/rh2m/${date}/${lon}/${lat}`;
  const response = await fetchWithFallback(url);
  return await response.json();
}

/**
 * Processar dados climáticos
 */
function processWeatherData(tempData, humidityData) {
  // Usar valores mais recentes (primeiros da lista)
  const currentTemp = tempData && tempData.length > 0 ? tempData[0].valor : null;
  const currentHumidity = humidityData && humidityData.length > 0 ? humidityData[0].valor : null;

  if (currentTemp === null || currentHumidity === null) {
    throw new Error('Dados insuficientes da API');
  }

  return {
    temperatura: Number(currentTemp.toFixed(1)),
    umidade: Number(currentHumidity.toFixed(0)),
    fonte: 'API Embrapa ClimAPI (Dados Reais)',
    timestamp: new Date().toISOString()
  };
}

/**
 * Gerar dados de fallback
 */
function generateFallbackData() {
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
    fonte: 'Dados Simulados (API Indisponível)',
    timestamp: now.toISOString(),
    isDemoData: true
  };
}

/**
 * Serverless Function principal
 */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parâmetros padrão (São Paulo)
    const lat = req.query.lat || '-23.5505';
    const lon = req.query.lon || '-46.6333';
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    console.log(`🌡️ Buscando dados para: lat=${lat}, lon=${lon}, date=${date}`);

    // Verificar se credenciais estão disponíveis
    if (!CONFIG.consumerKey || !CONFIG.consumerSecret) {
      console.log('⚠️ Credenciais OAuth não configuradas, usando dados simulados');
      return res.status(200).json(generateFallbackData());
    }

    // Buscar dados reais
    const [tempData, humidityData] = await Promise.all([
      fetchTemperature(lat, lon, date),
      fetchHumidity(lat, lon, date)
    ]);

    const result = processWeatherData(tempData, humidityData);
    
    console.log('✅ Dados processados:', result);
    return res.status(200).json(result);

  } catch (error) {
    console.error('🔴 Erro na API:', error);
    
    // Retornar dados simulados em caso de erro
    const fallbackData = generateFallbackData();
    fallbackData.error = error.message;
    
    return res.status(200).json(fallbackData);
  }
}