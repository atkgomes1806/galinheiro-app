import { galinhaRepository, registroOvoRepository, tratamentoRepository } from '../../infrastructure/config';

/**
 * Use Case: Obter Sumário Completo do Galinheiro
 * Agrega métricas de todas as entidades para o Dashboard
 * @returns {Promise<Object>} Sumário com todas as métricas
 */
export async function obterSumarioGalinheiro() {
    try {
        // Busca dados de todas as entidades em paralelo (otimização)
        const [galinhas, registrosOvos, tratamentos] = await Promise.all([
            galinhaRepository.fetchAllGalinhas(),
            registroOvoRepository.fetchAllRegistros(),
            tratamentoRepository.fetchAllTratamentos()
        ]);

        // 1. Métricas de Galinhas
        const totalGalinhas = galinhas.filter(g => g.status === 'Ativa' || !g.status).length;
        const galinhasInativas = galinhas.filter(g => g.status === 'Inativa').length;

        // 2. Métricas de Ovos (últimos 7 dias)
        const hoje = new Date();
        const seteDiasAtras = new Date(hoje);
        seteDiasAtras.setDate(hoje.getDate() - 7);

        const registrosUltimos7Dias = registrosOvos.filter(registro => {
            const dataPostura = new Date(registro.data_postura);
            return dataPostura >= seteDiasAtras && dataPostura <= hoje;
        });

        const totalOvos7Dias = registrosUltimos7Dias.reduce(
            (total, registro) => total + (registro.quantidade || 0),
            0
        );

        const mediaPostura7Dias = totalGalinhas > 0 
            ? (totalOvos7Dias / totalGalinhas).toFixed(2)
            : 0;

        // Produção por galinha (top performers)
        const producaoPorGalinha = {};
        registrosUltimos7Dias.forEach(registro => {
            const galinhaId = registro.galinha_id;
            if (!producaoPorGalinha[galinhaId]) {
                producaoPorGalinha[galinhaId] = {
                    nome: registro.Galinhas?.nome || 'Desconhecida',
                    total: 0
                };
            }
            producaoPorGalinha[galinhaId].total += registro.quantidade || 0;
        });

        const topProducers = Object.values(producaoPorGalinha)
            .sort((a, b) => b.total - a.total)
            .slice(0, 3);

        // 3. Métricas de Tratamentos
        // No Supabase, concluido é text: 'false' ou 'true'
        const tratamentosAtivos = tratamentos.filter(t => t.concluido === 'false').length;
        const tratamentosConcluidos = tratamentos.filter(t => t.concluido === 'true').length;

        // Calcular tratamentos em alerta (vencidos ou vencendo hoje/próximos 3 dias)
        hoje.setHours(0, 0, 0, 0);
        
        const tratamentosEmAlerta = tratamentos.filter(t => {
            if (t.concluido === 'true' || !t.data_fim_prevista) return false;
            
            const dataFim = new Date(t.data_fim_prevista);
            dataFim.setHours(0, 0, 0, 0);
            
            const diffDias = Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24));
            
            // Alerta: vencido ou vence em até 3 dias
            return diffDias <= 3;
        });

        const tratamentosEmAlertaCount = tratamentosEmAlerta.length;

        // Tratamentos vencidos (crítico)
        const tratamentosVencidos = tratamentosEmAlerta.filter(t => {
            const dataFim = new Date(t.data_fim_prevista);
            dataFim.setHours(0, 0, 0, 0);
            return dataFim < hoje;
        }).length;

        // 4. Métricas de Produção (últimos 30 dias para tendência)
        const trintaDiasAtras = new Date(hoje);
        trintaDiasAtras.setDate(hoje.getDate() - 30);

        const registrosUltimos30Dias = registrosOvos.filter(registro => {
            const dataPostura = new Date(registro.data_postura);
            return dataPostura >= trintaDiasAtras && dataPostura <= hoje;
        });

        const totalOvos30Dias = registrosUltimos30Dias.reduce(
            (total, registro) => total + (registro.quantidade || 0),
            0
        );

        const mediaPostura30Dias = totalGalinhas > 0
            ? (totalOvos30Dias / totalGalinhas).toFixed(2)
            : 0;

        // 5. Saúde Geral do Galinheiro
        const pontuacaoSaude = calcularPontuacaoSaude({
            totalGalinhas,
            mediaPostura7Dias: parseFloat(mediaPostura7Dias),
            tratamentosAtivos,
            tratamentosEmAlertaCount
        });

        return {
            // Métricas de Galinhas
            galinhas: {
                total: totalGalinhas,
                ativas: totalGalinhas,
                inativas: galinhasInativas
            },
            
            // Métricas de Ovos
            ovos: {
                ultimos7Dias: totalOvos7Dias,
                ultimos30Dias: totalOvos30Dias,
                mediaPostura7Dias: parseFloat(mediaPostura7Dias),
                mediaPostura30Dias: parseFloat(mediaPostura30Dias),
                topProducers
            },
            
            // Métricas de Tratamentos
            tratamentos: {
                ativos: tratamentosAtivos,
                concluidos: tratamentosConcluidos,
                emAlerta: tratamentosEmAlertaCount,
                vencidos: tratamentosVencidos,
                alertas: tratamentosEmAlerta.map(t => ({
                    id: t.id,
                    galinha: t.Galinhas?.nome || 'Desconhecida',
                    tipo: t.tipo_tratamento,
                    dataFimPrevista: t.data_fim_prevista
                }))
            },
            
            // Saúde Geral
            saudeGeral: pontuacaoSaude
        };
    } catch (error) {
        console.error('Erro ao obter sumário do galinheiro:', error.message);
        throw new Error('Não foi possível carregar o sumário. Tente novamente.');
    }
}

/**
 * Calcula pontuação de saúde do galinheiro (0-100)
 * @param {Object} metricas - Métricas para cálculo
 * @returns {Object} Pontuação e status
 */
function calcularPontuacaoSaude({ totalGalinhas, mediaPostura7Dias, tratamentosAtivos, tratamentosEmAlertaCount }) {
    let pontuacao = 100;

    // Penalidades
    if (totalGalinhas === 0) pontuacao -= 50;
    if (mediaPostura7Dias < 0.5) pontuacao -= 20; // Produção baixa
    if (tratamentosAtivos > totalGalinhas * 0.3) pontuacao -= 15; // Muitos tratamentos
    if (tratamentosEmAlertaCount > 0) pontuacao -= (tratamentosEmAlertaCount * 10); // Alertas críticos

    pontuacao = Math.max(0, Math.min(100, pontuacao));

    let status = 'Excelente';
    let cor = 'green';
    
    if (pontuacao < 90) {
        status = 'Bom';
        cor = 'lightgreen';
    }
    if (pontuacao < 70) {
        status = 'Atenção';
        cor = 'yellow';
    }
    if (pontuacao < 50) {
        status = 'Crítico';
        cor = 'orange';
    }
    if (pontuacao < 30) {
        status = 'Emergência';
        cor = 'red';
    }

    return {
        pontuacao: Math.round(pontuacao),
        status,
        cor
    };
}
