import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { CartItem, MenuItem } from '../types';

interface CartState {
  items: CartItem[];
}

interface CartContextValue extends CartState {
  addToCart: (item: MenuItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
}

type CartAction =
  | { type: 'ADD'; payload: MenuItem }
  | { type: 'UPDATE'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE'; payload: { id: string } }
  | { type: 'CLEAR' };

const CartContext = createContext<CartContextValue | undefined>(undefined);

const initialState: CartState = {
  items: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'UPDATE': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          items: state.items.filter(item => item.id !== id),
        };
      }
      return {
        items: state.items.map(item => (item.id === id ? { ...item, quantity } : item)),
      };
    }
    case 'REMOVE': {
      return {
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    }
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const subtotal = useMemo(() => {
    return state.items.reduce<number>((accumulator: number, item: CartItem) => {
      return accumulator + item.price * item.quantity;
    }, 0);
  }, [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      subtotal,
      addToCart: (item: MenuItem) => dispatch({ type: 'ADD', payload: item }),
      updateQuantity: (id: string, quantity: number) =>
        dispatch({ type: 'UPDATE', payload: { id, quantity } }),
      removeFromCart: (id: string) => dispatch({ type: 'REMOVE', payload: { id } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }),
    [state.items, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export type { CartContextValue };
