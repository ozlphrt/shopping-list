import { useMemo } from 'react';
import { Item } from '../types/item';
import { ItemCard } from './ItemCard';
import { useItems } from '../hooks/useItems';
import { useI18n } from '../i18n/context';
import { CATEGORIES } from '../constants/categories';
import './ItemList.css';

export const ItemList = () => {
  const { items, loading } = useItems();
  const { t } = useI18n();

  const activeItems = useMemo(() => {
    const filtered = items.filter(item => !item.deleted && !item.picked);
    // Sort by category order, then by name
    return filtered.sort((a, b) => {
      const aIndex = CATEGORIES.indexOf(a.category as any);
      const bIndex = CATEGORIES.indexOf(b.category as any);
      if (aIndex !== bIndex) {
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }
      return a.name.localeCompare(b.name);
    });
  }, [items]);
  const pickedItems = useMemo(() => items.filter(item => !item.deleted && item.picked), [items]);
  const deletedItems = useMemo(() => items.filter(item => item.deleted), [items]);

  if (loading) {
    return <div className="item-list-loading">{t('app.loading')}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="item-list-empty-state">
        <p>{t('list.emptyState')}</p>
      </div>
    );
  }

  return (
    <div className="item-list">
      <div className="item-list-items">
        {activeItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
      {pickedItems.length > 0 && (
        <div className="item-list-picked-section">
          <h3 className="item-list-category-title item-list-picked-title">{t('list.picked')}</h3>
          <div className="item-list-items">
            {pickedItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
      {deletedItems.length > 0 && (
        <div className="item-list-deleted-section">
          <h3 className="item-list-category-title item-list-deleted-title">{t('list.deleted')}</h3>
          <div className="item-list-items">
            {deletedItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

