import React from 'react';

const ChickenStatusSelector = ({ 
  value = 'laying', 
  onStatusChange,
  startDate = '',
  onStartDateChange,
  notes = '',
  onNotesChange
}) => {
  const statusOptions = [
    { 
      value: 'laying', 
      label: '🟢 Em Postura', 
      description: 'Galinha produzindo ovos normalmente' 
    },
    { 
      value: 'broody', 
      label: '🔴 Em Choco', 
      description: 'Período fértil - não coloca ovos' 
    },
    { 
      value: 'molting', 
      label: '🟡 Em Muda', 
      description: 'Queda de penas - produção reduzida' 
    }
  ];

  const shouldShowDateFields = value === 'broody' || value === 'molting';

  return (
    <fieldset className="chicken-status-selector">
      <legend>Status Reprodutivo/Fisiológico</legend>
      
      <div className="status-options">
        {statusOptions.map(option => (
          <label
            key={option.value}
            className={`status-option ${value === option.value ? 'is-selected' : ''}`}
          >
            <input
              type="radio"
              name="reproductiveStatus"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onStatusChange(e.target.value)}
              className="status-radio"
            />
            <div className="option-content">
              <span className="option-label">{option.label}</span>
              <small className="option-description">{option.description}</small>
            </div>
          </label>
        ))}
      </div>

      {shouldShowDateFields && (
        <div className="date-group">
          <label htmlFor="statusStartDate">
            Quando começou?
          </label>
          <input
            id="statusStartDate"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="date-input"
          />
          <small>Ajuda a estimar quando retornará à postura</small>
        </div>
      )}

      <div className="notes-group">
        <label htmlFor="statusNotes">Notas (opcional)</label>
        <textarea
          id="statusNotes"
          placeholder="Ex: Galinha muito atenta ao ninho, muda esperada para próximas 2 semanas..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows="3"
          className="notes-textarea"
        />
      </div>
    </fieldset>
  );
};

export default ChickenStatusSelector;
