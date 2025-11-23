import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Modal, FlatList, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Text, Card, IconButton, Divider, ActivityIndicator, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCustomers, getEquipment, addInvoice, updateEquipment } from '../config/storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import * as FileSystem from 'expo-file-system/legacy'; 
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BillingScreen() {
  // --- STATE ---
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  
  const [selectedCust, setSelectedCust] = useState(null);
  const [selectedEquip, setSelectedEquip] = useState(null);
  
  // Modals & Search
  const [custModal, setCustModal] = useState(false);
  const [equipModal, setEquipModal] = useState(false);
  const [custSearch, setCustSearch] = useState('');
  const [equipSearch, setEquipSearch] = useState('');

  // Input Fields 
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('0');
  
  // Date Picker State
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Editing State
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // --- LOAD DATA ---
  useEffect(() => {
    const loadData = async () => { 
      setLoading(true);
      try {
        const [fetchedCustomers, fetchedInventory] = await Promise.all([
          getCustomers(),
          getEquipment()
        ]);
        setCustomers(fetchedCustomers);
        setInventory(fetchedInventory);
      } catch (e) { 
        console.error("Data Load Error:", e); 
      }
      setLoading(false);
    };
    loadData();
  }, []);


  const addToCart = () => {
    if (!selectedEquip) {
      Alert.alert("No Item", "Please select an equipment item first.");
      return;
    }
    const safeQty = parseInt(qty);
    const safePrice = parseFloat(price);

    if (isNaN(safeQty) || isNaN(safePrice) || safeQty <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid quantity and price.");
      return;
    }

    const totalItemPrice = safeQty * safePrice;
    
    setCart([...cart, {
      id: selectedEquip.id,
      name: selectedEquip.name || 'Unknown Item',
      qty: safeQty,
      price: safePrice,
      total: totalItemPrice,
      date: date.toISOString().split('T')[0] 
    }]);
    
    setSelectedEquip(null);
    setQty('1');
    setPrice('0');
  };

  const clearBill = () => {
    setCart([]);
    setSelectedCust(null);
    setSelectedEquip(null);
    setQty('1');
    setPrice('0');
    setDate(new Date());
  }

  const saveAndGeneratePDF = async () => {
    if (!selectedCust || cart.length === 0) {
      Alert.alert('Missing Details', 'Please select a customer and add items to the cart.');
      return;
    }
    setLoading(true);
    
    // --- INVOICE NUMBER GENERATION ---
    const invoiceCounterRaw = await AsyncStorage.getItem('invoice_counter');
    let currentCounter = invoiceCounterRaw ? parseInt(invoiceCounterRaw, 10) : 0;
    const newInvoiceNumber = currentCounter + 1;

    const grandTotal = cart.reduce((acc, item) => acc + (item.total || 0), 0);

    // --- DETERMINE INVOICE DATE ---
    let invoiceDateString = new Date().toISOString();
    if (cart.length > 0) {
       invoiceDateString = new Date(cart[0].date).toISOString();
    }
    const displayDate = new Date(invoiceDateString).toLocaleDateString();

    //bill structure
    
    const html = `
      <html>
        <body style="padding: 40px; font-family: Helvetica, sans-serif;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #0e96b8ff; margin:0;">DNP EVENT ORGANIZING</h1>
            <p style="margin:5px; color: #666;">Rentals & Sales Invoice</p>
          </div>
          <div style="margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
            <strong>Invoice No:</strong> #${newInvoiceNumber}<br/>
            <strong>Customer:</strong> ${selectedCust.name || 'Valued Customer'}<br/>
            <strong>Date Created:</strong> ${displayDate}
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f3f3f3;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: left;">Date</th>
              <th style="padding: 10px;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Amount</th>
            </tr>
            ${cart.map(item => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.date}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${Number(item.price).toFixed(2)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${Number(item.total).toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
          <div style="text-align: right; margin-top: 30px;">
            <h2 style="display: inline-block; padding-bottom: 4px; border-bottom: 3px double #333;">Total: Rs. ${grandTotal.toFixed(2)}</h2>
          </div>
        </body>
      </html>
    `;

    try {
      const currentInventory = await getEquipment();
      let stockIsSufficient = true;

      for (const cartItem of cart) {
        const inventoryItem = currentInventory.find(i => i.id === cartItem.id);
        if (!inventoryItem || inventoryItem.quantity < cartItem.qty) {
          Alert.alert('Please Update the Stock', `Not enough stock for ${cartItem.name}. Only ${inventoryItem?.quantity || 0} available.`);
          stockIsSufficient = false;
          break;
        }
      }

      if (!stockIsSufficient) {
        setLoading(false);
        return;
      }

      for (const cartItem of cart) {
        const inventoryItem = currentInventory.find(i => i.id === cartItem.id);
        if (inventoryItem) {
          const newQty = inventoryItem.quantity - cartItem.qty;
          await updateEquipment(inventoryItem.id, { quantity: newQty });
        }
      }

      // --- SAVE TO DATABASE ---
      await addInvoice({
        customerId: selectedCust.id,
        invoiceNumber: newInvoiceNumber,
        customerName: selectedCust.name,
        customerPhone: selectedCust.phone,
        items: cart,
        total: grandTotal,
        createdAt: invoiceDateString, 
      });

      // --- UPDATE COUNTER ---
      await AsyncStorage.setItem('invoice_counter', String(newInvoiceNumber));

      // --- GENERATE PDF ---
      const { uri } = await Print.printToFileAsync({ html });
      

      let finalUri = uri;
      
      try {
        const cleanName = (selectedCust.name || 'Customer').replace(/[^a-zA-Z0-9]/g, '_');
        const paddedInvoiceNumber = String(newInvoiceNumber).padStart(3, '0');
        const fileName = `INV${paddedInvoiceNumber}-${cleanName}`;
        const newUri = FileSystem.documentDirectory + `${fileName}.pdf`;

        await FileSystem.moveAsync({
          from: uri,
          to: newUri
        });
        finalUri = newUri;
      } catch (renameError) {
        console.log("Renaming failed (using original name):", renameError);

      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(finalUri, {
          dialogTitle: `Share Invoice #${newInvoiceNumber}`,
          mimeType: 'application/pdf',
          UTI: 'com.adobe.pdf' 
        });
        Alert.alert('Success', 'Invoice generated and inventory updated!');
      } else {
        Alert.alert('Saved', 'Invoice generated but sharing is not available.');
      }

      clearBill(); 
    } catch(e) {
      Alert.alert('Operation Failed', 'Could not save or generate PDF: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    if (editingItem) {
      setEditingItem({ ...editingItem, item: { ...editingItem.item, date: currentDate.toISOString().split('T')[0] } });
    }
  };

  const handleOpenEditor = (item, index) => {
    setEditingItem({ item: { ...item }, index });
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    const safeQty = parseInt(editingItem.item.qty);
    const safePrice = parseFloat(editingItem.item.price);

    if (isNaN(safeQty) || isNaN(safePrice) || safeQty <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid quantity and price.");
      return;
    }

    const updatedCart = [...cart];
    updatedCart[editingItem.index] = { ...editingItem.item, total: safeQty * safePrice };
    setCart(updatedCart);
    setIsEditModalVisible(false);
    setEditingItem(null);
  };

  const grandTotal = cart.reduce((acc, item) => acc + (item.total || 0), 0);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Surface style={styles.headerSurface} elevation={4}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Billing & Invoices
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Create bills and generate PDF invoices
          </Text>
        </Surface>

        {loading && <ActivityIndicator animating={true} color="#00C853" size="large" style={styles.loader} />}

        <Surface style={styles.selectionSurface} elevation={2}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Select Customer & Items
          </Text>

          <Button 
            mode="outlined" 
            onPress={() => setCustModal(true)} 
            style={styles.selectionButton}
            contentStyle={styles.buttonContent}
            icon="account"
          >
            {selectedCust ? `Client: ${selectedCust.name}` : "Select Customer"}
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => setEquipModal(true)} 
            style={styles.selectionButton}
            contentStyle={styles.buttonContent}
            icon="package-variant"
          >
            {selectedEquip ? `Item: ${selectedEquip.name}` : "Select Equipment"}
          </Button>
        </Surface>

        {selectedEquip && (
          <Surface style={styles.itemEditorSurface} elevation={3}>
            <Text variant="titleMedium" style={styles.editorTitle}>
              {selectedEquip.name}
            </Text>
            <View style={styles.inputRow}>
              <TextInput 
                label="Quantity" 
                value={String(qty)} 
                onChangeText={setQty} 
                keyboardType="numeric" 
                mode="outlined" 
                style={styles.input}
                outlineColor="#e0e0e0"
                activeOutlineColor="#00C853"
                left={<TextInput.Icon icon="numeric" color="#666" />}
              />
              <TextInput 
                label="Price (Rs.)" 
                value={String(price)} 
                onChangeText={setPrice} 
                keyboardType="numeric" 
                mode="outlined" 
                style={styles.input}
                outlineColor="#e0e0e0"
                activeOutlineColor="#00C853"
              />
            </View>
            
            <Button 
              icon="calendar" 
              mode="outlined" 
              onPress={() => setShowDatePicker(true)} 
              style={styles.dateButton}
              contentStyle={styles.buttonContent}
            >
              Date: {date.toLocaleDateString()}
            </Button>
            
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onDateChange}
              />
            )}
            
            <Button 
              mode="contained" 
              onPress={addToCart} 
              style={styles.addButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="plus-circle"
              buttonColor="#00C853"
            >
              Add to Bill
            </Button>
          </Surface>
        )}

        {cart.length > 0 && (
          <Surface style={styles.cartSurface} elevation={3}>
            <Text variant="titleMedium" style={styles.cartTitle}>
              Bill Items ({cart.length})
            </Text>
            <Divider style={styles.divider} />
            
            {cart.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleOpenEditor(item, index)}>
                <View style={styles.cartRow}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetails}>
                      {item.qty} x Rs. {Number(item.price).toFixed(2)} • {item.date}
                    </Text>
                  </View>
                  <View style={styles.cartItemActions}>
                    <Text style={styles.itemTotal}>Rs. {Number(item.total).toFixed(2)}</Text>
                    <IconButton 
                      icon="pencil" 
                      size={18} 
                      iconColor="#666" 
                      onPress={() => handleOpenEditor(item, index)} 
                    />
                    <IconButton 
                      icon="delete" 
                      size={18} 
                      iconColor="#ff4444" 
                      onPress={() => setCart(cart.filter((_, idx) => idx !== index))} 
                    />
                  </View>
                </View>
                {index < cart.length - 1 && <Divider style={styles.itemDivider} />}
              </TouchableOpacity>
            ))}
            
            <View style={styles.totalSection}>
              <Text variant="titleLarge" style={styles.totalText}>
                Grand Total: Rs. {grandTotal.toFixed(2)}
              </Text>
            </View>
          </Surface>
        )}

        {cart.length > 0 && (
          <View style={styles.actionButtons}>
            <Button 
              mode="contained" 
              icon="receipt" 
              buttonColor="#00C853" 
              onPress={saveAndGeneratePDF} 
              style={styles.generateButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              loading={loading}
              disabled={loading}
            >
              Save & Generate Invoice
            </Button>
            <Button 
              mode="outlined" 
              icon="delete-sweep" 
              onPress={clearBill} 
              style={styles.clearButton}
              contentStyle={styles.buttonContent}
              textColor="#ff4444"
            >
              Clear Bill
            </Button>
          </View>
        )}

        {cart.length === 0 && !selectedEquip && (
          <Surface style={styles.emptyState} elevation={2}>
            <Text variant="bodyLarge" style={styles.emptyStateText}>
              Select a customer and add items to create a bill
            </Text>
          </Surface>
        )}

        {/* --- MODALS --- */}
        
        {/* Customer Modal */}
        <Modal visible={custModal} animationType="slide" onRequestClose={() => setCustModal(false)}>
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
                <TouchableOpacity onPress={() => { setSelectedCust(item); setCustModal(false); }}>
                  <Surface style={styles.listItem} elevation={1}>
                    <Text style={styles.listItemTitle}>{item.name}</Text>
                    <Text style={styles.listItemSubtitle}>{item.phone}</Text>
                    {item.email && <Text style={styles.listItemSubtitle}>{item.email}</Text>}
                  </Surface>
                </TouchableOpacity>
              )}
            />
            <Button 
              onPress={() => setCustModal(false)} 
              style={styles.modalCloseButton}
              mode="outlined"
            >
              Close
            </Button>
          </View>
        </Modal>

        {/* Equipment Modal */}
        <Modal visible={equipModal} animationType="slide" onRequestClose={() => setEquipModal(false)}>
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
                <TouchableOpacity onPress={() => { 
                  setSelectedEquip(item); 
                  setPrice(String(item.price || 0));
                  setEquipModal(false); 
                }}>
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
              onPress={() => setEquipModal(false)} 
              style={styles.modalCloseButton}
              mode="outlined"
            >
              Close
            </Button>
          </View>
        </Modal>

        {/* Edit Item Modal */}
        {editingItem && (
          <Modal visible={isEditModalVisible} animationType="slide" onRequestClose={() => setIsEditModalVisible(false)}>
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
              
              <Button 
                icon="calendar" 
                mode="outlined" 
                onPress={() => setShowDatePicker(true)} 
                style={styles.modalDateButton}
                contentStyle={styles.buttonContent}
              >
                Date: {new Date(editingItem.item.date).toLocaleDateString()}
              </Button>
              
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(editingItem.item.date)}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
              
              <View style={styles.modalActions}>
                <Button 
                  onPress={() => setIsEditModalVisible(false)} 
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
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    borderLeftColor: '#00C853',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#00C853',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#666',
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  selectionSurface: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#37474f',
    marginBottom: 16,
    textAlign: 'center',
  },
  selectionButton: {
    marginBottom: 12,
    borderRadius: 12,
    borderColor: '#e0e0e0',
  },
  itemEditorSurface: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#00C853',
  },
  editorTitle: {
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
  },
  dateButton: {
    marginBottom: 16,
    borderRadius: 12,
  },
  addButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cartSurface: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cartTitle: {
    fontWeight: '600',
    color: '#37474f',
    marginBottom: 12,
  },
  divider: {
    marginBottom: 16,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    color: '#37474f',
    marginBottom: 4,
  },
  itemDetails: {
    color: '#666',
    fontSize: 12,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTotal: {
    fontWeight: 'bold',
    color: '#00C853',
    marginRight: 8,
  },
  itemDivider: {
    marginVertical: 4,
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  totalText: {
    fontWeight: 'bold',
    color: '#00C853',
  },
  actionButtons: {
    gap: 12,
  },
  generateButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  clearButton: {
    borderRadius: 12,
    borderColor: '#ff4444',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyStateText: {
    color: '#78909c',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  modalHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#00C853',
    textAlign: 'center',
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  listItem: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  listItemTitle: {
    fontWeight: 'bold',
    color: '#37474f',
    marginBottom: 4,
  },
  listItemSubtitle: {
    color: '#666',
    fontSize: 12,
  },
  modalCloseButton: {
    margin: 16,
    borderRadius: 12,
  },
  modalInput: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  modalDateButton: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
  },
  modalActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderRadius: 12,
  },
  modalSaveButton: {
    flex: 1,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});