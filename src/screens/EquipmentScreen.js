import React, { useState } from 'react';
import { ScrollView, Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { addEquipment } from '../config/storage';

export default function EquipmentScreen() {
  const [name, setName] = useState('');
  // Initialize as strings because TextInput expects strings
  const [qty, setQty] = useState(''); 
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Item Name is required');
      return;
    }

    setLoading(true);
    
    // SAFE CONVERSION: Ensure we save actual numbers, default to 0 if invalid
    const safeQty = parseInt(qty) || 0;
    const safePrice = parseFloat(price) || 0.00;

    try {
      await addEquipment( { 
        name: name.trim(), 
        quantity: safeQty, 
        price: safePrice,
        createdAt: new Date().toISOString()
      });
      Alert.alert('Success', 'Item Added!');
      setName(''); setQty(''); setPrice('');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Surface style={styles.headerSurface} elevation={4}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Equipment Inventory
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Manage your rental equipment and stock
          </Text>
        </Surface>

        {/* Form Section */}
        <Surface style={styles.formSurface} elevation={2}>
          <Text variant="titleMedium" style={styles.formTitle}>
            Equipment Details
          </Text>
          
          <TextInput 
            label="Item Name *" 
            value={name} 
            onChangeText={setName} 
            mode="outlined" 
            style={styles.input}
            outlineColor="#e0e0e0"
            activeOutlineColor="#ff6d00"
            left={<TextInput.Icon icon="package-variant" color="#666" />}
          />
          
          <TextInput 
            label="Quantity Stock" 
            value={qty} 
            onChangeText={setQty} 
            keyboardType="numeric" 
            mode="outlined" 
            style={styles.input}
            outlineColor="#e0e0e0"
            activeOutlineColor="#ff6d00"
            left={<TextInput.Icon icon="numeric" color="#666" />}
          />
          
          <TextInput 
            label="Price Per Unit" 
            value={price} 
            onChangeText={setPrice} 
            keyboardType="numeric" 
            mode="outlined" 
            style={styles.input}
            outlineColor="#e0e0e0"
            activeOutlineColor="#ff6d00"
            left={<TextInput.Affix text="Rs. " />}
          />

          <View style={styles.requiredNote}>
            <Text variant="bodySmall" style={styles.requiredText}>
              * Required field
            </Text>
          </View>

          <Button 
            mode="contained" 
            loading={loading} 
            onPress={handleSave}
            style={styles.saveButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="plus-circle"
            buttonColor="#ff6d00"
          >
            Add to Inventory
          </Button>
        </Surface>

        {/* Info Section */}
        <Surface style={styles.infoSurface} elevation={1}>
          <Text variant="bodySmall" style={styles.infoText}>
            💡 Add chairs, tables, tents, and other rental equipment. Prices will be used for billing.
          </Text>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  headerSurface: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6d00',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#ff6d00',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#666',
    textAlign: 'center',
  },
  formSurface: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formTitle: {
    fontWeight: '600',
    color: '#37474f',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  requiredNote: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  requiredText: {
    color: '#ff6d00',
    fontStyle: 'italic',
  },
  saveButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  infoSurface: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  infoText: {
    color: '#e65100',
    textAlign: 'center',
    fontStyle: 'italic',
  },
};