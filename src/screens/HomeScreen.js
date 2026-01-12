import React from 'react';
import { 
  View, 
  StyleSheet, 
  StatusBar, 
  Platform, 
  Image,
  ScrollView 
} from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Header Section */}
          <Surface style={styles.headerSurface} elevation={8}>
            <View style={styles.logoContainer}>
              <Image    
                source={require('../../assets/dnpLogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text variant="headlineMedium" style={styles.title}>DNP Event Organizing</Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Equipment Rental & Sales Management
            </Text>
            <Text variant="bodyMedium" style={styles.tagline}>
              Professional Event Planner 
            </Text>
          </Surface>
          


          {/* Main Action Buttons */}
          <View style={styles.buttonContainer}>
            <Surface style={styles.buttonCard} elevation={4}>
              <Button 
                mode="contained"
                icon="account-plus" 
                style={styles.btn} 
                contentStyle={styles.btnContent}
                labelStyle={styles.btnLabel}
                onPress={() => navigation.navigate('Customers')}
              >
                Customer Registration
              </Button>
              <Text variant="bodySmall" style={styles.btnDescription}>
                Register new customers with contact details
              </Text>
            </Surface>

            <Surface style={styles.buttonCard} elevation={4}>
              <Button 
                mode="contained" 
                icon="package-variant" 
                style={[styles.btn, styles.equipmentBtn]} 
                contentStyle={styles.btnContent}
                labelStyle={styles.btnLabel}
                onPress={() => navigation.navigate('Equipment')}
              >
                Equipment Inventory
              </Button>
              <Text variant="bodySmall" style={styles.btnDescription}>
                Manage chairs, tables, tents & equipment
              </Text>
            </Surface>

            <Surface style={styles.buttonCard} elevation={4}>
              <Button 
                mode="contained" 
                icon="receipt" 
                buttonColor="#00C853" 
                style={[styles.btn, styles.billingBtn]} 
                contentStyle={styles.btnContent}
                labelStyle={styles.btnLabel}
                onPress={() => navigation.navigate('Billing')}
              >
                Billing & Invoices
              </Button>
              <Text variant="bodySmall" style={styles.btnDescription}>
                Create bills and generate PDF invoices
              </Text>
            </Surface>


        <Surface style={styles.buttonCard} elevation={4}>
              <Button 
                mode="contained" 
                icon="receipt" 
                buttonColor="#7e7097ff" 
                style={[styles.btn, styles.reportBtn]} 
                contentStyle={styles.btnContent}
                labelStyle={styles.btnLabel}
                onPress={() => navigation.navigate('HistoryHub')}
              >
                View History
              </Button>
              <Text variant="bodySmall" style={styles.btnDescription}>
                Manage customers, inventory & view reports
              </Text>
            </Surface>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text variant="bodyMedium" style={styles.footerText}>
              Developed by Tranzix Global Impex (Pvt) Ltd
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc',
  },
  
  // Header Styles
  headerSurface: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  logoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: { 
    fontWeight: 'bold', 
    color: '#1a237e',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    color: '#37474f',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: '500',
  },
  tagline: {
    color: '#78909c',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Button Section
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  btn: { 
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  equipmentBtn: {
    backgroundColor: '#ff6d00',
  },
  billingBtn: {
    backgroundColor: '#00c853',
  },
    reportBtn: {
    backgroundColor: '#081f88ff',
  },
  btnContent: { 
    paddingVertical: 10,
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  btnDescription: {
    color: '#78909c',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 10,
    marginTop: 'auto',
  },
  footerText: {
    color: '#031119ff',
    textAlign: 'center',
    marginBottom: 1,
  },
});