import React, { useState, useCallback } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Appbar, List, Text, Button, ActivityIndicator, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const UnfinishedBillsScreen = () => {
  const [savedBills, setSavedBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const loadSavedBills = async () => {
        setLoading(true);
        try {
          const savedBillsRaw = await AsyncStorage.getItem('unfinished_bills');
          const bills = savedBillsRaw ? JSON.parse(savedBillsRaw) : [];
          // Sort by most recently saved
          bills.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
          setSavedBills(bills);
        } catch (e) {
          Alert.alert('Error', 'Could not load saved bills.');
          console.error(e);
        } finally {
          setLoading(false);
        }
      };

      loadSavedBills();
    }, [])
  );

  const handleSelectBill = (bill) => {
    // Navigate to Billing screen and pass the selected bill data
    navigation.navigate('Billing', { savedBill: bill });
  };

  const handleDeleteBill = async (billId) => {
    try {
      const updatedBills = savedBills.filter(bill => bill.id !== billId);
      await AsyncStorage.setItem('unfinished_bills', JSON.stringify(updatedBills));
      setSavedBills(updatedBills);
      Alert.alert('Deleted', 'The saved bill has been deleted.');
    } catch (e) {
      Alert.alert('Error', 'Could not delete the bill.');
    }
  };

  const confirmDelete = (billId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this saved bill?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteBill(billId) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={`Bill for: ${item.customer.name}`}
      description={`Saved on: ${new Date(item.savedAt).toLocaleDateString()}`}
      left={props => <List.Icon {...props} icon="file-document-outline" />}
      right={props => (
        <Button icon="delete-outline" onPress={() => confirmDelete(item.id)} textColor="#d9534f" />
      )}
      onPress={() => handleSelectBill(item)}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Saved Bills" />
      </Appbar.Header>
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={savedBills}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 8 }}
          ListEmptyComponent={
            <Surface style={styles.emptyState} elevation={1}>
              <Text variant="titleMedium" style={styles.emptyText}>No unfinished bills found.</Text>
              <Text variant="bodyMedium" style={styles.emptySubText}>You can save a bill for later from the billing screen.</Text>
            </Surface>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listItem: { backgroundColor: '#fff', marginBottom: 8, borderRadius: 8, elevation: 2, marginHorizontal: 8 },
  emptyState: { marginTop: 50, padding: 30, alignItems: 'center', marginHorizontal: 20, borderRadius: 10, backgroundColor: '#fff' },
  emptyText: { color: '#555', textAlign: 'center' },
  emptySubText: { color: '#777', textAlign: 'center', marginTop: 8 },
});

export default UnfinishedBillsScreen;
