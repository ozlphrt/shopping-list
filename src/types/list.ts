export interface ShoppingList {
  id: string;
  name: string;
  ownerId: string; // User who created the list
  sharedWith: string[]; // Array of user email addresses who have access
  createdAt: Date;
  updatedAt: Date;
}


