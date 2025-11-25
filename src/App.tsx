import { useState } from 'react';
import { I18nProvider, useI18n } from './i18n/context';
import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';
import { ScanList } from './components/ScanList';
import { useItems } from './hooks/useItems';
import './App.css';

function AppContent() {
  const { clearAll } = useItems();
  const { t } = useI18n();
  const [showClearModal, setShowClearModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  const handleClearAll = async () => {
    await clearAll();
    setShowClearModal(false);
  };

  return (
    <>
      <div className="app">
        <div className="app-container">
          <div className="app-header">
            <h1 className="app-header-title">Shopping List</h1>
            <div className="app-header-buttons">
              <button 
                onClick={() => setShowScanModal(true)}
                className="app-header-button"
                title={t('scan.title') || 'Scan List'}
                aria-label={t('scan.title') || 'Scan List'}
              >
                <span className="material-symbols-outlined">camera_alt</span>
              </button>
              <button 
                onClick={() => setShowClearModal(true)}
                className="app-header-button"
                title={t('list.clearAll')}
                aria-label={t('list.clearAll')}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
          <main className="app-main">
            <ItemList />
          </main>
          <ItemForm />
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
      {showScanModal && (
        <ScanList onClose={() => setShowScanModal(false)} />
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

