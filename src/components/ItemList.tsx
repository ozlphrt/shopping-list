import { useMemo } from 'react';
import { ItemCard } from './ItemCard';
import { useItems } from '../hooks/useItems';
import { useI18n } from '../i18n/context';
import { categoryOrder, categoryEmojis } from '../data/groceryDatabase';
import { getCategoryEmoji } from '../utils/categoryDetector';
import './ItemList.css';

interface ItemListProps {
  listId: string | null;
}

export const ItemList = ({ listId }: ItemListProps) => {
  const { items, loading } = useItems(listId);
  const { t } = useI18n();

  // Separate items into active, picked, and deleted FIRST
  // This ensures deleted items never appear in category sections
  const activeItems = useMemo(() => {
    // Explicitly filter: only include items that are NOT deleted and NOT picked
    return items.filter(item => {
      // Strict check: if deleted is true, exclude
      if (item.deleted === true) return false;
      // If picked is true, exclude from active
      if (item.picked === true) return false;
      // Only include if both are false
      return true;
    });
  }, [items]);


  // Group active items by category (only non-deleted, non-picked items)
  const groupedActiveItems = useMemo(() => {
    const grouped: Record<string, typeof activeItems> = {};
    // activeItems already excludes deleted and picked items, but double-check for safety
    activeItems.forEach(item => {
      // Extra safety check: skip if somehow deleted or picked
      if (item.deleted === true || item.picked === true) {
        return;
      }
      
      const category = item.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    
    // Sort items within each category by name
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return grouped;
  }, [activeItems]);

  // Sort categories by the order defined in groceryDatabase
  const sortedCategories = useMemo(() => {
    const categories = Object.keys(groupedActiveItems);
    return categories.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a as any);
      const bIndex = categoryOrder.indexOf(b as any);
      const aIdx = aIndex === -1 ? categoryOrder.length : aIndex;
      const bIdx = bIndex === -1 ? categoryOrder.length : bIndex;
      return aIdx - bIdx;
    });
  }, [groupedActiveItems]);

  const uncheckedCount = activeItems.length;

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
      <div className="item-list-content">
        {/* Active items grouped by category */}
        {sortedCategories.length > 0 ? (
          sortedCategories.map(category => (
            <div key={category} className="item-list-category">
              <div className="item-list-category-header">
                <span className="item-list-category-emoji">{getCategoryEmoji(category)}</span>
                <h3 className="item-list-category-title">{category}</h3>
                <div className="item-list-category-divider"></div>
              </div>
              <div className="item-list-items">
                {groupedActiveItems[category].map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))
        ) : activeItems.length === 0 ? (
          <div className="item-list-empty-state">
            <p>{t('list.emptyState')}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

