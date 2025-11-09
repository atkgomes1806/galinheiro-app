/**
 * Componente: Card de Dados Climáticos Embrapa
 * 
 * Exibe temperatura e umidade em tempo real obtidos da API ClimAPI da Embrapa
 * Substituído o KPI "Média de Postura" no Dashboard
 * 
 * Features:
 * - Busca automática de dados ao montar
 * - Auto-refresh a cada 30 minutos
 * - Estados de loading e error
 * - Alertas baseados em condições climáticas
 * - Design responsivo e acessível
 */

import React, { useState, useEffect } from 'react';
import { obterDadosClimaEmbrapa, atualizarDadosClimaEmbrapa } from '../../application/use-cases/obterDadosClimaEmbrapa';

const EmbrapaWeatherCard = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);

  /**
   * Carrega dados climáticos
   */
  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dadosClima = await obterDadosClimaEmbrapa();
      setDados(dadosClima);
      setUltimaAtualizacao(new Date());
      
    } catch (err) {
      console.error('Erro ao carregar dados climáticos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Força atualização dos dados
   */
  const forcarAtualizacao = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dadosClima = await atualizarDadosClimaEmbrapa();
      setDados(dadosClima);
      setUltimaAtualizacao(new Date());
      
    } catch (err) {
      console.error('Erro ao atualizar dados climáticos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Efeito: Carregar dados ao montar e configurar auto-refresh
   */
  useEffect(() => {
    carregarDados();

    // Auto-refresh a cada 30 minutos
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh: atualizando dados climáticos...');
      carregarDados();
    }, 30 * 60 * 1000); // 30 minutos

    return () => clearInterval(interval);
  }, []);

  /**
   * Formata hora para exibição
   */
  const formatarHora = (date) => {
    if (!date) return '--:--';
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Renderiza estado de loading
   */
  if (loading && !dados) {
    return (
      <div className="card kpi-card weather-card-loading">
        <div className="kpi-chip kpi-chip--weather">
          <span>🌡️</span>
          <span className="kpi-content-title">Clima no Galinheiro</span>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--gray-600)' }}>
          Carregando...
        </div>
      </div>
    );
  }

  /**
   * Renderiza estado de erro
   */
  if (error && !dados) {
    return (
      <div className="card kpi-card weather-card-error">
        <div className="kpi-chip kpi-chip--weather">
          <span>🌡️</span>
          <span className="kpi-content-title">Clima no Galinheiro</span>
        </div>
        <div style={{ textAlign: 'center', padding: '0.5rem 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ marginBottom: '0.75rem', color: 'var(--danger)', fontSize: '0.875rem' }}>
            ⚠️ Erro ao carregar
          </p>
          <button 
            onClick={forcarAtualizacao}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  /**
   * Renderiza card com dados no estilo KPI padrão
   */
  return (
    <div className="card kpi-card">
      {/* Header - mesmo estilo dos outros KPIs */}
      <div className="kpi-chip kpi-chip--weather">
        <span>{dados?.icone || '🌤️'}</span>
        <span className="kpi-content-title">Clima no Galinheiro</span>
      </div>

      {/* Dados principais: Temperatura e Umidade */}
      <div className="weather-metrics">
        <div>
          <div className="kpi-content-value">
            {dados?.temperatura !== null ? `${dados.temperatura}°C` : '--'}
          </div>
          <div className="kpi-content-subtitle">Temperatura</div>
        </div>
        
        <div style={{ borderLeft: '1px solid var(--gray-200)', paddingLeft: '0.75rem' }}>
          <div className="kpi-content-value">
            {dados?.umidade !== null ? `${dados.umidade}%` : '--'}
          </div>
          <div className="kpi-content-subtitle">Umidade</div>
        </div>
      </div>

      {/* Status/Sensação - substituindo o link */}
      <div className="kpi-content-link" style={{ marginTop: 'auto' }}>
        {dados?.sensacao || 'Indisponível'}
        {dados?.isDemoData && ' (Demo)'}
      </div>

      {/* Botão de atualização discreto */}
      {!loading && (
        <button
          onClick={forcarAtualizacao}
          className="weather-refresh-mini"
          title="Atualizar dados"
        >
          🔄
        </button>
      )}
    </div>
  );
};

export default EmbrapaWeatherCard;
