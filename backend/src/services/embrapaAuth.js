/**
 * Serviço de Autenticação OAuth 2.0 - API Embrapa
 * 
 * Gerencia autenticação via Client Credentials Grant
 * Implementa cache de token e renovação automática
 */

import fetch from 'node-fetch';

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

class EmbrapaAuthService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiresAt = null;
  }

  /**
   * Codifica credenciais em Base64 para header Authorization
   */
  encodeCredentials() {
    const config = getConfig();
    const credentials = `${config.consumerKey}:${config.consumerSecret}`;
    return Buffer.from(credentials).toString('base64');
  }

  /**
   * Verifica se o token em cache ainda é válido
   */
  isTokenValid() {
    if (!this.accessToken || !this.tokenExpiresAt) {
      return false;
    }
    
    // Verifica se ainda não expirou (com margem de 5 minutos)
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutos
    return now < (this.tokenExpiresAt - bufferTime);
  }

  /**
   * Autentica na API Embrapa e obtém token de acesso
   */
  async authenticate() {
    try {
      console.log('🔐 Autenticando na API Embrapa...');
      console.log('🔑 Consumer Key:', this.encodeCredentials().substring(0, 20) + '...');
      
      const credentials = this.encodeCredentials();
      
      const response = await fetch(getConfig().tokenURL, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      console.log('🔐 Status da resposta de autenticação:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Resposta de erro da API:', errorText);
        throw new Error(`Autenticação falhou: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Dados de autenticação recebidos:', { access_token: data.access_token ? 'PRESENTE' : 'AUSENTE', expires_in: data.expires_in });
      
      // Armazenar token e calcular expiração
      this.accessToken = data.access_token;
      const expiresIn = data.expires_in || 3600; // Padrão: 1 hora
      this.tokenExpiresAt = Date.now() + (expiresIn * 1000);

      const expiresAt = new Date(this.tokenExpiresAt).toLocaleTimeString('pt-BR');
      console.log(`✅ Autenticação bem-sucedida! Token expira às ${expiresAt}`);
      
      return this.accessToken;
    } catch (error) {
      console.error('❌ Erro na autenticação:', error.message);
      throw error;
    }
  }

  /**
   * Obtém token válido (autentica se necessário)
   */
  async getValidToken() {
    if (this.isTokenValid()) {
      console.log('✅ Usando token em cache');
      return this.accessToken;
    }
    
    console.log('⚠️ Token expirado ou inexistente, renovando...');
    return await this.authenticate();
  }

  /**
   * Limpa cache de token (forçar nova autenticação)
   */
  clearToken() {
    this.accessToken = null;
    this.tokenExpiresAt = null;
    console.log('🗑️ Cache de token limpo');
  }
}

// Exportar instância única (Singleton)
const authService = new EmbrapaAuthService();
export default authService;
