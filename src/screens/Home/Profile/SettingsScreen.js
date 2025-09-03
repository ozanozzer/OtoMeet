// src/screens/Profile/SettingsScreen.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Title, List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../constants/colors';

const SettingsScreen = () => {
    const navigation = useNavigation();

    // Çıkış yapma fonksiyonunu ProfilScreen'den buraya da taşıyabiliriz
    // veya bir Auth servisi üzerinden yönetebiliriz. Şimdilik placeholder.
    const handleLogout = () => {
        // ProfilScreen'deki handleLogout mantığı buraya gelecek
        console.log("Çıkış yap butonuna basıldı!");
        navigation.replace('Login'); // Örnek yönlendirme
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={colors.text} />
                <Appbar.Content title="Ayarlar" titleStyle={styles.title} />
            </Appbar.Header>

            <View style={styles.content}>
                <List.Section>
                    <List.Item
                        title="Profili Düzenle"
                        left={props => <List.Icon {...props} icon="account-edit-outline" />}
                        onPress={() => console.log('Profili Düzenle')}
                    />
                    <List.Item
                        title="Şifre Değiştir"
                        left={props => <List.Icon {...props} icon="lock-reset" />}
                        onPress={() => console.log('Şifre Değiştir')}
                    />
                    <List.Item
                        title="Bildirimler"
                        left={props => <List.Icon {...props} icon="bell-outline" />}
                        onPress={() => console.log('Bildirimler')}
                    />
                </List.Section>
                
                <Divider />

                <List.Section>
                    <List.Item
                        title="Çıkış Yap"
                        titleStyle={{ color: colors.error }} // Kırmızı renk
                        left={props => <List.Icon {...props} icon="logout" color={colors.error} />}
                        onPress={handleLogout}
                    />
                </List.Section>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.surface,
    },
    title: {
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 8,
    },
});

export default SettingsScreen;