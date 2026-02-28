import React from 'react';

const ReproductiveStatusWidget = ({ galinhas = [] }) => {
  // Calcula estatísticas de status reprodutivo
  const stats = {
    laying: galinhas.filter(g => (g.status_reprodutivo || 'laying') === 'laying').length,
    broody: galinhas.filter(g => (g.status_reprodutivo || 'laying') === 'broody').length,
    molting: galinhas.filter(g => (g.status_reprodutivo || 'laying') === 'molting').length,
  };

  // Lista de galinhas em choco com dias de início
  const birdsBroodingList = galinhas
    .filter(g => (g.status_reprodutivo || 'laying') === 'broody')
    .map(g => {
      const now = new Date();
      const startDate = g.data_inicio_status ? new Date(g.data_inicio_status) : null;
      const daysGoing = startDate && !Number.isNaN(startDate.getTime())
        ? Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
        : 0;
      
      return {
        name: g.nome,
        startDate: g.data_inicio_status,
        daysGoing: daysGoing > 0 ? daysGoing : 0
      };
    });

  // Lista de galinhas em muda
  const birdsMoltingList = galinhas
    .filter(g => (g.status_reprodutivo || 'laying') === 'molting')
    .map(g => ({
      name: g.nome,
      startDate: g.data_inicio_status
    }));

  const totalGalinhas = galinhas.length;
  const percentageLaying = totalGalinhas > 0 
    ? Math.round((stats.laying / totalGalinhas) * 100) 
    : 0;

  return (
    <div className="reproductive-status-widget-modern">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-icon">🐔</span>
          Status Reprodutivo
        </h2>
        <span className="section-subtitle">Visão geral do plantel</span>
      </div>
      
      <div className="status-stats-modern">
        <div className="stat-card-modern stat-card-modern--laying">
          <div className="stat-card-icon">🟢</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.laying}</div>
            <div className="stat-card-label">Em Postura</div>
            <div className="stat-card-detail">{percentageLaying}% do plantel</div>
            <div className="stat-card-bar">
              <div className="stat-card-bar-fill" style={{ width: `${percentageLaying}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="stat-card-modern stat-card-modern--broody">
          <div className="stat-card-icon">🔴</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.broody}</div>
            <div className="stat-card-label">Em Choco</div>
            <div className="stat-card-detail">
              {stats.broody === 0 ? 'Nenhuma em choco' : `${stats.broody} galinha${stats.broody > 1 ? 's' : ''}`}
            </div>
          </div>
        </div>
        
        <div className="stat-card-modern stat-card-modern--molting">
          <div className="stat-card-icon">🟡</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.molting}</div>
            <div className="stat-card-label">Em Muda</div>
            <div className="stat-card-detail">
              {stats.molting === 0 ? 'Nenhuma em muda' : `${stats.molting} galinha${stats.molting > 1 ? 's' : ''}`}
            </div>
          </div>
        </div>
      </div>

      {/* Alerta: Galinhas em choco */}
      {birdsBroodingList.length > 0 && (
        <div className="status-alert alert-broody">
          <strong>🔴 Galinhas em Choco:</strong>
          <ul className="alert-list">
            {birdsBroodingList.map((bird, idx) => (
              <li key={idx}>
                <strong>{bird.name}</strong> há {bird.daysGoing} dias
              </li>
            ))}
          </ul>
          <small className="alert-note">
            Essas galinhas dificilmente produzirão ovos durante este período
          </small>
        </div>
      )}

      {/* Alerta: Galinhas em muda */}
      {birdsMoltingList.length > 0 && (
        <div className="status-alert alert-molting">
          <strong>🟡 Galinhas em Muda:</strong>
          <ul className="alert-list">
            {birdsMoltingList.map((bird, idx) => (
              <li key={idx}>
                <strong>{bird.name}</strong>
              </li>
            ))}
          </ul>
          <small className="alert-note">
            Produção de ovos reduzida durante a muda de penas
          </small>
        </div>
      )}

      {/* Dados gerais */}
      <div className="status-info">
        <div className="info-item">
          <span className="info-label">Total de Galinhas:</span>
          <span className="info-value">{totalGalinhas}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Disponíveis para Postura:</span>
          <span className="info-value">{stats.laying}</span>
        </div>
      </div>
    </div>
  );
};

export default ReproductiveStatusWidget;
