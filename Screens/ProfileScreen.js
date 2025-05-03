import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUserDetails = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userInfo = userDoc.data();
          setUserData({ ...userInfo, docId: userDoc.id });
          setQrValue(JSON.stringify(userInfo));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleQRCodeScan = () => {
    if (userData && userData.isAdmin) {
      navigation.navigate('PointsScreen');  // Only allow if admin is true
    } else {
      Alert.alert('Access Denied', 'You are not an admin.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {userData ? (
          <>
            <View style={styles.header}>
              {userData.photoURL ? (
                <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
              ) : (
                <Text style={styles.profilePlaceholder}>👤</Text>
              )}
              <Text style={styles.username}>{userData.username}</Text>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.detail}>📧 Email: {userData.email}</Text>
              <Text style={styles.detail}>📞 Mobile: {userData.mobile}</Text>
              <Text style={styles.detail}>📍 Address: {userData.address}</Text>
              <Text style={styles.points}>⭐ Points: {userData.points}</Text>
            </View>

            <View style={styles.qrContainer}>
              <QRCode value={qrValue} size={180} />
              <TouchableOpacity style={styles.scanButton} onPress={handleQRCodeScan}>
                <Text style={styles.scanText}>Scan QR (Admin Only)</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={{ textAlign: 'center' }}>No user data found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdf4' },
  header: {
    alignItems: 'center',
    backgroundColor: '#34d399',
    paddingVertical: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
  },
  profilePlaceholder: {
    fontSize: 60,
    color: '#fff',
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  logoutText: {
    color: '#34d399',
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 10,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  scanButton: {
    backgroundColor: '#34d399',
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  scanText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
