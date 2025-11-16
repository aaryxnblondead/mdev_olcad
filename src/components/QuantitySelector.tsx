import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantitySelector = ({ quantity, onIncrease, onDecrease }: QuantitySelectorProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrease} style={[styles.button, styles.leftButton]}>
        <Text style={styles.symbol}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity onPress={onIncrease} style={[styles.button, styles.rightButton]}>
        <Text style={styles.symbol}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
  },
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  leftButton: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  rightButton: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  symbol: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: spacing.md,
  },
});

export default QuantitySelector;
