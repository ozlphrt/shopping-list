import { useI18n } from '../i18n/context';
import './LanguageSwitcher.css';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="language-switcher">
      <button
        onClick={() => setLanguage('en')}
        className={`language-button ${language === 'en' ? 'active' : ''}`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('tr')}
        className={`language-button ${language === 'tr' ? 'active' : ''}`}
      >
        TR
      </button>
    </div>
  );
};

