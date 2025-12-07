/**
 * DashboardService - Facade de Serviços
 * 
 * Orquestra múltiplos use cases para o Dashboard
 * Desacopla a Presentation Layer da Application Layer
 * Permite trocar implementações sem afetar componentes UI
 */

import { obterSumarioGalinheiro } from '../use-cases/obterSumarioGalinheiro';
import { listarRegistrosOvos } from '../use-cases/listarRegistrosOvos';
import { listarGalinhas } from '../use-cases/listarGalinhas';
import { listarTratamentos } from '../use-cases/listarTratamentos';

export class DashboardService {
  /**
   * Construtor do serviço
   * @param {GalinhaRepository} galinhaRepository - Repositório de galinhas
   * @param {RegistroOvoRepository} registroOvoRepository - Repositório de registros de ovos
   * @param {TratamentoRepository} tratamentoRepository - Repositório de tratamentos
   */
  constructor(
    galinhaRepository,
    registroOvoRepository,
    tratamentoRepository
  ) {
    if (!galinhaRepository) {
      throw new Error('galinhaRepository é obrigatório');
    }
    if (!registroOvoRepository) {
      throw new Error('registroOvoRepository é obrigatório');
    }
    if (!tratamentoRepository) {
      throw new Error('tratamentoRepository é obrigatório');
    }

    this.galinhaRepository = galinhaRepository;
    this.registroOvoRepository = registroOvoRepository;
    this.tratamentoRepository = tratamentoRepository;
  }

