'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { apiGetNotes, apiCreateNote, apiDeleteNote, ApiNote } from '@/lib/api';

export default function Notes() {
  const { token } = useAuth();
  const { t } = usePreferences();
  const [notes, setNotes] = useState<ApiNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: '',
    color: 'yellow'
  });

  // Load notes from backend
  useEffect(() => {
    if (!token) return;
    
    const loadNotes = async () => {
      try {
        setLoading(true);
        const data = await apiGetNotes(token);
        setNotes(data);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [token]);

  // Calculate category stats
  const categoryStats = notes.reduce((acc, note) => {
    const cat = note.category || 'Lainnya';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleCreateNote = async () => {
    if (!token || !newNote.title.trim()) {
      alert(t('notes.titleRequired'));
      return;
    }

    try {
      const created = await apiCreateNote(token, {
        title: newNote.title,
        content: newNote.content || null,
        category: newNote.category || null,
        color: newNote.color
      });
      
      setNotes([created, ...notes]);
      setShowCreateModal(false);
      setNewNote({ title: '', content: '', category: '', color: 'yellow' });
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Gagal membuat catatan. Pastikan backend server sudah running.');
    }
  };

  const getColorClass = (color: string) => {
    const colors = {
      yellow: 'from-yellow-400 to-yellow-500',
      blue: 'from-blue-400 to-blue-500',
      green: 'from-green-400 to-green-500',
      purple: 'from-purple-400 to-purple-500',
      pink: 'from-pink-400 to-pink-500',
    };
    return colors[color as keyof typeof colors] || colors.yellow;
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex justify-center">
        <div className="todo-section w-full">
          <div className="notes-loading">
            <div className="notes-spinner"></div>
            <div className="notes-loading-text">{t('notes.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen flex justify-center">
      <div className="todo-section w-full notes-container">
      {/* Header */}
      <div className="notes-header">
        <div className="notes-title-section">
          <div className="todo-title">{t('notes.title')}</div>
          <div className="todo-subtitle">{t('notes.subtitle')}</div>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-add"
        >
          <span className="btn-icon">➕</span>
          <span>{t('notes.addNew')}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="notes-stats">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon total">
              📄
            </div>
            <div>
              <div className="stat-number">{notes.length}</div>
              <div className="stat-label">{t('notes.totalNotes')}</div>
            </div>
          </div>
        </div>
        {Object.entries(categoryStats).slice(0, 3).map(([category, count], index) => {
          const icons = ['💡', '💼', '👤'];
          const iconClasses = ['ideas', 'work', 'personal'];
          return (
            <div key={category} className="stat-card">
              <div className="stat-content">
                <div className={`stat-icon ${iconClasses[index]}`}>
                  {icons[index]}
                </div>
                <div>
                  <div className="stat-number">{count}</div>
                  <div className="stat-label">{category}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes Grid */}
      <div className="notes-grid">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => setSelectedNote(note.id)}
            className={`note-card ${note.color} ${
              selectedNote === note.id ? 'selected' : ''
            }`}
          >
            {/* Note Header */}
            <div className="note-header">
              <div className={`note-category ${note.color}`}>
                {note.category || 'Lainnya'}
              </div>
              <button className="note-menu">
                ⋮
              </button>
            </div>

            {/* Note Content */}
            <h3 className="note-title">
              {note.title}
            </h3>
            <p className="note-content">
              {note.content}
            </p>

            {/* Note Footer */}
            <div className="note-footer">
              <div className="note-date">
                <span>📅</span>
                <span>{formatDate(note.updated_at)}</span>
              </div>
              <button className="note-read-btn">
                Baca →
              </button>
            </div>
          </div>
        ))}

        {/* Add New Note Card */}
        <div 
          onClick={() => setShowCreateModal(true)}
          className="add-note-card"
        >
          <div className="add-note-icon">➕</div>
          <div className="add-note-text">
            {t('notes.addNewNote')}
          </div>
        </div>
      </div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="notes-modal">
          <div className="notes-modal-content">
            <div className="notes-modal-header">
              <div className="notes-modal-title">➕ {t('notes.addNew')}</div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewNote({ title: '', content: '', category: '', color: 'yellow' });
                }}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            
            <div>
              {/* Title */}
              <div className="notes-form-group">
                <label className="notes-form-label">
                  {t('notes.noteTitle')} *
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="notes-form-input"
                  placeholder="Masukkan judul catatan..."
                />
              </div>

              {/* Category */}
              <div className="notes-form-group">
                <label className="notes-form-label">
                  {t('notes.category')}
                </label>
                <input
                  type="text"
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                  className="notes-form-input"
                  placeholder="Contoh: Ide, Kerja, Pribadi..."
                />
              </div>

              {/* Color */}
              <div className="notes-form-group">
                <label className="notes-form-label">
                  {t('notes.color')}
                </label>
                <div className="notes-color-picker">
                  {['yellow', 'blue', 'green', 'purple', 'pink'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewNote({ ...newNote, color })}
                      className={`notes-color-option ${color} ${
                        newNote.color === color ? 'selected' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="notes-form-group">
                <label className="notes-form-label">
                  {t('notes.content')}
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="notes-form-textarea"
                  placeholder="Tulis catatan Anda di sini..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="notes-modal-actions">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewNote({ title: '', content: '', category: '', color: 'yellow' });
                }}
                className="notes-btn-cancel"
              >
                {t('notes.cancel')}
              </button>
              <button
                onClick={handleCreateNote}
                className="notes-btn-save"
              >
                {t('notes.save')}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
