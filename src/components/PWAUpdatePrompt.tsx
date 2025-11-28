import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useI18n } from '../i18n/context';
import './PWAUpdatePrompt.css';

export const PWAUpdatePrompt = () => {
  const { t } = useI18n();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error: Error) {
      console.log('SW registration error', error);
    },
  });

  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = async () => {
    await updateServiceWorker(true);
    setShowPrompt(false);
    setNeedRefresh(false);
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-update-prompt">
      <div className="pwa-update-prompt-content">
        <div className="pwa-update-prompt-icon">
          <span className="material-symbols-outlined">system_update</span>
        </div>
        <div className="pwa-update-prompt-text">
          <div className="pwa-update-prompt-title">
            {t('pwa.updateAvailable') || 'Update Available'}
          </div>
          <div className="pwa-update-prompt-message">
            {t('pwa.updateMessage') || 'A new version is available. Update now?'}
          </div>
        </div>
        <div className="pwa-update-prompt-actions">
          <button
            onClick={handleUpdate}
            className="pwa-update-prompt-button pwa-update-prompt-button-primary"
          >
            {t('pwa.update') || 'Update'}
          </button>
          <button
            onClick={handleDismiss}
            className="pwa-update-prompt-button pwa-update-prompt-button-secondary"
          >
            {t('pwa.later') || 'Later'}
          </button>
        </div>
      </div>
    </div>
  );
};

