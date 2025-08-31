import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/colors';


const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken');

                setTimeout(() => {
                    if (userToken) {
                        navigation.replace('HomeScreen');
                    } else {
                        navigation.replace('Register');
                    }
                }, 2000);
            } catch (e) {
                console.error("AsyncStorage'dan veri okunurken hata oluştu:", e);
                navigation.replace('Login');
            }
        };

        checkLoginStatus();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hoş Geldiniz!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.subtitle}>Yükleniyor...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 10,
        color: '#666',
    },
});

export default SplashScreen;