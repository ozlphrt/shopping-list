import { useOffline } from '../hooks/useOffline';
import { useI18n } from '../i18n/context';
import './OfflineIndicator.css';

export const OfflineIndicator = () => {
  const { t } = useI18n();
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div className="offline-indicator" role="alert">
      <span className="material-symbols-outlined offline-indicator-icon">
        wifi_off
      </span>
      <span className="offline-indicator-text">
        {t('pwa.offline') || 'You are offline'}
      </span>
    </div>
  );
};

