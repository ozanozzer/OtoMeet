import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

// === GEREKLİ IMPORT'LARI TEMİZ BİR ŞEKİLDE YAPIYORUZ ===
import colors from '../constants/colors.js';
import HomeScreen from '../screens/Home/HomeScreen.js';
import SearchScreen from '../screens/Search/SearchScreen.js'; // 'Search' büyük harfle, doğru yol
import MessageScreen from '../screens/Messages/MessagesScreen.js';
import ProfilScreen from '../screens/Home/Profile/ProfilScreen.js'; // Sadece bir kere import ediliyor

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            // --- screenOptions kısmında HİÇBİR DEĞİŞİKLİK YOK, MÜKEMMEL ---
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.icon,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: insets.bottom > 0 ? insets.bottom : 10,
                    left: 40,
                    right: 40,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: colors.surface,
                    borderTopWidth: 0,
                    paddingHorizontal: 10,
                    paddingBottom: 5,
                    paddingTop: 5,
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
            {/* --- EKRANLARDA HİÇBİR DEĞİŞİKLİK YOK, MÜKEMMEL --- */}
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
                name="Arama"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
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
                name="Profil"
                component={ProfilScreen}
                options={{
                    headerTitle: '',
                    tabBarIcon: ({ color, focused }) => (
                        <AntDesign name="user" size={24} color={color} />
                    ),
                }}
                // --- listeners kısmında HİÇBİR DEĞİŞİKLİK YOK, MÜKEMMEL ---
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Profil', { userId: undefined });
                    },
                })}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;