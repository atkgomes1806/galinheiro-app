/**
 * Teste Comparativo - OAuth 2.0 vs Bearer Token
 * 🎯 Objetivo: Comparar OAuth com o token Bearer que sabemos que funcionava
 * 📝 Baseado nas configurações atuais do backend
 */

import https from 'https';

// Configurações do backend (copiadas do .env)
const CONFIG = {
  tokenURL: 'https://api.cnptia.embrapa.br/token',
  baseURL: 'https://api.cnptia.embrapa.br/climapi/v1',
  consumerKey: 'Gu1cl2cXpRt8mPwOw0IjntwrnZsa',
  consumerSecret: '4kVqfR7tip5lm2rPKfKuj3gofFoa',
  bearerToken: 'c2ca68ae-0235-31ca-9a8a-de525b67ee7b'
};

const API_BASE = 'api.cnptia.embrapa.br';
const latitude = '-23.5505';
const longitude = '-46.6333';
const date = '2025-11-09';

async function testOAuth() {
  console.log('🔐 === TESTANDO OAUTH 2.0 ===\n');
  
  try {
    console.log('Solicitando token OAuth...');
    const credentials = Buffer.from(`${CONFIG.consumerKey}:${CONFIG.consumerSecret}`).toString('base64');
    
    const response = await fetch(CONFIG.tokenURL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    
    console.log(`OAuth Status: ${response.status} ${response.ok ? '✅' : '❌'}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Token: ${data.access_token?.substring(0, 20)}...`);
      console.log(`Expira em: ${data.expires_in} segundos\n`);
      return data.access_token;
    } else {
      const errorText = await response.text();
      console.log(`Erro OAuth: ${errorText}\n`);
      return null;
    }
    
  } catch (error) {
    console.log(`Erro OAuth: ${error.message}\n`);
    return null;
  }
}

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

async function testAPIWithToken(token, tokenName) {
  console.log(`🧪 === TESTANDO ${tokenName} ===`);
  
  try {
    // Teste simples: listar variáveis
    const variablesResponse = await makeRequest('/climapi/v1/ncep-gfs', token);
    console.log(`Variáveis: ${variablesResponse.status} ${variablesResponse.ok ? '✅' : '❌'}`);
    
    if (variablesResponse.ok) {
      const variables = JSON.parse(variablesResponse.data);
      console.log(`${variables.length} variáveis encontradas`);
      
      const ourVars = variables.filter(v => ['tmpsfc', 'rh2m'].includes(v.nome));
      if (ourVars.length > 0) {
        console.log('Variáveis do projeto:');
        ourVars.forEach(v => console.log(`  • ${v.nome}: ${v.descricao}`));
      }
    }
    
    return variablesResponse.ok;
    
  } catch (error) {
    console.log(`Erro ${tokenName}: ${error.message}`);
    return false;
  }
}
  
async function runComparisonTest() {
  console.log('� === TESTE COMPARATIVO: OAUTH vs BEARER ===');
  console.log(`📍 Local: São Paulo (lat: ${latitude}, lon: ${longitude})`);
  console.log(`� Data: ${date}`);
  console.log('');
  
  // Teste OAuth
  const oauthToken = await testOAuth();
  let oauthWorks = false;
  if (oauthToken) {
    oauthWorks = await testAPIWithToken(oauthToken, 'OAUTH');
  }
  
  console.log('');
  
  // Teste Bearer
  console.log('🔑 === TESTANDO BEARER TOKEN ===');
  console.log(`Token: ${CONFIG.bearerToken.substring(0, 20)}...`);
  const bearerWorks = await testAPIWithToken(CONFIG.bearerToken, 'BEARER');
  
  // Relatório final
  console.log('\n📊 === RELATÓRIO COMPARATIVO ===');
  console.log(`OAuth 2.0: ${oauthWorks ? '✅ Funcionou' : '❌ Falhou'}`);
  console.log(`Bearer Token: ${bearerWorks ? '✅ Funcionou' : '❌ Falhou'}`);
  
  if (bearerWorks && !oauthWorks) {
    console.log('\n🏆 VENCEDOR: Bearer Token');
    console.log('✅ Recomendação: Usar endpoint /data-real do backend');
    console.log('� Status: Backend já implementado com Bearer Token');
  } else if (oauthWorks && !bearerWorks) {
    console.log('\n🏆 VENCEDOR: OAuth 2.0'); 
    console.log('✅ Recomendação: Manter OAuth atual do backend');
  } else if (oauthWorks && bearerWorks) {
    console.log('\n🤝 EMPATE: Ambos funcionam');
  } else {
    console.log('\n❌ PROBLEMA: Ambos falharam');
    console.log('⚠️ Possível problema de conectividade ou credenciais expiradas');
  }
  
  console.log('\n� Para mais detalhes:');
  console.log('   • docs/TESTES_CLIMAPI_REAL.md - Log completo dos testes');
  console.log('   • node scripts/test-real-api.js - Teste detalhado Bearer Token');
  console.log('   • node scripts/test-connection.js - Teste conectividade geral');
}

// Executar teste comparativo
runComparisonTest();