import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const HistoryHubScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Section */}
      <Surface style={styles.headerSurface} elevation={4}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          History & Management
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          View records, manage data & reports
        </Text>
      </Surface>

      {/* Management Section */}
      <Surface style={styles.sectionSurface} elevation={2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Data Management
        </Text>
        
        <Button
          icon="account-group"
          mode="contained"
          onPress={() => navigation.navigate('ViewCustomers')}
          style={[styles.button, styles.customerBtn]}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
        >
          View Customers
        </Button>

        <Button
          icon="package-variant"
          mode="contained"
          onPress={() => navigation.navigate('ViewEquipment')}
          style={[styles.button, styles.inventoryBtn]}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
        >
          View Inventory
        </Button>
      </Surface>

      {/* Billing Section */}
      <Surface style={styles.sectionSurface} elevation={2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Billing & Reports
        </Text>

        <Button
          icon="file-document-edit-outline"
          mode="contained"
          onPress={() => navigation.navigate('UnfinishedBills')}
          style={[styles.button, styles.unfinishedBtn]}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
        >
          View Unfinished Bills
        </Button>

        <Button
          icon="chart-bar"
          mode="contained"
          onPress={() => navigation.navigate('Reports')}
          style={[styles.button, styles.reportBtn]}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
        >
          Billing Reports
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  headerSurface: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#081f88ff',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#081f88ff',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#666',
    textAlign: 'center',
  },
  sectionSurface: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#37474f',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  btnContent: {
    paddingVertical: 6,
  },
  btnLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  customerBtn: {
    backgroundColor: '#2563EB',
  },
  inventoryBtn: {
    backgroundColor: '#ff6d00',
  },
  unfinishedBtn: {
    backgroundColor: '#F59E0B',
  },
  reportBtn: {
    backgroundColor: '#00c853',
  },
});

export default HistoryHubScreen;
