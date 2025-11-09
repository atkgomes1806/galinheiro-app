/**
 * Teste direto da API Embrapa com token Bearer
 * 🎯 Objetivo: Demonstrar que dados reais funcionam perfeitamente!
 */

import https from 'https';

const BEARER_TOKEN = '724ecc90-70b1-36c1-b573-c5b01d6173ea';
const API_BASE = 'api.cnptia.embrapa.br';

// São Paulo
const latitude = '-23.5505';
const longitude = '-46.6333';
const date = '2025-11-09';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_BASE,
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
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

async function testRealData() {
  console.log('🎯 === TESTE DE DADOS REAIS API EMBRAPA ===');
  console.log(`📍 Local: São Paulo (lat: ${latitude}, lon: ${longitude})`);
  console.log(`📅 Data: ${date}`);
  console.log(`🔑 Token Bearer: ${BEARER_TOKEN.substring(0, 8)}...`);
  console.log('');
  
  try {
    // Teste 1: Health Check
    console.log('🏥 Testando Health Check...');
    const healthResponse = await makeRequest('/climapi/v1/health');
    console.log(`🏥 Health Status: ${healthResponse.status} ${healthResponse.ok ? '✅' : '❌'}`);
    
    // Teste 2: Variáveis disponíveis
    console.log('\n📋 Testando lista de variáveis...');
    const variablesResponse = await makeRequest('/climapi/v1/ncep-gfs');
    console.log(`📋 Variables Status: ${variablesResponse.status} ${variablesResponse.ok ? '✅' : '❌'}`);
    
    if (variablesResponse.ok) {
      try {
        const variables = JSON.parse(variablesResponse.data);
        console.log(`📋 ${variables.length} variáveis disponíveis:`);
        variables.forEach(v => {
          if (v.nome === 'tmpsfc' || v.nome === 'rh2m') {
            console.log(`   • ${v.nome}: ${v.descricao}`);
          }
        });
      } catch (e) {
        console.log('📋 Erro ao parsear variáveis');
      }
    }
    
    // Teste 3: Dados de Temperatura
    console.log('\n🌡️ Testando temperatura (tmpsfc)...');
    const tempPath = `/climapi/v1/ncep-gfs/tmpsfc/${date}/${longitude}/${latitude}`;
    console.log(`🌡️ Path: ${tempPath}`);
    
    const tempResponse = await makeRequest(tempPath);
    console.log(`🌡️ Temperature Status: ${tempResponse.status} ${tempResponse.ok ? '✅' : '❌'}`);
    
    if (tempResponse.ok) {
      try {
        const tempData = JSON.parse(tempResponse.data);
        console.log('🌡️ Dados de temperatura:');
        tempData.slice(0, 4).forEach(item => {
          console.log(`   • ${item.horas}h: ${item.valor}°C`);
        });
      } catch (e) {
        console.log('🌡️ Erro ao parsear dados de temperatura');
      }
    }
    
    // Teste 4: Dados de Umidade
    console.log('\n💧 Testando umidade (rh2m)...');
    const humidityPath = `/climapi/v1/ncep-gfs/rh2m/${date}/${longitude}/${latitude}`;
    console.log(`💧 Path: ${humidityPath}`);
    
    const humidityResponse = await makeRequest(humidityPath);
    console.log(`💧 Humidity Status: ${humidityResponse.status} ${humidityResponse.ok ? '✅' : '❌'}`);
    
    if (humidityResponse.ok) {
      try {
        const humidityData = JSON.parse(humidityResponse.data);
        console.log('💧 Dados de umidade:');
        humidityData.slice(0, 4).forEach(item => {
          console.log(`   • ${item.horas}h: ${item.valor}%`);
        });
      } catch (e) {
        console.log('💧 Erro ao parsear dados de umidade');
      }
    }
    
    // Resumo final
    console.log('\n🎯 === RESUMO FINAL ===');
    const allSuccess = healthResponse.ok && variablesResponse.ok && tempResponse.ok && humidityResponse.ok;
    
    if (allSuccess) {
      console.log('🎉 SUCESSO TOTAL! Todos os endpoints funcionaram!');
      console.log('✅ API Embrapa está 100% funcional com token Bearer');
      console.log('🚀 Dados reais de São Paulo obtidos com sucesso!');
      console.log('');
      console.log('📝 Próximas ações:');
      console.log('   1. Atualizar backend para usar token Bearer');
      console.log('   2. Substituir dados simulados por dados reais');
      console.log('   3. Implementar no card de clima do dashboard');
    } else {
      console.log('⚠️ Alguns endpoints falharam');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar teste
testRealData();