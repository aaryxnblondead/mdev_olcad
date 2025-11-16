export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  isAvailable?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderPayload {
  id?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: number;
}
