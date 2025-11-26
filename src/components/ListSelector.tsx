import { useI18n } from '../i18n/context';
import { ShoppingList } from '../types/list';
import { auth } from '../config/firebase';
import './ListSelector.css';

interface ListSelectorProps {
  lists: ShoppingList[];
  currentListId: string | null;
  onSelectList: (listId: string) => void;
  onCreateNew: () => void;
  loading?: boolean;
}

export const ListSelector = ({ 
  lists, 
  currentListId, 
  onSelectList, 
  onCreateNew,
  loading = false 
}: ListSelectorProps) => {
  const { t } = useI18n();
  const currentUser = auth.currentUser;

  // Filter lists to only show ones the user owns or is shared on
  // This is a defensive check in case queries return unexpected results
  const filteredLists = lists.filter(list => {
    if (!currentUser) {
      console.warn('[ListSelector] No current user, filtering out all lists');
      return false;
    }
    
    const normalizedUserEmail = currentUser.email?.toLowerCase() || '';
    const normalizedSharedWith = (list.sharedWith || []).map((email: string) => email.toLowerCase());
    
    // Include if user owns it
    const isOwned = list.ownerId === currentUser.uid;
    // Include if user's email is in sharedWith array (case-insensitive)
    const isShared = normalizedUserEmail && normalizedSharedWith.includes(normalizedUserEmail);
    
    if (isOwned || isShared) {
      return true;
    } else {
      console.warn(`[ListSelector] Filtering out list ${list.id}: user ${currentUser.uid} doesn't own it and email ${currentUser.email} not in sharedWith`);
      return false;
    }
  });
  
  // Log if we're filtering out lists
  if (lists.length !== filteredLists.length) {
    console.warn(`[ListSelector] Filtered ${lists.length} lists down to ${filteredLists.length} lists`);
  }

  const ownedLists = filteredLists.filter(list => list.ownerId === currentUser?.uid);
  // Shared lists are lists where the user is NOT the owner AND their email is in sharedWith (case-insensitive)
  const normalizedUserEmail = currentUser?.email?.toLowerCase() || '';
  const sharedLists = filteredLists.filter(list => {
    if (list.ownerId === currentUser?.uid) return false; // Not shared if user owns it
    if (!normalizedUserEmail) return false;
    const normalizedSharedWith = (list.sharedWith || []).map((email: string) => email.toLowerCase());
    return normalizedSharedWith.includes(normalizedUserEmail);
  });

  if (loading) {
    return (
      <div className="list-selector">
        <div className="list-selector-loading">{t('app.loading')}</div>
      </div>
    );
  }

  return (
    <div className="list-selector">
      <div className="list-selector-header">
        <h2 className="list-selector-title">{t('list.myLists') || 'My Lists'}</h2>
        <button 
          onClick={onCreateNew}
          className="list-selector-create-button"
          title={t('list.createNew') || 'Create New List'}
          aria-label={t('list.createNew') || 'Create New List'}
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      {filteredLists.length === 0 ? (
        <div className="list-selector-empty">
          <p>{t('list.noLists') || 'No lists yet. Create your first list!'}</p>
          <button 
            onClick={onCreateNew}
            className="list-selector-empty-button"
          >
            {t('list.createNew') || 'Create New List'}
          </button>
        </div>
      ) : (
        <div className="list-selector-content">
          {ownedLists.length > 0 && (
            <div className="list-selector-section">
              <h3 className="list-selector-section-title">
                {t('list.ownedLists') || 'Owned Lists'}
              </h3>
              <div className="list-selector-items">
                {ownedLists.map(list => (
                  <button
                    key={list.id}
                    onClick={() => onSelectList(list.id)}
                    className={`list-selector-item ${currentListId === list.id ? 'list-selector-item-active' : ''}`}
                  >
                    <span className="list-selector-item-name">{list.name}</span>
                    <span className="list-selector-item-badge list-selector-item-badge-owned">
                      {t('list.owner') || 'Owner'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {sharedLists.length > 0 && (
            <div className="list-selector-section">
              <h3 className="list-selector-section-title">
                {t('list.sharedLists') || 'Shared With Me'}
              </h3>
              <div className="list-selector-items">
                {sharedLists.map(list => (
                  <button
                    key={list.id}
                    onClick={() => onSelectList(list.id)}
                    className={`list-selector-item ${currentListId === list.id ? 'list-selector-item-active' : ''}`}
                  >
                    <span className="list-selector-item-name">{list.name}</span>
                    <span className="list-selector-item-badge list-selector-item-badge-shared">
                      {t('list.shared') || 'Shared'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

