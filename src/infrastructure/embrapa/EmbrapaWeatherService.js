/**
 * Serviço de Dados Climáticos - API Embrapa ClimAPI via Backend Proxy
 * 
 * Responsável por:
 * - Buscar dados de temperatura e umidade via proxy backend
 * - Processar e formatar dados para a aplicação
 * - Aplicar regras de negócio específicas para galinheiro
 * 
 * Nota: Autenticação OAuth agora é feita no backend por segurança
 */

class EmbrapaWeatherService {
  constructor() {
    // Detectar ambiente automaticamente
    const isProduction = window.location.hostname !== 'localhost';
    const baseURL = isProduction 
      ? window.location.origin  // No Vercel, usar o próprio domínio
      : 'http://localhost:3002'; // Local, usar backend separado
    
    // URL do backend proxy
    this.proxyURL = import.meta.env.VITE_BACKEND_PROXY_URL || baseURL;
    
    // Cache de dados (mínimo, pois backend já tem cache)
    this.cachedData = null;
    this.cacheExpiresAt = null;
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos (cache curto)
    
    // Modo de demonstração (ativar se houver problemas com backend)
    this.useDemoData = import.meta.env.VITE_USE_DEMO_WEATHER === 'true';
    
    console.log(`🌐 EmbrapaWeatherService configurado para: ${this.proxyURL}`);
  }
  
  /**
   * Retorna dados simulados para demonstração
   * Útil quando há problemas de CORS com a API
   */
  getDemoData() {
    // Gera valores realistas variando ao longo do dia
    const hour = new Date().getHours();
    const baseTemp = 22;
    const tempVariation = Math.sin((hour / 24) * Math.PI * 2) * 5;
    const temperatura = baseTemp + tempVariation;
    
    const baseHumidity = 60;
    const humidityVariation = Math.cos((hour / 24) * Math.PI * 2) * 15;
    const umidade = baseHumidity + humidityVariation;
    
    const avaliacao = this.avaliarCondicoesGalinheiro(temperatura, umidade);
    
    return {
      temperatura: Number(temperatura.toFixed(1)),
      umidade: Number(umidade.toFixed(0)),
      sensacao: avaliacao.sensacao,
      alertas: [...avaliacao.alertas, '⚠️ Dados simulados para demonstração'],
      corAlerta: avaliacao.corAlerta,
      recomendacao: avaliacao.recomendacao,
      icone: this.getWeatherIcon(temperatura, umidade),
      atualizadoEm: new Date().toISOString(),
      fonte: 'Dados Simulados (Demo)',
      isDemoData: true
    };
  }

  /**
   * Verifica se os dados em cache ainda são válidos
   * @returns {boolean} True se cache é válido
   */
  isCacheValid() {
    if (!this.cachedData || !this.cacheExpiresAt) {
      return false;
    }
    return Date.now() < this.cacheExpiresAt;
  }



  /**
   * Busca dados climáticos do backend proxy (dados reais)
   * @param {number} latitude - Latitude da localização
   * @param {number} longitude - Longitude da localização
   * @returns {Promise<Object>} Dados climáticos (temperatura e umidade)
   */
  async fetchWeatherFromProxy(latitude, longitude) {
    try {
      // Usando endpoint de dados reais com token Bearer
      const url = `${this.proxyURL}/api/weather/data-real?lat=${latitude}&lon=${longitude}`;
      console.log('🌐 Buscando dados REAIS via proxy:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Dados REAIS recebidos do proxy:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar dados reais via proxy:', error.message);
      // Fallback para endpoint simulado se dados reais falharem
      console.log('🔄 Tentando endpoint de fallback com dados simulados...');
      
      const fallbackUrl = `${this.proxyURL}/api/weather/data?lat=${latitude}&lon=${longitude}`;
      try {
        const fallbackResponse = await fetch(fallbackUrl);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('⚠️ Usando dados simulados como fallback:', fallbackData);
          return fallbackData;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback também falhou:', fallbackError.message);
      }
      
      throw error;
    }
  }

  /**
   * Avalia condições climáticas para criação de galinhas
   * Baseado em boas práticas agropecuárias
   * @param {number} temperatura - Temperatura em °C
   * @param {number} umidade - Umidade relativa em %
   * @returns {Object} Avaliação e alertas
   */
  avaliarCondicoesGalinheiro(temperatura, umidade) {
    const alertas = [];
    let sensacao = 'Ideal';
    let corAlerta = 'green';

    // Temperatura ideal para galinhas poedeiras: 18-25°C
    if (temperatura < 10) {
      alertas.push('🥶 Temperatura crítica baixa - Risco de hipotermia');
      sensacao = 'Crítico - Frio';
      corAlerta = 'red';
    } else if (temperatura < 18) {
      alertas.push('❄️ Temperatura baixa - Providenciar aquecimento');
      sensacao = 'Frio';
      corAlerta = 'orange';
    } else if (temperatura > 32) {
      alertas.push('🔥 Temperatura crítica alta - Risco de estresse térmico');
      sensacao = 'Crítico - Calor';
      corAlerta = 'red';
    } else if (temperatura > 28) {
      alertas.push('🌡️ Temperatura elevada - Aumentar ventilação e água');
      sensacao = 'Quente';
      corAlerta = 'orange';
    }

    // Umidade ideal: 50-70%
    if (umidade < 40) {
      alertas.push('💧 Umidade baixa - Aumentar água e ventilação');
      if (corAlerta === 'green') corAlerta = 'orange';
    } else if (umidade > 80) {
      alertas.push('🌧️ Umidade alta - Risco de problemas respiratórios');
      if (corAlerta === 'green') corAlerta = 'orange';
    }

    // Condição ideal
    if (alertas.length === 0) {
      alertas.push('✅ Condições ideais para o galinheiro');
    }

    return {
      sensacao,
      alertas,
      corAlerta,
      recomendacao: this.getRecomendacao(temperatura, umidade)
    };
  }

