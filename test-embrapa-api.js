/**
 * Script de teste para API Embrapa
 * Execute este arquivo para testar a conexão e autenticação
 */

// Simular ambiente
const testConfig = {
  tokenURL: 'https://api.cnptia.embrapa.br/token',
  baseURL: 'https://api.cnptia.embrapa.br/climapi/v1',
  consumerKey: 'Gu1cl2cXpRt8mPwOw0IjntwrnZsa',
  consumerSecret: '4kVqfR7tip5lm2rPKfKuj3gofFoa'
};

async function testEmbrapaAPI() {
  console.log('🧪 TESTE DE INTEGRAÇÃO API EMBRAPA\n');
  
  try {
    // 1. Testar autenticação
    console.log('1️⃣ Testando autenticação OAuth 2.0...');
    const credentials = btoa(`${testConfig.consumerKey}:${testConfig.consumerSecret}`);
    
    const authResponse = await fetch(testConfig.tokenURL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    
    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Autenticação falhou: ${authResponse.status} - ${errorText}`);
    }
    
    const authData = await authResponse.json();
    console.log('✅ Autenticação bem-sucedida!');
    console.log('Token:', authData.access_token?.substring(0, 20) + '...');
    console.log('Expira em:', authData.expires_in, 'segundos\n');
    
    const token = authData.access_token;
    
    // 2. Testar endpoint de variáveis
    console.log('2️⃣ Testando endpoint de variáveis...');
    const variablesResponse = await fetch(`${testConfig.baseURL}/ncep-gfs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    if (!variablesResponse.ok) {
      throw new Error(`Variáveis falhou: ${variablesResponse.status}`);
    }
    
    const variables = await variablesResponse.json();
    console.log('✅ Variáveis disponíveis:', variables);
    console.log('');
    
    // 3. Testar datas disponíveis para tmp2m
    console.log('3️⃣ Testando datas disponíveis para tmp2m...');
    const datesResponse = await fetch(`${testConfig.baseURL}/ncep-gfs/tmp2m`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    if (!datesResponse.ok) {
      throw new Error(`Datas falhou: ${datesResponse.status}`);
    }
    
    const dates = await datesResponse.json();
    console.log('✅ Datas disponíveis:', dates);
    
    if (dates && dates.length > 0) {
      const latestDate = dates[0];
      console.log('📅 Data mais recente:', latestDate);
      console.log('');
      
      // 4. Testar busca de temperatura
      console.log('4️⃣ Testando busca de temperatura...');
      const lat = -23.5505;
      const lon = -46.6333;
      
      const tempURL = `${testConfig.baseURL}/ncep-gfs/tmp2m/${latestDate}/${lon}/${lat}`;
      console.log('URL:', tempURL);
      
      const tempResponse = await fetch(tempURL, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!tempResponse.ok) {
        throw new Error(`Temperatura falhou: ${tempResponse.status}`);
      }
      
      const tempData = await tempResponse.json();
      console.log('✅ Dados de temperatura:', tempData);
      
      if (tempData && tempData.length > 0) {
        const firstForecast = tempData[0];
        console.log('📊 Primeira previsão:', firstForecast);
        
        const tempKelvin = firstForecast.valor || firstForecast.temperatura;
        const tempCelsius = tempKelvin - 273.15;
        console.log(`🌡️ Temperatura: ${tempCelsius.toFixed(1)}°C`);
      }
    }
    
    console.log('\n✅ TODOS OS TESTES PASSARAM!');
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error);
    console.error('Stack:', error.stack);
  }
}

// Executar teste
testEmbrapaAPI();