  /**
   * Carrega todos os dados do Dashboard
   * Orquestra chamadas aos 3 use cases principais
   * 
   * @param {object} opcoes - Opções de carregamento
   * @param {number} opcoes.anoSelecionado - Ano para filtro
   * @returns {object} Objeto com { sumario, galinhas, registros, tratamentos }
   * @throws {Error} Se alguma operação falhar
   */
  async carregarDadosDashboard(opcoes = {}) {
    try {
      // Carrega os dados em paralelo para otimizar performance
      const [sumario, galinhas, registros, tratamentos] = await Promise.all([
        obterSumarioGalinheiro(this.galinhaRepository, opcoes),
        listarGalinhas(this.galinhaRepository),
        listarRegistrosOvos(this.registroOvoRepository),
        listarTratamentos(this.tratamentoRepository)
      ]);

      return {
        sumario,
        galinhas,
        registros,
        tratamentos,
        carregadoEm: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(
        `Erro ao carregar dados do dashboard: ${error.message}`
      );
    }
  }

  /**
   * Carrega apenas o sumário (dados rápidos)
   * Útil para refresh rápido sem recarregar tudo
   * 
   * @param {object} opcoes - Opções de carregamento
   * @returns {object} Sumário com métricas principais
   */
  async carregarSumario(opcoes = {}) {
    try {
      return await obterSumarioGalinheiro(this.galinhaRepository, opcoes);
    } catch (error) {
      throw new Error(`Erro ao carregar sumário: ${error.message}`);
    }
  }

  /**
   * Carrega dados de galinhas
   * 
   * @returns {array} Lista de galinhas
   */
  async carregarGalinhas() {
    try {
      return await listarGalinhas(this.galinhaRepository);
    } catch (error) {
      throw new Error(`Erro ao carregar galinhas: ${error.message}`);
    }
  }

  /**
   * Carrega registros de ovos
   * 
   * @returns {array} Lista de registros de ovos
   */
  async carregarRegistros() {
    try {
      return await listarRegistrosOvos(this.registroOvoRepository);
    } catch (error) {
      throw new Error(`Erro ao carregar registros: ${error.message}`);
    }
  }

  /**
   * Carrega tratamentos
   * 
   * @returns {array} Lista de tratamentos
   */
  async carregarTratamentos() {
    try {
      return await listarTratamentos(this.tratamentoRepository);
    } catch (error) {
      throw new Error(`Erro ao carregar tratamentos: ${error.message}`);
    }
  }

  /**
   * Calcula série temporal para gráfico
   * Filtra registros por período e galinha
   * 
   * @param {array} registros - Lista de registros de ovos
   * @param {string} periodo - 'mes' ou 'ano'
   * @param {number} galinha - ID da galinha (null = todas)
   * @returns {array} Array com { label, value, galinhas }
   */
  calcularSerieTemporalPorPeriodo(registros, periodo = 'mes', galinha = null) {
    if (!Array.isArray(registros) || registros.length === 0) {
      return [];
    }

    const agrupado = {};
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();

    registros.forEach(registro => {
      const data = new Date(registro.data);
      const ano = data.getFullYear();

      // Filtra por ano atual
      if (ano !== anoAtual) return;

      // Filtra por galinha se especificada
      if (galinha && registro.galinha_id !== galinha) return;

      let chave;
      if (periodo === 'mes') {
        chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      } else {
        chave = String(data.getMonth() + 1).padStart(2, '0');
      }

      if (!agrupado[chave]) {
        agrupado[chave] = { total: 0, galinhas: new Set() };
      }

      agrupado[chave].total += registro.quantidade || 1;
      if (registro.galinha_nome) {
        agrupado[chave].galinhas.add(registro.galinha_nome);
      }
    });

    // Converte para array com labels
    const resultado = Object.entries(agrupado).map(([chave, dados]) => ({
      label: chave,
      value: dados.total,
      galinhas: Array.from(dados.galinhas)
    }));

    return resultado.sort((a, b) => a.label.localeCompare(b.label));
  }

  /**
   * Calcula dados para heatmap mensal
   * 
   * @param {array} registros - Lista de registros de ovos
   * @param {number} mes - Mês (1-12)
   * @param {number} ano - Ano
   * @param {number} totalGalinhas - Total de galinhas no rebanho
   * @returns {array} Array com dados para cada dia do mês
   */
  calcularDadosHeatmapMensal(registros, mes, ano, totalGalinhas = 1) {
    if (!Array.isArray(registros) || registros.length === 0) {
      return [];
    }

    const diasDoMes = new Date(ano, mes, 0).getDate();
    const agrupado = {};

    // Inicializa dias com valores padrão
    for (let dia = 1; dia <= diasDoMes; dia++) {
      const chave = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      agrupado[chave] = {
        dia,
        total: 0,
        galinhas: new Set()
      };
    }

    // Popula com dados dos registros
    registros.forEach(registro => {
      const data = new Date(registro.data);
      if (data.getFullYear() !== ano || data.getMonth() + 1 !== mes) return;

      const chave = `${ano}-${String(mes).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;

      if (agrupado[chave]) {
        agrupado[chave].total += registro.quantidade || 1;
        if (registro.galinha_nome) {
          agrupado[chave].galinhas.add(registro.galinha_nome);
        }
      }
    });

    // Converte para formato esperado
    return Object.entries(agrupado).map(([data, dados]) => ({
      date: data,
      label: dados.dia,
      value: dados.total,
      percent: totalGalinhas > 0
        ? Math.round((dados.galinhas.size / totalGalinhas) * 100)
        : 0,
      galinhas: Array.from(dados.galinhas)
    }));
  }

  /**
   * Obtém estatísticas rápidas do dashboard
   * 
   * @param {array} galinhas - Lista de galinhas
   * @param {array} registros - Lista de registros de ovos
   * @param {array} tratamentos - Lista de tratamentos
   * @returns {object} Objeto com métricas principais
   */
  obterEstatisticas(galinhas = [], registros = [], tratamentos = []) {
    const totalGalinhas = galinhas.length;
    const galinhasVivas = galinhas.filter(g => g.statusProducao !== 'morta').length;
    const galinhasProducao = galinhas.filter(g => {
      // Verifica condições de produção simplificadas
      return (
        g.statusProducao === 'ativa' &&
        g.idade >= 6 &&
        g.idade <= 12
      );
    }).length;

    const totalOvos = registros.reduce((sum, r) => sum + (r.quantidade || 1), 0);
    const mediaOvosDia = registros.length > 0 ? (totalOvos / registros.length).toFixed(2) : 0;
    const tratamentosAtivos = tratamentos.filter(t => !t.data_conclusao).length;

    return {
      totalGalinhas,
      galinhasVivas,
      galinhasProducao,
      percentualProducao: totalGalinhas > 0
        ? Math.round((galinhasProducao / totalGalinhas) * 100)
        : 0,
      totalOvos,
      mediaOvosDia,
      tratamentosAtivos
    };
  }
}
