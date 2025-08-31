import { View, Text, StyleSheet, Button, Alert, SafeAreaView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthService } from '../../services/AuthService';
import colors from '../../constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProfileScreen = () => {
    const navigation = useNavigation();

    const handleLogout = () => {
        // Kullanıcıya emin olup olmadığını soralım (iyi bir kullanıcı deneyimi için önemlidir)
        Alert.alert(
            "Çıkış Yap",
            "Çıkış yapmak istediğinize emin misiniz?",
            [
                {
                    text: "İptal",
                    style: "cancel"
                },
                {
                    text: "Evet, Çıkış Yap",
                    onPress: async () => {
                        try {
                            await AuthService.logout();
                            // Çıkış başarılı olursa, navigasyon geçmişini sıfırlayıp Login ekranına atıyoruz.
                            // Bu, kullanıcının 'geri' tuşuyla tekrar profil ekranına dönmesini engeller.
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (error) {
                            Alert.alert("Hata", "Çıkış işlemi sırasında bir sorun oluştu.");
                        }
                    },
                    style: 'destructive' // iOS'te metni kırmızı yapar
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.profileHeader}>
                    <Ionicons name="person-circle-outline" size={100} color={colors.text} />
                    <Text style={styles.emailText}>kullanici@email.com</Text>
                    <Text style={styles.nameText}>Kullanıcı Adı</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Çıkış Yap"
                        onPress={handleLogout}
                        color={colors.error} // Çıkış butonu için hata rengini kullanmak yaygındır
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 50,
    },
    emailText: {
        fontSize: 18,
        color: colors.text,
        fontWeight: '600',
        marginTop: 15,
    },
    nameText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 5,
    },
    buttonContainer: {
        width: '80%',
    }
});

export default ProfileScreen;