import { useMemo } from 'react';
import { useItems } from '../hooks/useItems';
import { useI18n } from '../i18n/context';
import { ItemCard } from './ItemCard';
import './ItemList.css'; // Reusing ItemList styles for consistency

interface PickedItemsSectionProps {
  listId: string | null;
}

export const PickedItemsSection = ({ listId }: PickedItemsSectionProps) => {
  const { items } = useItems(listId);
  const { t } = useI18n();
  
  const pickedItems = useMemo(() => {
    return items.filter(item => !item.deleted && item.picked);
  }, [items]);

  if (pickedItems.length === 0) return null;

  return (
    <div className="item-list-picked-section">
      <h3 className="item-list-category-title item-list-picked-title">{t('list.picked')}</h3>
      <div className="item-list-items">
        {pickedItems.map(item => (
          <ItemCard key={item.id} item={item} listId={listId} />
        ))}
      </div>
    </div>
  );
};

