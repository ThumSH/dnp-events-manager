import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, Surface } from 'react-native-paper';

const UpdateStockModal = ({ visible, onClose, item, onUpdate }) => {
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    // When the modal becomes visible with an item, set the input to its current quantity.
    if (visible && item) {
      setNewQuantity(String(item.quantity || '0'));
    }
  }, [visible, item]);

  const handleUpdate = () => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      onUpdate(quantity);
      onClose();
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid non-negative number for quantity.');
    }
  };

  if (!item) return null;

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <Surface style={styles.modalContent} elevation={4}>
          <Text variant="headlineSmall" style={styles.modalHeader}>Please Update Stock</Text>
          <Text variant="bodyLarge" style={{ marginBottom: 16, textAlign: 'center' }}>
            Item: <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
            Current Stock: {item.quantity}
          </Text>
          <TextInput
            label="New Stock Quantity"
            value={newQuantity}
            onChangeText={setNewQuantity}
            keyboardType="number-pad"
            mode="outlined"
            style={{ marginBottom: 20 }}
            autoFocus={true}
          />
          <View style={styles.modalActions}>
            <Button onPress={onClose} style={{ marginRight: 8 }}>Cancel</Button>
            <Button mode="contained" onPress={handleUpdate}>Update Stock</Button>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { padding: 20, borderRadius: 10, width: '100%', maxWidth: 400 },
  modalHeader: { marginBottom: 20, textAlign: 'center' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
});

export default UpdateStockModal;