import { View, StyleSheet, Alert, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { AuthService } from '../../services/AuthService';
import { supabase } from '../../services/supabase';
import colors from '../../constants/colors'; // <-- DEĞİŞİKLİK: Renkler artık merkezi dosyadan geliyor.

const RegisterScreen = () => {
    // --- BU BÖLÜMDEKİ HİÇBİR KODA DOKUNULMADI ---
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleUsernameChange = (text) => {
        let cleanedText = text.toLowerCase();
        cleanedText = cleanedText.replace(/\s/g, '');
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
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                    }
                }
            });

            if (error) {
                Alert.alert('Kayıt Hatası', error.message);
                return;
            }
            
            Alert.alert(
                'Kaydınız alınmıştır',
                'Doğrulama için lütfen mail adresinizdeki bağlantıya tıklayın.',
                [
                    {
                        text:'Giriş Yap',
                        onPress: () => navigation.replace('Login'),
                    }
                ]
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
    // --- MANTIK KODLARI BİTİŞİ ---

// ... importlar ve fonksiyonların (handleRegister vb.) aynı kalıyor ...

    return (
        <View style={styles.container}>
            {/* AÇIK TEMA İÇİN: Status bar ikonlarını siyaha çevirir */}
            <StatusBar barStyle="dark-content" />

            <LottieView
                source={require('../../assets/animations/car_dashboard.json')}
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
                label="Kullanıcı Adı"
                value={username}
                onChangeText={handleUsernameChange}
                style={styles.input}
                mode="outlined"
                autoCapitalize='none'
                textColor={colors.text} // BEYAZ TEMAYA UYUMLU RENKLER
                activeOutlineColor={colors.accent}
                outlineColor={colors.border}
                theme={{ 
                    roundness: 12,
                    colors: { onSurfaceVariant: colors.textSecondary } 
                }}
                left={<TextInput.Icon icon="account-circle-outline" color={colors.textSecondary} />}
            />

             <TextInput
                label="E-posta"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                textColor={colors.text} // BEYAZ TEMAYA UYUMLU RENKLER
                activeOutlineColor={colors.accent}
                outlineColor={colors.border}
                theme={{ 
                    roundness: 12,
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
                textColor={colors.text} // BEYAZ TEMAYA UYUMLU RENKLER
                activeOutlineColor={colors.accent}
                outlineColor={colors.border}
                theme={{ 
                    roundness: 12,
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
                labelStyle={styles.buttonLabel} // Buton yazı rengi buradan ayarlanıyor
                loading={loading}
                disabled={loading}
                icon="arrow-right-bold-circle"
                buttonColor={colors.accent}
            >
                Kaydol
            </Button>

            <View style={styles.loginPrompt}>
                <Text style={styles.promptText}>Zaten bir garajın var mı?</Text>
                <Button
                    mode="text"
                    onPress={() => navigation.navigate('Login')}
                    textColor={colors.accent}
                >
                    Giriş Yap
                </Button>
            </View>
        </View>
    );
};

// --- STYLESHEET, BEYAZ TEMAYA UYGUN HALE GETİRİLDİ ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: colors.background, // Açık tema arka planı
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
        color: colors.text, // Açık tema metin rengi (siyah)
        letterSpacing: 1,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        color: colors.textSecondary, // Açık tema ikincil metin rengi (gri)
    },
    input: {
        marginBottom: 12,
        backgroundColor: colors.surface, // Açık tema yüzey rengi (beyaz)
    },
    button: {
        marginTop: 20,
        borderRadius: 30,
        paddingVertical: 6,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textLight, // Buton içindeki yazının beyaz olmasını sağlar
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