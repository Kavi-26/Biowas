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
  ActivityIndicator,
  Dimensions
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
import { useTranslation } from 'react-i18next';
import i18n from '../bio/i18n/index';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { t } = useTranslation();

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
      navigation.navigate('PointsScreen');
    } else {
      Alert.alert('Access Denied', 'You are not an admin.');
    }
  };

  const handleLanguageChange = () => {
    const nextLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(nextLang);
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
        colors={['#0ea5e9', '#0284c7', '#0369a1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Animatable.View 
          animation="fadeIn" 
          duration={1000} 
          style={styles.profileContainer}>
          {userData?.photoURL ? (
            <Animatable.View animation="pulse" iterationCount={1} duration={1500}>
              <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
            </Animatable.View>
          ) : (
            <Animatable.View animation="pulse" iterationCount={1} duration={1500} style={styles.profilePlaceholder}>
              <MaterialIcons name="person" size={45} color="#0ea5e9" />
            </Animatable.View>
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        <Animatable.View 
          animation="fadeInUp" 
          delay={500} 
          style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info" size={24} color="#0ea5e9" />
            <Text style={styles.infoTitle}>{t('profile.personalInfo')}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={20} color="#64748b" />
            <Text style={styles.infoLabel}>{t('profile.mobile')}</Text>
            <Text style={styles.infoValue}>{userData?.mobile || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#64748b" />
            <Text style={styles.infoLabel}>{t('profile.address')}</Text>
            <Text style={styles.infoValue}>{userData?.address || '-'}</Text>
          </View>
          <Animatable.View 
            animation="pulse" 
            iterationCount="infinite" 
            duration={2000} 
            style={styles.pointsBadge}>
            <LinearGradient
              colors={['#0ea5e9', '#0284c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.pointsGradient}>
              <MaterialIcons name="stars" size={24} color="#fff" />
              <Text style={styles.pointsText}>{t('profile.points', { count: userData?.points || 0 })}</Text>
            </LinearGradient>
          </Animatable.View>
        </Animatable.View>

        <Animatable.View 
          animation="fadeInUp" 
          delay={700} 
          style={styles.qrCard}>
          <View style={styles.qrHeader}>
            <MaterialIcons name="qr-code" size={24} color="#0ea5e9" />
            <Text style={styles.qrTitle}>{t('profile.yourQRCode')}</Text>
          </View>
          <Animatable.View 
            animation="fadeIn" 
            delay={1000}
            style={styles.qrWrapper}>
            <QRCode 
              value={qrValue} 
              size={200} 
              backgroundColor="#f1f5f9"
              color="#0f172a"
            />
          </Animatable.View>
          
          {userData?.isAdmin && (
            <TouchableOpacity 
              style={styles.qrButton} 
              onPress={handleQRCodeScan}
              activeOpacity={0.8}>
              <MaterialIcons name="qr-code-scanner" size={20} color="#fff" />
              <Text style={styles.qrButtonText}>{t('profile.scanQRCode')}</Text>
            </TouchableOpacity>
          )}
        </Animatable.View>
        
        <Animatable.View animation="fadeInUp" delay={900}>
          <LinearGradient
            colors={['#0ea5e9', '#0284c7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.languageButton}>
            <TouchableOpacity
              style={styles.languageButtonInner}
              onPress={handleLanguageChange}
            >
              <MaterialIcons name="translate" size={20} color="#fff" />
              <Text style={styles.languageButtonText}>{t('profile.changeLanguage')}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animatable.View>
      </ScrollView>

      <Animatable.View 
        animation="fadeInRight" 
        delay={1000}>
        <LinearGradient
          colors={['#0ea5e9', '#0284c7']}
          style={styles.fabLogout}>
          <TouchableOpacity 
            onPress={handleLogout}
            activeOpacity={0.8}
            style={styles.fabTouchable}>
            <MaterialIcons name="logout" size={28} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
      </Animatable.View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#e0f2fe',
    marginRight: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#bae6fd',
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    elevation: 5,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  email: {
    fontSize: 15,
    color: '#f1f5f9',
    marginBottom: 8,
  },
  miniPointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  miniPointsText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    elevation: 3,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  infoValue: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 'auto',
  },
  pointsBadge: {
    marginTop: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    elevation: 2,
  },
  pointsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  pointsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 24,
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginLeft: 8,
  },
  qrWrapper: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  qrButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    width: width - 80,
  },
  qrButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
    marginLeft: 10,
  },
  languageButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  languageButtonInner: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  languageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  fabLogout: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    borderRadius: 30,
    width: 60,
    height: 60,
    elevation: 6,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 10,
  },
  fabTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default ProfileScreen;
