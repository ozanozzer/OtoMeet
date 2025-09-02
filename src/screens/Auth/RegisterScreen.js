import { View, StyleSheet, Alert, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { AuthService } from '../../services/AuthService';
import { supabase } from '../../services/supabase';

// Yeni renk paletimiz: Koyu, teknolojik ve odaklı.
const themeColors = {
    background: '#121212', // Zifiri siyaha yakın koyu gri
    surface: '#1E1E1E',    // Input gibi yüzeyler için biraz daha açık ton
    text: '#FFFFFF',
    textSecondary: '#A9A9A9',
    accent: '#E50914',      // Vurgu rengi (canlı bir kırmızı, stop lambası gibi)
    border: '#2C2C2C',
};

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleUsernameChange = (text) => {
        // 1. Metni küçük harfe dönüştür.
        let cleanedText = text.toLowerCase();

        // 2. Boşlukları kaldır.
        cleanedText = cleanedText.replace(/\s/g, '');

        // 3. Geçersiz karakterleri (_ hariç) kaldır.
        // İzin verilen karakterler: a-z, 0-9 ve _
        cleanedText = cleanedText.replace(/[^a-z0-9_]/g, '');

        setUsername(cleanedText);
        };

const handleRegister = async () => {
    if (!username || !email || !password) {
        Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
        return;
    }

    setLoading(true);
    try {
        // Profil ekleme kodu SİLİNDİ.
        // Username, options.data içine taşındı.
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username,
                    // Diğer profil verilerini de buraya ekleyebilirsiniz,
                    // örneğin: car_model: carModel
                }
            }
        });

        if (error) {
            Alert.alert('Kayıt Hatası', error.message);
            return;
        }
        
        // Tetikleyici geri kalanı hallettiği için burada başka bir işlem yapmaya gerek yok.
        Alert.alert(
            'Kaydınız alınmıştır',
            'Doğrulama için lütfen mail adresinizdeki bağlantıya tıklayın.'
        );

    } catch (error) {
        console.error("Beklenmedik Hata:", error);
        Alert.alert(
            'Bir şeyler ters gitti :(',
            'Lütfen daha sonra tekrar deneyiniz.'
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <View style={styles.container}>
            {/* Koyu tema için status bar'ı beyaz yapar */}
            <StatusBar barStyle="light-content" />

            <LottieView
                source={require('../../assets/animations/car_dashboard.json')} // Kendi dosya yolunuzu yazın
                autoPlay
                loop
                style={styles.lottie}
            />

            <Text variant="headlineLarge" style={styles.title}>
                Topluluğuna Katıl
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                Yeni bir hesap oluşturarak yolculuğa başla.
            </Text>

            <TextInput
                label="Kullanıcı Adı (Özel Karakter Kullanılmaz)"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                mode="outlined"
                autoCapitalize='none'
                textColor={themeColors.text}
                activeOutlineColor={themeColors.accent}
                outlineColor={themeColors.border}
                theme={{ colors: { onSurfaceVariant: themeColors.textSecondary } }}
                left={<TextInput.Icon icon="account-circle-outline" color={themeColors.textSecondary} />}
            />

            <TextInput
                label="E-posta"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                textColor={themeColors.text}
                activeOutlineColor={themeColors.accent}
                outlineColor={themeColors.border}
                theme={{ colors: { onSurfaceVariant: themeColors.textSecondary } }}
                left={<TextInput.Icon icon="email-outline" color={themeColors.textSecondary} />}
            />

            <TextInput
                label="Şifre"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                mode="outlined"
                secureTextEntry={secureTextEntry}
                textColor={themeColors.text}
                activeOutlineColor={themeColors.accent}
                outlineColor={themeColors.border}
                theme={{ colors: { onSurfaceVariant: themeColors.textSecondary } }}
                left={<TextInput.Icon icon="lock-outline" color={themeColors.textSecondary} />}
                right={
                    <TextInput.Icon
                        icon={secureTextEntry ? "eye-off" : "eye"}
                        color={themeColors.textSecondary}
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
                buttonColor={themeColors.accent}
            >
                Kaydol
            </Button>

            <View style={styles.loginPrompt}>
                <Text style={styles.promptText}>Zaten bir garajın var mı?</Text>
                <Button
                    mode="text"
                    onPress={() => navigation.navigate('Login')}
                    textColor={themeColors.accent}
                >
                    Giriş Yap
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: themeColors.background,
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
        color: themeColors.text,
        letterSpacing: 1, // Harfler arası boşluk tasarıma modern bir hava katar
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        color: themeColors.textSecondary,
    },
    input: {
        marginBottom: 12,
        backgroundColor: themeColors.surface,
    },
    button: {
        marginTop: 20,
        borderRadius: 8,
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
        color: themeColors.textSecondary,
    },
});

export default RegisterScreen;