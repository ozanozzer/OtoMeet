import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack';
// YENİ EKLENEN SATIR
import { Provider as PaperProvider } from 'react-native-paper'; 
import { supabase } from './src/services/supabase';

import SplashScreen from './src/screens/Auth/SplashScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import SettingsScreen from './src/screens/Home/Profile/SettingsScreen';
import EditProfileScreen from './src/screens/Home/Profile/EditProfileScreen'; 
import ChatScreen from './src/screens/Messages/ChatScreen';
import FollowersScreen from './src/screens/Home/Profile/FollowersScreen';
import FollowingScreen from './src/screens/Home/Profile/FollowingScreen';

const Stack = createStackNavigator();

export default function App() {

  useEffect(() => {
    // onAuthStateChange, Supabase oturum durumundaki değişiklikleri dinler
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Oturum açıldığında veya mevcut oturum bulunduğunda...
        if (event === 'SIGNED_IN' && session) {
          console.log('>>> KULLANICI OTURUMU BULUNDU (SIGNED_IN), PRESENCE KURULUYOR...');
          const user = session.user;
          
          const channel = supabase.channel('online-users', {
            config: {
              presence: { key: user.id },
            },
          });

          channel.on('presence', { event: 'sync' }, () => {
            channel.track({ online_at: new Date().toISOString() });
          });

          channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              console.log('>>> PRESENCE KANALINA ABONE OLUNDU!');
              await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', user.id);
            }
          });

          // Uygulama kapanırken kanalı temizlemek için global bir değişkende saklayabiliriz.
          // Bu, daha ileri seviye bir konudur, şimdilik bu yapı çalışacaktır.
        }

        if (event === 'SIGNED_OUT') {
          console.log('>>> KULLANICI ÇIKIŞ YAPTI (SIGNED_OUT)');
          // Tüm kanallardan çıkış yap
          supabase.removeAllChannels();
        }
      }
    );

    // Uygulama kapandığında listener'ı temizle
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Boş dizi, bu listener'ın sadece bir kez kurulmasını sağlar.

  
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

          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />

          <Stack.Screen 
            name="EditProfile" 
            component={EditProfileScreen}
            // Bu ekran için de soldan kayma animasyonu güzel durur
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />

          <Stack.Screen
            name='ChatScreen'
            component={ChatScreen}
          />

          <Stack.Screen name="Followers" component={FollowersScreen} />
          <Stack.Screen name="Following" component={FollowingScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider> // YENİ EKLENEN SARMALAYICI
  );
}