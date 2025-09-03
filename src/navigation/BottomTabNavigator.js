import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/Home/HomeScreen.js';
import AntDesign from '@expo/vector-icons/AntDesign';
const EmptyScreen = () => <View style={{ flex: 1, backgroundColor: colors.background }} />;

import colors from '../constants/colors.js';
import MeetingsScreen from '../screens/Events/MeetingsScreen.js';
import MessageScreen from '../screens/Messages/MessagesScreen.js';
import ProfilScreen from '../screens/Home/Profile/ProfilScreen.js';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.icon,

                // GÜNCELLENMİŞ STİL - Daha Belirgin Boşluklarla
                tabBarStyle: {
                    position: 'absolute',
                    // Konumlandırma
                    bottom: insets.bottom > 0 ? insets.bottom : 10, // iPhone'larda home bar'ın hemen üstü, Android'de alttan 20 boşluk

                    // YAN BOŞLUKLAR: Barı daraltıp havada durma hissini artırıyoruz
                    left: 40,
                    right: 40,

                    // Estetik
                    height: 70, // Daha tok bir yükseklik
                    borderRadius: 35, // Yüksekliğin yarısı, mükemmel hap şekli için
                    backgroundColor: colors.surface,
                    borderTopWidth: 0,

                    // İçerik hizalama
                    paddingHorizontal: 10, // İkonların kenarlara yapışmasını engeller
                    paddingBottom: 5, // Yazıların hizası için
                    paddingTop: 5,

                    // Gölgelendirme
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Akış"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "grid" : "grid-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Buluşmalar"
                component={MeetingsScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "car-sport" : "car-sport-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Mesajlar"
                component={MessageScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profil"  // Bu isim önemli! 'navigate' içinde bu kullanılır.
                component={ProfilScreen} // ProfilScreen'i import etmeyi unutma
                options={{
                    headerTitle: '',

                    tabBarIcon: ({ color, focused }) => (
                        <AntDesign name="user" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>

        
    );
};

export default BottomTabNavigator;