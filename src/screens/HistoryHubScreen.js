import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function HistoryHubScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>View Customers</Text>
          <Text style={styles.cardSubtitle}>Edit or delete existing customer details.</Text>
          <Button
            mode="contained"
            icon="account-group"
            onPress={() => navigation.navigate('ViewCustomers')}
            style={styles.button}
          >
            Manage Customers
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>View Equipment</Text>
          <Text style={styles.cardSubtitle}>Update stock, prices, or remove equipment.</Text>
          <Button
            mode="contained"
            icon="clipboard-list"
            onPress={() => navigation.navigate('ViewEquipment')}
            style={styles.button}
          >
            Manage Inventory
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>Billing Summary</Text>
          <Text style={styles.cardSubtitle}>View past invoices within a date range.</Text>
          <Button
            mode="contained"
            icon="history"
            onPress={() => navigation.navigate('Reports')}
            style={styles.button}
          >
            View Invoice History
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  card: { marginBottom: 20, backgroundColor: 'white' },
  cardTitle: { marginBottom: 5 },
  cardSubtitle: { marginBottom: 15, color: '#666' },
  button: { borderRadius: 8 },
});