// src/screens/Profile/EditProfileScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, Avatar, ActivityIndicator, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../services/supabase';
import colors from '../../../constants/colors';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form alanları için state'ler
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [biography, setBiography] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // Ekran ilk açıldığında mevcut profil bilgilerini çek
    useEffect(() => {
        const getProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Kullanıcı bulunamadı.");

                const { data, error } = await supabase
                    .from('profiles')
                    .select(`username, full_name, avatar_url, biography`)
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (data) {
                    setUsername(data.username || '');
                    setFullName(data.full_name || '');
                    setBiography(data.biography || '');
                    setAvatarUrl(data.avatar_url || '');
                }
            } catch (error) {
                Alert.alert("Hata", "Profil bilgileri yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };
        getProfile();
    }, []);

    const handleUsernameChange = (text) => {
        //gelen metni küçük harfe çevirtiyorum
        let cleanedText = text.toLowerCase();

        //boşlukları kaldırtan kısım
        cleanedText = cleanedText.replace(/\s+/g,'');

        cleanedText = cleanedText.replace(/[^a-z0-9_]/g, '');

        setUsername(cleanedText);
    }

    // "Kaydet" butonuna basıldığında çalışacak fonksiyon
    // EditProfileScreen.js içinde

const handleUpdateProfile = async () => {
    // Kullanıcı adının boş olup olmadığını kontrol et
    if (!username.trim()) {
        Alert.alert("Hata", "Kullanıcı adı boş bırakılamaz.");
        return;
    }

    setSaving(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Kullanıcı bulunamadı.");

        const updates = {
            id: user.id,
            username: username.trim(), // Boşlukları temizle
            full_name: fullName.trim(),
            biography: biography.trim(),
            avatar_url: avatarUrl,
            updated_at: new Date(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        
        // YENİ VE AKILLI HATA KONTROLÜ
        if (error) {
            // Eğer hata "duplicate key" (zaten var olan anahtar) hatasıysa,
            // bunun sebebi %99 ihtimalle kullanıcı adının başkası tarafından alınmış olmasıdır.
            if (error.message.includes('duplicate key value violates unique constraint')) {
                Alert.alert("Hata", "Bu kullanıcı adı zaten alınmış. Lütfen başka bir tane deneyin.");
            } else {
                // Diğer tüm hatalar için genel mesaj
                throw error;
            }
        } else {
            Alert.alert("Başarılı", "Profilin güncellendi!");
            navigation.goBack();
        }

        } catch (error) {
            Alert.alert("Hata", "Profil güncellenirken bir sorun oluştu.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} animating={true} color={colors.accent} />;
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={colors.text} />
                <Appbar.Content title="Profili Düzenle" titleStyle={styles.title} />
                <Button onPress={handleUpdateProfile} textColor={colors.accent} disabled={saving} loading={saving}>
                    Kaydet
                </Button>
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.content}>
                <Avatar.Image 
                    size={120} 
                    source={{ uri: avatarUrl || 'https://via.placeholder.com/150' }} 
                    style={styles.avatar}
                />
                
                <TextInput
                    label="Kullanıcı Adı"
                    value={username}
                    onChangeText={handleUsernameChange}
                    style={styles.input}
                    mode="outlined"
                    autoCapitalize='none'
                />
                <HelperText type='info'>
                    Sadece küçük harf, rakam ve _ kullanabilirsiniz
                </HelperText>

                <TextInput
                    label="Tam Adınız"
                    value={fullName}
                    onChangeText={setFullName}
                    style={styles.input}
                    mode="outlined"
                />
                <TextInput
                    label="Biyografi"
                    value={biography}
                    onChangeText={setBiography}
                    style={styles.input}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.surface },
    title: { fontWeight: 'bold' },
    content: { padding: 20, alignItems: 'center' },
    avatar: { marginBottom: 20 },
    input: { width: '100%', marginTop: 10 },
});

export default EditProfileScreen;