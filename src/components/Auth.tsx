import { useState, useEffect, useRef } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { useI18n } from '../i18n/context';
import { useLists } from '../hooks/useLists';
import { ShoppingList } from '../types/list';
import { 
  isBiometricAvailable, 
  createBiometricCredential, 
  authenticateWithBiometric,
  arrayBufferToBase64 
} from '../utils/webauthn';
import { useTheme } from '../hooks/useTheme';
import './Auth.css';

interface AuthProps {
  currentList?: ShoppingList | null;
}

export const Auth = ({ currentList }: AuthProps) => {
  const { t } = useI18n();
  const { unshareList } = useLists();
  const { currentPalette, setTheme, palettes } = useTheme();
  const [showPanel, setShowPanel] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasBiometricCredential, setHasBiometricCredential] = useState(false);
  const [storedEmailForBiometric, setStoredEmailForBiometric] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Check biometric availability
  useEffect(() => {
    const checkBiometric = async () => {
      const available = await isBiometricAvailable();
      setBiometricAvailable(available);
    };
    checkBiometric();
  }, []);

  // Check if user has biometric credential when signed in
  useEffect(() => {
    const checkUserBiometric = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists() && userDoc.data().biometricCredentialId) {
            setHasBiometricCredential(true);
          } else {
            setHasBiometricCredential(false);
          }
        } catch (error: any) {
          // Silently ignore permission errors - Firestore rules not deployed yet
          if (error.code !== 'permission-denied' && error.code !== 'missing-or-insufficient-permissions') {
            console.error('Error checking biometric credential:', error);
          }
          setHasBiometricCredential(false);
        }
      } else {
        // Check if there's a stored email with biometric credential
        const storedEmail = localStorage.getItem('lastSignedInEmail');
        if (storedEmail && biometricAvailable) {
          try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', storedEmail));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              if (userData.biometricCredentialId) {
                setHasBiometricCredential(true);
                setStoredEmailForBiometric(storedEmail);
                return;
              }
            }
          } catch (error: any) {
            // Silently ignore permission errors - Firestore rules not deployed yet
            if (error.code !== 'permission-denied' && error.code !== 'missing-or-insufficient-permissions') {
              console.error('Error checking stored biometric:', error);
            }
          }
        }
        setHasBiometricCredential(false);
        setStoredEmailForBiometric(null);
      }
    };
    checkUserBiometric();
  }, [auth.currentUser, biometricAvailable]);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign-in successful:', result.user.email);
      setShowAuthModal(false);
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(t('auth.signInError') || 'Sign in failed');
      if (error.code === 'auth/popup-closed-by-user') {
        setError(null);
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Store email for biometric sign-in lookup
      localStorage.setItem('lastSignedInEmail', email);
      
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Sign in error:', error);
      let errorMessage = t('auth.signInError') || 'Sign in failed';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('auth.userNotFound') || 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = t('auth.wrongPassword') || 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('auth.emailInvalid') || 'Invalid email address';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(t('auth.weakPassword') || 'Password should be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign up successful:', result.user.email);
      
      // Create user document
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        createdAt: new Date(),
      });
      
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Sign up error:', error);
      let errorMessage = t('auth.signUpError') || 'Sign up failed';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = t('auth.emailInUse') || 'This email is already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('auth.emailInvalid') || 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = t('auth.weakPassword') || 'Password should be at least 6 characters';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Check if user is already signed in (session persisted)
      if (auth.currentUser) {
        // Just verify biometric to unlock
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists() && userDoc.data().biometricCredentialId) {
          await authenticateWithBiometric(userDoc.data().biometricCredentialId);
          setShowAuthModal(false);
          return;
        }
      }

      // For new sign-in, get stored email
      const emailToUse = storedEmailForBiometric || localStorage.getItem('lastSignedInEmail');
      if (!emailToUse) {
        setError('Please sign in with email first to enable biometric');
        setLoading(false);
        return;
      }

      // Get user document to find credential
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', emailToUse));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError('Biometric credential not found. Please sign in with email first.');
        setLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const biometricCredentialId = userDoc.data().biometricCredentialId;
      
      if (!biometricCredentialId) {
        setError('Biometric not set up. Please sign in with email and set it up.');
        setLoading(false);
        return;
      }

      // Authenticate with biometric
      await authenticateWithBiometric(biometricCredentialId);
      
      // If biometric succeeds, check if session is still valid
      if (auth.currentUser && auth.currentUser.email === emailToUse) {
        // Session is valid, just unlock
        setShowAuthModal(false);
      } else {
        // Session expired - biometric verified identity, but need to sign in
        // For now, prompt for password (in future, could use secure token)
        setEmail(emailToUse);
        setError('Session expired. Please enter your password.');
        setIsSignUp(false);
      }
    } catch (error: any) {
      console.error('Biometric sign in error:', error);
      setError(error.message || t('auth.biometricNotAvailable') || 'Biometric authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupBiometric = async () => {
    if (!auth.currentUser) {
      setError('Please sign in first');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const credential = await createBiometricCredential(
        auth.currentUser.uid,
        auth.currentUser.email || ''
      );

      if (credential && credential.id) {
        const credentialId = arrayBufferToBase64(credential.id);
        
        // Save credential ID to user document
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          email: auth.currentUser.email,
          biometricCredentialId: credentialId,
          biometricSetupAt: new Date(),
        }, { merge: true });

        setHasBiometricCredential(true);
        setError(null);
        alert('Biometric authentication set up successfully!');
      }
    } catch (error: any) {
      console.error('Biometric setup error:', error);
      setError(error.message || 'Failed to set up biometric authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
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
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && 
          !(event.target as HTMLElement).closest('.auth-button')) {
        setShowAuthModal(false);
      }
    };

    if (showPanel || showAuthModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPanel, showAuthModal]);

  const handleUnshare = async (emailToRemove: string) => {
    if (!currentList) return;
    
    setLoading(true);
    try {
      await unshareList(currentList.id, emailToRemove);
    } catch (error: any) {
      console.error('Error removing user:', error);
    } finally {
      setLoading(false);
    }
  };

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
                    <div className="auth-panel-name">{currentUser.displayName || currentUser.email}</div>
                    <div className="auth-panel-email">{currentUser.email}</div>
                  </div>
                </div>
              </div>
              
              {biometricAvailable && !hasBiometricCredential && (
                <div className="auth-panel-section">
                  <button 
                    onClick={handleSetupBiometric} 
                    className="auth-panel-biometric-setup"
                    disabled={loading}
                  >
                    <span className="material-symbols-outlined">fingerprint</span>
                    {t('auth.useBiometric') || 'Set up Face ID / Touch ID'}
                  </button>
                </div>
              )}
              
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
                <div 
                  className="auth-panel-section-title auth-panel-section-title-clickable"
                  onClick={() => setShowColorPalette(!showColorPalette)}
                  style={{ cursor: 'pointer' }}
                >
                  {t('auth.colorPalette') || 'Color Theme'}
                  <span className="material-symbols-outlined" style={{ 
                    fontSize: '1rem', 
                    marginLeft: '0.5rem',
                    transform: showColorPalette ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}>
                    expand_more
                  </span>
                </div>
                {showColorPalette && (
                  <div className="auth-panel-colors">
                    {palettes.map((palette) => (
                      <button
                        key={palette.id}
                        onClick={() => {
                          setTheme(palette.id);
                        }}
                        className={`auth-panel-color-option ${currentPalette.id === palette.id ? 'auth-panel-color-active' : ''}`}
                        title={palette.name}
                        aria-label={palette.name}
                      >
                        <div 
                          className="auth-panel-color-preview"
                          style={{
                            background: palette.colors.primary,
                            borderColor: palette.colors.accent,
                          }}
                        >
                          <div 
                            className="auth-panel-color-preview-secondary"
                            style={{ background: palette.colors.secondary }}
                          />
                        </div>
                        <span className="auth-panel-color-name">{palette.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
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
    <>
      <div className="auth">
        <button onClick={() => setShowAuthModal(true)} className="auth-button auth-button-primary">
          <span className="material-symbols-outlined">login</span>
          {t('auth.signIn') || 'Sign In'}
        </button>
      </div>

      {showAuthModal && (
        <>
          <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}></div>
          <div className="auth-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3 className="auth-modal-title">
                {isSignUp ? (t('auth.signUp') || 'Sign Up') : (t('auth.signIn') || 'Sign In')}
              </h3>
              <button 
                onClick={() => {
                  setShowAuthModal(false);
                  setError(null);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }} 
                className="auth-modal-close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="auth-modal-content">
              {error && <div className="auth-error">{error}</div>}

              {/* Biometric Sign In (if available and user has credential) */}
              {biometricAvailable && hasBiometricCredential && !isSignUp && (
                <button
                  onClick={handleBiometricSignIn}
                  className="auth-button auth-button-biometric"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined">fingerprint</span>
                  {t('auth.signInWithBiometric') || 'Sign in with Face ID'}
                </button>
              )}

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                className="auth-button auth-button-google"
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {t('auth.signIn') || 'Sign in with Google'}
              </button>

              <div className="auth-divider">
                <span>or</span>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn} className="auth-form">
                <div className="auth-form-group">
                  <label htmlFor="email">{t('auth.email') || 'Email'}</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder') || 'Enter your email'}
                    autoComplete="email"
                    required
                    disabled={loading}
                    className="auth-input"
                  />
                </div>

                <div className="auth-form-group">
                  <label htmlFor="password">{t('auth.password') || 'Password'}</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder') || 'Enter your password'}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    required
                    disabled={loading}
                    className="auth-input"
                    minLength={6}
                  />
                </div>

                {isSignUp && (
                  <div className="auth-form-group">
                    <label htmlFor="confirmPassword">{t('auth.confirmPassword') || 'Confirm Password'}</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder') || 'Enter your password again'}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      className="auth-input"
                      minLength={6}
                    />
                  </div>
                )}

                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="auth-forgot-password"
                    disabled={loading}
                  >
                    {t('auth.forgotPassword') || 'Forgot Password?'}
                  </button>
                )}

                <button
                  type="submit"
                  className="auth-button auth-button-primary auth-button-submit"
                  disabled={loading}
                >
                  {loading ? (t('app.loading') || 'Loading...') : (isSignUp ? (t('auth.signUp') || 'Sign Up') : (t('auth.signInEmail') || 'Sign In'))}
                </button>
              </form>

              <div className="auth-switch">
                {isSignUp ? (
                  <>
                    <span>{t('auth.hasAccount') || 'Already have an account?'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setError(null);
                        setConfirmPassword('');
                      }}
                      className="auth-switch-link"
                    >
                      {t('auth.signIn') || 'Sign In'}
                    </button>
                  </>
                ) : (
                  <>
                    <span>{t('auth.noAccount') || "Don't have an account?"}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setError(null);
                      }}
                      className="auth-switch-link"
                    >
                      {t('auth.signUp') || 'Sign Up'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
