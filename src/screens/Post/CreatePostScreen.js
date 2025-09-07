// src/screens/Post/CreatePostScreen.js

import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Appbar, TextInput, Button, Text, ActivityIndicator, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import PagerView from 'react-native-pager-view'; // Çoklu fotoğraf için
import { supabase } from '../../services/supabase';
import colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CreatePostScreen = () => {
    const navigation = useNavigation();
    const [images, setImages] = useState([]); // Artık tek bir URI değil, bir dizi
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const pagerRef = useRef(null);
    const CAPTION_MAX_LENGTH = 280; // Twitter gibi

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { /* ... aynı ... */ return; }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.7,
            // YENİ: Birden fazla fotoğraf seçimine izin ver
            allowsMultipleSelection: true, 
            selectionLimit: 5, // En fazla 5 fotoğraf
        });

        if (!result.canceled) {
            setImages(result.assets); // Gelen asset dizisini state'e ata
        }
    };

    const handleShare = async () => {
        if (images.length === 0) { /* ... aynı ... */ return; }
        setUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Kullanıcı bulunamadı.");

            // Yüklenecek tüm dosya yollarını ve URL'lerini tutacak bir dizi
            const imageUrls = [];

            // Seçilen her bir fotoğrafı sırayla yükle
            for (const image of images) {
                const fileExt = image.uri.split('.').pop();
                const fileName = `${user.id}_${Date.now()}_${Math.random()}.${fileExt}`;
                const response = await fetch(image.uri);
                const blob = await response.blob();

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('posts')
                    .upload(fileName, blob, { contentType: `image/${fileExt}` });

                if (uploadError) throw uploadError;
                
                const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(uploadData.path);
                imageUrls.push(publicUrl);
            }
            
            // Veriyi 'posts' tablosuna kaydet
            // Not: image_url sütununun tipi 'text[]' (text dizisi) olmalı
            const { error: insertError } = await supabase
                .from('posts')
                .insert({
                    user_id: user.id,
                    image_url: imageUrls[0], // Şimdilik sadece ilk fotoğrafı ana URL olarak kaydediyoruz
                    // İleride 'image_urls' adında text[] bir sütun oluşturulabilir
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
                <Appbar.Content title="Yeni Gönderi" titleStyle={styles.headerTitle} />
                <Button onPress={handleShare} disabled={uploading || images.length === 0} loading={uploading} mode="contained" style={styles.shareButton}>
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
            
            {/* --- İŞTE DÜZELTİLMİŞ BLOK --- */}
            {uploading && (
                <View style={styles.uploadingOverlay}>
                    <ActivityIndicator animating={true} color={colors.textLight} size="large" />
                    <Text style={styles.uploadingText}>Paylaşılıyor...</Text>
                </View>
            )}
        </View>
    );
};

// --- STİLLER TAMAMEN AYNI, HİÇBİR DEĞİŞİKLİK YOK ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.surface, elevation: 0 },
    headerTitle: { fontWeight: 'bold' },
    shareButton: { borderRadius: 20 },
    content: { padding: 16 },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagerView: {
        width: '100%',
        height: '100%',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    placeholder: { alignItems: 'center' },
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
    pageIndicatorText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    captionInput: {
        backgroundColor: colors.surface,
        fontSize: 16,
        minHeight: 120,
    },
    characterCount: {
        textAlign: 'right',
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: 4,
        marginRight: 8,
    },
    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadingText: {
        marginTop: 16,
        color: colors.textLight,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CreatePostScreen;