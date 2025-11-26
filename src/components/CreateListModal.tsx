import { useState } from 'react';
import { useI18n } from '../i18n/context';
import { useLists } from '../hooks/useLists';
import './CreateListModal.css';

interface CreateListModalProps {
  onClose: () => void;
  onCreated?: (listId: string) => void;
}

export const CreateListModal = ({ onClose, onCreated }: CreateListModalProps) => {
  const { t } = useI18n();
  const { createList } = useLists();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const listId = await createList(name.trim());
      setName('');
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

