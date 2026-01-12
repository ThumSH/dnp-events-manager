import React, { useState, useCallback, useRef } from 'react';
import { ScrollView,View, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { ActivityIndicator, Surface, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCustomers, getEquipment, addInvoice, updateEquipment } from '../../config/storage'; // Adjust path if needed
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

// Component Imports
import { styles } from '../BillingScreen/styles';
import Header from './components/Header';
import SelectionArea from './components/SelectionArea';
import ItemInput from './components/ItemInput';
import CartSummary from './components/CartSummary';
import CustomerModal from './components/CustomerModal';
import EquipmentModal from './components/EquipmentModal';
import EditItemModal from './components/EditItemModal';
import DiscountModal from './components/DiscountModal';
import UpdateStockModal from './components/UpdateStockModal';

export default function BillingScreen() {
  // --- STATE ---
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  
  const [selectedCust, setSelectedCust] = useState(null);
  const [selectedEquip, setSelectedEquip] = useState(null);
  
  // Modals
  const [custModal, setCustModal] = useState(false);
  const [equipModal, setEquipModal] = useState(false);

  // Input Fields 
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('0');
  const [itemDescription, setItemDescription] = useState('');
  const [usageDays, setUsageDays] = useState('1');
  const [globalDiscount, setGlobalDiscount] = useState('0');
  
  // Date Picker State
  const [billDate, setBillDate] = useState(new Date());
  const [showBillDatePicker, setShowBillDatePicker] = useState(false);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Editing State
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);
  const [isUpdateStockModalVisible, setIsUpdateStockModalVisible] = useState(false);
  const [itemToUpdateStock, setItemToUpdateStock] = useState(null);
  const [unfinishedBillId, setUnfinishedBillId] = useState(null);

  // --- REF FOR SCROLLVIEW ---
  const scrollViewRef = useRef(null);
  
  // --- NAVIGATION HOOKS ---
  const navigation = useNavigation();
  const route = useRoute();

  // --- SCROLL TO INPUT FUNCTION ---
  const scrollToInput = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // --- LOAD DATA ---
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const [fetchedCustomers, fetchedInventory] = await Promise.all([
            getCustomers(),
            getEquipment()
          ]);
          setCustomers(fetchedCustomers);
          setInventory(fetchedInventory);

          // Load unfinished bill if passed in params
          if (route.params?.savedBill) {
            const { savedBill } = route.params;
            setSelectedCust(savedBill.customer);
            setCart(savedBill.cart);
            setGlobalDiscount(String(savedBill.globalDiscount || '0'));
            setBillDate(new Date(savedBill.billDate));
            setUnfinishedBillId(savedBill.id); // Keep track of the ID

            // Clear the param so it doesn't re-load on next focus
            navigation.setParams({ savedBill: undefined });
          }

        } catch (e) {
          console.error("Data Load Error:", e);
        }
      };
      loadData();
      // Re-run if we navigate here with a savedBill param
    }, [route.params?.savedBill])
  );

  const addToCart = () => {
    if (!selectedEquip) {
      Alert.alert("No Item", "Please select an equipment item first.");
      return;
    }
    const safeQty = parseInt(qty);
    const safePrice = parseFloat(price);
    const safeUsageDays = parseInt(usageDays);

    if (isNaN(safeUsageDays) || safeUsageDays <= 0) {
      Alert.alert("Invalid Usage Days", "Item Usage (Days) must be at least 1.");
      return;
    }

    if (isNaN(safeQty) || isNaN(safePrice) || safeQty <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid quantity and price.");
      return;
    }

    const existingQtyInCart = cart
      .filter(item => item.id === selectedEquip.id)
      .reduce((sum, item) => sum + item.qty, 0);

    const availableStock = selectedEquip.quantity || 0;

    if (existingQtyInCart + safeQty > availableStock) {
      setItemToUpdateStock(selectedEquip);
      setIsUpdateStockModalVisible(true);
      return;
    }

    const subTotal = safeQty * safePrice * safeUsageDays;
    
    setCart([...cart, {
      id: selectedEquip.id,
      name: selectedEquip.name || 'Unknown Item',
      qty: safeQty,
      price: safePrice,
      usageDays: safeUsageDays,
      description: itemDescription.trim(),
      subTotal: subTotal,
      total: subTotal, // Total per item is just subtotal now
    }]);
    
    setSelectedEquip(null);
    setQty('1');
    setPrice('0');
    setItemDescription('');
    setUsageDays('1');
  };

  const clearBill = () => {
    setCart([]);
    setSelectedCust(null);
    setSelectedEquip(null);
    setQty('1');
    setPrice('0');
    setItemDescription('');
    setUsageDays('1');
    setGlobalDiscount('0');
    setBillDate(new Date());
    setUnfinishedBillId(null);
  }

  const handleSaveForLater = async () => {
    if (!selectedCust || cart.length === 0) {
      Alert.alert('Cannot Save', 'Please select a customer and add items to the cart before saving.');
      return;
    }

    setLoading(true);
    try {
      const savedBillsRaw = await AsyncStorage.getItem('unfinished_bills');
      const savedBills = savedBillsRaw ? JSON.parse(savedBillsRaw) : [];

      const newBill = {
        id: unfinishedBillId || Date.now(), // Use existing ID or create a new one
        customer: selectedCust,
        cart: cart,
        globalDiscount: globalDiscount,
        billDate: billDate.toISOString(),
        savedAt: new Date().toISOString(),
      };

      const otherBills = savedBills.filter(bill => bill.id !== newBill.id);
      const updatedBills = [...otherBills, newBill];
      await AsyncStorage.setItem('unfinished_bills', JSON.stringify(updatedBills));
      setUnfinishedBillId(newBill.id);
      Alert.alert('Bill Saved', 'Your progress has been saved.', [
        { text: 'OK', onPress: () => navigation.navigate('UnfinishedBills') }
      ]);
    } catch (e) {
      Alert.alert('Save Failed', 'Could not save the bill: ' + e.message);
    } finally { setLoading(false); }
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

    const safeGlobalDiscount = parseFloat(globalDiscount) || 0;
    const subTotal = cart.reduce((acc, item) => acc + (item.subTotal || 0), 0);
    const totalDiscount = subTotal * (safeGlobalDiscount / 100);
    const grandTotal = subTotal - totalDiscount;

    const html = `
      <html>
        <body style="padding: 25px; font-family: Helvetica, sans-serif; font-size: 12px; color: #333;">
          
          <div style="text-align: center; margin-bottom: 10px;">
            <h1 style="color: #0e96b8ff; margin: 0; font-size: 16px;">DNP EVENT ORGANIZING</h1>
            <p style="margin: 2px; color: #666; font-size: 11px;">Rentals & Sales Invoice</p>
            <hr style="border: none; border-top: 1px solid #b0e0e6; margin-top: 5px; margin-bottom: 5px;" />
          </div>

          <div style="margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee;">
            <div style="font-size: 12px; line-height: 1.6;">
              <strong>Invoice No:</strong> #${String(newInvoiceNumber).padStart(3, '0')}<br/>
              <strong>Customer:</strong> ${selectedCust.name || 'Valued Customer'}<br/>
              <strong>Date:</strong> ${billDate.toLocaleDateString('en-GB')}
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px;">
            <thead>
                <tr style="background: #f3f3f3;">
                  <th style="padding: 5px; text-align: left; border: 1px solid #ddd; width: 30%;">Item</th>
                  <th style="padding: 5px; text-align: center; border: 1px solid #ddd;">Qty</th>                
                  <th style="padding: 5px; text-align: right; border: 1px solid #ddd;">Price(RS)</th>
                  <th style="padding: 5px; text-align: right; border: 1px solid #ddd;">Amount(RS)</th>
                  <th style="padding: 5px; text-align: center; border: 1px solid #ddd;">Usage Days</th>
                  <th style="padding: 5px; text-align: right; border: 1px solid #ddd;">Total(RS)</th>
                </tr>
            </thead>
            <tbody>
                ${cart.map(item => `
                  <tr>
                    <td style="padding: 4px 5px; text-align: left; border: 1px solid #ddd;">
                      <span style="font-weight: 500;">${item.name}</span>
                      ${item.description ? `<span style="color: #666; font-style: italic; font-size: 10px;"> - ${item.description}</span>` : ''}
                    </td>
                    <td style="padding: 4px 5px; text-align: center; border: 1px solid #ddd;">${item.qty}</td>                    
                    <td style="padding: 4px 5px; text-align: right; border: 1px solid #ddd;">${Number(item.price).toFixed(2)}</td>
                    <td style="padding: 4px 5px; text-align: right; border: 1px solid #ddd;">${Number(item.price * item.qty).toFixed(2)}</td>
                    <td style="padding: 4px 5px; text-align: center; border: 1px solid #ddd;">${item.usageDays}</td>
                    <td style="padding: 4px 5px; text-align: right; border: 1px solid #ddd;">${Number(item.subTotal).toFixed(2)}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>

          <div style="width: 100%; margin-top: 10px;">
            <table align="right" style="width: auto; border-collapse: collapse; font-size: 12px;">
                
                  <tr>
                      <td style="padding: 4px 10px 4px 0; text-align: right;">Total Amount:</td>
                      <td style="padding: 4px 5px; text-align: right; width: 120px;">Rs. ${Number(subTotal).toFixed(2)}</td>
                  </tr>

                  ${totalDiscount > 0 ? `
                  <tr>
                      <td style="padding: 4px 10px 4px 0; text-align: right; color: #d9534f;">Less: Discount (${globalDiscount}%):</td>
                      <td style="padding: 4px 5px; text-align: right; width: 120px; color: #d9534f;">Rs. ${Number(totalDiscount).toFixed(2)}</td>
                  </tr>` : ''}

                  <tr style="background-color: #f0f0f0; border-top: 2px solid #333; border-bottom: 2px solid #333;">
                      <td style="padding: 6px 10px 6px 0; text-align: right; font-weight: bold; font-size: 12px;">NET TOTAL:</td>
                      <td style="padding: 6px 5px; text-align: right; font-weight: bold; font-size: 12px;">Rs. ${Number(grandTotal).toFixed(2)}</td>
                  </tr>

              </table>
            <div style="clear: both;"></div>
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
          const updatedItem = { ...inventoryItem, quantity: newQty };
          await updateEquipment(inventoryItem.id, updatedItem);
        }
      }

      await addInvoice({
        customerId: selectedCust.id,
        invoiceNumber: newInvoiceNumber,
        customerName: selectedCust.name,
        customerPhone: selectedCust.phone,
        items: cart,
        discountPercentage: safeGlobalDiscount,
        total: grandTotal,
        billDate: billDate.toISOString(),
        createdAt: new Date().toISOString(),
      });

      await AsyncStorage.setItem('invoice_counter', String(newInvoiceNumber));

      // If this was a previously saved bill, remove it from the unfinished list
      if (unfinishedBillId) {
        const savedBillsRaw = await AsyncStorage.getItem('unfinished_bills');
        const savedBills = savedBillsRaw ? JSON.parse(savedBillsRaw) : [];
        const updatedBills = savedBills.filter(bill => bill.id !== unfinishedBillId);
        await AsyncStorage.setItem('unfinished_bills', JSON.stringify(updatedBills));
      }

      const { uri } = await Print.printToFileAsync({ html });
      
      let finalUri = uri;
      
      try {
        const cleanName = (selectedCust.name || 'Customer').replace(/[^a-zA-Z0-9]/g, '');
        const paddedInvoiceNumber = String(newInvoiceNumber).padStart(3, '0');
        const fileName = `INV${paddedInvoiceNumber}-${cleanName}.pdf`;
        const newUri = FileSystem.cacheDirectory + fileName;

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

      setInventory(await getEquipment());
      clearBill(); 
    } catch(e) {
      Alert.alert('Operation Failed', 'Could not save or generate PDF: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const onBillDateChange = (event, selectedDate) => {
    setShowBillDatePicker(Platform.OS === 'ios');
    if (event.type === 'set' && selectedDate) {
      setBillDate(selectedDate);
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
    const safeUsageDays = parseInt(editingItem.item.usageDays);

    if (isNaN(safeQty) || isNaN(safePrice) || safeQty <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid quantity and price.");
      return;
    }

    const originalItem = inventory.find(i => i.id === editingItem.item.id);
    const maxStock = originalItem ? originalItem.quantity : 0;

    const otherQtyInCart = cart
      .filter((_, idx) => idx !== editingItem.index)
      .filter(item => item.id === editingItem.item.id)
      .reduce((sum, item) => sum + item.qty, 0);

    if (otherQtyInCart + safeQty > maxStock) {
      setItemToUpdateStock(originalItem);
      setIsUpdateStockModalVisible(true);
      return;
    }

    const subTotal = safeQty * safePrice * safeUsageDays;

    const updatedCart = [...cart];
    updatedCart[editingItem.index] = { 
      ...editingItem.item, 
      qty: safeQty, 
      price: safePrice, 
      usageDays: safeUsageDays,
      description: (editingItem.item.description || '').trim(),
      subTotal: subTotal,
      total: subTotal
    };
    setCart(updatedCart);
    setIsEditModalVisible(false);
    setEditingItem(null);
  };

  const handleUpdateStock = async (newItemQuantity) => {
    if (!itemToUpdateStock) return;

    setLoading(true);
    try {
      const updatedItem = { ...itemToUpdateStock, quantity: parseInt(newItemQuantity, 10) };
      await updateEquipment(itemToUpdateStock.id, updatedItem);
      
      const newInventory = await getEquipment();
      setInventory(newInventory);

      // If the item being updated is the currently selected one for adding to cart,
      // we need to refresh its data in the state.
      if (selectedEquip && selectedEquip.id === itemToUpdateStock.id) {
        const refreshedItem = newInventory.find(i => i.id === itemToUpdateStock.id);
        if (refreshedItem) {
          setSelectedEquip(refreshedItem);
        }
      }
      
      Alert.alert("Success", `Stock for ${itemToUpdateStock.name} has been updated to ${newItemQuantity}.`);
      
      setIsUpdateStockModalVisible(false);
      setItemToUpdateStock(null);
    } catch (e) {
      Alert.alert('Update Failed', 'Could not update stock: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* The ScrollView is removed. The FlatList in CartSummary now handles all scrolling. */}
      <View style={{ flex: 1 }}>
        <Header />

        {loading && <ActivityIndicator animating={true} color="#00C853" size="large" style={styles.loader} />}

        <CartSummary 
          cart={cart}
          globalDiscount={globalDiscount}
          handleOpenEditor={handleOpenEditor}
          setCart={setCart}
          loading={loading}
          saveAndGeneratePDF={saveAndGeneratePDF}
          clearBill={clearBill}
          handleSaveForLater={handleSaveForLater}
          openDiscountModal={() => setIsDiscountModalVisible(true)}
          // We pass all the content that should appear ABOVE the cart list as a header.
          ListHeaderComponent={
            <>
              <SelectionArea 
                selectedCust={selectedCust}
                selectedEquip={selectedEquip}
                billDate={billDate}
                showBillDatePicker={showBillDatePicker}
                setCustModal={setCustModal}
                setEquipModal={setEquipModal}
                setShowBillDatePicker={setShowBillDatePicker}
                onBillDateChange={onBillDateChange}
              />
              <ItemInput 
                selectedEquip={selectedEquip}
                qty={qty} setQty={setQty}
                price={price} setPrice={setPrice}
                usageDays={usageDays} setUsageDays={setUsageDays}
                itemDescription={itemDescription} setItemDescription={setItemDescription}
                scrollToInput={scrollToInput}
                addToCart={addToCart}
              />
              {cart.length === 0 && !selectedEquip && (
                <Surface style={styles.emptyState} elevation={2}>
                  <Text variant="bodyLarge" style={styles.emptyStateText}>Select a customer and add items to create a bill</Text>
                </Surface>
              )}
            </>
          }
        />

        {/* --- MODALS --- */}
        <CustomerModal 
          visible={custModal}
          onClose={() => setCustModal(false)}
          customers={customers}
          onSelect={(item) => { setSelectedCust(item); setCustModal(false); }}
        />

        <EquipmentModal 
          visible={equipModal}
          onClose={() => setEquipModal(false)}
          inventory={inventory}
          onSelect={(item) => { 
            setSelectedEquip(item); 
            setPrice(String(item.price || 0));
            setQty('1');
            setEquipModal(false); 
          }}
        />

        <EditItemModal 
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          billDate={billDate}
          showBillDatePicker={showBillDatePicker}
          setShowBillDatePicker={setShowBillDatePicker}
          onBillDateChange={onBillDateChange}
          handleSaveEdit={handleSaveEdit}
        />

        <DiscountModal
          visible={isDiscountModalVisible}
          onClose={() => setIsDiscountModalVisible(false)}
          currentDiscount={globalDiscount}
          onSave={setGlobalDiscount}
        />

        <UpdateStockModal
          visible={isUpdateStockModalVisible}
          onClose={() => { setIsUpdateStockModalVisible(false); setItemToUpdateStock(null); }}
          item={itemToUpdateStock}
          onUpdate={handleUpdateStock}
        />

      </View>
    </KeyboardAvoidingView>
  );
}