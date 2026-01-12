import React, { useState } from 'react';
import { View, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Surface, Text, TextInput, Button } from 'react-native-paper';
import { styles } from '../styles';

export default function CustomerModal({ visible, onClose, customers, onSelect }) {
  const [custSearch, setCustSearch] = useState('');

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Surface style={styles.modalHeader} elevation={4}>
          <Text variant="headlineSmall" style={styles.modalTitle}>Select Customer</Text>
        </Surface>
        <TextInput 
          placeholder="Search customers..." 
          value={custSearch} 
          onChangeText={setCustSearch} 
          style={styles.searchInput}
          mode="outlined"
          left={<TextInput.Icon icon="magnify" />}
        />
        <FlatList 
          data={customers.filter(c => (c.name || "").toLowerCase().includes(custSearch.toLowerCase()))}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => onSelect(item)}>
              <Surface style={styles.listItem} elevation={1}>
                <Text style={styles.listItemTitle}>{item.name}</Text>
                <Text style={styles.listItemSubtitle}>{item.phone}</Text>
                {item.email && <Text style={styles.listItemSubtitle}>{item.email}</Text>}
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