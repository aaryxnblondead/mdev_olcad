import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import MenuCard from '../components/MenuCard';
import { useMenu } from '../hooks/useMenu';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const MenuScreen = (): React.ReactElement => {
  const { items, isLoading, error } = useMenu();
  const { addToCart, items: cartItems, subtotal } = useCart();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const totalQuantity = useMemo(
    () => cartItems.reduce((accumulator, item) => accumulator + item.quantity, 0),
    [cartItems]
  );

  const renderItem: ListRenderItem<MenuItem> = ({ item }): React.ReactElement => {
    return <MenuCard item={item} onAdd={() => addToCart(item)} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.helperText}>Loading today&apos;s menu...</Text>
          </View>
        )}
        {!isLoading && error && (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>We could not load the menu. Pull to refresh.</Text>
            <Text style={styles.helperText}>{error}</Text>
          </View>
        )}
        {!isLoading && !error && (
          <FlatList<MenuItem>
            data={items}
            renderItem={renderItem}
            keyExtractor={(item: MenuItem) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.centerContent}>
                <Text style={styles.helperText}>No items available right now. Check back soon!</Text>
              </View>
            }
          />
        )}
      </View>
      {totalQuantity > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.85}
        >
          <Text style={styles.cartButtonLabel}>{totalQuantity} item(s) | {formatCurrency(subtotal)}</Text>
          <Text style={styles.cartButtonSubLabel}>Review order</Text>
        </TouchableOpacity>
      )}
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    marginTop: spacing.sm,
    color: colors.textMuted,
  },
  errorText: {
    color: colors.danger,
    fontWeight: '600',
  },
  cartButton: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cartButtonLabel: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  cartButtonSubLabel: {
    color: colors.surface,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default MenuScreen;
