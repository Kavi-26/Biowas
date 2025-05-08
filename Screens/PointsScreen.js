import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { db } from '../firebaseConfig';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const USER_UID = 'AqbNrsbvZVRug5Wt4Mp6YwoL9l53'; // <-- Replace with actual UID or fetch dynamically

const PointsScreen = ({ navigation }) => {
  const userUid = USER_UID;
  const [points, setPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', userUid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserData({ ...userDoc.data(), docId: userDoc.id });
      } else {
        setUserData(null);
      }
    } catch (error) {
      setUserData(null);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userUid]);

  const handleAddPoints = async () => {
    if (!userUid || !points) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('uid', '==', userUid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const userDoc = snapshot.docs[0];
      const currentPoints = userDoc.data().points || 0;
      const newPoints = currentPoints + parseInt(points);

      await updateDoc(doc(db, 'users', userDoc.id), {
        points: newPoints
      });

      setUserData({ ...userDoc.data(), points: newPoints, docId: userDoc.id });

      Alert.alert(
        'Success',
        `Points updated successfully!\nNew total: ${newPoints}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setPoints('');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update points');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <LinearGradient
      colors={['#f4f4f4', '#e0e0e0']}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Animatable.View 
              animation="fadeInDown" 
              duration={1000} 
              style={styles.header}>
              <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
                <MaterialCommunityIcons name="star-circle" size={60} color="#FFD700" />
              </Animatable.View>
              <Animatable.Text animation="fadeIn" delay={500} style={styles.title}>
                Manage Points
              </Animatable.Text>

              {userData && (
                <Animatable.View 
                  animation="fadeInUp" 
                  delay={600} 
                  style={styles.userInfoContainer}>
                  <Text style={styles.userInfoText}>
                    Name: {userData.username || 'N/A'}
                  </Text>
                  <Text style={styles.userInfoText}>
                    Email: {userData.email || 'N/A'}
                  </Text>
                  <Text style={styles.userInfoText}>
                    Mobile: {userData.mobile || 'N/A'}
                  </Text>
                  <Text style={styles.userInfoText}>
                    Address: {userData.address || 'N/A'}
                  </Text>
                  <Animatable.Text 
                    animation="bounceIn" 
                    delay={800} 
                    style={styles.pointsText}>
                    Current Points: {userData.points ?? 0}
                  </Animatable.Text>
                </Animatable.View>
              )}
            </Animatable.View>

            <Animatable.View 
              animation="fadeInUp" 
              delay={800} 
              style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Points to Add</Text>
                <TextInput
                  style={styles.input}
                  value={points}
                  onChangeText={setPoints}
                  placeholder="Enter points"
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleAddPoints}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Add Points</Text>
                )}
              </TouchableOpacity>
            </Animatable.View>
          </ScrollView>

          <Animatable.View 
            animation="fadeInUp" 
            delay={1000} 
            style={styles.bottomContainer}>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
              activeOpacity={0.8}>
              <MaterialCommunityIcons name="logout" size={24} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </Animatable.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 15,
  },
  userInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 10,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#88c98b',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  bottomContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});

export default PointsScreen;