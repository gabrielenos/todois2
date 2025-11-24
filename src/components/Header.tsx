'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileModal from './ProfileModal';

export default function Header() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <header className="header sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          {/* Left side - App title */}
          <div className="logo-section">
            <span className="logo-icon">📝</span>
            <span className="app-title">Todo App</span>
          </div>

          {/* Right side - User Profile */}
          <div className="user-section">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`user-button ${isProfileOpen ? 'active' : ''}`}
            >
              <div className="user-avatar bg-gradient-to-br from-blue-500 to-purple-600">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-info">
                <p className="user-name">
                  {user?.name || 'User'}
                </p>
                <p className="user-email">
                  @{user?.username || 'username'}
                </p>
              </div>
              <span className="dropdown-icon">▾</span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsProfileOpen(false)}
                ></div>
                
                {/* Dropdown */}
                <div className={`dropdown-menu ${isProfileOpen ? 'active' : ''}`}>
                  {/* User Info */}
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="dropdown-user-info">
                      <p className="dropdown-user-name">{user?.name || 'User'}</p>
                      <p className="dropdown-user-email">@{user?.username || 'username'}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="dropdown-body">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsProfileOpen(false);
                      }}
                      className="dropdown-item"
                    >
                      <span className="dropdown-item-icon">👤</span>
                      <div className="dropdown-item-content">
                        <span className="dropdown-item-title">Profil Saya</span>
                        <span className="dropdown-item-subtitle">Edit profil dan password</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                      }}
                      className="dropdown-item"
                    >
                      <span className="dropdown-item-icon">⚙️</span>
                      <div className="dropdown-item-content">
                        <span className="dropdown-item-title">Pengaturan</span>
                        <span className="dropdown-item-subtitle">Tema dan preferensi</span>
                      </div>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="dropdown-divider" />
                  <button
                    type="button"
                    onClick={logout}
                    className="dropdown-item logout"
                  >
                    <span className="dropdown-item-icon">🚪</span>
                    <div className="dropdown-item-content">
                      <span className="dropdown-item-title">Keluar</span>
                      <span className="dropdown-item-subtitle">Logout dari akun</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </>
  );
}
