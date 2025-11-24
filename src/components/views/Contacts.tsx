'use client';

import { useState } from 'react';
import { usePreferences } from '@/context/PreferencesContext';

export default function Contacts() {
  const { t } = usePreferences();
  // Data kosong - nanti bisa diintegrasikan dengan backend
  const [contacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    const badges = {
      unread: { labelKey: 'contacts.statusUnread', color: 'bg-blue-100 text-blue-700' },
      read: { labelKey: 'contacts.statusRead', color: 'bg-gray-100 text-gray-700' },
      replied: { labelKey: 'contacts.statusReplied', color: 'bg-green-100 text-green-700' },
    };
    return badges[status as keyof typeof badges] || badges.unread;
  };

  return (
    <div className="p-8 min-h-screen flex justify-center">
      <div className="todo-section w-full">
      {/* Header */}
      <div className="todo-header mb-4">
        <div>
          <div className="todo-title">{t('contacts.title')}</div>
          <div className="todo-subtitle">{t('contacts.subtitle')}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar mb-6">
        <div className="stat-item">
          <span>📬</span>
          <span>{t('contacts.statusUnread')} ({contacts.filter(c => c.status === 'unread').length})</span>
        </div>
        <div className="stat-item">
          <span>📭</span>
          <span>{t('contacts.statusRead')} ({contacts.filter(c => c.status === 'read').length})</span>
        </div>
        <div className="stat-item">
          <span>✅</span>
          <span>{t('contacts.statusReplied')} ({contacts.filter(c => c.status === 'replied').length})</span>
        </div>
      </div>

      {/* Message List Section */}
      <div className="mb-4">
        <div className="section-header">
          <span className="section-icon">📧</span>
          <span className="section-title">{t('contacts.messageList')}</span>
        </div>
      </div>

      {/* Contacts List */}
      <div className="task-list">
        {contacts.length === 0 ? (
          <div className="empty-state text-center py-12">
            <div className="empty-icon text-6xl mb-4">📧</div>
            <div className="empty-title">{t('contacts.noMessages')}</div>
            <div className="empty-subtitle">{t('contacts.startReceiving')}</div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 mt-4">
              <span>💡</span>
              <span>{t('contacts.featureNote')}</span>
            </div>
          </div>
        ) : (
          contacts.map((contact) => {
            const badge = getStatusBadge(contact.status);
            return (
              <div
                key={contact.id}
                className={`task-item cursor-pointer ${
                  selectedContact === contact.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedContact(contact.id)}
              >
                <div className="task-content">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="task-title">{contact.name}</div>
                        <div className="text-xs text-gray-500">{contact.email}</div>
                      </div>
                    </div>
                    <div className="task-date">{contact.date}</div>
                  </div>
                  <div className="font-medium text-sm mb-1">{contact.subject}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{contact.message}</div>
                  {selectedContact === contact.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button className="btn-action btn-edit">💬</button>
                        <button className="btn-action" style={{background: '#e8f5e9', color: '#4caf50'}}>✓</button>
                        <button className="btn-action btn-delete">🗑️</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="task-meta">
                  <div className={`task-badge ${badge.color.includes('blue') ? 'badge-category' : badge.color.includes('green') ? 'badge-priority rendah' : 'badge-priority sedang'}`}>
                    {t(badge.labelKey)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
}
