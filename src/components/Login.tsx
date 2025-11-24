'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister && !name) {
      setError('Nama harus diisi');
      return;
    }

    if (isRegister && !username) {
      setError('Username harus diisi');
      return;
    }

    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    try {
      setIsLoading(true);
      if (isRegister) {
        const result = await register(name, username, email, password);
        if (!result.success) {
          // Ganti pesan error yang lebih user-friendly
          let errorMsg = result.message || 'Tidak dapat mendaftar';
          if (errorMsg.includes('fetch') || errorMsg.includes('Failed')) {
            errorMsg = 'Tidak dapat mendaftar. Pastikan server sudah berjalan.';
          }
          setError(errorMsg);
          setPassword('');
        }
      } else {
        console.log('Attempting login with:', { email, password: '***' });
        const success = await login(email, password);
        console.log('Login result:', success);
        if (!success) {
          setError('Email atau password salah. Pastikan Anda sudah mendaftar dan data login benar.');
          setPassword('');
        }
      }
    } catch (err: any) {
      console.error('Login/Register error:', err);
      // Handle network errors
      if (isRegister) {
        setError('Tidak dapat mendaftar. Pastikan server sudah berjalan.');
      } else {
        setError('Tidak dapat login. Pastikan server backend sudah berjalan di http://localhost:8000');
      }
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Animated Background Elements */}
      <div className="auth-bg-element"></div>
      <div className="auth-bg-element"></div>
      <div className="auth-bg-element"></div>
      <div className="auth-bg-element"></div>
      
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="auth-title">
            {isRegister ? 'Buat Akun Baru' : 'Selamat Datang! 👋'}
          </h1>
          <p className="auth-subtitle">
            {isRegister ? 'Daftar untuk mulai menggunakan todo list Anda' : 'Masuk untuk mengelola todo list Anda'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="auth-mode-toggle">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
            className={`auth-mode-btn ${!isRegister ? 'active' : ''}`}
          >
            🔑 Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
            className={`auth-mode-btn ${isRegister ? 'active' : ''}`}
          >
            🎆 Daftar
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="auth-form-group">
              <label htmlFor="name" className="auth-form-label">
                👤 Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-form-input"
                placeholder="Masukkan nama lengkap"
              />
            </div>
          )}
          {isRegister && (
            <div className="auth-form-group">
              <label htmlFor="username" className="auth-form-label">
                🏷️ Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-form-input"
                placeholder="Masukkan username"
              />
            </div>
          )}
          {/* Email Input */}
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-form-label">
              📧 Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-form-input"
              placeholder="Masukkan email"
            />
          </div>

          {/* Password Input */}
          <div className="auth-form-group">
            <label htmlFor="password" className="auth-form-label">
              🔒 Password
            </label>
            <div className="auth-password-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-form-input"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-password-toggle"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="auth-error">
              <div className="auth-error-icon">⚠️</div>
              <div className="auth-error-content">
                <h4>{error}</h4>
                {!isRegister && (
                  <p>💡 Pastikan email dan password yang Anda masukkan benar.</p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="auth-submit-btn"
          >
            {isLoading ? (
              <div className="auth-loading">
                <div className="auth-loading-spinner"></div>
                <span>Memproses...</span>
              </div>
            ) : (
              <span>{isRegister ? '🎆 Daftar Sekarang' : '🔑 Masuk Sekarang'}</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <div className="auth-security-note">
            🔒 Data Anda aman bersama kami
          </div>
        </div>
      </div>
    </div>
  );
}
