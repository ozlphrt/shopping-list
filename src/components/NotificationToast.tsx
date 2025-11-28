import { useI18n } from '../i18n/context';
import './NotificationToast.css';

interface NotificationToastProps {
  show: boolean;
  message: string;
  listName?: string;
  onDismiss: () => void;
}

export const NotificationToast = ({ 
  show, 
  message, 
  listName,
  onDismiss 
}: NotificationToastProps) => {
  const { t } = useI18n();

  if (!show) return null;

  return (
    <div className="notification-toast" role="alert">
      <div className="notification-toast-content">
        <span className="material-symbols-outlined notification-toast-icon">
          share
        </span>
        <div className="notification-toast-text">
          <div className="notification-toast-title">
            {t('notification.listShared') || 'New List Shared'}
          </div>
          <div className="notification-toast-message">
            {message}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="notification-toast-close"
          aria-label={t('notification.dismiss') || 'Dismiss'}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
};

