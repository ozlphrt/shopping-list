import { useState, useEffect, useRef } from 'react';
import { Item } from '../types/item';
import { useItems } from '../hooks/useItems';
import { useI18n } from '../i18n/context';
import { CATEGORIES } from '../constants/categories';
import './ItemCard.css';

interface ItemCardProps {
  item: Item;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  const { updateItem, deleteItem } = useItems();
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    quantity: item.quantity,
    category: item.category,
    notes: item.notes
  });
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Sync editData when item changes
  useEffect(() => {
    setEditData({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      notes: item.notes
    });
  }, [item]);

  const handleTogglePicked = async () => {
    await updateItem(item.id, { picked: !item.picked });
  };

  const handleSave = async () => {
    await updateItem(item.id, editData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteItem(item.id);
  };


  const description = [item.quantity, item.notes].filter(Boolean).join(', ');

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open edit if item is deleted, clicking on checkbox, or if we just swiped
    if (item.deleted || (e.target as HTMLElement).closest('.item-card-checkbox-wrapper') || isSwiping) {
      return;
    }
    setIsEditing(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Disable swipe for deleted items
    if (item.deleted) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - touchStartX.current;
    const deltaY = Math.abs(touchY - touchStartY.current);

    // Only consider horizontal swipes (more horizontal than vertical)
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
      setIsSwiping(true);
      // Limit swipe distance
      const maxSwipe = 150;
      const limitedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
      setSwipeOffset(limitedDelta);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;

    const swipeThreshold = 80;
    
    if (swipeOffset > swipeThreshold) {
      // Swipe right - complete
      handleTogglePicked();
    } else if (swipeOffset < -swipeThreshold) {
      // Swipe left - delete
      handleDelete();
    }

    // Reset
    setSwipeOffset(0);
    setIsSwiping(false);
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const getWrapperClassName = () => {
    if (swipeOffset > 10) return 'item-card-wrapper swiping-right';
    if (swipeOffset < -10) return 'item-card-wrapper swiping-left';
    return 'item-card-wrapper';
  };

  return (
    <>
      <div className={getWrapperClassName()}>
        {!item.deleted && (
          <div className="item-card-swipe-indicators">
            <div className="item-card-swipe-indicator item-card-swipe-complete">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div className="item-card-swipe-indicator item-card-swipe-delete">
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>
        )}
        <div 
          className={`item-card ${item.picked ? 'item-card-picked' : ''} ${item.deleted ? 'item-card-deleted' : ''} ${isSwiping ? 'item-card-swiping' : ''}`}
          onClick={handleCardClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ transform: `translateX(${swipeOffset}px)` }}
        >
          <div className="item-card-checkbox">
            <div className="item-card-checkbox-wrapper">
              <input
                type="checkbox"
                checked={item.picked}
                onChange={handleTogglePicked}
                disabled={item.deleted}
              />
            </div>
            <div className="item-card-content">
              <p className="item-card-name">{item.name}</p>
              {description && (
                <p className="item-card-description">{description}</p>
              )}
            </div>
          </div>
          <div className="item-card-category-tag">{t(`categories.${item.category || 'Other'}`)}</div>
        </div>
      </div>
      {isEditing && (
        <>
          <div className="item-card-edit-overlay" onClick={() => setIsEditing(false)}></div>
          <div className="item-card-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="item-card-edit-header">
              <h3 className="item-card-edit-title">{t('form.editItem')}</h3>
              <button onClick={() => setIsEditing(false)} className="item-card-edit-close">×</button>
            </div>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="item-card-edit-input"
              placeholder={t('form.itemName')}
              autoFocus
            />
            <input
              type="text"
              value={editData.quantity}
              onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
              className="item-card-edit-input"
              placeholder={t('form.quantity')}
            />
            <select
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
              className="item-card-edit-select"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
              ))}
            </select>
            <textarea
              value={editData.notes}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              className="item-card-edit-textarea"
              placeholder={t('form.notes')}
              rows={2}
            />
            <div className="item-card-edit-actions">
              <button onClick={handleSave} className="item-card-edit-save">{t('form.save')}</button>
              <button onClick={handleDelete} className="item-card-edit-delete">{t('form.delete')}</button>
              <button onClick={() => setIsEditing(false)} className="item-card-edit-cancel">{t('form.cancel')}</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

