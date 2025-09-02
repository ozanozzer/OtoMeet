import { View, StyleSheet, Alert, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { AuthService } from '../../services/AuthService';
import colors from '../../constants/colors'; // Renkler artık merkezi dosyadan geliyor.

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    // handleRegister fonksiyonu aynı kalıyor...
    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
            return;
        }
        setLoading(true);
        try {
            console.log('Kayıt denemesi:', email, password);
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert('Başarılı!', 'Sürücü koltuğuna hoş geldin!', [
                {
                    text: 'Devam Et',
                    onPress: () => navigation.replace('HomeScreen'),
                },
            ]);

        } catch (error) {
            console.error(error);
            Alert.alert('Bir Sorun Oluştu', 'Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LottieView
                source={require('../../assets/animations/car_dashboard.json')}
                autoPlay
                loop
                style={styles.lottie}
            />

            <Text variant="headlineLarge" style={styles.title}>
                Kontrolü Ele Al
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                Yeni bir hesap oluşturarak yolculuğa başla.
            </Text>

            <TextInput
                label="E-posta"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                textColor={colors.text}
                activeOutlineColor={colors.accent}
                outlineColor={colors.border}
                // YENİ: Yuvarlaklığı artırmak ve renkleri temaya uygulamak için theme prop'u güncellendi
                theme={{
                    roundness: 12, // Bu değer input'ların köşe yuvarlaklığını artırır
                    colors: { onSurfaceVariant: colors.textSecondary }
                }}
                left={<TextInput.Icon icon="email-outline" color={colors.textSecondary} />}
            />

            <TextInput
                label="Şifre"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                mode="outlined"
                secureTextEntry={secureTextEntry}
                textColor={colors.text}
                activeOutlineColor={colors.accent}
                outlineColor={colors.border}
                // YENİ: Yuvarlaklığı artırmak ve renkleri temaya uygulamak için theme prop'u güncellendi
                theme={{
                    roundness: 12, // Bu değer input'ların köşe yuvarlaklığını artırır
                    colors: { onSurfaceVariant: colors.textSecondary }
                }}
                left={<TextInput.Icon icon="lock-outline" color={colors.textSecondary} />}
                right={
                    <TextInput.Icon
                        icon={secureTextEntry ? "eye-off" : "eye"}
                        color={colors.textSecondary}
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                    />
                }
            />

            <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                loading={loading}
                disabled={loading}
                icon="arrow-right-bold-circle"
                buttonColor={colors.accent}
            >
                Giriş Yap
            </Button>

            <View style={styles.loginPrompt}>
                <Text style={styles.promptText}>Henüz bir garajın yok mu?</Text>
                <Button
                    mode="text"
                    onPress={() => navigation.navigate('Register')}
                    textColor={colors.accent}
                >
                    Kaydol
                </Button>
            </View>
        </View>
    );
};


// Stillerde renkler artık 'colors' objesinden okunuyor.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },
    lottie: {
        width: '80%',
        height: 180,
        alignSelf: 'center',
        marginBottom: 10,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: colors.text,
        letterSpacing: 1,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        color: colors.textSecondary,
    },
    input: {
        marginBottom: 12,
        backgroundColor: colors.surface,
    },
    button: {
        marginTop: 20,
        borderRadius: 30, // Butonun yuvarlaklığını da input ile uyumlu hale getirelim
        paddingVertical: 6,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginPrompt: {
        marginTop: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    promptText: {
        color: colors.textSecondary,
    },
});

export default RegisterScreen;