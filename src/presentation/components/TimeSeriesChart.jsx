import React from 'react';

const TimeSeriesChart = ({ data = [], height = 240, color = 'var(--primary)' }) => {
    if (!data || data.length === 0) {
        return <div className="timeseries-empty">Sem dados para o período selecionado.</div>;
    }

    const paddingX = 24;
    const paddingY = 20;
    const baseSegment = 28; // largura mínima entre pontos para evitar esticar
    const width = Math.max(360, paddingX * 2 + baseSegment * Math.max(1, data.length - 1));
    const maxVal = Math.max(...data.map((d) => d.value), 1);
    const stepX = data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0;

    const points = data.map((d, idx) => {
        const x = paddingX + idx * stepX;
        const y = paddingY + (1 - d.value / maxVal) * (height - paddingY * 2);
        return { x, y };
    });

    const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

    const areaFill = 'rgba(16,185,129,0.15)'; // verde translúcido

    return (
        <div className="timeseries-chart">
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Área preenchida */}
                <polygon
                    fill={areaFill}
                    points={`${paddingX},${height - paddingY} ${polylinePoints} ${paddingX + stepX * (data.length - 1)},${height - paddingY}`}
                />
                {/* Linha */}
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    points={polylinePoints}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
                {/* Pontos */}
                {points.map((p, idx) => (
                    <g key={idx}>
                        <circle cx={p.x} cy={p.y} r="2.2" fill={color} />
                        <text x={p.x} y={p.y - 6} className="timeseries-point-label">
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
