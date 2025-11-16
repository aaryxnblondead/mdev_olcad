import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartItem } from '../types';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import QuantitySelector from './QuantitySelector';
import { formatCurrency } from '../utils/currency';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

const CartItemRow = ({ item, onQuantityChange, onRemove }: CartItemRowProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>{formatCurrency(item.price * item.quantity)}</Text>
      </View>
      <View style={styles.actions}>
        <QuantitySelector
          quantity={item.quantity}
          onIncrease={() => onQuantityChange(item.quantity + 1)}
          onDecrease={() => onQuantityChange(item.quantity - 1)}
        />
        <TouchableOpacity onPress={onRemove}>
          <Text style={styles.remove}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    paddingRight: spacing.md,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remove: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CartItemRow;
