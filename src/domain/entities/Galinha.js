/**
 * Modelo leve de Galinha
 * Centraliza o shape/DTO, sem regras adicionais de negócio.
 */
class Galinha {
  constructor({
    id = null,
    nome = '',
    idade = 0,
    raca = '',
    dataAquisicao = null,
    statusProducao = 'ativa',
    dataMorte = null
  } = {}) {
    this.id = id;
    this.nome = nome;
    this.idade = idade;
    this.raca = raca;
    this.dataAquisicao = dataAquisicao;
    this.statusProducao = statusProducao;
    this.dataMorte = dataMorte;
  }

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