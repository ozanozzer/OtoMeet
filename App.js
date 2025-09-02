import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/Auth/SplashScreen';
import HomeScreen from './src/screens/Home/HomeScreen'; // Bu satırda bir tutarsızlık olabilir, BottomTabNavigator mu kullanılacak HomeScreen mi? Aşağıda BottomTabNavigator kullanılıyor.
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {

  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Register"
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
  );
}

//abcdef