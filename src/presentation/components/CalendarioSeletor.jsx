import React, { useState } from 'react';
import '../../styles/calendario.css';

/**
 * Componente de Calendário para seleção de múltiplas datas
 * Permite navegação entre meses/anos e marcação de datas
 */
const CalendarioSeletor = ({ onDatasConfirmadas, onCancelar, initialMonth = new Date() }) => {
    const [currentDate, setCurrentDate] = useState(new Date(initialMonth));
    const [selectedDates, setSelectedDates] = useState(new Set());

    // Obter primeiro dia do mês, último dia, etc.
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = domingo, 6 = sábado

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

    // Gerar array de dias para renderizar (incluindo dias vazios do mês anterior)
    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null); // Dias do mês anterior
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const handleDayClick = (day) => {
        if (!day) return; // Clique em dia vazio
        
        const dateStr = formatDateString(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        const newSelected = new Set(selectedDates);
        
        if (newSelected.has(dateStr)) {
            newSelected.delete(dateStr);
        } else {
            newSelected.add(dateStr);
        }
        
        setSelectedDates(newSelected);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleConfirm = () => {
        const datas = Array.from(selectedDates).sort();
        onDatasConfirmadas(datas);
    };

    const isDaySelected = (day) => {
        if (!day) return false;
        const dateStr = formatDateString(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        return selectedDates.has(dateStr);
    };

    const isDayToday = (day) => {
        if (!day) return false;
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const canGoToPreviousMonth = () => {
        // Permitir navegar pelo menos 12 meses para trás
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        return currentDate > twoYearsAgo;
    };

    const canGoToNextMonth = () => {
        // Permitir navegar pelo menos 12 meses para frente
        const futuro = new Date();
        futuro.setFullYear(futuro.getFullYear() + 1);
        return currentDate < futuro;
    };

    return (
        <div className="calendario-overlay">
            <div className="calendario-modal">
                <div className="calendario-header">
                    <h3>📅 Selecionar Datas</h3>
                    <button className="close-btn" onClick={onCancelar}>✕</button>
                </div>

                <div className="calendario-container">
                    {/* Navegação Mês/Ano */}
                    <div className="calendario-nav">
                        <button
                            onClick={handlePrevMonth}
                            disabled={!canGoToPreviousMonth()}
                            className="nav-btn"
                        >
                            ◀ Anterior
                        </button>
                        <h4>
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h4>
                        <button
                            onClick={handleNextMonth}
                            disabled={!canGoToNextMonth()}
                            className="nav-btn"
                        >
                            Próximo ▶
                        </button>
                    </div>

                    {/* Cabeçalho dos dias da semana */}
                    <div className="calendario-weekdays">
                        {weekDays.map((day) => (
                            <div key={day} className="weekday">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grid de dias */}
                    <div className="calendario-days">
                        {calendarDays.map((day, index) => (
                            <button
                                key={index}
                                className={`day ${!day ? 'empty' : ''} ${isDaySelected(day) ? 'selected' : ''} ${isDayToday(day) ? 'today' : ''}`}
                                onClick={() => handleDayClick(day)}
                                disabled={!day}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Resumo de datas selecionadas */}
                    <div className="calendario-selected-summary">
                        <p>
                            <strong>{selectedDates.size}</strong> data{selectedDates.size !== 1 ? 's' : ''} selecionada{selectedDates.size !== 1 ? 's' : ''}
                        </p>
                        {selectedDates.size > 0 && (
                            <div className="selected-dates-list">
                                {Array.from(selectedDates)
                                    .sort()
                                    .slice(0, 5)
                                    .map((date) => (
                                        <span key={date} className="date-badge">
                                            {formatDisplayDate(date)} ✕
                                        </span>
                                    ))}
                                {selectedDates.size > 5 && (
                                    <span className="date-badge more">
                                        +{selectedDates.size - 5} mais
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Botões de ação */}
                    <div className="calendario-actions">
                        <button
                            onClick={onCancelar}
                            className="btn btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selectedDates.size === 0}
                            className="btn btn-primary"
                        >
                            Confirmar ({selectedDates.size})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Formata data para string YYYY-MM-DD usando timezone local
 * Evita offset de timezone ao salvar no banco
 */
function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Formata data para exibição DD/MM/YYYY
 */
function formatDisplayDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}`;
}

export default CalendarioSeletor;
