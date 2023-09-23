import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [vendor, setVendor] = useState('');
  const [mrp, setMrp] = useState('');
  const [batchNum, setBatchNum] = useState('');
  const [batchDate, setBatchDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('Pending');
  const [inventoryList, setInventoryList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [employee, setEmployee] = useState(false);
  useEffect(() => {
    // AsyncStorage.clear();
    // Load inventory data from local storage when the component mounts
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      const data = await AsyncStorage.getItem('inventoryData');
      const user = await AsyncStorage.getItem('user');
      if (data !== null) {
        setInventoryList(JSON.parse(data));
      }
      let userdata = JSON.parse(user);
      if (userdata.type == 'employee') {
        setEmployee(true);
      } else {
        setEmployee(false);
      }
    } catch (error) {
      console.error('Error loading inventory data:', error);
    }
  };

  const saveInventoryData = async () => {
    if (edit) {
      try {
        const newItem = {
          productId,
          productName,
          vendor,
          mrp,
          batchNum,
          batchDate,
          quantity,
          status,
        };
        const existingItems = await AsyncStorage.getItem('inventoryData');
        let inventory = existingItems ? JSON.parse(existingItems) : [];
        inventory = inventory.map(item =>
          item.productId == productId ? {...item, ...newItem} : item,
        );
        // console.log('firstddddd', inventory);
        await AsyncStorage.setItem('inventoryData', JSON.stringify(inventory));
        loadInventoryData();
        setEdit(false);
      } catch (error) {
        console.error('Error updating inventory item:', error);
      }
    } else {
      try {
        const newItem = {
          productId,
          productName,
          vendor,
          mrp,
          batchNum,
          batchDate,
          quantity,
          status,
        };

        const updatedList = [...inventoryList, newItem];
        await AsyncStorage.setItem(
          'inventoryData',
          JSON.stringify(updatedList),
        );

        // Clear input fields after saving
        clearInputFields();

        // Update the list of inventory items
        setInventoryList(updatedList);
      } catch (error) {
        console.error('Error saving inventory data:', error);
      }
    }
  };

  const handleDelete = async itemId => {
    try {
      const existingItems = await AsyncStorage.getItem('inventory');
      const inventory = existingItems ? JSON.parse(existingItems) : [];
      const updatedInventory = inventory.filter(
        item => item.productId !== itemId,
      );
      await AsyncStorage.setItem('inventory', JSON.stringify(updatedInventory));
      loadInventoryData();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const clearInputFields = () => {
    setProductId('');
    setProductName('');
    setVendor('');
    setMrp('');
    setBatchNum('');
    setBatchDate('');
    setQuantity('');
    setStatus('Pending');
  };

  return (
    // <ScrollView>

    // </ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Management</Text>
      <TextInput
        style={styles.input}
        placeholder="Product ID"
        value={productId}
        onChangeText={setProductId}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Vendor"
        value={vendor}
        onChangeText={setVendor}
      />
      <TextInput
        style={styles.input}
        placeholder="MRP"
        value={mrp}
        onChangeText={setMrp}
      />
      <TextInput
        style={styles.input}
        placeholder="Batch No"
        value={batchNum}
        onChangeText={setBatchNum}
      />
      <TextInput
        style={styles.input}
        placeholder="Batch Date"
        value={batchDate}
        onChangeText={setBatchDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
      />
      <TextInput
        style={styles.input}
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
      />
      {/* Add more input fields for other inventory details */}
      <Button title="Save" onPress={saveInventoryData} />
      <FlatList
        data={inventoryList}
        keyExtractor={(item, index) => `${item.productId}-${index}`}
        renderItem={({item}) => (
          <View style={styles.inventoryItem}>
            <Text>{`Product ID: ${item.productId}`}</Text>
            <Text>{`Product Name: ${item.productName}`}</Text>
            <Text>{`Vendor: ${item.vendor}`}</Text>
            <Text>{`MRP Rs.: ${item.mrp}.00`}</Text>
            <Text>{`Batch No: ${item.batchNum}`}</Text>
            <Text>{`Batch Date: ${item.batchDate}`}</Text>
            <Text>{`Quantity: ${item.quantity}`}</Text>
            <Text>{`Status: ${item.status}`}</Text>
            {!employee && (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'red',
                    width: 100,
                    borderRadius: 5,
                    marginVertical: 10,
                  }}
                  onPress={() => {
                    handleDelete(item.productId);
                  }}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#1a1a1a',
                    width: 100,
                    borderRadius: 5,
                    marginVertical: 10,
                  }}
                  onPress={() => {
                    setProductId(item.productId);
                    setProductName(item.productName);
                    setVendor(item.vendor);
                    setMrp(item.mrp);
                    setBatchNum(item.batchNum);
                    setBatchDate(item.batchDate);
                    setQuantity(item.quantity);
                    setStatus(item.status);
                    setEdit(true);
                  }}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>Edit</Text>
                </TouchableOpacity>
              </>
            )}
            {/* Display other inventory details here */}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inventoryItem: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default HomeScreen;
