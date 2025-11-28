import { useState, useMemo } from 'react';
import { useI18n } from '../i18n/context';
import { useLists } from '../hooks/useLists';
import { usePreviousAddresses } from '../hooks/usePreviousAddresses';
import { auth } from '../config/firebase';
import './ShareList.css';

interface ShareListProps {
  listId: string;
  onClose: () => void;
}

export const ShareList = ({ listId, onClose }: ShareListProps) => {
  const { t } = useI18n();
  const { lists, shareList, unshareList } = useLists();
  const { previousAddresses, addAddress } = usePreviousAddresses();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentList = lists.find(l => l.id === listId);

  // Filter out addresses that are already shared with this list
  const availableSuggestions = useMemo(() => {
    if (!currentList) return [];
    const sharedEmails = currentList.sharedWith.map(e => e.toLowerCase());
    return previousAddresses.filter(addr => !sharedEmails.includes(addr));
  }, [previousAddresses, currentList]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await shareList(listId, normalizedEmail);
      // Save to previous addresses (non-blocking)
      await addAddress(normalizedEmail);
      setEmail('');
    } catch (err: any) {
      setError(err.message || t('share.error') || 'Failed to share list');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestedEmail: string) => {
    setEmail(suggestedEmail);
  };

  const handleUnshare = async (emailToRemove: string) => {
    setError(null);
    setLoading(true);

    try {
      await unshareList(listId, emailToRemove);
    } catch (err: any) {
      setError(err.message || t('share.error') || 'Failed to unshare list');
    } finally {
      setLoading(false);
    }
  };

  if (!currentList) return null;

  return (
    <>
      <div className="share-modal-overlay" onClick={onClose}></div>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3 className="share-modal-title">{t('share.title') || 'Share List'}</h3>
          <button onClick={onClose} className="share-modal-close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="share-modal-content">
          <form onSubmit={handleShare} className="share-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('share.emailPlaceholder') || 'Enter email address'}
              className="share-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="share-button share-button-primary"
              disabled={loading || !email.trim()}
            >
              {t('share.share') || 'Share'}
            </button>
          </form>

          {error && <div className="share-error">{error}</div>}

          {availableSuggestions.length > 0 && (
            <div className="share-suggestions">
              <div className="share-suggestions-title">
                {t('share.previousAddresses') || 'Previously used:'}
              </div>
              <div className="share-suggestions-list">
                {availableSuggestions.map((suggestedEmail) => (
                  <button
                    key={suggestedEmail}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestedEmail)}
                    className="share-suggestion-item"
                    disabled={loading}
                    title={t('share.useAddress') || `Use ${suggestedEmail}`}
                  >
                    <span className="material-symbols-outlined share-suggestion-icon">history</span>
                    <span className="share-suggestion-email">{suggestedEmail}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="share-list">
            <h4 className="share-list-title">{t('share.sharedWith') || 'Shared with:'}</h4>
            {currentList.sharedWith.length === 0 ? (
              <p className="share-empty">{t('share.noShares') || 'No one yet'}</p>
            ) : (
              <ul className="share-list-items">
                {currentList.sharedWith.map((sharedEmail) => (
                  <li key={sharedEmail} className="share-list-item">
                    <span className="share-email">{sharedEmail}</span>
                    {currentList.ownerId === auth.currentUser?.uid && (
                      <button
                        onClick={() => handleUnshare(sharedEmail)}
                        className="share-remove"
                        disabled={loading}
                        title={t('share.remove') || 'Remove access'}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};


