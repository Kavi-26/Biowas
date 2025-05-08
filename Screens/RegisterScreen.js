import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const InputField = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType, animation, delay }) => (
  <Animatable.View animation={animation} delay={delay}>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      placeholderTextColor="#888"
      autoCapitalize="none"
    />
  </Animatable.View>
);

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your photos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageURL(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !mobile || !address || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields and select a profile image');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        username: name,
        email: email,
        mobile: mobile,
        address: address,
        photoURL: imageURL,
        createdAt: new Date().toISOString()
      });

      Alert.alert('Success', 'Account created successfully');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#f4f4f4', '#e0e0e0']}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Animatable.View 
              animation="slideInUp" 
              duration={1000} 
              style={styles.content}>
              
              <Animatable.Image
                animation={{
                  from: { 
                    scale: 0,
                    rotate: '0deg',
                    opacity: 0
                  },
                  to: { 
                    scale: 1,
                    rotate: '360deg',
                    opacity: 1
                  }
                }}
                duration={2000}
                source={require('../assets/logo.png')}
                style={styles.logo}
              />

              <Animatable.View 
                animation={{
                  from: {
                    translateY: 50,
                    opacity: 0
                  },
                  to: {
                    translateY: 0,
                    opacity: 1
                  }
                }}
                duration={800}
                delay={500}
                style={styles.formContainer}>
                
                <Animatable.Text 
                  animation="rubberBand"
                  delay={1500}
                  style={styles.title}>
                  Create Account
                </Animatable.Text>

                <Animatable.Text 
                  animation="fadeIn" 
                  delay={1700}
                  style={styles.subtitle}>
                  Please fill in the details below
                </Animatable.Text>

                <Animatable.View 
                  animation={{
                    from: { scale: 0, opacity: 0 },
                    to: { scale: 1, opacity: 1 }
                  }}
                  duration={800}
                  delay={800}>
                  <TouchableOpacity onPress={selectImage} style={styles.imagePickerButton}>
                    {imageUri ? (
                      <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                    ) : (
                      <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Tap to select profile image</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animatable.View>

                <InputField
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  animation={{
                    from: { translateX: -100, opacity: 0 },
                    to: { translateX: 0, opacity: 1 }
                  }}
                  delay={1000}
                />

                <InputField
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  animation={{
                    from: { translateX: 100, opacity: 0 },
                    to: { translateX: 0, opacity: 1 }
                  }}
                  delay={1200}
                />

                <InputField
                  placeholder="Mobile Number"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  animation={{
                    from: { translateX: -100, opacity: 0 },
                    to: { translateX: 0, opacity: 1 }
                  }}
                  delay={1400}
                />

                <InputField
                  placeholder="Address"
                  value={address}
                  onChangeText={setAddress}
                  animation={{
                    from: { translateX: 100, opacity: 0 },
                    to: { translateX: 0, opacity: 1 }
                  }}
                  delay={1600}
                />

                <InputField
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  animation={{
                    from: { translateX: -100, opacity: 0 },
                    to: { translateX: 0, opacity: 1 }
                  }}
                  delay={1800}
                />

                <InputField
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  animation={{
                    from: { translateX: 100, opacity: 0 },
                    to: { translateX: 0, opacity: 1 }
                  }}
                  delay={2000}
                />

                <Animatable.View 
                  animation={{
                    from: { scale: 0.5, opacity: 0 },
                    to: { scale: 1, opacity: 1 }
                  }}
                  duration={500}
                  delay={2200}>
                  <TouchableOpacity 
                    style={styles.registerButton} 
                    onPress={handleRegister}
                    activeOpacity={0.8}>
                    <Animatable.Text 
                      animation="pulse"
                      iterationCount="infinite"
                      duration={2000}
                      style={styles.registerButtonText}>
                      Create Account
                    </Animatable.Text>
                  </TouchableOpacity>

                  <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity 
                      onPress={() => navigation.navigate('Login')}
                      activeOpacity={0.7}>
                      <Animatable.Text 
                        animation="flash"
                        delay={2500}
                        duration={2000}
                        style={styles.loginLink}>
                        Sign In
                      </Animatable.Text>
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              </Animatable.View>
            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 30,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imagePickerButton: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 75,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#007bff',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default RegisterScreen;
