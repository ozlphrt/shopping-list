import { useState, useEffect, useRef } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useI18n } from '../i18n/context';
import { useLists } from '../hooks/useLists';
import { ShoppingList } from '../types/list';
import './Auth.css';

interface AuthProps {
  currentList?: ShoppingList | null;
}

export const Auth = ({ currentList }: AuthProps) => {
  const { t } = useI18n();
  const { unshareList } = useLists();
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleSignIn = async () => {
    try {
      console.log('Starting Google sign-in popup...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign-in successful:', result.user.email);
      // Auth state will be updated automatically via onAuthStateChanged
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('User closed the popup');
      } else if (error.code === 'auth/popup-blocked') {
        console.error('Popup blocked by browser. Please allow popups for this site.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowPanel(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPanel]);

  const handleUnshare = async (emailToRemove: string) => {
    if (!currentList) return;
    
    setLoading(true);
    try {
      await unshareList(currentList.id, emailToRemove);
    } catch (error: any) {
      console.error('Error removing user:', error);
      // You could add error state here if needed
    } finally {
      setLoading(false);
    }
  };

  // Use auth.currentUser for immediate check, but App.tsx manages the actual user state
  const currentUser = auth.currentUser;
  const sharedWith = currentList?.sharedWith || [];
  const isOwner = currentList?.ownerId === currentUser?.uid;
  
  if (currentUser) {
    return (
      <div className="auth" ref={panelRef}>
        <div className="auth-user">
          <img 
            src={currentUser.photoURL || ''} 
            alt="User" 
            className="auth-avatar"
            onClick={() => setShowPanel(!showPanel)}
            style={{ cursor: 'pointer' }}
          />
          {showPanel && (
            <div className="auth-panel">
              <div className="auth-panel-section">
                <div className="auth-panel-user">
                  <img 
                    src={currentUser.photoURL || ''} 
                    alt="User" 
                    className="auth-panel-avatar"
                  />
                  <div className="auth-panel-user-info">
                    <div className="auth-panel-name">{currentUser.displayName}</div>
                    <div className="auth-panel-email">{currentUser.email}</div>
                  </div>
                </div>
              </div>
              
              {sharedWith.length > 0 && (
                <div className="auth-panel-section">
                  <div className="auth-panel-section-title">{t('share.sharedWith') || 'Shared with:'}</div>
                  <div className="auth-panel-members">
                    {sharedWith.map((email, index) => (
                      <div key={index} className="auth-panel-member">
                        <span className="auth-panel-member-email">{email}</span>
                        {isOwner && (
                          <button
                            onClick={() => handleUnshare(email)}
                            className="auth-panel-member-remove"
                            disabled={loading}
                            title={t('share.remove') || 'Remove access'}
                            aria-label={t('share.remove') || 'Remove access'}
                          >
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="auth-panel-section">
                <button onClick={handleSignOut} className="auth-panel-signout">
                  {t('auth.signOut')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth">
      <button onClick={handleSignIn} className="auth-button auth-button-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {t('auth.signIn')}
      </button>
    </div>
  );
};

