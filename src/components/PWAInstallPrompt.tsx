import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/context';
import './PWAInstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const { t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay (don't be too aggressive)
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000); // Show after 3 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || !showPrompt || !deferredPrompt || 
      sessionStorage.getItem('pwa-install-dismissed') === 'true') {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-prompt-content">
        <div className="pwa-install-prompt-icon">
          <span className="material-symbols-outlined">download</span>
        </div>
        <div className="pwa-install-prompt-text">
          <div className="pwa-install-prompt-title">
            {t('pwa.installTitle') || 'Install Shopping List'}
          </div>
          <div className="pwa-install-prompt-message">
            {t('pwa.installMessage') || 'Install this app for quick access, offline support, and a better shopping experience'}
          </div>
          <div className="pwa-install-prompt-benefits">
            {t('pwa.installBenefits') || 'Get faster access, work offline, and sync your lists across devices'}
          </div>
        </div>
        <div className="pwa-install-prompt-actions">
          <button
            onClick={handleInstall}
            className="pwa-install-prompt-button pwa-install-prompt-button-primary"
          >
            {t('pwa.install') || 'Install'}
          </button>
          <button
            onClick={handleDismiss}
            className="pwa-install-prompt-button pwa-install-prompt-button-close"
            aria-label={t('pwa.dismiss') || 'Dismiss'}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

