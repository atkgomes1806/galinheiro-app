/**
 * Entidade de Domínio: Galinha
 * 
 * Representa uma galinha com lógica de negócio, validações e ciclo de vida.
 * Esta é a entidade central do domínio do Galinheiro App.
 */
class Galinha {
  // Constantes de domínio
  static readonly IDADE_MAXIMA = 15;
  static readonly IDADE_MINIMA_PRODUCAO = 6;
  static readonly IDADE_MAXIMA_PRODUCAO = 12;
  
  static readonly STATUS_FILHOTE = 'filhote';
  static readonly STATUS_ATIVA = 'ativa';
  static readonly STATUS_QUARENTENA = 'quarentena';
  static readonly STATUS_MORTA = 'morta';

  constructor({
    id = null,
    nome,
    idade = 0,
    raca,
    dataAquisicao,
    statusProducao = Galinha.STATUS_FILHOTE,
    dataMorte = null
  } = {}) {
    // Validações na construção
    this.validarNome(nome);
    this.validarIdade(idade);
    this.validarStatus(statusProducao);

    this.id = id;
    this.nome = nome;
    this.idade = idade;
    this.raca = raca;
    this.dataAquisicao = dataAquisicao;
    this.statusProducao = statusProducao;
    this.dataMorte = dataMorte;
  }

  // ============== VALIDAÇÕES ==============

