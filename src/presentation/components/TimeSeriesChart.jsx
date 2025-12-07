import React from 'react';

const TimeSeriesChart = ({ data = [], height = 240, color = 'var(--primary)' }) => {
    if (!data || data.length === 0) {
        return <div className="timeseries-empty">Sem dados para o período selecionado.</div>;
    }

    const paddingX = 24;
    const paddingY = 20;
    const width = 100;
    const maxVal = Math.max(...data.map((d) => d.value), 1);
    const stepX = data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0;

    const points = data.map((d, idx) => {
        const x = paddingX + idx * stepX;
        const y = paddingY + (1 - d.value / maxVal) * (height - paddingY * 2);
        return { x, y };
    });

    const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

    return (
        <div className="timeseries-chart">
            <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                {/* Área preenchida */}
                <polygon
                    fill={color + '22'}
                    points={`${paddingX},${height - paddingY} ${polylinePoints} ${paddingX + stepX * (data.length - 1)},${height - paddingY}`}
                />
                {/* Linha */}
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    points={polylinePoints}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
                {/* Pontos */}
                {points.map((p, idx) => (
                    <g key={idx}>
                        <circle cx={p.x} cy={p.y} r="1.8" fill={color} />
                        <text x={p.x} y={p.y - 2} className="timeseries-point-label">
                            {data[idx].value}
                        </text>
                    </g>
                ))}
                {/* Eixo X labels */}
                {data.map((d, idx) => (
                    <text
                        key={`lbl-${idx}`}
                        x={paddingX + idx * stepX}
                        y={height - 6}
                        className="timeseries-x-label"
                    >
                        {d.label}
                    </text>
                ))}
            </svg>
        </div>
    );
};

export default TimeSeriesChart;
