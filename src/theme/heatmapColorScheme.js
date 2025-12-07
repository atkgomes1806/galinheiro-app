/**
 * Esquema de cores e thresholds para o Heatmap
 * Centraliza a lógica de mapeamento de percentuais para cores
 */

export const HEATMAP_THRESHOLDS = {
  LEVEL_0: { min: 0, max: 0, label: '0%', description: 'Nenhuma galinha produziu' },
  LEVEL_1: { min: 1, max: 25, label: '<25%', description: 'Poucas galinhas' },
  LEVEL_2: { min: 25, max: 50, label: '25-50%', description: 'Metade do plantel' },
  LEVEL_3: { min: 50, max: 100, label: '>50%', description: 'Maioria produzindo' }
};

export const HEATMAP_COLORS = {
  LEVEL_0: '#d1d5db', // Cinza claro - sem produção
  LEVEL_1: '#a7f3d0', // Verde muito claro - produção baixa
  LEVEL_2: '#6ee7b7', // Verde médio - produção média
  LEVEL_3: '#10b981'  // Verde escuro - alta produção
};

/**
 * Determina o nível de intensidade baseado no percentual
 * @param {number} percentage - Percentual de 0-100
 * @returns {number} Nível de 0-3
 */
export function getHeatmapLevel(percentage) {
  if (percentage === 0) return 0;
  if (percentage < 25) return 1;
  if (percentage <= 50) return 2;
  return 3;
}

/**
 * Obtém a cor correspondente ao percentual
 * @param {number} percentage - Percentual de 0-100
 * @returns {string} Código de cor hexadecimal
 */
export function getHeatmapColor(percentage) {
  const level = getHeatmapLevel(percentage);
  const levelKeys = Object.keys(HEATMAP_COLORS);
  return HEATMAP_COLORS[levelKeys[level]];
}

/**
 * Obtém a descrição do nível
 * @param {number} percentage - Percentual de 0-100
 * @returns {string} Descrição do nível
 */
export function getHeatmapLevelDescription(percentage) {
  const level = getHeatmapLevel(percentage);
  const levelKeys = Object.keys(HEATMAP_THRESHOLDS);
  return HEATMAP_THRESHOLDS[levelKeys[level]].description;
}

/**
 * Retorna o objeto completo de threshold para um percentual
 * @param {number} percentage - Percentual de 0-100
 * @returns {object} Threshold com min, max, label, description
 */
export function getHeatmapThreshold(percentage) {
  const level = getHeatmapLevel(percentage);
  const levelKeys = Object.keys(HEATMAP_THRESHOLDS);
  return HEATMAP_THRESHOLDS[levelKeys[level]];
}

/**
 * Mapeia todos os níveis para dados de legenda
 * Útil para renderizar a legenda de cores no heatmap
 * @returns {array} Array com objetos { level, color, label, description }
 */
export function getHeatmapLegendData() {
  return Object.entries(HEATMAP_COLORS).map(([level, color], index) => {
    const threshold = Object.values(HEATMAP_THRESHOLDS)[index];
    return {
      level: index,
      color,
      label: threshold.label,
      description: threshold.description
    };
  });
}
