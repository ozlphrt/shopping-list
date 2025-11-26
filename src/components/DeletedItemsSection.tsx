import { useMemo } from 'react';
import { useItems } from '../hooks/useItems';
import { useI18n } from '../i18n/context';
import { ItemCard } from './ItemCard';
import './ItemList.css';

interface DeletedItemsSectionProps {
  listId: string | null;
}

export const DeletedItemsSection = ({ listId }: DeletedItemsSectionProps) => {
  const { items } = useItems(listId);
  const { t } = useI18n();
  
  const deletedItems = useMemo(() => {
    // Use strict check to ensure we catch all deleted items
    const deleted = items.filter(item => item.deleted === true);
    return deleted;
  }, [items]);

  if (deletedItems.length === 0) return null;

  return (
    <div className="item-list-deleted-section">
      <h3 className="item-list-category-title item-list-deleted-title">{t('list.deleted')}</h3>
      <div className="item-list-items">
        {deletedItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

