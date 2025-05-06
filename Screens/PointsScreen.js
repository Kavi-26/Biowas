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
  ScrollView
} from 'react-native';
import { db } from '../firebaseConfig';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';

// Declare userUid constant here
const USER_UID = 'AqbNrsbvZVRug5Wt4Mp6YwoL9l53'; // <-- Replace with actual UID or fetch dynamically

const PointsScreen = ({ navigation }) => {
  const userUid = USER_UID; // Use the constant in the component
  const [points, setPoints] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user points or other data using userUid
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
      navigation.replace('Login'); // Adjust 'Login' to your login screen name
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="star-circle" size={50} color="#FFD700" />
            <Text style={styles.title}>Manage Points</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={24} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
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
            >
              {loading ? (
                <Text style={styles.buttonText}>Processing...</Text>
              ) : (
                <Text style={styles.buttonText}>Add Points</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#88c98b',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 15,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default PointsScreen;