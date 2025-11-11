/**
 * Componente: Card de Dados Climáticos Open-Meteo
 * 
 * Substitui o EmbrapaWeatherCard pela Open-Meteo API
 * Exibe temperatura e umidade em tempo real obtidos da Open-Meteo Weather API
 * 
 * @author Galinheiro App Team
 * @description Card climático moderno com dados da Open-Meteo
 */

import React, { useState, useEffect } from 'react';
import { obterDadosClima, atualizarDadosClima } from '../../application/use-cases/obterDadosClima';

const WeatherCard = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandido, setExpandido] = useState(false);

    // Carregar dados ao montar o componente
    useEffect(() => {
        carregarDadosIniciais();
    }, []);

    const carregarDadosIniciais = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const dadosClima = await obterDadosClima();
            setWeatherData(dadosClima);
            
            console.log('🌦️ Weather data loaded:', dadosClima);
            
        } catch (err) {
            console.error('❌ Erro ao carregar dados climáticos:', err);
            setError(err.message || 'Erro ao carregar dados climáticos');
        } finally {
            setLoading(false);
        }
    };

    const handleAtualizar = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const dadosClima = await atualizarDadosClima();
            setWeatherData(dadosClima);
            
            console.log('🔄 Weather data updated:', dadosClima);
            
        } catch (err) {
            console.error('❌ Erro ao atualizar dados climáticos:', err);
            setError(err.message || 'Erro ao atualizar dados climáticos');
        } finally {
            setLoading(false);
        }
    };

    const getAlertColor = (temp, humidity) => {
        if (!temp || !humidity) return 'info';
        
        // Temperatura ideal: 18-28°C
        // Umidade ideal: 50-75%
        const tempOK = temp >= 18 && temp <= 28;
        const humidityOK = humidity >= 50 && humidity <= 75;
        
        if (tempOK && humidityOK) return 'success';
        if ((temp >= 15 && temp <= 30) && (humidity >= 40 && humidity <= 80)) return 'warning';
        return 'danger';
    };

    const formatarUltimaAtualizacao = (data) => {
        if (!data) return 'Desconhecido';
        
        try {
            const agora = new Date();
            const ultimaAtualizacao = new Date(data);
            const diffMs = agora - ultimaAtualizacao;
            const diffMinutos = Math.floor(diffMs / 60000);
            
            if (diffMinutos < 1) return 'Agora mesmo';
            if (diffMinutos < 60) return `${diffMinutos} min atrás`;
            
            const diffHoras = Math.floor(diffMinutos / 60);
            if (diffHoras < 24) return `${diffHoras}h atrás`;
            
            return ultimaAtualizacao.toLocaleDateString('pt-BR');
        } catch (error) {
            return 'Desconhecido';
        }
    };

    if (loading) {
        return (
            <div className="card kpi-card">
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: '140px'
                }}>
                    <div className="loading-spinner">🌦️ Carregando...</div>
                </div>
            </div>
        );
    }

    if (error && !weatherData) {
        return (
            <div className="card kpi-card weather-error">
                <div>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                        Clima indisponível
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                        {error}
                    </div>
                </div>
                <button 
                    className="btn btn-sm btn-outline"
                    onClick={handleAtualizar}
                    style={{ marginTop: '0.75rem' }}
                >
                    🔄 Tentar Novamente
                </button>
            </div>
        );
    }

    const { 
        temperatura, 
        umidade, 
        sensacaoTermica,
        condicaoTempo,
        velocidadeVento,
        direcaoVento,
        previsaoProximasHoras,
        previsaoProximosDias,
        localizacao,
        ultimaAtualizacao,
        fonte,
        recomendacoes,
        alerta,
        corAlerta,
        pontuacaoClima
    } = weatherData || {};

    return (
        <div 
            className={`card kpi-card weather-card clickable ${expandido ? 'expanded' : ''}`}
            onClick={() => setExpandido(!expandido)}
        >
            {/* Header Principal */}
            <div className="weather-header">
                <div>
                    <div className="weather-location">
                        🌍 {localizacao?.nome || 'Localização'}
                    </div>
                    <div className="weather-condition">
                        {condicaoTempo || 'Condição desconhecida'}
                    </div>
                </div>
                <button 
                    className="btn btn-sm btn-ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAtualizar();
                    }}
                    disabled={loading}
                    title="Atualizar dados climáticos"
                >
                    🔄
                </button>
            </div>

            {/* Dados Principais */}
            <div className="weather-main-data">
                <div className="weather-temp-section">
                    <div className="weather-temp">
                        {temperatura ? `${temperatura.toFixed(1)}°C` : '--°C'}
                    </div>
                    {sensacaoTermica && sensacaoTermica !== temperatura && (
                        <div className="weather-feels-like">
                            Sensação: {sensacaoTermica.toFixed(1)}°C
                        </div>
                    )}
                </div>
                
                <div className="weather-humidity-section">
                    <div className="weather-humidity">
                        💧 {umidade ? `${Math.round(umidade)}%` : '--%'}
                    </div>
                    <div className="weather-humidity-label">Umidade</div>
                </div>
            </div>

            {/* Status de Alerta */}
            {(temperatura || umidade) && (
                <div className={`weather-status ${getAlertColor(temperatura, umidade)}`}>
                    <div className="weather-status-text">
                        {getAlertColor(temperatura, umidade) === 'success' ? 
                            '✅ Condições ideais para galinhas' :
                            getAlertColor(temperatura, umidade) === 'warning' ?
                            '⚠️ Condições aceitáveis' :
                            '🚨 Atenção necessária'
                        }
                    </div>
                    {pontuacaoClima && (
                        <div className="weather-score">
                            Score: {Math.round(pontuacaoClima)}
                        </div>
                    )}
                </div>
            )}

            {/* Seção Expansível */}
            {expandido && (
                <div className="weather-expanded">
                    {/* Vento */}
                    {(velocidadeVento || direcaoVento) && (
                        <div className="weather-wind">
                            <div className="weather-section-title">💨 Vento</div>
                            <div className="weather-wind-data">
                                {velocidadeVento && `${velocidadeVento.toFixed(1)} km/h`}
                                {direcaoVento && ` ${direcaoVento}`}
                            </div>
                        </div>
                    )}

                    {/* Previsão Próximas Horas */}
                    {previsaoProximasHoras && previsaoProximasHoras.length > 0 && (
                        <div className="weather-hourly">
                            <div className="weather-section-title">🕒 Próximas Horas</div>
                            <div className="weather-hourly-grid">
                                {previsaoProximasHoras.slice(0, 3).map((hora, index) => (
                                    <div key={index} className="weather-hourly-item">
                                        <div className="weather-hourly-time">{hora.hora}</div>
                                        <div className="weather-hourly-temp">{hora.temperatura?.toFixed(1)}°C</div>
                                        <div className="weather-hourly-humidity">{hora.umidade}%</div>
                                        {hora.precipitacao > 10 && (
                                            <div className="weather-hourly-rain">☔ {hora.precipitacao}%</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Previsão Próximos Dias */}
                    {previsaoProximosDias && previsaoProximosDias.length > 0 && (
                        <div className="weather-daily">
                            <div className="weather-section-title">📅 Próximos Dias</div>
                            <div className="weather-daily-grid">
                                {previsaoProximosDias.map((dia, index) => (
                                    <div key={index} className="weather-daily-item">
                                        <div className="weather-daily-day">{dia.dia}</div>
                                        <div className="weather-daily-temps">
                                            <span className="weather-daily-max">{dia.temperaturaMax?.toFixed(1)}°</span>
                                            <span className="weather-daily-min">{dia.temperaturaMin?.toFixed(1)}°</span>
                                        </div>
                                        <div className="weather-daily-condition">{dia.condicao}</div>
                                        {dia.precipitacao > 0 && (
                                            <div className="weather-daily-rain">☔ {dia.precipitacao}mm</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recomendações */}
                    {recomendacoes && recomendacoes.length > 0 && (
                        <div className="weather-recommendations">
                            <div className="weather-section-title">💡 Recomendações</div>
                            <div className="weather-recommendations-list">
                                {recomendacoes.slice(0, 3).map((rec, index) => (
                                    <div key={index} className="weather-recommendation">
                                        {rec}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Alerta */}
                    {alerta && (
                        <div className={`weather-alert ${corAlerta || 'warning'}`}>
                            <div className="weather-alert-icon">
                                {corAlerta === 'orange' ? '⚠️' : 
                                 corAlerta === 'yellow' ? '💡' :
                                 corAlerta === 'blue' ? '❄️' : '🔔'}
                            </div>
                            <div className="weather-alert-text">{alerta}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="weather-footer">
                <div className="weather-source">
                    📡 {fonte || 'Open-Meteo Weather API'}
                </div>
                <div className="weather-updated">
                    🕒 {formatarUltimaAtualizacao(ultimaAtualizacao)}
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;