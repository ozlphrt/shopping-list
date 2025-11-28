import { useState } from 'react';
import { useI18n } from '../i18n/context';
import { useLists } from '../hooks/useLists';
import './CreateListModal.css';

interface CreateListModalProps {
  onClose: () => void;
  onCreated?: (listId: string) => void;
}

type ExpirationOption = '1' | '7' | '30';

export const CreateListModal = ({ onClose, onCreated }: CreateListModalProps) => {
  const { t } = useI18n();
  const { createList } = useLists();
  const [name, setName] = useState('');
  const [expiration, setExpiration] = useState<ExpirationOption>('1');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateExpirationTime = (option: ExpirationOption): Date => {
    const now = new Date();
    const days = parseInt(option);
    return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const expirationTime = calculateExpirationTime(expiration);
      const listId = await createList(name.trim(), expirationTime);
      setName('');
      setExpiration('1');
      onCreated?.(listId);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="create-list-modal-overlay" onClick={onClose}></div>
      <div className="create-list-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-list-modal-header">
          <h3 className="create-list-modal-title">{t('list.createNew') || 'Create New List'}</h3>
          <button onClick={onClose} className="create-list-modal-close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="create-list-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('list.listName') || 'List name'}
            className="create-list-input"
            autoFocus
            disabled={loading}
          />
          
          <div className="create-list-expiration">
            <label className="create-list-expiration-label">
              {t('list.expiresAfter') || 'Expires after:'}
            </label>
            <div className="create-list-expiration-options">
              <button
                type="button"
                onClick={() => setExpiration('1')}
                className={`create-list-expiration-option ${expiration === '1' ? 'active' : ''}`}
                disabled={loading}
              >
                {t('list.expiration1d') || '1 day'}
              </button>
              <button
                type="button"
                onClick={() => setExpiration('7')}
                className={`create-list-expiration-option ${expiration === '7' ? 'active' : ''}`}
                disabled={loading}
              >
                {t('list.expiration7d') || '7 days'}
              </button>
              <button
                type="button"
                onClick={() => setExpiration('30')}
                className={`create-list-expiration-option ${expiration === '30' ? 'active' : ''}`}
                disabled={loading}
              >
                {t('list.expiration30d') || '30 days'}
              </button>
            </div>
          </div>
          
          {error && <div className="create-list-error">{error}</div>}
          
          <div className="create-list-actions">
            <button 
              type="submit" 
              className="create-list-button create-list-button-primary"
              disabled={loading || !name.trim()}
            >
              {t('form.create') || 'Create'}
            </button>
            <button 
              type="button"
              onClick={onClose} 
              className="create-list-button create-list-button-secondary"
              disabled={loading}
            >
              {t('form.cancel') || 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

