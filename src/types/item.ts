export interface Item {
  id: string;
  name: string;
  quantity: string;
  category: string;
  notes: string;
  picked: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ItemFormData {
  name: string;
  quantity: string;
  category: string;
  notes: string;
}

