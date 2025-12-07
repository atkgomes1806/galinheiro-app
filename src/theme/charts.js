// Tokens específicos para gráficos e visualizações
import { COLORS } from './tokens';

export const TIME_SERIES_PALETTE = {
  line: COLORS.primary,
  fill: 'rgba(16, 185, 129, 0.15)',
  point: COLORS.primaryDark,
  axis: COLORS.gray[500],
  grid: COLORS.gray[200],
  tooltipBg: '#111827',
  tooltipText: '#ffffff'
};

export const HEATMAP_THRESHOLDS = {
  LEVEL_0: { min: 0, max: 0, label: '0%', description: 'Nenhuma galinha produziu' },
  LEVEL_1: { min: 1, max: 25, label: '<25%', description: 'Poucas galinhas' },
  LEVEL_2: { min: 25, max: 50, label: '25-50%', description: 'Metade do plantel' },
  LEVEL_3: { min: 50, max: 100, label: '>50%', description: 'Maioria produzindo' }
};

export const HEATMAP_COLORS = {
  LEVEL_0: COLORS.gray[300],
  LEVEL_1: '#a7f3d0',
  LEVEL_2: '#6ee7b7',
  LEVEL_3: COLORS.primary
};

export function getHeatmapLevel(percentage) {
  if (percentage === 0) return 0;
  if (percentage < 25) return 1;
  if (percentage <= 50) return 2;
  return 3;
}

export function getHeatmapColor(percentage) {
  const level = getHeatmapLevel(percentage);
  const levelKeys = Object.keys(HEATMAP_COLORS);
  return HEATMAP_COLORS[levelKeys[level]];
}

export function getHeatmapLevelDescription(percentage) {
  const level = getHeatmapLevel(percentage);
  const levelKeys = Object.keys(HEATMAP_THRESHOLDS);
  return HEATMAP_THRESHOLDS[levelKeys[level]].description;
}

export function getHeatmapThreshold(percentage) {
  const level = getHeatmapLevel(percentage);
  const levelKeys = Object.keys(HEATMAP_THRESHOLDS);
  return HEATMAP_THRESHOLDS[levelKeys[level]];
}

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
