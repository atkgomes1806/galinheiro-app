import { registroOvoRepository } from '../../infrastructure/config';

/**
 * Use Case: Registrar múltiplos ovos em uma única operação
 * @param {string} galinhaId - ID da galinha (obrigatório)
 * @param {Object} detalhesOvos - Map de { data_postura: { peso_gramas, qualidade_casca } }
 * @param {Object} repositorio - Repositório (opcional, usa injeção padrão)
 * @returns {Promise<Object>} { sucesso: number, falhas: Array, registros: Array }
 * @throws {Error} Se validação crítica falhar
 */
export async function registrarMultiplosOvos(galinhaId, detalhesOvos, repositorio = registroOvoRepository) {
    // Validações
    if (!galinhaId || galinhaId.trim() === '') {
        throw new Error('O ID da galinha é obrigatório.');
    }

    if (!detalhesOvos || Object.keys(detalhesOvos).length === 0) {
        throw new Error('Nenhuma data foi selecionada.');
    }

    const resultado = {
        sucesso: 0,
        falhas: [],
        registros: []
    };

    // Processar cada data selecionada
    for (const [dataPostura, detalhe] of Object.entries(detalhesOvos)) {
        try {
            // Validação de data
            if (!dataPostura) {
                resultado.falhas.push({
                    data: dataPostura,
                    erro: 'Data inválida'
                });
                continue;
            }

            // Validação de peso (opcional)
            let pesoGramas = null;
            if (detalhe.peso_gramas && detalhe.peso_gramas !== '') {
                const peso = parseFloat(detalhe.peso_gramas);
                if (isNaN(peso) || peso <= 0 || peso > 200) {
                    resultado.falhas.push({
                        data: dataPostura,
                        erro: 'Peso inválido'
                    });
                    continue;
                }
                pesoGramas = peso;
            }

            // Validação de qualidade (opcional)
            let qualidadeCasca = null;
            if (detalhe.qualidade_casca && detalhe.qualidade_casca !== '') {
                const qualidades = ['Excelente', 'Boa', 'Regular', 'Ruim'];
                if (!qualidades.includes(detalhe.qualidade_casca)) {
                    resultado.falhas.push({
                        data: dataPostura,
                        erro: 'Qualidade de casca inválida'
                    });
                    continue;
                }
                qualidadeCasca = detalhe.qualidade_casca;
            }

            // Preparar dados para inserção
            // Importante: quantidade agora é sempre 1 (uma galinha só põe 1 ovo por dia)
            const dadosNormalizados = {
                galinha_id: galinhaId.trim(),
                data_postura: dataPostura,
                quantidade: 1, // Sempre 1 ovo por data
                peso_gramas: pesoGramas,
                qualidade_casca: qualidadeCasca
            };

            // Inserir no banco
            const novoRegistro = await repositorio.criar(dadosNormalizados);
            resultado.sucesso++;
            resultado.registros.push(novoRegistro);

        } catch (erro) {
            resultado.falhas.push({
                data: dataPostura,
                erro: erro.message
            });
        }
    }

    return resultado;
}

export default registrarMultiplosOvos;
