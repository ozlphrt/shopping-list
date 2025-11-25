import { signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useI18n } from '../i18n/context';
import { useEffect } from 'react';
import './Auth.css';

export const Auth = () => {
  const { t } = useI18n();

  useEffect(() => {
    // Handle redirect result after sign-in
    getRedirectResult(auth).catch((error) => {
      console.error('Redirect result error:', error);
    });
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (auth.currentUser) {
    return (
      <div className="auth">
        <div className="auth-user">
          <img src={auth.currentUser.photoURL || ''} alt="User" className="auth-avatar" />
          <span className="auth-name">{auth.currentUser.displayName}</span>
        </div>
        <button onClick={handleSignOut} className="auth-button">{t('auth.signOut')}</button>
      </div>
    );
  }

  return (
    <div className="auth">
      <button onClick={handleSignIn} className="auth-button auth-button-primary">
        {t('auth.signIn')}
      </button>
    </div>
  );
};

