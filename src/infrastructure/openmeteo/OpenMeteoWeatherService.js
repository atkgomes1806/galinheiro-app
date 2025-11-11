/**
 * Serviço de Dados Climáticos - Open-Meteo Weather API
 * 
 * Substitui a API da Embrapa pela Open-Meteo (código aberto, sem autenticação)
 * 
 * @author Galinheiro App Team
 * @description Obtém dados meteorológicos em tempo real da Open-Meteo API
 */

import { fetchWeatherApi } from 'openmeteo';

class OpenMeteoWeatherService {
    constructor() {
        // Coordenadas padrão (São Paulo) - podem ser configuradas via env
        this.latitude = parseFloat(process.env.VITE_LOCATION_LATITUDE) || -23.5505;
        this.longitude = parseFloat(process.env.VITE_LOCATION_LONGITUDE) || -46.6333;
        this.locationName = process.env.VITE_LOCATION_NAME || 'São Paulo';
        
        // URL da API Open-Meteo
        this.apiURL = 'https://api.open-meteo.com/v1/forecast';
        
        console.log(`🌐 OpenMeteoWeatherService configurado para: ${this.locationName} (${this.latitude}, ${this.longitude})`);
    }

    /**
     * Busca dados meteorológicos atuais da Open-Meteo API
     * @returns {Promise<Object>} Dados climáticos formatados
     */
    async obterDadosClimaticos() {
        try {
            console.log('🌦️ Buscando dados meteorológicos da Open-Meteo API...');

            // Parâmetros para a API Open-Meteo
            const params = {
                latitude: this.latitude,
                longitude: this.longitude,
                current: [
                    'temperature_2m',
                    'relative_humidity_2m',
                    'weather_code',
                    'wind_speed_10m',
                    'wind_direction_10m'
                ],
                hourly: [
                    'temperature_2m',
                    'relative_humidity_2m',
                    'precipitation_probability',
                    'weather_code'
                ],
                daily: [
                    'weather_code',
                    'temperature_2m_max',
                    'temperature_2m_min',
                    'precipitation_sum',
                    'precipitation_probability_max'
                ],
                timezone: 'America/Sao_Paulo',
                forecast_days: 3
            };

            // Buscar dados da API
            const responses = await fetchWeatherApi(this.apiURL, params);
            const response = responses[0];

            // Extrair dados básicos
            const utcOffsetSeconds = response.utcOffsetSeconds();
            const current = response.current();
            const hourly = response.hourly();
            const daily = response.daily();

            // Dados atuais
            const currentData = {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature: current.variables(0).value(),
                humidity: current.variables(1).value(),
                weatherCode: current.variables(2).value(),
                windSpeed: current.variables(3).value(),
                windDirection: current.variables(4).value()
            };

            // Helper para criar ranges de tempo
            const range = (start, stop, step) =>
                Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

            // Dados horários (próximas 24h)
            const hourlyData = {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval())
                    .slice(0, 24) // Próximas 24 horas
                    .map(t => new Date((t + utcOffsetSeconds) * 1000)),
                temperature: Array.from(hourly.variables(0).valuesArray()).slice(0, 24),
                humidity: Array.from(hourly.variables(1).valuesArray()).slice(0, 24),
                precipitationProbability: Array.from(hourly.variables(2).valuesArray()).slice(0, 24),
                weatherCode: Array.from(hourly.variables(3).valuesArray()).slice(0, 24)
            };

            // Dados diários (próximos 3 dias)
            const dailyData = {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval())
                    .slice(0, 3)
                    .map(t => new Date((t + utcOffsetSeconds) * 1000)),
                weatherCode: Array.from(daily.variables(0).valuesArray()).slice(0, 3),
                temperatureMax: Array.from(daily.variables(1).valuesArray()).slice(0, 3),
                temperatureMin: Array.from(daily.variables(2).valuesArray()).slice(0, 3),
                precipitationSum: Array.from(daily.variables(3).valuesArray()).slice(0, 3),
                precipitationProbabilityMax: Array.from(daily.variables(4).valuesArray()).slice(0, 3)
            };

            // Formatar resposta no padrão esperado pela aplicação
            const dadosFormatados = this.formatarDadosClima({
                current: currentData,
                hourly: hourlyData,
                daily: dailyData,
                location: {
                    latitude: response.latitude(),
                    longitude: response.longitude(),
                    elevation: response.elevation(),
                    name: this.locationName
                }
            });

