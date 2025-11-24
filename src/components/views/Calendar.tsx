'use client';

import { useState } from 'react';
import { usePreferences } from '@/context/PreferencesContext';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  color: string;
  description?: string;
}

export default function Calendar() {
  const { t } = usePreferences();
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    color: 'blue',
    description: ''
  });

  const getMonthName = (monthIndex: number) => {
    const monthKeys = [
      'calendar.monthJan', 'calendar.monthFeb', 'calendar.monthMar', 'calendar.monthApr',
      'calendar.monthMay', 'calendar.monthJun', 'calendar.monthJul', 'calendar.monthAug',
      'calendar.monthSep', 'calendar.monthOct', 'calendar.monthNov', 'calendar.monthDec'
    ];
    return t(monthKeys[monthIndex]);
  };

  const getDayName = (dayIndex: number) => {
    const dayKeys = [
      'calendar.daySun', 'calendar.dayMon', 'calendar.dayTue', 'calendar.dayWed',
      'calendar.dayThu', 'calendar.dayFri', 'calendar.daySat'
    ];
    return t(dayKeys[dayIndex]);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      alert(t('calendar.eventTitle') + ', ' + t('calendar.date') + ', ' + t('calendar.time'));
      return;
    }

    const event: Event = {
      id: Date.now(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      color: newEvent.color,
      description: newEvent.description
    };

    setEvents([...events, event]);
    setShowAddModal(false);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      color: 'blue',
      description: ''
    });
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getColorClass = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-yellow-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-8 min-h-screen flex justify-center">
      <div className="todo-section w-full">
      {/* Header */}
      <div className="todo-header mb-4">
        <div>
          <div className="todo-title">{t('calendar.title')}</div>
          <div className="todo-subtitle">{t('calendar.subtitle')}</div>
        </div>
      </div>

      <div className="calendar-container">
        {/* Calendar */}
        <div className="calendar-section">
          {/* Calendar Header */}
          <div className="calendar-header">
            <div className="calendar-title">
              📅 {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
            </div>
            <div className="calendar-nav">
              <button className="nav-btn">←</button>
              <button className="today-btn">{t('calendar.today')}</button>
              <button className="nav-btn">→</button>
            </div>
          </div>

          {/* Day Names */}
          <div className="calendar-grid mb-2">
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
              <div
                key={dayIndex}
                className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2"
              >
                {getDayName(dayIndex)}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="calendar-grid">
            {days.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${
                  day
                    ? day === currentDate.getDate()
                      ? 'calendar-day--today'
                      : 'calendar-day--normal text-gray-800 dark:text-white'
                    : 'calendar-day--inactive'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="events-section">
          <div className="section-header mb-4">
            <span className="section-icon">🕰️</span>
            <span className="section-title">{t('calendar.upcomingEvents')}</span>
          </div>
          
          {events.length === 0 ? (
            <div className="empty-state text-center py-8">
              <div className="empty-icon text-4xl mb-3">📅</div>
              <div className="empty-title">{t('calendar.noEvents')}</div>
              <div className="empty-subtitle">{t('calendar.clickToAdd')}</div>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className={`event-card ${event.color}`}>
                <div className="event-header">
                  <div>
                    <div className="event-title">{event.title}</div>
                    <div className="event-time">
                      <span>📅 {event.date}</span>
                      <span>🕐 {event.time}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="event-delete"
                  >
                    🗑️
                  </button>
                </div>
                {event.description && (
                  <div className="event-description">{event.description}</div>
                )}
              </div>
            ))
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-add w-full mt-4"
          >
            <span className="btn-icon">➕</span>
            <span>{t('calendar.addEvent')}</span>
          </button>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">➕ {t('calendar.addEvent')}</div>
              <button
                onClick={() => setShowAddModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="form-group">
                <label className="form-label">{t('calendar.eventTitle')} *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder={t('calendar.eventTitle')}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('calendar.date')} *</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('calendar.time')} *</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('calendar.color')}</label>
                <div className="color-picker">
                  {['blue', 'purple', 'green', 'red', 'yellow'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewEvent({ ...newEvent, color })}
                      className={`color-option ${color} ${
                        newEvent.color === color ? 'selected' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('todo.description')}</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder={`${t('todo.description')}...`}
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-cancel"
              >
                {t('calendar.cancel')}
              </button>
              <button
                onClick={handleAddEvent}
                className="btn-save"
              >
                {t('calendar.save')}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
