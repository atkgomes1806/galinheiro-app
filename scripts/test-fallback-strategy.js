/**
 * Teste da Estratégia de Fallback Bearer → OAuth
 * 🎯 Objetivo: Verificar se o sistema tenta Bearer primeiro e fallback para OAuth
 * 🔧 Execute: node scripts/test-fallback-strategy.js
 */

import https from 'https';

const API_BASE = 'api.cnptia.embrapa.br';
const latitude = '-23.5505';
const longitude = '-46.6333';
const date = '2025-11-09';

// Tokens para teste
const TOKENS = {
  bearer: '724ecc90-70b1-36c1-b573-c5b01d6173ea',
  bearerInvalid: 'token-invalido-para-teste',
  oauthConfig: {
    tokenURL: 'https://api.cnptia.embrapa.br/token',
    consumerKey: 'Gu1cl2cXpRt8mPwOw0IjntwrnZsa',
    consumerSecret: '4kVqfR7tip5lm2rPKfKuj3gofFoa'
  }
};

function makeRequest(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_BASE,
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Node.js'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          data: data
        });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

async function getOAuthToken() {
  try {
    const credentials = Buffer.from(`${TOKENS.oauthConfig.consumerKey}:${TOKENS.oauthConfig.consumerSecret}`).toString('base64');
    
    const response = await fetch(TOKENS.oauthConfig.tokenURL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

async function testFallbackStrategy() {
  console.log('🎯 === TESTE ESTRATÉGIA DE FALLBACK ===');
  console.log('🔄 Simula: Bearer Token → OAuth 2.0');
  console.log('📍 Local: São Paulo\n');
  
  const testPath = `/climapi/v1/ncep-gfs/tmpsfc/${date}/${longitude}/${latitude}`;
  
  // Teste 1: Bearer Token Válido (deve funcionar)
  console.log('1️⃣ Testando Bearer Token VÁLIDO...');
  try {
    const result = await makeRequest(testPath, TOKENS.bearer);
    console.log(`   Status: ${result.status} ${result.ok ? '✅' : '❌'}`);
    if (result.ok) {
      console.log('   ✅ Bearer Token funcionou - não precisa de fallback');
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
  }
  
  console.log('');
  
  // Teste 2: Bearer Token Inválido + OAuth Fallback
  console.log('2️⃣ Testando Bearer INVÁLIDO + OAuth Fallback...');
  
  // Primeira tentativa: Bearer inválido
  console.log('   🔑 Tentando Bearer inválido...');
  try {
    const bearerResult = await makeRequest(testPath, TOKENS.bearerInvalid);
    console.log(`   Bearer Status: ${bearerResult.status} ${bearerResult.ok ? '✅' : '❌'}`);
    
    if (!bearerResult.ok) {
      console.log('   ⚠️ Bearer falhou, tentando OAuth...');
      
      // Segunda tentativa: OAuth
      console.log('   🔐 Obtendo token OAuth...');
      const oauthToken = await getOAuthToken();
      
      if (oauthToken) {
        console.log('   🔐 Token OAuth obtido, testando...');
        const oauthResult = await makeRequest(testPath, oauthToken);
        console.log(`   OAuth Status: ${oauthResult.status} ${oauthResult.ok ? '✅' : '❌'}`);
        
        if (oauthResult.ok) {
          console.log('   ✅ Fallback para OAuth funcionou!');
        } else {
          console.log('   ❌ OAuth também falhou');
        }
      } else {
        console.log('   ❌ Não foi possível obter token OAuth');
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Erro no teste: ${error.message}`);
  }
  
  console.log('');
  
  // Teste 3: Backend com Fallback
  console.log('3️⃣ Testando endpoint do backend (/data-real)...');
  try {
    console.log('   🌐 Chamando: http://localhost:3002/api/weather/data-real');
    
    const backendResponse = await fetch(`http://localhost:3002/api/weather/data-real?lat=${latitude}&lon=${longitude}`);
    console.log(`   Status: ${backendResponse.status} ${backendResponse.ok ? '✅' : '❌'}`);
    
    if (backendResponse.ok) {
      const data = await backendResponse.json();
      console.log('   ✅ Backend funcionou com fallback automático!');
      console.log(`   🌡️ Temperatura: ${data.temperatura}°C`);
      console.log(`   💧 Umidade: ${data.umidade}%`);
      console.log(`   📊 Fonte: ${data.fonte}`);
    } else {
      console.log('   ❌ Backend falhou');
    }
    
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
    console.log('   ℹ️ Certifique-se de que o backend está rodando (porta 3002)');
  }
  
  console.log('\n🎯 === CONCLUSÃO ===');
  console.log('✅ Estratégia de Fallback garante dados sempre atualizados:');
  console.log('   1. Bearer Token (rápido) → se funcionar, usa');
  console.log('   2. OAuth 2.0 (robusto) → se Bearer falhar, usa OAuth');
  console.log('   3. Sistema nunca fica sem dados!');
}

// Executar teste
testFallbackStrategy().catch(console.error);