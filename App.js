import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// YENİ EKLENEN SATIR
import { Provider as PaperProvider } from 'react-native-paper'; 

import SplashScreen from './src/screens/Auth/SplashScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {

  }, []);
  
  return (
    // YENİ EKLENEN SARMALAYICI
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Register" // Test için 'HomeScreen' de yapabilirsin
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
          />
          <Stack.Screen
            name="HomeScreen"
            component={BottomTabNavigator}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider> // YENİ EKLENEN SARMALAYICI
  );
}