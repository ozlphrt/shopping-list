import { useState, useEffect, useRef } from 'react';
import { I18nProvider, useI18n } from './i18n/context';
import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';
import { DeletedItemsSection } from './components/DeletedItemsSection';
import { PickedItemsSection } from './components/PickedItemsSection';
import { Auth } from './components/Auth';
import { ShareList } from './components/ShareList';
import { ListDropdown } from './components/ListDropdown';
import { CreateListModal } from './components/CreateListModal';
import { CleanupButton } from './components/CleanupButton';
import { useItems } from './hooks/useItems';
import { useLists } from './hooks/useLists';
import { auth, db } from './config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import './App.css';

function AppContent() {
  const { t } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const [listToDelete, setListToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showListDropdown, setShowListDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { lists, loading: listsLoading, hasOrphanedLists } = useLists();
  const { clearAll } = useItems(currentListId);

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener - this will fire immediately with current state
    // and again after sign-in completes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (mounted) {
        // Only log auth changes in development
        if (import.meta.env.DEV) {
          console.log('Auth state changed:', user ? `${user.email} (${user.uid})` : 'signed out');
        }
        setUser(user);
        setLoading(false);
      }
    });
    
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Auto-select first list if no list is currently selected
    if (!user || listsLoading) return;
    
    if (lists.length > 0 && !currentListId) {
      // Auto-select the first list if none is selected
      setCurrentListId(lists[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, lists.length, listsLoading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowListDropdown(false);
      }
    };

    if (showListDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showListDropdown]);

  const handleClearAll = async () => {
    await clearAll();
    setShowClearModal(false);
  };

  const handleListCreated = (listId: string) => {
    setCurrentListId(listId);
    setShowCreateListModal(false);
  };

  const handleDeleteList = async () => {
    if (!listToDelete) return;
    
    try {
      const listRef = doc(db, 'lists', listToDelete.id);
      await deleteDoc(listRef);
      // If deleted list was current, clear selection
      if (currentListId === listToDelete.id) {
        setCurrentListId(null);
      }
      setShowDeleteListModal(false);
      setListToDelete(null);
    } catch (error: any) {
      console.error('Error deleting list:', error);
      alert(`Error deleting list: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="app-container">
          <div className="app-loading">{t('app.loading')}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app">
        <div className="app-container">
          <div className="app-auth-screen">
            <h1 className="app-auth-title">{t('app.title')}</h1>
            <p className="app-auth-subtitle">{t('app.subtitle')}</p>
            <Auth />
          </div>
        </div>
      </div>
    );
  }

  const currentList = lists.find(l => l.id === currentListId);

  return (
    <>
      <div className="app">
        <div className="app-container">
          <div className="app-header">
            <div className="app-header-left">
              <div className="app-header-title-wrapper" ref={dropdownRef}>
                <button
                  onClick={() => setShowListDropdown(!showListDropdown)}
                  className="app-header-title-button"
                  title={t('list.myLists') || 'My Lists'}
                >
                  <h1 className="app-header-title">{currentList?.name || t('app.title')}</h1>
                  <span className="material-symbols-outlined app-header-title-icon">
                    {showListDropdown ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {showListDropdown && (
                  <ListDropdown
                    lists={lists}
                    currentListId={currentListId}
                    onSelectList={(listId) => {
                      setCurrentListId(listId);
                      setShowListDropdown(false);
                    }}
                    onDeleteList={(listId) => {
                      const list = lists.find(l => l.id === listId);
                      if (list) {
                        setListToDelete({ id: listId, name: list.name });
                        setShowDeleteListModal(true);
                        setShowListDropdown(false); // Close dropdown when opening modal
                      }
                    }}
                    loading={listsLoading}
                  />
                )}
              </div>
            </div>
            <div className="app-header-buttons">
              <button 
                onClick={() => setShowCreateListModal(true)}
                className="app-header-button app-header-button-add"
                title={t('list.createNew') || 'Create New List'}
                aria-label={t('list.createNew') || 'Create New List'}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="app-header-button"
                title={t('list.share')}
                aria-label={t('list.share')}
                disabled={!currentListId}
              >
                <span className="material-symbols-outlined">share</span>
              </button>
              <button 
                onClick={() => setShowClearModal(true)}
                className="app-header-button"
                title={t('list.clearAll')}
                aria-label={t('list.clearAll')}
                disabled={!currentListId}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
              <Auth currentList={currentList} />
            </div>
          </div>
          <main className="app-main">
            <div className="app-main-container">
              {hasOrphanedLists && (
                <CleanupButton onCleanupComplete={() => window.location.reload()} />
              )}
              {currentListId ? (
                <>
                  <ItemForm listId={currentListId} />
                  <ItemList listId={currentListId} />
                  <PickedItemsSection listId={currentListId} />
                  <DeletedItemsSection listId={currentListId} />
                </>
              ) : (
                <div className="app-no-list-selected">
                  <p>{t('list.selectOrCreate') || 'Select a list above or create a new one to get started.'}</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      {showClearModal && (
        <>
          <div className="app-modal-overlay" onClick={() => setShowClearModal(false)}></div>
          <div className="app-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="app-modal-title">{t('list.clearAllConfirm')}</h3>
            <div className="app-modal-actions">
              <button onClick={handleClearAll} className="app-modal-button app-modal-button-primary">
                {t('form.delete')}
              </button>
              <button onClick={() => setShowClearModal(false)} className="app-modal-button app-modal-button-secondary">
                {t('form.cancel')}
              </button>
            </div>
          </div>
        </>
      )}
      {showShareModal && currentListId && (
        <ShareList 
          listId={currentListId}
          onClose={() => setShowShareModal(false)} 
        />
      )}
      {showCreateListModal && (
        <CreateListModal
          onClose={() => setShowCreateListModal(false)}
          onCreated={handleListCreated}
        />
      )}
      {showDeleteListModal && listToDelete && (
        <>
          <div className="app-modal-overlay" onClick={() => {
            setShowDeleteListModal(false);
            setListToDelete(null);
          }}></div>
          <div className="app-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="app-modal-title">
              {t('list.deleteListConfirm') || 'Delete list?'} "{listToDelete.name}"
            </h3>
            <p className="app-modal-message">
              {t('list.deleteListMessage') || 'This will permanently delete this list and all its items. This action cannot be undone.'}
            </p>
            <div className="app-modal-actions">
              <button onClick={handleDeleteList} className="app-modal-button app-modal-button-danger">
                {t('form.delete')}
              </button>
              <button 
                onClick={() => {
                  setShowDeleteListModal(false);
                  setListToDelete(null);
                }} 
                className="app-modal-button app-modal-button-secondary"
              >
                {t('form.cancel')}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;

