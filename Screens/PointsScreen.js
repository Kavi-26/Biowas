import React, { useState } from 'react';
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

const PointsScreen = ({ navigation, route }) => {
  const [userId, setUserId] = useState('');
  const [points, setPoints] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPoints = async () => {
    if (!userId || !points) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('uid', '==', userId));
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
              setUserId('');
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
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>User ID</Text>
              <TextInput
                style={styles.input}
                value={userId}
                onChangeText={setUserId}
                placeholder="Enter user ID"
                placeholderTextColor="#666"
              />
            </View>

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
});

export default PointsScreen;