            console.log('✅ Dados meteorológicos obtidos com sucesso da Open-Meteo');
            return dadosFormatados;

        } catch (error) {
            console.error('❌ Erro ao obter dados da Open-Meteo:', error);
            
            // Retorna dados simulados em caso de erro
            return this.obterDadosSimulados();
        }
    }

    /**
     * Formata dados da Open-Meteo no padrão esperado pela aplicação
     * @param {Object} rawData - Dados brutos da API
     * @returns {Object} Dados formatados
     */
    formatarDadosClima(rawData) {
        const { current, hourly, daily, location } = rawData;

        return {
            // Dados básicos de temperatura e umidade
            temperatura: Math.round(current.temperature * 10) / 10,
            umidade: Math.round(current.humidity),
            
            // Informações complementares
            sensacaoTermica: this.calcularSensacaoTermica(current.temperature, current.humidity, current.windSpeed),
            condicaoTempo: this.traduzirCodigoTempo(current.weatherCode),
            
            // Dados de vento
            velocidadeVento: Math.round(current.windSpeed * 10) / 10,
            direcaoVento: this.traduzirDirecaoVento(current.windDirection),
            
            // Previsão próximas horas (4 horas)
            previsaoProximasHoras: hourly.time.slice(1, 5).map((time, index) => ({
                hora: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                temperatura: Math.round(hourly.temperature[index + 1] * 10) / 10,
                umidade: Math.round(hourly.humidity[index + 1]),
                precipitacao: Math.round(hourly.precipitationProbability[index + 1]),
                condicao: this.traduzirCodigoTempo(hourly.weatherCode[index + 1])
            })),
            
            // Previsão próximos dias
            previsaoProximosDias: daily.time.map((time, index) => ({
                dia: time.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
                temperaturaMax: Math.round(daily.temperatureMax[index] * 10) / 10,
                temperaturaMin: Math.round(daily.temperatureMin[index] * 10) / 10,
                precipitacao: Math.round(daily.precipitationSum[index] * 10) / 10,
                precipitacaoProb: Math.round(daily.precipitationProbabilityMax[index]),
                condicao: this.traduzirCodigoTempo(daily.weatherCode[index])
            })),
            
            // Metadados
            localizacao: {
                nome: location.name,
                latitude: location.latitude,
                longitude: location.longitude,
                altitude: Math.round(location.elevation)
            },
            ultimaAtualizacao: current.time,
            fonte: 'Open-Meteo Weather API',
            status: 'success'
        };
    }

    /**
     * Traduz códigos WMO para descrições em português
     * @param {number} code - Código WMO
     * @returns {string} Descrição da condição climática
     */
    traduzirCodigoTempo(code) {
        const codigosWMO = {
            0: 'Céu limpo',
            1: 'Principalmente limpo',
            2: 'Parcialmente nublado',
            3: 'Nublado',
            45: 'Nevoeiro',
            48: 'Nevoeiro com geada',
            51: 'Garoa leve',
            53: 'Garoa moderada', 
            55: 'Garoa forte',
            56: 'Garoa gelada leve',
            57: 'Garoa gelada forte',
            61: 'Chuva fraca',
            63: 'Chuva moderada',
            65: 'Chuva forte',
            66: 'Chuva gelada leve',
            67: 'Chuva gelada forte',
            71: 'Neve fraca',
            73: 'Neve moderada',
            75: 'Neve forte',
            77: 'Granizo',
            80: 'Pancadas de chuva leves',
            81: 'Pancadas de chuva moderadas',
            82: 'Pancadas de chuva fortes',
            85: 'Pancadas de neve leves',
            86: 'Pancadas de neve fortes',
            95: 'Tempestade',
            96: 'Tempestade com granizo leve',
            99: 'Tempestade com granizo forte'
        };
        
        return codigosWMO[code] || 'Condição desconhecida';
    }

    /**
     * Traduz direção do vento em graus para pontos cardeais
     * @param {number} degrees - Direção em graus
     * @returns {string} Ponto cardeal
     */
    traduzirDirecaoVento(degrees) {
        const direcoes = [
            'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
            'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'
        ];
        
        const index = Math.round(degrees / 22.5) % 16;
        return direcoes[index];
    }

    /**
     * Calcula sensação térmica usando fórmula wind chill / heat index
     * @param {number} temp - Temperatura em °C
     * @param {number} humidity - Umidade em %
     * @param {number} windSpeed - Velocidade do vento em km/h
     * @returns {number} Sensação térmica em °C
     */
    calcularSensacaoTermica(temp, humidity, windSpeed) {
        if (temp <= 10 && windSpeed > 4.8) {
            // Wind chill para temperaturas baixas
            const windSpeedMph = windSpeed * 0.621371;
            const tempF = temp * 9/5 + 32;
            const wcF = 35.74 + (0.6215 * tempF) - (35.75 * Math.pow(windSpeedMph, 0.16)) + (0.4275 * tempF * Math.pow(windSpeedMph, 0.16));
            return Math.round(((wcF - 32) * 5/9) * 10) / 10;
        } else if (temp >= 27) {
            // Heat index para temperaturas altas
            const tempF = temp * 9/5 + 32;
            const rh = humidity;
            let hiF = tempF;
            
            if (tempF >= 80) {
                hiF = -42.379 + 2.04901523 * tempF + 10.14333127 * rh 
                    - 0.22475541 * tempF * rh - 6.83783e-3 * tempF**2 
                    - 5.481717e-2 * rh**2 + 1.22874e-3 * tempF**2 * rh 
                    + 8.5282e-4 * tempF * rh**2 - 1.99e-6 * tempF**2 * rh**2;
            }
            
            return Math.round(((hiF - 32) * 5/9) * 10) / 10;
        }
        
        return Math.round(temp * 10) / 10;
    }

    /**
     * Gera dados simulados quando a API está indisponível
     * @returns {Object} Dados simulados
     */
    obterDadosSimulados() {
        const agora = new Date();
        
        return {
            temperatura: 22.5 + Math.random() * 8, // 22.5-30.5°C
            umidade: 60 + Math.random() * 30, // 60-90%
            sensacaoTermica: 24.0,
            condicaoTempo: 'Parcialmente nublado',
            velocidadeVento: 5.2,
            direcaoVento: 'SE',
            previsaoProximasHoras: Array.from({ length: 4 }, (_, i) => {
                const hora = new Date(agora.getTime() + (i + 1) * 3600000);
                return {
                    hora: hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    temperatura: 20 + Math.random() * 10,
                    umidade: 50 + Math.random() * 40,
                    precipitacao: Math.random() * 30,
                    condicao: ['Céu limpo', 'Parcialmente nublado', 'Nublado'][Math.floor(Math.random() * 3)]
                };
            }),
            previsaoProximosDias: Array.from({ length: 3 }, (_, i) => {
                const dia = new Date(agora.getTime() + i * 86400000);
                return {
                    dia: dia.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
                    temperaturaMax: 25 + Math.random() * 8,
                    temperaturaMin: 15 + Math.random() * 5,
                    precipitacao: Math.random() * 10,
                    precipitacaoProb: Math.random() * 60,
                    condicao: ['Céu limpo', 'Parcialmente nublado', 'Chuva fraca'][Math.floor(Math.random() * 3)]
                };
            }),
            localizacao: {
                nome: this.locationName,
                latitude: this.latitude,
                longitude: this.longitude,
                altitude: 760
            },
            ultimaAtualizacao: agora,
            fonte: 'Dados simulados (Open-Meteo indisponível)',
            status: 'fallback'
        };
    }

    /**
     * Obtém recomendações para manejo do galinheiro baseado no clima
     * @param {Object} dadosClima - Dados climáticos atuais
     * @returns {Object} Recomendações e alertas
     */
    obterRecomendacoes(dadosClima) {
        const { temperatura, umidade, velocidadeVento } = dadosClima;
        const recomendacoes = [];
        let alerta = null;
        let cor = 'green';

        // Análise de temperatura
        if (temperatura > 30) {
            recomendacoes.push('🌡️ Temperatura alta: Aumente a ventilação e disponibilize mais água');
            recomendacoes.push('☂️ Considere criar sombra adicional no galinheiro');
            alerta = 'Calor excessivo pode reduzir a postura de ovos';
            cor = 'orange';
        } else if (temperatura < 15) {
            recomendacoes.push('🥶 Temperatura baixa: Proteja as galinhas do frio');
            recomendacoes.push('🏠 Verifique se o galinheiro está bem vedado');
            alerta = 'Frio pode afetar a saúde das galinhas';
            cor = 'blue';
        } else {
            recomendacoes.push('🌡️ Temperatura ideal para criação de galinhas');
        }

        // Análise de umidade
        if (umidade > 80) {
            recomendacoes.push('💧 Umidade alta: Melhore a ventilação');
            recomendacoes.push('🏠 Mantenha a cama do galinheiro seca');
            if (!alerta) {
                alerta = 'Alta umidade favorece proliferação de fungos';
                cor = 'yellow';
            }
        } else if (umidade < 40) {
            recomendacoes.push('🏜️ Umidade baixa: Monitore hidratação das aves');
        } else {
            recomendacoes.push('💧 Umidade adequada para o galinheiro');
        }

        // Análise de vento
        if (velocidadeVento > 25) {
            recomendacoes.push('💨 Ventos fortes: Proteja o galinheiro');
            if (!alerta) {
                alerta = 'Ventos fortes podem estressar as galinhas';
                cor = 'orange';
            }
        }

        return {
            recomendacoes,
            alerta,
            cor,
            pontuacao: this.calcularPontuacaoClima(temperatura, umidade, velocidadeVento)
        };
    }

    /**
     * Calcula pontuação de adequação climática (0-100)
     * @param {number} temp - Temperatura
     * @param {number} umidade - Umidade
     * @param {number} vento - Velocidade do vento
     * @returns {number} Pontuação 0-100
     */
    calcularPontuacaoClima(temp, umidade, vento) {
        let pontuacao = 100;

        // Penalidades por temperatura
        if (temp > 30 || temp < 15) pontuacao -= 20;
        else if (temp > 28 || temp < 18) pontuacao -= 10;

        // Penalidades por umidade
        if (umidade > 80 || umidade < 40) pontuacao -= 15;
        else if (umidade > 75 || umidade < 50) pontuacao -= 5;

        // Penalidades por vento
        if (vento > 25) pontuacao -= 15;
        else if (vento > 20) pontuacao -= 5;

        return Math.max(0, Math.min(100, pontuacao));
    }
}

// Instância singleton
const openMeteoWeatherService = new OpenMeteoWeatherService();

export default openMeteoWeatherService;