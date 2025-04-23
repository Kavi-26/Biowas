import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { auth } from '../firebaseConfig';
const HomeScreen = () => {
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.welcomeText}>Welcome!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  profileContainer: {
    backgroundColor: '#007bff',
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
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

export default HomeScreen;
