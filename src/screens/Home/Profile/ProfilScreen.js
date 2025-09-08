// src/screens/Home/Profile/ProfilScreen.js

import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, Dimensions, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Text, Button, ActivityIndicator, Divider, Title, Paragraph, IconButton } from 'react-native-paper';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { supabase } from '../../../services/supabase';
import colors from '../../../constants/colors';

const { width } = Dimensions.get('window');
const postSize = width / 3;

// --- DÜZELTME 1: PostItem'ı doğru prop'u kullanacak şekilde güncelle ---
const PostItem = ({ post }) => (
    <TouchableOpacity style={styles.postItem}>
        {/* Supabase'den 'image_url' gelir, 'image' değil */}
        <Image source={{ uri: post.image_url }} style={styles.postImage} />
    </TouchableOpacity>
);

const ProfilScreen = () => {
    const route = useRoute();
    const userId = route.params?.userId;

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const [userPosts, setUserPosts] = useState([]);

    // --- DÜZELTME 2: fetchProfile fonksiyonu güncellendi ---
    const fetchProfile = useCallback(async () => {
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            const userToFetchId = userId || currentUser?.id;

            if (!userToFetchId) throw new Error("Kullanıcı ID bulunamadı.");

            setIsMyProfile(userToFetchId === currentUser?.id);

            // Promise.all ile tüm sorguları aynı anda gönder, daha hızlı
            const [profileRes, postsRes, followersRes, followingRes, followingStatusRes] = await Promise.all([
                supabase.from('profiles').select(`id, username, full_name, avatar_url, biography`).eq('id', userToFetchId).single(),
                supabase.from('posts').select('id, image_url').eq('user_id', userToFetchId).order('created_at', { ascending: false }),
                supabase.from('followers').select('*', { count: 'exact', head: true }).eq('following_id', userToFetchId),
                supabase.from('followers').select('*', { count: 'exact', head: true }).eq('follower_id', userToFetchId),
                !isMyProfile && currentUser ? supabase.from('followers').select('id').eq('follower_id', currentUser.id).eq('following_id', userToFetchId) : Promise.resolve({ data: [] })
            ]);
            
            if (profileRes.error && profileRes.error.code !== 'PGRST116') throw profileRes.error;
            setProfile(profileRes.data);

            if (postsRes.error) throw postsRes.error;
            setUserPosts(postsRes.data || []);

            setFollowerCount(followersRes.count || 0);
            setFollowingCount(followingRes.count || 0);
            
            if (followingStatusRes.data) {
                setIsFollowing(followingStatusRes.data.length > 0);
            }

        } catch (error) {
            Alert.alert('Hata', 'Profil bilgileri yüklenemedi: ' + error.message);
            setProfile(null);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId, isMyProfile]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchProfile();
        }, [fetchProfile])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProfile();
    }, [fetchProfile]);

    const handleFollow = async () => {
        if (!profile || isFollowing) return;
        setIsFollowLoading(true);
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            await supabase.from('followers').insert({
                follower_id: currentUser.id,
                following_id: profile.id
            });
            setIsFollowing(true);
            setFollowerCount(prev => prev + 1);
        } catch (error) {
            Alert.alert("Hata", "Takip etme işlemi başarısız oldu.");
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleUnfollow = async () => {
        if (!profile || !isFollowing) return;
        setIsFollowLoading(true);
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            await supabase.from('followers')
                .delete()
                .eq('follower_id', currentUser.id)
                .eq('following_id', profile.id);
            setIsFollowing(false);
            setFollowerCount(prev => prev - 1);
        } catch (error) {
            Alert.alert("Hata", "Takibi bırakma işlemi başarısız oldu.");
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleSendMessage = async (targetUserId) => {
        try {
            if (!targetUserId) throw new Error("Profil ID bulunamadı.");
            const { data, error } = await supabase.rpc('create_conversation', {
                other_user_id: targetUserId
            }).single();

            if (error) throw error;
            
            navigation.navigate('ChatScreen', {
                conversationId: data.conversation_id,
                otherUserName: data.other_user_name || profile.username,
                otherUserAvatar: data.other_user_avatar
            });

        } catch (error) {
            console.error("SOHBET BAŞLATMA HATASI: ", error);
            Alert.alert('Hata', 'Sohbet başlatılırken bir sorun oluştu');
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator color={colors.accent} size="large" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text>Profil Bilgileri Bulunamadı</Text>
            </View>
        );
    }

    // --- DÜZELTME 3: Sahte 'userPosts' dizisi TAMAMEN SİLİNDİ ---
    
    const ListHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.profileInfo}>
                <Avatar.Image 
                    size={90} 
                    source={{ uri: profile.avatar_url || 'https://via.placeholder.com/150' }} 
                />
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{userPosts.length}</Text>
                        <Text>Gönderi</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.statItem} 
                        onPress={() => navigation.navigate('Followers', { 
                            profileId: profile.id,
                            screenTitle: 'Takipçiler'
                        })}
                    >
                        <Text style={styles.statNumber}>{followerCount}</Text>
                        <Text>Takipçi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.statItem} 
                        onPress={() => navigation.navigate('Following', { 
                            profileId: profile.id,
                            screenTitle: 'Takip Edilenler'
                        })}
                    >
                        <Text style={styles.statNumber}>{followingCount}</Text>
                        <Text>Takip</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bioContainer}>
                <Title style={styles.fullName}>{profile.full_name || 'İsim Belirtilmemiş'}</Title>
                <Paragraph style={styles.username}>@{profile.username}</Paragraph>
                <Paragraph style={styles.bio}>{profile.biography || 'Henüz bir biyografi eklenmemiş.'}</Paragraph>
            </View>
            
            {!isMyProfile && (
                <View style={[styles.buttonContainer, { flexDirection: 'row'}]}>
                    {isFollowing ? (
                        <Button mode="outlined" onPress={handleUnfollow} style={[styles.button, styles.unfollowButton]} labelStyle={{color: colors.textSecondary}} loading={isFollowLoading} disabled={isFollowLoading}>
                            Takibi Bırak
                        </Button>
                    ) : (
                        <Button mode="contained" onPress={handleFollow} buttonColor={colors.accent} loading={isFollowLoading} disabled={isFollowLoading} style={styles.button}>
                            Takip Et
                        </Button>
                    )}
                    <Button
                        mode="outlined"
                        onPress={() => handleSendMessage(profile.id)}
                        style={[styles.button, styles.messageButton]}
                        icon="message-text-outline">
                            Mesaj
                    </Button>
                </View>
            )}
            <Divider style={styles.divider} />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.customHeader}>
                <View style={{width: 50}} />
                <Title style={styles.headerTitle}>@{profile.username}</Title>
                {!isMyProfile ? (
                     <View style={{width: 50}} />
                ) : (
                    <IconButton
                        icon="cog-outline"
                        iconColor={colors.text}
                        size={28}
                        onPress={() => navigation.navigate('Settings')}
                    />
                )}
            </View>
            <FlatList
                data={userPosts}
                renderItem={({ item }) => <PostItem post={item} />}
                keyExtractor={item => item.id}
                numColumns={3}
                ListHeaderComponent={ListHeader}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.accent]}
                        tintColor={colors.accent}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    customHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, backgroundColor: colors.surface },
    headerTitle: { fontWeight: 'bold', fontSize: 18 },
    centerContent: { justifyContent: 'center', alignItems: 'center' },
    headerContainer: { paddingHorizontal: 16, paddingTop: 16 },
    profileInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    statsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginLeft: 10 },
    statItem: { alignItems: 'center' },
    statNumber: { fontWeight: 'bold', fontSize: 16 },
    bioContainer: { marginTop: 12 },
    fullName: { fontWeight: 'bold' },
    username: { color: colors.textSecondary, marginTop: -5 },
    bio: { marginTop: 8 },
    divider: { marginTop: 16 },
    postItem: { width: postSize, height: postSize },
    postImage: { width: '100%', height: '100%' },
    videoIcon: { position: 'absolute', top: 8, right: 8 },
    buttonContainer: {
        marginTop: 16,
    },
    button:{
        flex:1,
    },
    unfollowButton: {
        borderColor: colors.border,
        marginRight: 8,
    },
    messageButton:{
        borderColor: colors.border,
        marginLeft: 8,
    }
});

export default ProfilScreen;