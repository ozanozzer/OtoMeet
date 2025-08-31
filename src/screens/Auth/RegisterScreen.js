import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

// Yeni importlarımız
import colors from '../../constants/colors'; // Renk paletini import ediyoruz
import { AuthService } from '../../services/AuthService'; // Servisimizi import ediyoruz

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            // Veri kaydetme işini artık AuthService'e devrediyoruz.
            await AuthService.registerAndSaveToken();

            Alert.alert('Başarılı', 'Kaydınız başarıyla tamamlandı!', [
                {
                    text: 'Harika!',
                    onPress: () => navigation.replace('HomeScreen'),
                },
            ]);

        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Kayıt işlemi sırasında bir sorun oluştu.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hesap Oluştur</Text>

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
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Button title="Kayıt Ol" onPress={handleRegister} color={colors.primary} />

            <View style={styles.loginPrompt}>
                <Text style={styles.promptText}>Zaten bir hesabın var mı?</Text>
                {/* 'Giriş Yap' butonu bir link gibi davrandığı için textLink rengini kullanabiliriz */}
                <Button title="Giriş Yap" onPress={() => navigation.navigate('Login')} color={colors.textLink} />
            </View>
        </View>
    );
};

// Stil tanımlamalarını renk paletimize göre güncelliyoruz.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background, // Değişti
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: colors.text, // Değişti
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: colors.border, // Değişti
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: colors.surfaceLight, // Değişti
        fontSize: 16,
        color: colors.text, // Değişti
    },
    loginPrompt: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    promptText: {
        color: colors.textSecondary, // Değişti
    },
});

export default RegisterScreen;