  /**
   * Gera recomendações práticas baseadas nas condições
   * @param {number} temperatura - Temperatura em °C
   * @param {number} umidade - Umidade em %
   * @returns {string} Recomendação prática
   */
  getRecomendacao(temperatura, umidade) {
    if (temperatura < 18) {
      return 'Use lâmpadas ou aquecedores para elevar a temperatura.';
    } else if (temperatura > 28) {
      return 'Aumente a ventilação e garanta água fresca abundante.';
    } else if (umidade < 40) {
      return 'Borrifar água no ambiente pode ajudar.';
    } else if (umidade > 80) {
      return 'Melhore a ventilação para reduzir umidade.';
    }
    return 'Continue monitorando as condições regularmente.';
  }

  /**
   * Determina ícone emoji baseado nas condições
   * @param {number} temperatura - Temperatura em °C
   * @param {number} umidade - Umidade em %
   * @returns {string} Emoji representativo
   */
  getWeatherIcon(temperatura, umidade) {
    if (temperatura < 18) return '❄️';
    if (temperatura > 28) return '🔥';
    if (umidade > 80) return '🌧️';
    if (umidade < 40) return '☀️';
    return '🌤️';
  }

  /**
   * Busca dados climáticos completos para uma localização
   * @param {number} latitude - Latitude da localização
   * @param {number} longitude - Longitude da localização
   * @returns {Promise<Object>} Dados climáticos formatados
   */
  async getWeatherData(latitude, longitude) {
    try {
      // Modo demonstração
      if (this.useDemoData) {
        console.log('🎭 Usando dados simulados (modo demonstração)');
        return this.getDemoData();
      }
      
      // Verifica cache primeiro
      if (this.isCacheValid()) {
        console.log('✅ Usando dados climáticos do cache');
        return this.cachedData;
      }

      console.log('🔄 Buscando dados climáticos via backend proxy...');
      console.log('📍 Localização:', { latitude, longitude });

      // Buscar dados do proxy (backend já faz tudo)
      const proxyData = await this.fetchWeatherFromProxy(latitude, longitude);
      
      const temperatura = proxyData.temperatura;
      const umidade = proxyData.umidade;

      // Processar dados
      const avaliacao = this.avaliarCondicoesGalinheiro(temperatura, umidade);
      
      const weatherData = {
        temperatura: Number(temperatura.toFixed(1)),
        umidade: Number(umidade.toFixed(0)),
        sensacao: avaliacao.sensacao,
        alertas: avaliacao.alertas,
        corAlerta: avaliacao.corAlerta,
        recomendacao: avaliacao.recomendacao,
        icone: this.getWeatherIcon(temperatura, umidade),
        atualizadoEm: new Date().toISOString(),
        fonte: proxyData.isDemoData ? 
          'Dados Simulados (API Embrapa indisponível)' : 
          'Embrapa ClimAPI (Dados Reais)',
        isDemoData: proxyData.isDemoData || false,
        modeloExecutado: proxyData.modeloExecutado || null
      };

      // Atualizar cache
      this.cachedData = weatherData;
      this.cacheExpiresAt = Date.now() + this.cacheDuration;

      console.log('✅ Dados climáticos obtidos com sucesso:', weatherData);

      return weatherData;
    } catch (error) {
      console.error('❌ Erro ao obter dados climáticos:', error);
      console.error('Tipo de erro:', error.name);
      console.error('Mensagem:', error.message);
      
      // Verificar se é erro de CORS
      const isCorsError = error.message.includes('CORS') || 
                         error.message.includes('Failed to fetch') ||
                         error.name === 'TypeError';
      
      let mensagemErro = '⚠️ Não foi possível obter dados climáticos';
      let recomendacao = 'Verifique sua conexão e tente novamente.';
      
      if (isCorsError) {
        mensagemErro = '🚫 Erro de CORS - API bloqueada pelo navegador';
        recomendacao = 'A API Embrapa precisa ser acessada via servidor backend (proxy).';
        console.warn('⚠️ PROBLEMA DETECTADO: CORS');
        console.warn('💡 SOLUÇÃO: Implementar proxy backend ou usar dados simulados');
      }
      
      // Retornar dados de fallback em caso de erro
      return {
        temperatura: null,
        umidade: null,
        sensacao: 'Indisponível',
        alertas: [mensagemErro],
        corAlerta: 'gray',
        recomendacao: recomendacao,
        icone: '❓',
        atualizadoEm: new Date().toISOString(),
        fonte: 'Erro',
        erro: error.message,
        isCorsError
      };
    }
  }

  /**
   * Limpa cache de dados
   */
  clearCache() {
    this.cachedData = null;
    this.cacheExpiresAt = null;
    console.log('🗑️ Cache de dados climáticos limpo');
  }
}

// Exporta instância única (Singleton)
const embrapaWeatherService = new EmbrapaWeatherService();
export default embrapaWeatherService;
