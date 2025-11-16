import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Menu"
      component={MenuScreen}
      options={{ title: 'Discover Dishes' }}
    />
    <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Your Cart' }} />
    <Stack.Screen
      name="OrderSummary"
      component={OrderSummaryScreen}
      options={{ title: 'Confirm Order' }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
