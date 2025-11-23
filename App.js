import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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


const Stack = createStackNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    onPrimary: '#ffffff',
    secondary: '#03dac6',
    background: '#f6f6f6',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{ 
              headerStyle: { backgroundColor: '#6200ee' }, 
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              headerBackTitleVisible: false
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Dashboard', headerShown: false }} 
            />
            <Stack.Screen 
              name="Customers" 
              component={CustomerScreen} 
              options={{ title: 'Add Customer' }}
            />
            <Stack.Screen 
              name="Equipment" 
              component={EquipmentScreen} 
              options={{ title: 'Manage Inventory' }}
            />
            <Stack.Screen 
              name="Billing" 
              component={BillingScreen} 
              options={{ title: 'Create Invoice' }} 
            />

            <Stack.Screen 
              name="HistoryHub" 
              component={HistoryHubScreen} 
              options={{ title: 'History & Management' }} 
            />
            <Stack.Screen 
              name="ViewCustomers" 
              component={ViewCustomersScreen} 
              options={{ title: 'View Customers' }} 
            />
            <Stack.Screen 
              name="ViewEquipment" 
              component={ViewEquipmentScreen} 
              options={{ title: 'View Equipment' }} 
            />
            <Stack.Screen 
              name="Reports" 
              component={ReportsScreen} 
              options={{ title: 'Billing Summary' }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}