export interface Item {
  id: string;
  name: string;
  quantity: string;
  category: string;
  notes: string;
  picked: boolean;
  deleted: boolean;
  dimmed?: boolean; // Out of stock / dimmed state
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  userId: string; // Owner of the item
  listId: string; // ID of the list this item belongs to
}

export interface ItemFormData {
  name: string;
  quantity: string;
  category: string;
  notes: string;
}

