import { useState, useRef, useEffect } from 'react';
import { useItems } from '../hooks/useItems';
import { useI18n } from '../i18n/context';
import { findProductMatch } from '../utils/categoryDetector';
import './ItemForm.css';

interface ItemFormProps {
  listId: string | null;
}

export const ItemForm = ({ listId }: ItemFormProps) => {
  const { addItem } = useItems(listId);
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !listId) return;

    // Try to find a match and use normalized name if found
    const match = findProductMatch(inputValue.trim());
    const itemName = match ? match.name : inputValue.trim();
    const itemCategory = match ? match.category : 'Other';

    await addItem({
      name: itemName,
      quantity: '',
      category: itemCategory,
      notes: '',
      picked: false,
      deleted: false,
      createdBy: ''
    }, listId);

    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="item-form-inline">
      <form onSubmit={handleSubmit} className="item-form-inline-form">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('form.itemName') || 'Add item...'}
          className="item-form-inline-input"
        />
        <button
          type="submit"
          className="item-form-inline-button"
          disabled={!inputValue.trim()}
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </form>
    </div>
  );
};
