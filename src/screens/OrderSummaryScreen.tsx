import React, { useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { createOrder } from '../services/orderService';
import { OrderPayload } from '../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const TAX_RATE = 0.08;

const OrderSummaryScreen = (): React.ReactElement => {
  const { items, subtotal, clearCart } = useCart();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isSubmitting, setSubmitting] = useState(false);

  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Cart empty', 'Add items to your cart before submitting an order.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: OrderPayload = {
        items,
        subtotal,
        tax,
        total,
        createdAt: Date.now(),
      };
      await createOrder(payload);
      clearCart();
      Alert.alert('Order placed', 'Your delicious meal is on its way!');
      navigation.reset({ index: 0, routes: [{ name: 'Menu' }] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Something went wrong', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Order Summary</Text>
        <View style={styles.card}>
          {items.length === 0 ? (
            <Text style={styles.emptyState}>Your cart is empty. Head back and add some dishes.</Text>
          ) : (
            items.map(item => (
              <View key={item.id} style={styles.row}>
                <View style={styles.rowInfo}>
                  <Text style={styles.itemName}>{item.quantity} x {item.name}</Text>
                  <Text style={styles.itemNote}>{formatCurrency(item.price)} each</Text>
                </View>
                <Text style={styles.itemTotal}>{formatCurrency(item.price * item.quantity)}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (8%)</Text>
            <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmitOrder}
          disabled={isSubmitting || items.length === 0}
        >
          <Text style={styles.submitLabel}>
            {isSubmitting ? 'Placing order...' : items.length === 0 ? 'Add items to order' : 'Place order'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rowInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  itemNote: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyState: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    color: colors.textMuted,
  },
  summaryValue: {
    color: colors.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  submitButton: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitLabel: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OrderSummaryScreen;
