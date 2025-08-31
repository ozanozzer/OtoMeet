import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

// Renk paletimizi ve sabitlerimizi import ediyoruz
import colors from '../../constants/colors';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = () => {
        // Girdi kontrolü
        if (!email || !password) {
            Alert.alert('Giriş Hatası', 'Lütfen e-posta ve şifre alanlarını doldurun.');
            return;
        }

        // --- Gerçek Uygulama Mantığı ---
        // Burada normalde bir AuthService çağrısı yapılır,
        // sunucuya e-posta ve şifre gönderilir,
        // başarılı olursa token alınır ve kaydedilir.
        // Şimdilik sadece bir uyarı gösterip HomeScreen'e yönlendirelim.
        console.log('Giriş denendi:', { email, password });

        Alert.alert('Giriş Başarılı', 'Hoş geldiniz!', [
            {
                text: 'Devam Et',
                onPress: () => {
                    // Giriş başarılı olduğunda SplashScreen'e geri dönülmesini engellemek için 'replace' kullanıyoruz.
                    navigation.replace('HomeScreen');
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hoş Geldiniz</Text>
            <Text style={styles.subtitle}>Devam etmek için giriş yapın</Text>

            <TextInput
                style={styles.input}
                placeholder="E-posta Adresiniz"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Şifreniz"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry // Şifrenin gizli olmasını sağlar
                value={password}
                onChangeText={setPassword}
            />

            {/* Şifremi Unuttum linki için bir Pressable */}
            <Pressable style={styles.forgotPasswordContainer} onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </Pressable>

            {/* Giriş Butonu */}
            <View style={styles.buttonContainer}>
                <Button title="Giriş Yap" onPress={handleLogin} color={colors.primary} />
            </View>

            {/* Kayıt Ekranına Yönlendirme */}
            <View style={styles.registerPrompt}>
                <Text style={styles.promptText}>Hesabın yok mu?</Text>
                <Button title="Hemen Kayıt Ol" onPress={() => navigation.navigate('Register')} color={colors.textLink} />
            </View>
        </View>
    );
};

// Stilleri renk paletimize göre düzenliyoruz
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: colors.surfaceLight,
        fontSize: 16,
        color: colors.text,
    },
    buttonContainer: {
        marginTop: 10,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: colors.textLink,
        fontSize: 14,
    },
    registerPrompt: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    promptText: {
        color: colors.textSecondary,
        marginRight: 5,
    },
});

export default LoginScreen;