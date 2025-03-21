export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  category: string;
  lastOrdered?: string;
  supplier?: string;
}

export interface DbInventoryItem {
  id: string;
  name: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  unit: string;
  category: string;
  supplier: string;
  last_ordered: string;
  created_at: string;
  updated_at: string;
}
