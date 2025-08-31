import { React } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 1. Gerekli hook'u import edin

import HomeScreen from '../screens/Home/HomeScreen.js';
import ProfileScreen from '../screens/Home/ProfilScreen.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../constants/colors.js';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    // 2. Hook'u bileşen içinde çağırarak alttaki güvenli alan boşluğunu alın
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                // 3. Stili, alttaki boşluğu (insets.bottom) içerecek şekilde dinamik olarak güncelleyin
                tabBarStyle: {
                    ...styles.tabContainer,
                    height: 70 + insets.bottom, // Orijinal yüksekliğe güvenli alan yüksekliğini ekleyin
                    paddingBottom: insets.bottom, // İkonların güvenli alanın üstünde kalması için padding ekleyin
                },
                tabBarActiveTintColor: colors.primary, // Renk paletinizdeki doğru değişkenleri kullanalım
                tabBarInactiveTintColor: colors.textSecondary,
            })}
        >
            <Tab.Screen
                name="AnaSayfa"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profil"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingTop: 15,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        elevation: 5,
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: colors.surface, // Arka plan rengi eklemek genellikle daha iyi görünür
        borderTopWidth: 1, // Kenarlık için
        borderTopColor: colors.border,
    },
});

export default BottomTabNavigator;