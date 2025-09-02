// src/screens/Home/HomeScreen.js

import React from 'react';
// DEĞİŞİKLİK 1: `useSafeAreaInsets` hook'unu import ediyoruz
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

// Bileşenlerimizi dışarıdan çağırıyoruz
import HomeHeader from '../../components/home/HomeHeader';
import FilterBar from '../../components/home/FilterBar';
import PostCard from '../../components/home/PostCard';

const HomeScreen = () => {
    // DEĞİŞİKLİK 2: Hook'u çağırarak üst boşluğu alıyoruz
    const insets = useSafeAreaInsets();

    // Örnek gönderi verileri
    const feedData = [
        {
            id: 1,
            username: 'can_sahin',
            userAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
            timestamp: '2 saat önce',
            caption: 'Hafta sonu kaçamağı... Harika bir gündü! #bmw #m4 #carlife',
            postImage: 'https://i0.shbdn.com/photos/19/23/19/x5_1256192319ogz.jpg',
            likeCount: 356,
            commentCount: 42,
        },
        {
            id: 2,
            username: 'aylin_garage',
            userAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
            timestamp: 'Dün, 18:30',
            caption: 'Yeni canavar geldi! Sizce ilk modifiye ne olmalı? Fikirlerinizi bekliyorum. #audi #rs6',
            postImage: 'https://images.unsplash.com/photo-1617886322207-6f504e7472c5?w=500&q=80',
            likeCount: 1204,
            commentCount: 188,
        },
    ];

    return (
        // DEĞİŞİKLİK 3: Ana View'e dinamik paddingTop veriyoruz
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <HomeHeader />
            <FilterBar />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {feedData.map(post => <PostCard key={post.id} post={post} />)}
            </ScrollView>
        </View>
    );
};

// DEĞİŞİKLİK 4: Stil dosyasını güncelliyoruz
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Header'ın arka planıyla bütünleşik olması için surface (beyaz) yapıyoruz
        backgroundColor: colors.surface,
    },
    scrollContainer: {
        // Kartların olduğu alanın farklı renkte olması için background (gri) yapıyoruz
        backgroundColor: colors.background,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 120, // Alttaki navigasyon barının içeriği kapatmaması için
    },
});

export default HomeScreen;