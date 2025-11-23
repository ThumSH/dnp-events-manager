import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import { Button, Card, Text, ActivityIndicator, IconButton, TextInput } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getCustomers, updateCustomer, deleteCustomer } from '../config/storage';

export default function ViewCustomersScreen() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const fetchedCustomers = await getCustomers();
      setCustomers(fetchedCustomers);
    } catch (error) {
      Alert.alert("Error", "Could not fetch customers.");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect will re-fetch data every time the screen comes into view
  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, [])
  );

  const handleDelete = (customerId, customerName) => {
    Alert.alert(
      "Delete Customer",
      `Are you sure you want to delete ${customerName}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCustomer(customerId);
              Alert.alert("Success", `${customerName} has been deleted.`);
              fetchCustomers(); // Refresh the list
            } catch (error) {
              Alert.alert("Error", "Could not delete customer.");
            }
          },
        },
      ]
    );
  };

  const handleOpenEditor = (customer) => {
    setEditingCustomer(customer);
    setIsEditModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (!editingCustomer) return;
    try {
      await updateCustomer(editingCustomer.id, editingCustomer);
      setIsEditModalVisible(false);
      setEditingCustomer(null);
      Alert.alert("Success", "Customer details updated.");
      fetchCustomers(); // Refresh list
    } catch (error) {
      Alert.alert("Error", "Could not update details.");
    }
  };

  const renderCustomer = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} titleStyle={{ fontWeight: 'bold' }} />
      <Card.Content>
        <Text>Phone: {item.phone}</Text>
        <Text>Address: {item.address || 'N/A'}</Text>
        <Text>Email: {item.email || 'N/A'}</Text>
      </Card.Content>
      <Card.Actions>
        <IconButton icon="pencil" iconColor="blue" onPress={() => handleOpenEditor(item)} />
        <IconButton icon="delete" iconColor="red" onPress={() => handleDelete(item.id, item.name)} />
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return <ActivityIndicator animating={true} size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={customers}
        renderItem={renderCustomer}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No customers found.</Text>}
      />

      {editingCustomer && (
        <Modal visible={isEditModalVisible} animationType="slide" onRequestClose={() => setIsEditModalVisible(false)}>
          <View style={styles.modalView}>
            <Text variant="headlineSmall" style={{ marginBottom: 20 }}>Edit Customer</Text>
            <TextInput label="Name" value={editingCustomer.name} onChangeText={(text) => setEditingCustomer({ ...editingCustomer, name: text })} mode="outlined" style={styles.input} />
            <TextInput label="Phone" value={editingCustomer.phone} onChangeText={(text) => setEditingCustomer({ ...editingCustomer, phone: text })} mode="outlined" style={styles.input} keyboardType="phone-pad" />
            <TextInput label="Address" value={editingCustomer.address} onChangeText={(text) => setEditingCustomer({ ...editingCustomer, address: text })} mode="outlined" style={styles.input} />
            <TextInput label="Email" value={editingCustomer.email} onChangeText={(text) => setEditingCustomer({ ...editingCustomer, email: text })} mode="outlined" style={styles.input} keyboardType="email-address" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
              <Button onPress={() => setIsEditModalVisible(false)} style={{ flex: 1, marginRight: 5 }}>Cancel</Button>
              <Button mode="contained" onPress={handleSaveChanges} style={{ flex: 1, marginLeft: 5 }}>Save</Button>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  card: { marginVertical: 8, backgroundColor: 'white' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  modalView: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', marginTop: 40 },
  input: { marginBottom: 10 },
});