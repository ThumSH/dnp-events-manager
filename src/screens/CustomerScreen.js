import React, { useState } from 'react';
import { ScrollView, Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { addCustomer } from '../config/storage';

export default function CustomerScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // SAFE CHECK: Trim removes spaces. prevents "   " being saved as a name.
    if (!name.trim) {
      Alert.alert('Missing Info', 'Name is required.');
      return;
    }

    setLoading(true);
    try {
      await addCustomer({ 
        name: name.trim(), 
        phone: phone.trim(), 
        address: address.trim(), 
        email: email.trim(),
        createdAt: new Date().toISOString() // Save date as string to be safe
      });
      Alert.alert('Success', 'Customer Saved!');
      setName(''); setPhone(''); setAddress(''); setEmail('');
    } catch (e) {
      Alert.alert('Error', 'Could not save: ' + e.message);
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
            Customer Registration
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Add new customers to DNP
          </Text>
        </Surface>

        {/* Form Section */}
        <Surface style={styles.formSurface} elevation={2}>
          <Text variant="titleMedium" style={styles.formTitle}>
            Customer Details
          </Text>
          
          <TextInput 
            label="Full Name *" 
            value={name} 
            onChangeText={setName} 
            mode="outlined" 
            style={styles.input}
            outlineColor="#e0e0e0"
            activeOutlineColor="#1a237e"
            left={<TextInput.Icon icon="account" color="#666" />}
          />
          
          <TextInput 
            label="Phone Number " 
            value={phone} 
            onChangeText={setPhone} 
            keyboardType="phone-pad" 
            mode="outlined" 
            style={styles.input}
            outlineColor="#e0e0e0"
            activeOutlineColor="#1a237e"
            left={<TextInput.Icon icon="phone" color="#666" />}
          />
          
          <TextInput 
            label="Address" 
            value={address} 
            onChangeText={setAddress} 
            mode="outlined" 
            style={styles.input}
            outlineColor="#e0e0e0"
            activeOutlineColor="#1a237e"
            left={<TextInput.Icon icon="map-marker" color="#666" />}
            multiline
            numberOfLines={3}
          />
          
          <TextInput 
            label="Email" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
            mode="outlined" 
            style={styles.input}
            outlineColor="#e0e0e0"
            activeOutlineColor="#1a237e"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" color="#666" />}
          />

          <View style={styles.requiredNote}>
            <Text variant="bodySmall" style={styles.requiredText}>
              * Required fields
            </Text>
          </View>

          <Button 
            mode="contained" 
            loading={loading} 
            onPress={handleSave}
            style={styles.saveButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="content-save"
          >
            Save Customer
          </Button>
        </Surface>

        {/* Info Section */}
        <Surface style={styles.infoSurface} elevation={1}>
          <Text variant="bodySmall" style={styles.infoText}>
            💡 Customer information will be available for billing and invoicing.
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
    borderLeftColor: '#1a237e',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#1a237e',
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
    backgroundColor: '#1a237e',
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
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoText: {
    color: '#1565c0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
};