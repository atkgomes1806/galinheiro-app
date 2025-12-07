import React, { useMemo } from 'react';
import { formatDateBRFromString } from '../../utils';
import {
  getHeatmapLevel,
  getHeatmapColor,
  getHeatmapLevelDescription,
  getHeatmapLegendData
} from '../../theme/heatmapColorScheme';

const CalendarHeatmap = ({ days = [], month, year }) => {
  const weeks = useMemo(() => chunkIntoWeeks(days), [days]);
  const monthLabel = `${String(month).padStart(2, '0')}/${year}`;
  const legendData = useMemo(() => getHeatmapLegendData(), []);

  return (
    <div className="heatmap-card">
      <div className="heatmap-legend">
        <span>{monthLabel}</span>
        <div className="legend-scale">
          <span>0%</span>
          <div className="legend-bar">
            {legendData.map((item) => (
              <span
                key={`legend-${item.level}`}
                className={`legend-stop level-${item.level}`}
                style={{ backgroundColor: item.color }}
                title={item.description}
              />
            ))}
          </div>
          <span>100%</span>
        </div>
      </div>
      <div className="heatmap-grid">
        {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d) => (
          <div key={d} className="heatmap-weekday">{d}</div>
        ))}
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="heatmap-week">
            {week.map((day, dIdx) => {
              const level = getHeatmapLevel(day.percent || 0);
              const color = getHeatmapColor(day.percent || 0);
              const tooltip = buildTooltip(day, level);
              return (
                <div
                  key={`${wIdx}-${dIdx}`}
                  className={`heatmap-cell level-${level}`}
                  style={{ backgroundColor: color }}
                  title={tooltip}
                >
                  {day.label || ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Constrói tooltip com informações do dia
 * @param {object} day - Dados do dia
 * @param {number} level - Nível de intensidade (0-3)
 * @returns {string} Texto do tooltip
 */
function buildTooltip(day, level) {
  if (!day || !day.date) return '';
  
  const dateLabel = formatDateBRFromString(day.date);
  const eggsLabel = `${day.value || 0} ovo(s)`;
  const percentLabel = day.percent !== undefined ? `${Math.round(day.percent)}%` : '';
  const percentText = percentLabel ? ` - ${percentLabel} das galinhas` : '';
  const levelDesc = getHeatmapLevelDescription(day.percent || 0);
  const hensText = day.galinhas?.length ? `\n${day.galinhas.join(', ')}` : '';
  
  return `${dateLabel}: ${eggsLabel}${percentText} (${levelDesc})${hensText}`;
}

/**
 * Agrupa dias em semanas
 * @param {array} days - Lista de dias
 * @returns {array} Array bidimensional com semanas
 */
function chunkIntoWeeks(days) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export default CalendarHeatmap;
