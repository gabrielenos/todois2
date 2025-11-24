'use client';

import { usePreferences } from '@/context/PreferencesContext';

export default function Settings() {
  const { theme, language, toggleTheme, setLanguage, t } = usePreferences();

  return (
    <div className="p-8 min-h-screen flex justify-center">
      <div className="todo-section w-full settings-container">
      <div className="todo-header mb-6">
        <div>
          <div className="todo-title">{t('settings.title')}</div>
          <div className="todo-subtitle">{t('settings.subtitle')}</div>
        </div>
      </div>

      <div className="settings-card">
          {/* Appearance Section */}
          <div className="settings-section">
            <div className="settings-section-title">
              <div className="settings-section-icon">
                🎨
              </div>
              {t('settings.appearance')}
            </div>
            
            {/* Dark Mode Toggle */}
            <div className="theme-toggle-item">
              <div className="theme-toggle-content">
                <div className={`theme-toggle-icon ${theme === 'dark' ? 'dark' : ''}`}>
                  {theme === 'dark' ? '🌙' : '☀️'}
                </div>
                <div className="theme-toggle-info">
                  <h4>{t('settings.darkMode')}</h4>
                  <p>{theme === 'dark' ? 'Mode gelap aktif' : 'Mode terang aktif'}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
              >
              </button>
            </div>
          </div>

          {/* Language Section */}
          <div className="settings-section">
            <div className="settings-section-title">
              <div className="settings-section-icon">
                🌐
              </div>
              {t('settings.language')}
            </div>
            
            <div className="language-options">
              {/* Indonesian */}
              <button
                onClick={() => setLanguage('id')}
                className={`language-option ${language === 'id' ? 'active' : ''}`}
              >
                <div className="language-option-content">
                  <div className="language-flag">🇮🇩</div>
                  <div className="language-info">
                    <h4>{t('settings.indonesian')}</h4>
                    <p>Bahasa Indonesia</p>
                  </div>
                </div>
                <svg className="language-check w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>

              {/* English */}
              <button
                onClick={() => setLanguage('en')}
                className={`language-option ${language === 'en' ? 'active' : ''}`}
              >
                <div className="language-option-content">
                  <div className="language-flag">🇬🇧</div>
                  <div className="language-info">
                    <h4>{t('settings.english')}</h4>
                    <p>English</p>
                  </div>
                </div>
                <svg className="language-check w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="settings-info-card">
            <div className="settings-info-content">
              <div className="settings-info-icon">
                ℹ️
              </div>
              <div className="settings-info-text">
                <h4>{language === 'id' ? 'Informasi' : 'Information'}</h4>
                <p>
                  {language === 'id' 
                    ? 'Pengaturan Anda akan tersimpan secara otomatis dan diterapkan di seluruh aplikasi.'
                    : 'Your settings will be saved automatically and applied throughout the app.'}
                </p>
              </div>
            </div>
          </div>
      </div>
      </div>
    </div>
  );
}
