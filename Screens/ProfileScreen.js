import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator, 
  Image 
} from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import QRCode from 'react-native-qrcode-svg';


const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            const qrPayload = {
              uid: currentUser.uid,
              email: currentUser.email,
              name: data.username,
              mobile: data.mobile,
              address: data.address,
            };
            setQrValue(JSON.stringify(qrPayload));
          } else {
            console.log('User document not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: userData?.photoURL || 'https://via.placeholder.com/150' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.welcomeText}>{userData?.username || 'User'}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailItem}>📧 Email: {userData?.email}</Text>
        <Text style={styles.detailItem}>📱 Mobile: {userData?.mobile}</Text>
        <Text style={styles.detailItem}>🏠 Address: {userData?.address}</Text>
      </View>

      <View style={styles.qrContainer}>
        {qrValue ? (
          <>
            <QRCode value={qrValue} size={200} />
            <Text style={styles.qrLabel}>Your Unique QR Code</Text>
          </>
        ) : (
          <Text>No QR Code Available</Text>
        )}
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  profileContainer: {
    backgroundColor: '#007bff',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
  },
  welcomeText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
  },
  detailsContainer: {
    padding: 20,
  },
  detailItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrLabel: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;
