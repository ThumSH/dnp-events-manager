import React, { useState } from 'react';
import { View, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Surface, Text, TextInput, Button } from 'react-native-paper';
import { styles } from '../styles';

export default function EquipmentModal({ visible, onClose, inventory, onSelect }) {
  const [equipSearch, setEquipSearch] = useState('');

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Surface style={styles.modalHeader} elevation={4}>
          <Text variant="headlineSmall" style={styles.modalTitle}>Select Equipment</Text>
        </Surface>
        <TextInput 
          placeholder="Search equipment..." 
          value={equipSearch} 
          onChangeText={setEquipSearch} 
          style={styles.searchInput}
          mode="outlined"
          left={<TextInput.Icon icon="magnify" />}
        />
        <FlatList 
          data={inventory.filter(i => (i.name || "").toLowerCase().includes(equipSearch.toLowerCase()))}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => onSelect(item)}>
              <Surface style={styles.listItem} elevation={1}>
                <Text style={styles.listItemTitle}>{item.name}</Text>
                <Text style={styles.listItemSubtitle}>
                  Stock: {item.quantity} | Rs. {item.price}
                </Text>
              </Surface>
            </TouchableOpacity>
          )}
        />
        <Button 
          onPress={onClose} 
          style={styles.modalCloseButton}
          mode="outlined"
        >
          Close
        </Button>
      </View>
    </Modal>
  );
}