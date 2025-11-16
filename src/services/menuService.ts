import {
  collection,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import { MenuItem } from '../types';

type MenuSubscription = (items: MenuItem[]) => void;
type ErrorHandler = (error: Error) => void;

const mapMenuItem = (doc: QueryDocumentSnapshot<DocumentData>): MenuItem => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    price: Number(data.price ?? 0),
    imageUrl: data.imageUrl,
    category: data.category,
    isAvailable: data.isAvailable ?? true,
  };
};

export const subscribeToMenu = (onData: MenuSubscription, onError: ErrorHandler) => {
  const menuRef = collection(db, 'menu');
  const menuQuery = query(menuRef, orderBy('name'));

  return onSnapshot(
    menuQuery,
    snapshot => {
      const nextItems: MenuItem[] = snapshot.docs
        .filter(doc => doc.data().isAvailable !== false)
        .map(mapMenuItem);
      onData(nextItems);
    },
    error => {
      onError(error);
    }
  );
};
