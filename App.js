import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import './bio/i18n/index';

// Import screens
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import ProductsScreen from './Screens/ProductsScreen';
import OrderPlacedScreen from './Screens/OrderPlacesScreen';
// import MapScreen from './Screens/MapScreen'; // Removed
import AdminScreen from './Screens/AdminScreen'; // 
import PointsScreen from './Screens/PointsScreen'; // 

// Create Stack Navigator
const Stack = createStackNavigator();

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// 🚀 Bottom Tabs (Home, Products, Profile)
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Products') {
            iconName = 'cart-outline';
          // } else if (route.name === 'Map') {
          //   iconName = 'map-outline';
          } else if (route.name === 'Profile') {
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
      {/* <Tab.Screen name="Map" component={MapScreen} /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// 🚀 Main App Navigation
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Authentication Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Main Screens */}
        <Stack.Screen name="Home" component={MainTabs} />
        <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Products" component={ProductsScreen} options={{ headerShown: true }} />

        {/* Admin Screen */}
        <Stack.Screen name="AdminScreen" component={AdminScreen} />

        {/* Points Screen */}
        <Stack.Screen 
          name="PointsScreen" 
          component={PointsScreen}
          options={{
            title: 'Manage Points',
            headerLeft: null // Prevents going back to scanner
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;