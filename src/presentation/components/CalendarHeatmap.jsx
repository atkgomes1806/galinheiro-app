import React from 'react';
import { formatDateBRFromString } from '../../utils';

const CalendarHeatmap = ({ days = [], month, year }) => {
    const weeks = chunkIntoWeeks(days);
    const monthLabel = `${String(month).padStart(2, '0')}/${year}`;

    return (
        <div className="heatmap-card">
            <div className="heatmap-legend">
                <span>{monthLabel}</span>
                <div className="legend-scale">
                    <span>0%</span>
                    <div className="legend-bar">
                        <span className="legend-stop level-0"></span>
                        <span className="legend-stop level-1"></span>
                        <span className="legend-stop level-2"></span>
                        <span className="legend-stop level-3"></span>
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
                            const level = getLevel(day);
                            const tooltip = buildTooltip(day);
                            return (
                                <div
                                    key={`${wIdx}-${dIdx}`}
                                    className={`heatmap-cell level-${level}`}
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

function buildTooltip(day) {
    if (!day || !day.date) return '';
    const dateLabel = formatDateBRFromString(day.date);
    const percentLabel = day.percent !== undefined ? `${Math.round(day.percent)}%` : '';
    const hensList = day.galinhas?.length ? day.galinhas.join(', ') : '';
    const eggsLabel = `${day.value || 0} ovo(s)`;
    const percentText = percentLabel ? ` - ${percentLabel} das galinhas` : '';
    const hensText = hensList ? `\n${hensList}` : '';
    return `${dateLabel}: ${eggsLabel}${percentText}${hensText}`;
}

function getLevel(day) {
    if (!day || !day.date) return 0;
    const pct = day.percent || 0;
    if (pct === 0) return 0;
    if (pct < 25) return 1;
    if (pct < 50) return 2;
    return 3;
}

function chunkIntoWeeks(days) {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }
    return weeks;
}

export default CalendarHeatmap;
