import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Alert, 
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (email.toLowerCase() === 'admin@gmail.com') {
        navigation.replace('AdminScreen');
      } else {
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#f4f4f4', '#e0e0e0']}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Animatable.View 
            animation={{
              0: { scale: 1 },
              0.5: { scale: 1.2 },
              1: { scale: 1 }
            }}
            easing="ease-out"
            iterationCount="infinite"
            duration={1500}
            style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
          </Animatable.View>
        ) : (
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
                Welcome Back
              </Animatable.Text>

              <Animatable.View 
                animation={{
                  from: { translateX: -100, opacity: 0 },
                  to: { translateX: 0, opacity: 1 }
                }}
                duration={600}
                delay={800}>
                <TextInput
                  style={[styles.input, styles.emailInput]}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#888"
                />
              </Animatable.View>

              <Animatable.View 
                animation={{
                  from: { translateX: 100, opacity: 0 },
                  to: { translateX: 0, opacity: 1 }
                }}
                duration={600}
                delay={1000}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </Animatable.View>

              <Animatable.View 
                animation={{
                  from: { scale: 0.5, opacity: 0 },
                  to: { scale: 1, opacity: 1 }
                }}
                duration={500}
                delay={1200}>
                <TouchableOpacity 
                  style={styles.forgotPassword}
                  activeOpacity={0.7}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.loginButton} 
                  onPress={handleLogin}
                  activeOpacity={0.8}>
                  <Animatable.Text 
                    animation="pulse"
                    iterationCount="infinite"
                    duration={2000}
                    style={styles.loginButtonText}>
                    Login
                  </Animatable.Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Don't have an account? </Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('Register')}
                    activeOpacity={0.7}>
                    <Animatable.Text 
                      animation="flash"
                      delay={2000}
                      duration={2000}
                      style={styles.registerLink}>
                      Register
                    </Animatable.Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            </Animatable.View>
          </Animatable.View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: 'white',
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
    textAlign: 'center',
    marginBottom: 30,
    color: '#1a1a1a',
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
  emailInput: {
    transform: [{ scale: 1 }],
  },
  passwordInput: {
    transform: [{ scale: 1 }],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 15,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#007bff',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  registerText: {
    color: '#666',
    fontSize: 16,
  },
  registerLink: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default LoginScreen;