export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  description?: string;
  lastUpdated: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  date: Date;
  reference?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}