import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AdminScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [about, setAbout] = useState('');
  const [recycledMaterial, setRecycledMaterial] = useState('');

  const handleAddProduct = async () => {
    if (!name || !price || !image || !about || !recycledMaterial) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await addDoc(collection(db, 'products'), {
        name: name,
        price: parseFloat(price),
        image: image,
        about: about,
        recycledMaterial: recycledMaterial,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Product added successfully!");
      setName('');
      setPrice('');
      setImage('');
      setAbout('');
      setRecycledMaterial('');
    } catch (error) {
      console.error("Error adding product: ", error);
      Alert.alert("Error", "Failed to add product");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Add New Product</Text>

        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Price (e.g. 9.99)"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <TextInput
          style={styles.input}
          placeholder="Image URL"
          value={image}
          onChangeText={setImage}
        />

        <TextInput
          style={styles.input}
          placeholder="About Product"
          multiline
          value={about}
          onChangeText={setAbout}
        />

        <TextInput
          style={styles.input}
          placeholder="Recycled Material Used"
          value={recycledMaterial}
          onChangeText={setRecycledMaterial}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F1F8E9',
    paddingVertical: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminScreen;









import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';

const ProfileScreen = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);

  const onQRScan = (event) => {
    if (scanned) return;
    setScanned(true);

    try {
      const data = JSON.parse(event.nativeEvent.codeStringValue);
      if (data.uid) {
        navigation.navigate('UserDetail', { uid: data.uid });
      } else {
        Alert.alert("Invalid QR Code", "No UID found in QR code.");
        setScanned(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to parse QR code.");
      setScanned(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraKitCameraScreen
        showFrame={true}
        scanBarcode={true}
        laserColor={'blue'}
        frameColor={'yellow'}
        onReadCode={onQRScan}
      />
    </View>
  );
};

export default ProfileScreen;
