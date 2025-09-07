import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../services/supabase'; // Kendi dosya yolunu kontrol et
import colors from '../../constants/colors';

const CreatePostScreen = () => {
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState(null);
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('İzin Gerekli', 'Gönderi oluşturmak için galeri iznine ihtiyacımız var.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleShare = async () => {
        if (!imageUri) {
            Alert.alert("Hata", "Lütfen bir fotoğraf seçin.");
            return;
        }
        setUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Kullanıcı bulunamadı.");

            const fileExt = imageUri.split('.').pop();
            const fileName = `${user.id}_${Date.now()}.${fileExt}`;
            
            // Expo Image Picker'dan gelen URI, fetch ile Blob'a çevrilmeli
            const response = await fetch(imageUri);
            const blob = await response.blob();
            
            // Fotoğrafı Storage'a yükle
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('posts')
                .upload(fileName, blob, { contentType: `image/${fileExt}` });

            if (uploadError) throw uploadError;

            // Yüklenen fotoğrafın URL'ini al
            const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(uploadData.path);
            
            // Veriyi 'posts' tablosuna kaydet
            const { error: insertError } = await supabase
                .from('posts')
                .insert({
                    user_id: user.id,
                    image_url: publicUrl,
                    caption: caption.trim()
                });
            
            if (insertError) throw insertError;
            
            Alert.alert("Başarılı", "Gönderin paylaşıldı!");
            navigation.goBack();

        } catch (error) {
            Alert.alert("Hata", "Gönderi paylaşılırken bir sorun oluştu.");
            console.error("Paylaşım Hatası:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Yeni Gönderi" />
                <Button onPress={handleShare} disabled={uploading} loading={uploading}>
                    Paylaş
                </Button>
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text>Fotoğraf Seçmek İçin Dokun</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput
                    label="Açıklama yaz..."
                    value={caption}
                    onChangeText={setCaption}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={styles.captionInput}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.surface },
    content: { padding: 16 },
    imageContainer: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    captionInput: {
        backgroundColor: colors.surface,
    },
});

export default CreatePostScreen;