import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(0);

  // Fetch products from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleBuyNow = (price) => {
    setSelectedPrice(price);
    setShowQRCode(true);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bio Recycled Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.about}>{item.about}</Text>
              <Text style={styles.material}>♻️ Made from: {item.recycledMaterial}</Text>
              <Text style={styles.price}>Rs. {item.price.toFixed(2)}</Text>
              <TouchableOpacity style={styles.button} onPress={() => handleBuyNow(item.price)}>
                <Text style={styles.buttonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* QR Code Modal */}
      <Modal visible={showQRCode} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.gpayCard}>
            {/* Header with Brand Logo */}
            <View style={styles.modalHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>P</Text>
              </View>
              <Text style={styles.gpayText}>Pay with GPay</Text>
            </View>

            {/* Amount Display */}
            <Text style={styles.amountDisplay}>Rs. {selectedPrice.toFixed(2)}</Text>

            {/* QR Code Image */}
            <Image
              source={require('../assets/gpay1.jpg')} // Replace with your QR image path
              style={styles.qrCodeImage}
            />

            {/* Instruction */}
            <Text style={styles.instructionText}>Scan the QR code to complete your payment</Text>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowQRCode(false);
                navigation.navigate('OrderPlaced'); // Navigate to OrderPlaced screen
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    padding: 15,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2E7D32',
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  about: {
    fontSize: 14,
    color: '#4E4E4E',
    marginVertical: 5,
  },
  material: {
    fontSize: 14,
    color: '#388E3C',
    fontStyle: 'italic',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpayCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  gpayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  amountDisplay: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginVertical: 10,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#4E4E4E',
    textAlign: 'center',
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '50%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductsScreen;
