// src/screens/Profile/EditProfileScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Platform, TouchableOpacity } from 'react-native';
// YENİ: Icon bileşeni Paper'dan import edildi
import { Appbar, TextInput, Button, Avatar, ActivityIndicator, HelperText, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../services/supabase';
import colors from '../../../constants/colors';
import * as ImagePicker from 'expo-image-picker';
// FA5Style import'u kaldırıldı, kullanılmıyordu.

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form alanları için state'ler (değişiklik yok)
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [biography, setBiography] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // Ekran ilk açıldığında mevcut profil bilgilerini çek (değişiklik yok)
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

    // Kullanıcı adı temizleme fonksiyonu (değişiklik yok)
    const handleUsernameChange = (text) => {
        let cleanedText = text.toLowerCase();
        cleanedText = cleanedText.replace(/\s+/g,'');
        cleanedText = cleanedText.replace(/[^a-z0-9_]/g, '');
        setUsername(cleanedText);
    };

    // Fotoğraf seçme ve yükleme fonksiyonu (hataları düzeltildi)
    const pickImage = async () => {
        setUploading(true);
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted'){
                Alert.alert('İzin Gerekli', 'Üzgünüz, fotoğraf yükleyebilmeniz için iznine ihtiyacımız var.');
                setUploading(false); // İzin verilmezse yüklemeyi bitir
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (result.canceled) {
                setUploading(false); // İptal edilirse yüklemeyi bitir
                return;
            }

            const image = result.assets[0];
            const fileExt = image.uri.split('.').pop();
            // DÜZELTME: Doğru tırnak (`) ve büyük 'D' kullanıldı
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = fileName;

            const formData = new FormData();
            formData.append('file',{
                uri: image.uri,
                name: fileName,
                // DÜZELTME: Doğru tırnak (`) kullanıldı
                type: `image/${fileExt}`
            });

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, formData);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            if (data && data.publicUrl) {
                setAvatarUrl(data.publicUrl);
            }

        } catch (error) {
            Alert.alert("Fotoğraf yüklenemedi", error.message);
        } finally {
            setUploading(false);
        }
    };

    // Kaydetme fonksiyonu (değişiklik yok)
    const handleUpdateProfile = async () => {
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
                username: username.trim(),
                full_name: fullName.trim(),
                biography: biography.trim(),
                avatar_url: avatarUrl,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            
            if (error) {
                if (error.message.includes('duplicate key value violates unique constraint')) {
                    Alert.alert("Hata", "Bu kullanıcı adı zaten alınmış. Lütfen başka bir tane deneyin.");
                } else {
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
                <Button onPress={handleUpdateProfile} textColor={colors.accent} disabled={saving || uploading} loading={saving}>
                    Kaydet
                </Button>
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.content}>
                
                {/* DÜZELTME: Eksik '=' eklendi */}
                <TouchableOpacity onPress={pickImage} disabled={uploading} style={styles.avatarContainer}>
                    <Avatar.Image 
                        size={120} 
                        source={{ uri: avatarUrl || 'https://via.placeholder.com/150' }} 
                        // style prop'u gereksiz, container'dan geliyor
                    />
                    <View style={styles.avatarOverlay}>
                        {uploading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            // DÜZELTME: Icon bileşeni doğru kullanıldı
                            <Icon source="camera" size={32} color="#fff" />
                        )}
                    </View>
                </TouchableOpacity>
                
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

// Stillerin neredeyse aynı, sadece avatar'daki gereksiz stil kaldırıldı
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.surface },
    title: { fontWeight: 'bold' },
    content: { padding: 20, alignItems: 'center' },
    avatarContainer: { 
        position: 'relative',
        marginBottom: 20,
        borderRadius: 60,
        overflow: 'hidden',
    },
    avatarOverlay:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: { width: '100%', marginTop: 10 },
});

export default EditProfileScreen;