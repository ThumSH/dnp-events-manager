import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

const ItemInput = ({
  selectedEquip,
  qty,
  setQty,
  price,
  setPrice,
  usageDays,
  setUsageDays,
  itemDescription,
  setItemDescription,
  scrollToInput,
  addToCart,
}) => {
  if (!selectedEquip) {
    return null; // Don't show this component if no item is selected
  }

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>Add Item: {selectedEquip.name}</Text>
      <View style={styles.row}>
        <TextInput
          label="Quantity"
          value={qty}
          onChangeText={setQty}
          keyboardType="numeric"
          style={[styles.input, styles.halfInput]}
          mode="outlined"
          onFocus={scrollToInput}
        />
        <TextInput
          label="Price (per day)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={[styles.input, styles.halfInput]}
          mode="outlined"
          onFocus={scrollToInput}
        />
      </View>
      <TextInput
        label="Item Usage (Days)"
        value={usageDays}
        onChangeText={setUsageDays}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        onFocus={scrollToInput}
      />
      <TextInput
        label="Item Description (Optional)"
        value={itemDescription}
        onChangeText={setItemDescription}
        style={styles.input}
        mode="outlined"
        onFocus={scrollToInput}
      />
      <Button icon="plus-circle" mode="contained" onPress={addToCart} style={styles.addButton}>
        Add to Cart
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#fff', margin: 10, borderRadius: 8, elevation: 2 },
  title: { marginBottom: 10, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  input: { marginBottom: 10 },
  halfInput: { width: '48%' },
  addButton: { marginTop: 5 },
});

export default ItemInput;