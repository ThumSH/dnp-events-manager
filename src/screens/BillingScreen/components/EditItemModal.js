import React from 'react';
import { View, Modal } from 'react-native';
import { Surface, Text, TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../styles';

export default function EditItemModal({ 
  visible, 
  onClose, 
  editingItem, 
  setEditingItem, 
  billDate, 
  showBillDatePicker, 
  setShowBillDatePicker, 
  onBillDateChange,
  handleSaveEdit 
}) {
  if (!editingItem) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Surface style={styles.modalHeader} elevation={4}>
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Edit: {editingItem.item.name}
          </Text>
        </Surface>
        
        <TextInput
          label="Quantity"
          value={String(editingItem.item.qty)}
          onChangeText={(text) => setEditingItem({ ...editingItem, item: { ...editingItem.item, qty: text } })}
          keyboardType="numeric"
          mode="outlined"
          style={styles.modalInput}
          outlineColor="#e0e0e0"
          activeOutlineColor="#00C853"
        />
        <TextInput
          label="Price (Rs.)"
          value={String(editingItem.item.price)}
          onChangeText={(text) => setEditingItem({ ...editingItem, item: { ...editingItem.item, price: text } })}
          keyboardType="numeric"
          mode="outlined"
          style={styles.modalInput}
          outlineColor="#e0e0e0"
          activeOutlineColor="#00C853"
        />
        <TextInput
          label="Description (Optional)"
          value={editingItem.item.description || ''}
          onChangeText={(text) => setEditingItem({ ...editingItem, item: { ...editingItem.item, description: text } })}
          mode="outlined"
          style={styles.modalInput}
          outlineColor="#e0e0e0"
          activeOutlineColor="#00C853"
          maxLength={50}
        />
        <TextInput
          label="Item Usage (Days)"
          value={String(editingItem.item.usageDays)}
          onChangeText={(text) => setEditingItem({ ...editingItem, item: { ...editingItem.item, usageDays: text } })}
          keyboardType="numeric"
          mode="outlined"
          style={styles.modalInput}
          outlineColor="#e0e0e0"
          activeOutlineColor="#00C853"
        />
        <Button
          icon="calendar"
          mode="outlined"
          onPress={() => setShowBillDatePicker(true)}
          style={styles.modalInput}
        >
          Bill Date: {billDate.toLocaleDateString('en-GB')}
        </Button>

        {showBillDatePicker && (
          <DateTimePicker
            value={billDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              onBillDateChange(event, date);
            }}
          />
        )}
        
        <View style={styles.modalActions}>
          <Button 
            onPress={onClose} 
            style={styles.modalCancelButton}
            mode="outlined"
            textColor="#666"
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSaveEdit} 
            style={styles.modalSaveButton}
            buttonColor="#00C853"
          >
            Save Changes
          </Button>
        </View>
      </View>
    </Modal>
  );
}