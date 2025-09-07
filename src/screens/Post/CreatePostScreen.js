// src/screens/Post/CreatePostScreen.js

import { decode } from 'base-64';
if(typeof global.atob === 'undefined') {
  global.atob = decode;
}
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Appbar, TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import PagerView from 'react-native-pager-view'; // PagerView import'u
import { supabase } from '../../services/supabase';
import colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CreatePostScreen = () => {
    const navigation = useNavigation();
    // DEĞİŞİKLİK: 'imageUri' yerine 'images' dizisi kullanıyoruz
    const [images, setImages] = useState([]); 
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const pagerRef = useRef(null);
    const CAPTION_MAX_LENGTH = 280;

    const pickImage = async () => {
        let permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
                Alert.alert('İzin Gerekli', 'Gönderi oluşturmak için galeri iznine ihtiyacımız var.');
                return;
            }
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // 'MediaTypeOptions' kullanıyoruz
                quality: 0.7,
                allowsMultipleSelection: true,
                selectionLimit: 5,
                base64: true,
            });

            if (!result.canceled) {
                // 'imageUri' yerine 'images' state'ini güncelliyoruz
                setImages(result.assets); 
            }
        } catch (error) {
            console.error("Galeri açma hatası:", error);
            Alert.alert("Hata", "Galeri açılırken bir sorun oluştu.");
        }
    };

    // DEĞİŞİKLİK: handleShare fonksiyonu çoklu fotoğraf yükleyecek şekilde güncellendi
    const handleShare = async () => {
        if (images.length === 0) {
            Alert.alert("Hata", "Lütfen bir fotoğraf seçin.");
            return;
        }
        setUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Kullanıcı bulunamadı.");

            const imageUrls = [];

            for (const image of images) {
                const fileExt = image.uri.split('.').pop();
                const fileName = `${user.id}_${Date.now()}_${Math.random()}.${fileExt}`;
                
                // Fetch ve Blob'u SİLİYORUZ.
                // Artık direkt base64 metnini kullanıyoruz.
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('posts')
                    .upload(fileName, decode(image.base64), { // 'decode' fonksiyonu base64'ü Supabase'in anlayacağı hale getirir
                        contentType: `image/${fileExt}`
                    });

                if (uploadError) throw uploadError;
                
                const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(uploadData.path);
                imageUrls.push(publicUrl);
            }
            
            const { error: insertError } = await supabase
                .from('posts')
                .insert({
                    user_id: user.id,
                    image_url: imageUrls[0],
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
                <Appbar.Action icon="close" onPress={() => navigation.goBack()} />
                <Appbar.Content title="Yeni Gönderi" titleStyle={{ fontWeight: 'bold' }} />
                <Button onPress={handleShare} disabled={uploading || images.length === 0} loading={uploading} mode="contained" style={{borderRadius: 20}}>
                    Paylaş
                </Button>
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.imageContainer}>
                    {images.length > 0 ? (
                        <PagerView 
                            style={styles.pagerView} 
                            initialPage={0} 
                            ref={pagerRef}
                            onPageSelected={e => setActiveIndex(e.nativeEvent.position)}
                        >
                            {images.map((image, index) => (
                                <View key={index}>
                                    <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                                </View>
                            ))}
                        </PagerView>
                    ) : (
                        <TouchableOpacity onPress={pickImage} style={styles.placeholder}>
                            <Ionicons name="images-outline" size={64} color={colors.textSecondary} />
                            <Text style={styles.placeholderText}>Galeriden Seç</Text>
                        </TouchableOpacity>
                    )}

                    {images.length > 0 && (
                        <TouchableOpacity onPress={pickImage} style={styles.retakeButton}>
                            <Ionicons name="camera-reverse" size={18} color="white" />
                        </TouchableOpacity>
                    )}
                    {images.length > 1 && (
                        <View style={styles.pageIndicator}>
                            <Text style={styles.pageIndicatorText}>{activeIndex + 1} / {images.length}</Text>
                        </View>
                    )}
                </View>

                <View>
                    <TextInput
                        label="Bir şeyler yaz..."
                        value={caption}
                        onChangeText={setCaption}
                        mode="flat"
                        multiline
                        style={styles.captionInput}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        maxLength={CAPTION_MAX_LENGTH}
                    />
                    <Text style={styles.characterCount}>
                        {caption.length} / {CAPTION_MAX_LENGTH}
                    </Text>
                </View>
            </ScrollView>
            
            {uploading && (
                <View style={styles.uploadingOverlay}>
                    <ActivityIndicator animating={true} color={colors.textLight} size="large" />
                    <Text style={styles.uploadingText}>Paylaşılıyor...</Text>
                </View>
            )}
        </View>
    );
};

// --- STİLLER DE TAMAMEN MODERNLEŞTİRİLDİ ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.surface, elevation: 0 },
    content: { padding: 16 },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    pagerView: { width: '100%', height: '100%' },
    imagePreview: { width: '100%', height: '100%' },
    placeholder: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
    placeholderText: { marginTop: 8, color: colors.textSecondary, fontSize: 16 },
    retakeButton: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
    },
    pageIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    pageIndicatorText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    captionInput: { backgroundColor: colors.surface, fontSize: 16, minHeight: 120 },
    characterCount: { textAlign: 'right', color: colors.textSecondary, fontSize: 12, marginTop: 4, marginRight: 8 },
    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadingText: { marginTop: 16, color: colors.textLight, fontSize: 18, fontWeight: 'bold' },
});

export default CreatePostScreen;