import { useState, useEffect, useRef } from 'react';
import { Item } from '../types/item';
import { useItems } from '../hooks/useItems';
import { useI18n } from '../i18n/context';
import { CATEGORIES } from '../constants/categories';
import './ItemCard.css';

interface ItemCardProps {
  item: Item;
  listId: string | null;
}

export const ItemCard = ({ item, listId }: ItemCardProps) => {
  const { updateItem, deleteItem } = useItems(listId);
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    quantity: item.quantity,
    category: item.category,
    notes: item.notes
  });
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

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


  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open edit if clicking on checkbox, delete button, or swipe backgrounds
    if (
      item.deleted ||
      (e.target as HTMLElement).closest('.item-card-checkbox-wrapper') ||
      (e.target as HTMLElement).closest('.item-card-delete-btn') ||
      (e.target as HTMLElement).closest('.swipe-bg')
    ) {
      return;
    }
    setIsEditing(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (item.deleted) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
    setSwipeOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    const deltaY = e.touches[0].clientY - touchStartRef.current.y;
    
    // Only track horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const swipeThreshold = 80;
    
    if (swipeOffset > swipeThreshold) {
      // Right swipe - mark as picked (checked)
      handleTogglePicked();
    } else if (swipeOffset < -swipeThreshold) {
      // Left swipe - delete the item
      handleDelete();
    }
    
    // Reset
    setSwipeOffset(0);
    touchStartRef.current = null;
  };

  const handleTouchCancel = () => {
    setSwipeOffset(0);
    touchStartRef.current = null;
  };

  const swipeOpacity = Math.min(Math.abs(swipeOffset) / 100, 1);

  return (
    <>
      <div 
        className={`item-card-row ${item.dimmed ? 'item-card-dimmed' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {/* Red background with trash icon (left swipe) */}
        {swipeOffset < -5 && (
          <div 
            className="swipe-bg swipe-bg-left"
            style={{ opacity: swipeOpacity }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="swipe-icon">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </div>
        )}
        {/* Green background with check icon (right swipe) */}
        {swipeOffset > 5 && (
          <div 
            className="swipe-bg swipe-bg-right"
            style={{ opacity: swipeOpacity }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="swipe-icon">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        )}
        {/* Content */}
        <div
          className="item-card-content-wrapper"
          style={{ transform: `translateX(${swipeOffset}px)` }}
          onClick={handleCardClick}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!item.deleted) {
                handleTogglePicked();
              }
            }}
            className={`item-card-checkbox-btn ${item.picked ? 'item-card-checkbox-checked' : 'item-card-checkbox-unchecked'} ${item.deleted ? 'item-card-checkbox-deleted' : ''}`}
            disabled={item.deleted}
          >
            {item.deleted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(239, 68, 68)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            ) : item.picked ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : null}
          </button>
          <span className={`item-card-name ${item.picked ? 'item-card-name-picked' : ''} ${item.dimmed ? 'item-card-name-dimmed' : ''}`}>
            {item.name}
          </span>
          {!item.deleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="item-card-delete-btn"
              title={t('form.delete')}
              aria-label={t('form.delete')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          )}
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
