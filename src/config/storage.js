import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const CUSTOMERS_KEY = 'customers';
const EQUIPMENT_KEY = 'equipment';
const BILLING_KEY = 'billing';


const getItems = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return [];
  }
};


const saveItems = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(`Error saving ${key} to storage`, e);
  }
};

/* Customer Management */
export const getCustomers = () => getItems(CUSTOMERS_KEY);

export const addCustomer = async (customerData) => {
  const customers = await getCustomers();
  const newCustomer = {
    id: uuidv4(), 
    ...customerData,
  };
  const updatedCustomers = [...customers, newCustomer];
  await saveItems(CUSTOMERS_KEY, updatedCustomers);
  return newCustomer;
};

export const updateCustomer = async (customerId, updatedData) => {
    const customers = await getCustomers();
    const updatedCustomers = customers.map(c => c.id === customerId ? { ...c, ...updatedData } : c);
    await saveItems(CUSTOMERS_KEY, updatedCustomers);
};

export const deleteCustomer = async (customerId) => {
    const customers = await getCustomers();
    const updatedCustomers = customers.filter(c => c.id !== customerId);
    await saveItems(CUSTOMERS_KEY, updatedCustomers);
};


/* Equipment Management */
export const getEquipment = () => getItems(EQUIPMENT_KEY);

export const addEquipment = async (equipmentData) => {
  const equipment = await getEquipment();
  const newEquipment = {
    id: uuidv4(),
    ...equipmentData,
  };
  const updatedEquipment = [...equipment, newEquipment];
  await saveItems(EQUIPMENT_KEY, updatedEquipment);
  return newEquipment;
};

export const updateEquipment = async (equipmentId, updatedData) => {
    const equipment = await getEquipment();
    const updatedEquipment = equipment.map(e => e.id === equipmentId ? { ...e, ...updatedData } : e);
    await saveItems(EQUIPMENT_KEY, updatedEquipment);
};

export const deleteEquipment = async (equipmentId) => {
    const equipment = await getEquipment();
    const updatedEquipment = equipment.filter(e => e.id !== equipmentId);
    await saveItems(EQUIPMENT_KEY, updatedEquipment);
};



/* Billing Management */
export const getInvoices = () => getItems(BILLING_KEY);

export const addInvoice = async (invoiceData) => {
    const invoices = await getInvoices();
    const newInvoice = {
        id: uuidv4(),
        ...invoiceData,
        createdAt: new Date().toISOString(),
    };
    const updatedInvoices = [...invoices, newInvoice];
    await saveItems(BILLING_KEY, updatedInvoices);
    return newInvoice;
};

export const deleteInvoice = async (invoiceId) => {
    const invoices = await getInvoices();
    const updatedInvoices = invoices.filter(i => i.id !== invoiceId);
    await saveItems(BILLING_KEY, updatedInvoices);
};