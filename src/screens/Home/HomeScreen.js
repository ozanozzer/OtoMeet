// src/screens/Home/HomeScreen.js

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// useFocusEffect artık kullanılmıyor, silebilirsin.
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
    const [activeTab, setActiveTab] = useState('following');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setCurrentUser(user);
        });
    }, []);

    // --- DEĞİŞİKLİK: fetchFeed artık parametre almıyor, activeTab state'ini kullanıyor ---
    const fetchFeed = async () => {
        // ÖNCE, 'activeTab'in o anki değerini alalım
        const currentTab = activeTab;
        const functionName = currentTab === 'following' ? 'get_feed_posts' : 'get_explore_posts';

        try {
            // Promise.all ile iki isteği AYNI ANDA gönderelim, daha hızlı!
            const [profileRes, feedRes] = await Promise.all([
                supabase.auth.getUser(),
                supabase.rpc(functionName, { page: 1, page_size: 10 })
            ]);

            // 1. Profil fotoğrafı sonucunu işle
            const user = profileRes.data?.user;
            if (user) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('avatar_url')
                    .eq('id', user.id)
                    .single();
                if (profileError) throw profileError;
                setCurrentUserProfile(profileData);
            } else {
                setCurrentUserProfile(null);
            }

            // 2. Akış gönderileri sonucunu işle
            if (feedRes.error) throw feedRes.error;
            setFeedData(feedRes.data || []);

        } catch (error) {
            Alert.alert("Hata", "Ana akış yüklenirken bir sorun oluştu.");
            console.error("Akış Hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    // DEĞİŞİKLİK: useEffect'in fetchFeed'i doğru çağırdığından emin ol
    useEffect(() => {
        setLoading(true);
        // fetchFeed artık parametre almıyor, en üstteki 'activeTab' state'ini kullanıyor
        fetchFeed();
    }, [activeTab]); // 'activeTab' değiştiğinde bu fonksiyon yeniden çalışır

    const handleLikeToggle = useCallback(async (postId, isCurrentlyLiked) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. İyimser Güncelleme: Arayüzü anında değiştir
        setFeedData(currentFeed => 
            currentFeed.map(post => {
                if (post.id === postId) {
                    return { 
                        ...post, 
                        is_liked_by_user: !isCurrentlyLiked, 
                        like_count: post.like_count + (isCurrentlyLiked ? -1 : 1) 
                    };
                }
                return post;
            })
        );

        // 2. Veritabanı İşlemi: Arka planda Supabase'e isteği gönder
        try {
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
            // 3. Hata olursa: Yaptığın iyimser güncellemeyi geri al
            setFeedData(currentFeed => 
                currentFeed.map(post => {
                    if (post.id === postId) {
                        return { 
                            ...post, 
                            is_liked_by_user: isCurrentlyLiked, 
                            like_count: post.like_count 
                        };
                    }
                    return post;
                })
            );
            Alert.alert("Hata", "Beğeni işlemi sırasında bir sorun oluştu.");
        }
    }, []); // useCallback ile sarmaladık

    if (loading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {/* DÜZELTME: stackNavigation prop'u eklendi */}
                <HomeHeader userAvatar={currentUserProfile?.avatar_url} stackNavigation={stackNavigation} /> 
                <FilterBar activeTab={activeTab} onTabChange={setActiveTab} />
                <View style={styles.center}>
                    <ActivityIndicator color={colors.accent} />
                </View>
            </View>
        );
    }
    
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
             <HomeHeader userAvatar={currentUserProfile?.avatar_url} stackNavigation={stackNavigation} />
             {/* DÜZELTME: FilterBar'a proplar gönderildi */}
            <FilterBar activeTab={activeTab} onTabChange={setActiveTab} />
            
            <FlatList
                data={feedData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const postCardProps = {
                        id: item.id,
                        userId: item.user_id,
                        username: item.username,
                        userAvatar: item.avatar_url,
                        timestamp: item.created_at,
                        caption: item.caption,
                        postImage: item.image_url,
                        likeCount: item.like_count || 0,
                        isLiked: item.is_liked_by_user,
                        commentCount: item.comment_count || 0,
                    };

                    return <PostCard 
                                post={postCardProps} 
                                onLikeToggle={handleLikeToggle}
                                currentUser={currentUser} 
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