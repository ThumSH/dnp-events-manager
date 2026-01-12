import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Modal, Portal, Text, Button, TextInput } from 'react-native-paper';

const DiscountModal = ({ visible, onClose, currentDiscount, onSave }) => {
  const [discount, setDiscount] = useState(currentDiscount);

  // When the modal becomes visible, update its internal state
  useEffect(() => {
    if (visible) {
      setDiscount(String(currentDiscount));
    }
  }, [visible, currentDiscount]);

  const handleSave = () => {
    const numericDiscount = parseFloat(discount);
    if (isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount > 100) {
      Alert.alert("Invalid Discount", "Please enter a percentage between 0 and 100.");
      return;
    }
    onSave(String(numericDiscount));
    onClose();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Set Global Discount</Text>
        <TextInput
          label="Discount Percentage (%)"
          value={discount}
          onChangeText={setDiscount}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />
        <View style={styles.buttonContainer}>
          <Button onPress={onClose}>Cancel</Button>
          <Button mode="contained" onPress={handleSave} style={styles.button}>Save Discount</Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: { marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  button: { marginLeft: 8 },
});

export default DiscountModal;