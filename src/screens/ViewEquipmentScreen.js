import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import { Button, Card, Text, ActivityIndicator, IconButton, TextInput } from 'react-native-paper';;
import { useFocusEffect } from '@react-navigation/native';
import { getEquipment, updateEquipment, deleteEquipment } from '../config/storage';

export default function ViewEquipmentScreen() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const fetchedItems = await getEquipment();
      setEquipment(fetchedItems);
    } catch (error) {
      Alert.alert("Error", "Could not fetch equipment.");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEquipment();
    }, [])
  );

  const handleDelete = (itemId, itemName) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEquipment(itemId);
              Alert.alert("Success", `${itemName} has been deleted.`);
              fetchEquipment(); // Refresh the list
            } catch (error) {
              Alert.alert("Error", "Could not delete item.");
            }
          },
        },
      ]
    );
  };

  const handleOpenEditor = (item) => {
    setEditingItem({
      ...item,
      quantity: String(item.quantity || 0),
      price: String(item.price || 0)
    });
    setIsEditModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (!editingItem) return;
    try {
         const itemToSave = { ...editingItem };
        await updateEquipment(editingItem.id, {
        name: itemToSave.name,
        quantity: parseInt(itemToSave.quantity) || 0,
        price: parseFloat(itemToSave.price) || 0,
      });
      setIsEditModalVisible(false);
      setEditingItem(null);
      Alert.alert("Success", "Item details updated.");
      fetchEquipment(); // Refresh list
    } catch (error) {
      Alert.alert("Error", "Could not update details.");
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} titleStyle={{ fontWeight: 'bold' }} />
      <Card.Content>
        <Text>Quantity in Stock: {item.quantity}</Text>
        <Text>Price per Unit: Rs. {Number(item.price).toFixed(2)}</Text>
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
        data={equipment}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No equipment found.</Text>}
      />

      {editingItem && (
        <Modal visible={isEditModalVisible} animationType="slide" onRequestClose={() => setIsEditModalVisible(false)}>
          <View style={styles.modalView}>
            <Text variant="headlineSmall" style={{ marginBottom: 20 }}>Edit Item</Text>
            <TextInput label="Name" value={editingItem.name} onChangeText={(text) => setEditingItem({ ...editingItem, name: text })} mode="outlined" style={styles.input} />
            <TextInput label="Quantity" value={editingItem.quantity} onChangeText={(text) => setEditingItem({ ...editingItem, quantity: text })} mode="outlined" style={styles.input} keyboardType="numeric" />
            <TextInput label="Price (Rs.)" value={editingItem.price} onChangeText={(text) => setEditingItem({ ...editingItem, price: text })} mode="outlined" style={styles.input} keyboardType="numeric" />
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