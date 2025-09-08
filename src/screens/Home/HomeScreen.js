// src/screens/Home/HomeScreen.js

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, Text } from 'react-native'; // Text import'u eklendi
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; // useNavigation eklendi
import { ActivityIndicator } from 'react-native-paper';

import colors from '../../constants/colors';
import { supabase } from '../../services/supabase';

import HomeHeader from '../../components/home/HomeHeader';
import FilterBar from '../../components/home/FilterBar';
import PostCard from '../../components/home/PostCard';

const HomeScreen = ({ stackNavigation }) => {
    const insets = useSafeAreaInsets();

    const [feedData, setFeedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);

    const fetchFeed = async () => {
        try {
            // Önce mevcut kullanıcının profilini çek (Header'daki fotoğraf için)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('avatar_url')
                    .eq('id', user.id)
                    .single();
                if (profileError) throw profileError;
                setCurrentUserProfile(profileData);
            }

            // Şimdi ana akış gönderilerini çek
            const { data, error } = await supabase.rpc('get_feed_posts', {
                page: 1, 
                page_size: 10
            });

            if (error) throw error;
            setFeedData(data || []);

        } catch (error) {
            Alert.alert("Hata", "Ana akış yüklenirken bir sorun oluştu.");
            console.error("Akış Hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    // HomeScreen.js içinde

const handleLikeToggle = async (postId, isCurrentlyLiked) => {
    // 1. ADIM: Arayüzü ANINDA güncelle (İyimser Güncelleme)
    setFeedData(currentFeed => 
        currentFeed.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    is_liked_by_user: !isCurrentlyLiked, // Beğeni durumunu tersine çevir
                    like_count: isCurrentlyLiked ? post.like_count - 1 : post.like_count + 1 // Sayıyı artır/azalt
                };
            }
            return post;
        })
    );

    // 2. ADIM: Arka planda veritabanı işlemini yap
    try {
        const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                if (isCurrentlyLiked) {
                    // Beğeniyi geri al
                    const { error } = await supabase.from('likes').delete().match({ post_id: postId, user_id: user.id });
                    if (error) throw error;
                } else {
                    // Beğen
                    const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
                    if (error) throw error;
                }
            } catch (error) {
                console.error("Beğeni hatası:", error);
                // 3. ADIM: Eğer hata olursa, yaptığın iyimser güncellemeyi geri al
                setFeedData(currentFeed => 
                    currentFeed.map(post => {
                        if (post.id === postId) {
                            return {
                                ...post,
                                is_liked_by_user: isCurrentlyLiked, // Durumu eski haline getir
                                like_count: isCurrentlyLiked ? post.like_count + 1 : post.like_count - 1 // Sayıyı eski haline getir
                            };
                        }
                        return post;
                    })
                );
                Alert.alert("Hata", "Beğeni işlemi sırasında bir sorun oluştu.");
            }
            // 'fetchFeed()' ÇAĞRISINI BURADAN KALDIRDIK!
        };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchFeed();
        }, [])
    );

    if (loading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {/* Artık navigation göndermiyoruz */}
                <HomeHeader userAvatar={null} /> 
                <FilterBar />
                <View style={styles.center}>
                    <ActivityIndicator color={colors.accent} />
                </View>
            </View>
        );
    }
    
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* HomeHeader'a artık kullanıcının avatarını prop olarak geçiyoruz */}
             <HomeHeader userAvatar={currentUserProfile?.avatar_url} stackNavigation={stackNavigation} />
            <FilterBar />
            
            <FlatList
                data={feedData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const postCardProps = {
                        id: item.id,
                        username: item.username,
                        userAvatar: item.avatar_url,
                        timestamp: item.created_at,
                        caption: item.caption,
                        postImage: item.image_url,
                        // Veritabanından gelen yeni verileri ekliyoruz
                        likeCount: item.like_count || 0, // null ise 0 göster
                        isLiked: item.is_liked_by_user,
                        commentCount: item.comment_count || 0, // null ise 0 göster


                    };

                return <PostCard post={postCardProps} 
                    onLikeToggle={handleLikeToggle}
                />;
                    }}

                    contentContainerStyle={styles.scrollContainer}
                    ListEmptyComponent={() => (
                    <View style={styles.center}>
                    <Text style={styles.emptyText}>Takip ettiğin kimse yok veya henüz gönderi paylaşmadılar.</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    scrollContainer: {
        backgroundColor: colors.background,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 120,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 20,
    }
});

export default HomeScreen;