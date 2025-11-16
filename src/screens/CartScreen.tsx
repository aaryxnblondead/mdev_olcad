import React, { useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useCart } from '../context/CartContext';
import CartItemRow from '../components/CartItemRow';
import { CartItem } from '../types';
import { formatCurrency } from '../utils/currency';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const TAX_RATE = 0.08;

const CartScreen = (): React.ReactElement => {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const renderItem = ({ item }: { item: CartItem }): React.ReactElement => {
    return (
      <CartItemRow
        item={item}
        onQuantityChange={(quantity: number) => updateQuantity(item.id, quantity)}
        onRemove={() => removeFromCart(item.id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Add a tasty dish to get started.</Text>
          </View>
        ) : (
          <FlatList<CartItem>
            data={items}
            renderItem={renderItem}
            keyExtractor={(item: CartItem) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (8%)</Text>
          <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotalRow]}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          <Text style={styles.summaryTotalValue}>{formatCurrency(total)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.ctaButton, items.length === 0 && styles.disabledButton]}
          disabled={items.length === 0}
          onPress={() => navigation.navigate('OrderSummary')}
        >
          <Text style={styles.ctaLabel}>Review order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl * 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryTotalRow: {
    marginTop: spacing.md,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  ctaButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  ctaLabel: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CartScreen;
