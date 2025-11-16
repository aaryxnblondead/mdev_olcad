import { useEffect, useState } from 'react';
import { MenuItem } from '../types';
import { subscribeToMenu } from '../services/menuService';

interface MenuState {
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
}

export const useMenu = (): MenuState => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMenu(
      nextItems => {
        setItems(nextItems);
        setLoading(false);
      },
      err => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { items, isLoading, error };
};
