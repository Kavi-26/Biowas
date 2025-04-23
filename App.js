import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import ProductsScreen from './Screens/ProductsScreen';
import OrderPlacedScreen from './Screens/OrderPlacesScreen';
import MapScreen from './Screens/MapScreen';

// Create Stack Navigator for Authentication Screens
const Stack = createStackNavigator();

// Create Bottom Tab Navigator for Main Screens
const Tab = createBottomTabNavigator();

// 🚀 Bottom Tabs (Home, Profile, Products, Map)
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } 
          else if (route.name === 'Products') {
            iconName = 'cart-outline';
          } 
          else if (route.name === 'Map') {
            iconName = 'map-outline';
          }
          else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } 
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// 🚀 Main App Navigation (Authentication + Tabs)
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={MainTabs} />
        <Stack.Screen
                name="Products"
                component={ProductsScreen} 
                options={{ headerShown: true }}
                />
                <Stack.Screen
                name="OrderPlaced"
                component={OrderPlacedScreen} 
                options={{ headerShown: true }}
                />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
