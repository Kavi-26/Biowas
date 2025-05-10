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
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

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
      <LinearGradient
        colors={['#0ea5e9', '#0284c7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Animatable.View 
          animation="fadeIn" 
          duration={1000} 
          style={styles.profileContainer}>
          {userData?.photoURL ? (
            <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <MaterialIcons name="person" size={45} color="#0ea5e9" />
            </View>
          )}
          <Animatable.View 
            animation="fadeInRight" 
            delay={300} 
            style={styles.profileInfo}>
            <Text style={styles.username}>{userData?.username}</Text>
            <Text style={styles.email}>{userData?.email}</Text>
          </Animatable.View>
        </Animatable.View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        <Animatable.View 
          animation="fadeInUp" 
          delay={500} 
          style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info" size={24} color="#0ea5e9" />
            <Text style={styles.infoTitle}>Personal Information</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={20} color="#64748b" />
            <Text style={styles.infoLabel}>Mobile</Text>
            <Text style={styles.infoValue}>{userData?.mobile}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#64748b" />
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{userData?.address}</Text>
          </View>
          <Animatable.View 
            animation="pulse" 
            iterationCount="infinite" 
            duration={2000} 
            style={styles.pointsBadge}>
            <MaterialIcons name="stars" size={24} color="#0ea5e9" />
            <Text style={styles.pointsText}>{userData?.points} Points</Text>
          </Animatable.View>
        </Animatable.View>

        <Animatable.View 
          animation="fadeInUp" 
          delay={700} 
          style={styles.qrCard}>
          <View style={styles.qrHeader}>
            <MaterialIcons name="qr-code" size={24} color="#0ea5e9" />
            <Text style={styles.qrTitle}>Your QR Code</Text>
          </View>
          <View style={styles.qrWrapper}>
            <QRCode value={qrValue} size={200} />
          </View>
          <TouchableOpacity 
            style={styles.qrButton} 
            onPress={handleQRCodeScan}
            activeOpacity={0.8}>
            <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />
            <Text style={styles.qrButtonText}>Scan QR Code</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      <Animatable.View 
        animation="fadeInRight" 
        delay={1000}>
        <TouchableOpacity 
          style={styles.fabLogout} 
          onPress={handleLogout}
          activeOpacity={0.8}>
          <MaterialIcons name="logout" size={28} color="#fff" />
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#e0f2fe',
    marginRight: 18,
    elevation: 2,
  },
  profilePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#bae6fd',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    elevation: 2,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  email: {
    fontSize: 15,
    color: '#f1f5f9',
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
    elevation: 2,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  infoValue: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 'auto',
  },
  pointsBadge: {
    marginTop: 12,
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    color: '#0284c7',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginLeft: 8,
  },
  qrWrapper: {
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  qrButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 6,
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  qrButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  fabLogout: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#06b6d4',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    zIndex: 10,
  },
});

export default ProfileScreen;
