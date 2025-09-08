// src/screens/Home/HomeScreen.js

import React, { useState, useCallback, useEffect } from 'react'; // useEffect eklendi
import { View, StyleSheet, FlatList, Alert, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
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

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setCurrentUser(user);
        });
    }, []);


    const fetchFeed = async () => {
        try {
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

    const handleLikeToggle = async (postId, isCurrentlyLiked) => {
        setFeedData(currentFeed => 
            currentFeed.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        is_liked_by_user: !isCurrentlyLiked,
                        like_count: isCurrentlyLiked ? post.like_count - 1 : post.like_count + 1
                    };
                }
                return post;
            })
        );

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (isCurrentlyLiked) {
                const { error } = await supabase.from('likes').delete().match({ post_id: postId, user_id: user.id });
                if (error) throw error;
            } else {
                const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
                if (error) throw error;
            }
        } catch (error) {
            console.error("Beğeni hatası:", error);
            setFeedData(currentFeed => 
                currentFeed.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            is_liked_by_user: isCurrentlyLiked,
                            like_count: isCurrentlyLiked ? post.like_count + 1 : post.like_count - 1
                        };
                    }
                    return post;
                })
            );
            Alert.alert("Hata", "Beğeni işlemi sırasında bir sorun oluştu.");
        }
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
                {/* DÜZELTME 3: stackNavigation prop'u eklendi */}
                <HomeHeader userAvatar={null} stackNavigation={stackNavigation} /> 
                <FilterBar />
                <View style={styles.center}>
                    <ActivityIndicator color={colors.accent} />
                </View>
            </View>
        );
    }
    
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
             <HomeHeader userAvatar={currentUserProfile?.avatar_url} stackNavigation={stackNavigation} />
            <FilterBar />
            
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

                    // DÜZELTME 2: Fazladan 'currentUser' prop'u kaldırıldı
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