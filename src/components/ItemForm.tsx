import { useState, useRef, useEffect } from 'react';
import { useItems } from '../hooks/useItems';
import { useI18n } from '../i18n/context';
import { ItemFormData } from '../types/item';
import { detectCategory } from '../utils/categoryDetector';
import { CATEGORIES } from '../constants/categories';
import './ItemForm.css';

export const ItemForm = () => {
  const { addItem } = useItems();
  const { t } = useI18n();
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    quantity: '',
    category: 'Other',
    notes: ''
  });
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleNameChange = async (name: string) => {
    // Update name immediately
    setFormData(prev => ({ ...prev, name }));
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Quick local check first (synchronous keywords)
    const quickCheck = async () => {
      const detectedCategory = await detectCategory(name);
      setFormData(prev => ({ ...prev, category: detectedCategory }));
    };
    
    // For short names, check immediately
    if (name.length < 3) {
      await quickCheck();
      return;
    }
    
    // Debounce online lookup - wait 500ms after user stops typing
    debounceTimer.current = setTimeout(quickCheck, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    await addItem({
      name: formData.name.trim(),
      quantity: formData.quantity.trim(),
      category: formData.category,
      notes: formData.notes.trim(),
      picked: false,
      deleted: false,
      createdBy: ''
    });

    setFormData({ name: '', quantity: '', category: 'Other', notes: '' });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fab-button">
        <span className="material-symbols-outlined fab-icon">add</span>
      </button>
    );
  }

  return (
    <>
      <div className="item-form-overlay" onClick={() => setIsOpen(false)}></div>
      <form onSubmit={handleSubmit} className="item-form" onClick={(e) => e.stopPropagation()}>
        <div className="item-form-header">
          <h3 className="item-form-title">{t('form.addItem')}</h3>
          <button type="button" onClick={() => setIsOpen(false)} className="item-form-close">×</button>
        </div>
        <input
          type="text"
          placeholder={t('form.itemName')}
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="item-form-input"
          required
          autoFocus
        />
        <input
          type="text"
          placeholder={t('form.quantity')}
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="item-form-input"
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="item-form-select"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
          ))}
        </select>
        <textarea
          placeholder={t('form.notes')}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="item-form-textarea"
          rows={2}
        />
        <div className="item-form-actions">
          <button type="submit" className="item-form-submit">{t('form.add')}</button>
          <button type="button" onClick={() => setIsOpen(false)} className="item-form-cancel">{t('form.cancel')}</button>
        </div>
      </form>
    </>
  );
};

