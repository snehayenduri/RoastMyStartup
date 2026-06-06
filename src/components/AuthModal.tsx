import React, { useState } from 'react';
import { mockDb } from '../db/mockDb';
import type { User } from '../db/schema';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    const mockUser: User = {
      id: `u-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      plan: 'free',
      roastCountThisMonth: 0
    };

    mockDb.setCurrentUser(mockUser);
    onLoginSuccess(mockUser);
    onClose();
  };

  const handleGoogleLogin = () => {
    const mockUser: User = {
      id: `u-${Date.now()}`,
      email: 'google.founder@example.com',
      name: 'Google Founder',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      plan: 'free',
      roastCountThisMonth: 0
    };

    mockDb.setCurrentUser(mockUser);
    onLoginSuccess(mockUser);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Welcome to IdeaRoast AI</h2>
          <p style={{ color: 'var(--fg-subtle)', fontSize: '0.875rem' }}>Roast your assumptions before you spend your cash.</p>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-secondary" 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}
          id="google-login-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '0.25rem' }}>
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.85-2.11 3.51v2.92h3.42c2-1.84 3.74-4.56 3.74-8.28z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.89-3.02c-1.08.72-2.47 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.3v3.12C3.28 20.31 7.37 24 12 24z"/>
            <path fill="#FBBC05" d="M5.27 14.26a7.18 7.18 0 010-4.52V6.62H1.3a11.94 11.94 0 000 10.76l3.97-3.12z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.37 0 3.28 3.69 1.3 7.82l3.97 3.12c.95-2.85 3.6-4.96 6.73-4.96z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', marginBlock: '1rem', color: 'var(--border)' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
          <span style={{ marginInline: '0.75rem', fontSize: '0.75rem', color: 'var(--fg-subtle)', textTransform: 'uppercase' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
        </div>

        <form onSubmit={handleEmailLogin}>
          {error && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Jane Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="jane@example.com" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Continue with Email
          </button>
        </form>
      </div>
    </div>
  );
};
