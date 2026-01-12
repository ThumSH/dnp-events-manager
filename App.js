import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import CustomerScreen from './src/screens/CustomerScreen';
import EquipmentScreen from './src/screens/EquipmentScreen';
import BillingScreen from './src/screens/BillingScreen';
import HistoryHubScreen from './src/screens/HistoryHubScreen';
import ViewCustomersScreen from './src/screens/ViewCustomersScreen';
import ViewEquipmentScreen from './src/screens/ViewEquipmentScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import UnfinishedBillsScreen from './src/screens/UnfinishedBillsScreen';

const Stack = createStackNavigator();

const theme = {
  ...MD3LightTheme,
  roundness: 18,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563EB',
    secondary: '#F59E0B',
    tertiary: '#10B981',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    error: '#EF4444',
    onSurface: '#1E293B',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: theme.colors.primary },
              headerTintColor: '#fff',
              headerTitleAlign: 'center',
              headerTitleStyle: { fontWeight: '700' },
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Customers" component={CustomerScreen} title="Add Customer" />
            <Stack.Screen name="Equipment" component={EquipmentScreen} title="Inventory" />
            <Stack.Screen name="Billing" component={BillingScreen} title="Billing" />
            <Stack.Screen name="HistoryHub" component={HistoryHubScreen} title="History" />
            <Stack.Screen name="ViewCustomers" component={ViewCustomersScreen} />
            <Stack.Screen name="ViewEquipment" component={ViewEquipmentScreen} />
            <Stack.Screen name="UnfinishedBills" component={UnfinishedBillsScreen} />
            <Stack.Screen name="Reports" component={ReportsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