  /**
   * Valida se o nome é válido
   * @param {string} nome - Nome da galinha
   * @throws {Error} Se nome inválido
   */
  validarNome(nome) {
    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }
  }

  /**
   * Valida se a idade é válida
   * @param {number} idade - Idade da galinha em meses
   * @throws {Error} Se idade inválida
   */
  validarIdade(idade) {
    const idadeNum = parseInt(idade, 10);
    if (isNaN(idadeNum) || idadeNum < 0 || idadeNum > Galinha.IDADE_MAXIMA) {
      throw new Error(
        `Idade deve estar entre 0 e ${Galinha.IDADE_MAXIMA} meses`
      );
    }
  }

  /**
   * Valida se o status é válido
   * @param {string} status - Status da galinha
   * @throws {Error} Se status inválido
   */
  validarStatus(status) {
    const statusValidos = [
      Galinha.STATUS_FILHOTE,
      Galinha.STATUS_ATIVA,
      Galinha.STATUS_QUARENTENA,
      Galinha.STATUS_MORTA
    ];
    if (!statusValidos.includes(status)) {
      throw new Error(`Status inválido: ${status}`);
    }
  }

  // ============== MÉTODOS DE CRIAÇÃO ==============

  /**
   * Factory method para criar nova galinha
   * @param {string} nome - Nome da galinha
   * @param {string} raca - Raça/tipo da galinha
   * @param {Date} dataAquisicao - Data de aquisição
   * @returns {Galinha} Instância de galinha recém-nascida
   */
  static criar(nome, raca, dataAquisicao) {
    return new Galinha({
      id: null,
      nome,
      idade: 0,
      raca,
      dataAquisicao,
      statusProducao: Galinha.STATUS_FILHOTE,
      dataMorte: null
    });
  }

  // ============== MÉTODOS DE CICLO DE VIDA ==============

  /**
   * Verifica se a galinha está viva
   * @returns {boolean} True se viva
   */
  isViva() {
    return !this.dataMorte && this.statusProducao !== Galinha.STATUS_MORTA;
  }

  /**
   * Marca a galinha como morta
   * @param {Date} data - Data da morte (padrão: agora)
   */
  marcarComoMorta(data = new Date()) {
    if (!this.isViva()) {
      throw new Error('Galinha já está morta');
    }
    this.statusProducao = Galinha.STATUS_MORTA;
    this.dataMorte = data;
  }

  /**
   * Envelhece a galinha em 1 mês
   * Se atingir idade máxima, marca como morta automaticamente
   * @throws {Error} Se galinha já está morta
   */
  envelhecer() {
    if (!this.isViva()) {
      throw new Error('Não é possível envelhecer uma galinha morta');
    }

    this.idade += 1;

    // Se atingir idade máxima, morre automaticamente
    if (this.idade > Galinha.IDADE_MAXIMA) {
      this.marcarComoMorta();
    }
  }

  // ============== MÉTODOS DE PRODUÇÃO ==============

  /**
   * Verifica se a galinha está em fase de produção
   * Condições: idade adequada, viva, ativa e não em quarentena
   * @returns {boolean} True se está produzindo
   */
  isProducao() {
    return (
      this.isViva() &&
      this.statusProducao === Galinha.STATUS_ATIVA &&
      this.idade >= Galinha.IDADE_MINIMA_PRODUCAO &&
      this.idade <= Galinha.IDADE_MAXIMA_PRODUCAO
    );
  }

  /**
   * Verifica se a galinha já completou ciclo produtivo
   * @returns {boolean} True se passou da idade máxima de produção
   */
  completouCicloProducao() {
    return this.idade > Galinha.IDADE_MAXIMA_PRODUCAO && this.isViva();
  }

  /**
   * Calcula a percentagem de vida produtiva restante
   * @returns {number} Percentual 0-100
   */
  getPercentualVidaProdutivaRestante() {
    if (!this.isViva()) return 0;

    const vidaProdutivaTotal = Galinha.IDADE_MAXIMA_PRODUCAO - Galinha.IDADE_MINIMA_PRODUCAO;
    const vidaProdutivaAtual = Math.max(0, this.idade - Galinha.IDADE_MINIMA_PRODUCAO);
    const vidaProdutivaRestante = Math.max(0, Galinha.IDADE_MAXIMA_PRODUCAO - this.idade);

    return Math.round((vidaProdutivaRestante / vidaProdutivaTotal) * 100);
  }

  // ============== MÉTODOS DE ESTÁGIO ==============

  /**
   * Obtém o estágio de vida da galinha
   * @returns {string} Estágio: 'filhote', 'producao', 'poedeira_velha', 'apos_vida_util'
   */
  getEstagio() {
    if (!this.isViva()) return 'morta';
    if (this.idade < Galinha.IDADE_MINIMA_PRODUCAO) return 'filhote';
    if (this.idade <= Galinha.IDADE_MAXIMA_PRODUCAO) return 'producao';
    if (this.idade < Galinha.IDADE_MAXIMA) return 'poedeira_velha';
    return 'apos_vida_util';
  }

  /**
   * Obtém descrição legível do estágio
   * @returns {string} Descrição do estágio
   */
  getEstagioDescricao() {
    const estagios = {
      filhote: 'Filhote (0-6 meses)',
      producao: 'Em Produção (6-12 meses)',
      poedeira_velha: 'Poedeira Velha (12-15 meses)',
      apos_vida_util: 'Após Vida Útil (>15 meses)',
      morta: 'Morta'
    };
    return estagios[this.getEstagio()] || 'Desconhecido';
  }

  // ============== MÉTODOS DE TRATAMENTO ==============

  /**
   * Verifica se galinha pode receber tratamento
   * Não pode estar em quarentena ou morta
   * @returns {boolean} True se pode receber tratamento
   */
  podeReceberTratamento() {
    return this.isViva() && this.statusProducao !== Galinha.STATUS_QUARENTENA;
  }

  /**
   * Marca galinha para quarentena
   * @param {Date} data - Data de início da quarentena
   * @throws {Error} Se galinha não puder ser colocada em quarentena
   */
  marcarQuarentena(data = new Date()) {
    if (!this.isViva()) {
      throw new Error('Não é possível colocar galinha morta em quarentena');
    }
    if (this.statusProducao === Galinha.STATUS_QUARENTENA) {
      throw new Error('Galinha já está em quarentena');
    }
    this.statusProducao = Galinha.STATUS_QUARENTENA;
    this.dataQuarentena = data;
  }

  /**
   * Remove galinha de quarentena
   * @throws {Error} Se galinha não estiver em quarentena
   */
  recuperarDeQuarentena() {
    if (this.statusProducao !== Galinha.STATUS_QUARENTENA) {
      throw new Error('Galinha não está em quarentena');
    }
    this.statusProducao = Galinha.STATUS_ATIVA;
    this.dataQuarentena = null;
  }

  // ============== MÉTODOS DE INFORMAÇÃO ==============

  /**
   * Obtém resumo da galinha em formato legível
   * @returns {object} Resumo com informações principais
   */
  getResumo() {
    return {
      id: this.id,
      nome: this.nome,
      idade: this.idade,
      raca: this.raca,
      status: this.statusProducao,
      estagio: this.getEstagio(),
      estagioDescricao: this.getEstagioDescricao(),
      isViva: this.isViva(),
      isProducao: this.isProducao(),
      vidaProdutivaRestante: this.getPercentualVidaProdutivaRestante()
    };
  }

  /**
   * Converte a entidade para objeto simples (DTO)
   * Útil para serialização JSON
   * @returns {object} Objeto com propriedades da galinha
   */
  toDTO() {
    return {
      id: this.id,
      nome: this.nome,
      idade: this.idade,
      raca: this.raca,
      dataAquisicao: this.dataAquisicao,
      statusProducao: this.statusProducao,
      dataMorte: this.dataMorte
    };
  }
}

export default Galinha;