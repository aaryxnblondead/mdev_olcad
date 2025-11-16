import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { OrderPayload } from '../types';

export const createOrder = async (order: OrderPayload) => {
  const ordersRef = collection(db, 'orders');
  await addDoc(ordersRef, {
    items: order.items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    createdAt: serverTimestamp(),
  });
};
