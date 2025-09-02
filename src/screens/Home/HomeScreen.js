// src/screens/Home/HomeScreen.js

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

// Bileşenlerimizi dışarıdan çağırıyoruz
import HomeHeader from '../../components/HomeHeader';
import FilterBar from '../../components/FilterBar';
import PostCard from '../../components/PostCard';

const HomeScreen = () => {
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
        <View style={styles.safeArea}>
            <HomeHeader />
            <FilterBar />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {feedData.map(post => <PostCard key={post.id} post={post} />)}
            </ScrollView>
        </View>
    );
};

// Artık sadece bu ekrana ait stiller burada
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 1,
    },
    scrollContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 100, // Alttaki navigasyon barının içeriği kapatmaması için
    },
});

export default HomeScreen;