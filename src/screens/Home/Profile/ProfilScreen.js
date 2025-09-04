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

const PostItem = ({ post }) => (
    <TouchableOpacity style={styles.postItem}>
        <Image source={{ uri: post.image }} style={styles.postImage} />
        {post.type === 'video' && (
            <Ionicons name="play" size={24} color="white" style={styles.videoIcon} />
        )}
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

    const fetchProfile = useCallback(async () => {
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            const userToFetchId = userId || currentUser?.id;

            if (!userToFetchId) throw new Error("Kullanıcı ID bulunamadı.");

            setIsMyProfile(userToFetchId === currentUser?.id);

            const { data, error } = await supabase
                .from('profiles')
                .select(`id, username, full_name, avatar_url, biography`)
                .eq('id', userToFetchId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') setProfile(null);
                else throw error;
            } else {
                setProfile(data);
            }

            const { count: followers } = await supabase
                .from('followers')
                .select('*', { count: 'exact', head: true })
                .eq('following_id', userToFetchId);
            setFollowerCount(followers || 0);

            const { count: following } = await supabase
                .from('followers')
                .select('*', { count: 'exact', head: true })
                .eq('follower_id', userToFetchId);
            setFollowingCount(following || 0);

            if (!isMyProfile && currentUser) {
                const { data: followData, error: followError } = await supabase
                    .from('followers')
                    .select('id', { count: 'exact' })
                    .eq('follower_id', currentUser.id)
                    .eq('following_id', userToFetchId);

                if (followError) throw followError;
                setIsFollowing(followData.length > 0);
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

    // --- BÜTÜN DEĞİŞİKLİK BURADA BAŞLIYOR (YAPI DEĞİŞİKLİĞİ) ---

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

    // Artık 'profile' dolu olduğundan eminiz, şimdi ekranı çizebiliriz.
    
    const userPosts = [
        { id: '1', image: 'https://i0.shbdn.com/photos/19/23/19/x5_1256192319ogz.jpg', type: 'image' },
        { id: '2', image: 'https://images.unsplash.com/photo-1617886322207-6f504e7472c5?w=500&q=80', type: 'image' },
        { id: '3', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', type: 'image' },
    ];

    const ListHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.profileInfo}>
                <Avatar.Image 
                    size={90} 
                    source={{ uri: profile.avatar_url || 'https://via.placeholder.com/150' }} 
                />
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}><Text style={styles.statNumber}>{userPosts.length}</Text><Text>Gönderi</Text></View>
                    <View style={styles.statItem}><Text style={styles.statNumber}>{followerCount}</Text><Text>Takipçi</Text></View>
                    <View style={styles.statItem}><Text style={styles.statNumber}>{followingCount}</Text><Text>Takip</Text></View>
                </View>
            </View>
            <View style={styles.bioContainer}>
                <Title style={styles.fullName}>{profile.full_name || 'İsim Belirtilmemiş'}</Title>
                <Paragraph style={styles.username}>@{profile.username}</Paragraph>
                <Paragraph style={styles.bio}>{profile.biography || 'Henüz bir biyografi eklenmemiş.'}</Paragraph>
            </View>
            
            {!isMyProfile && (
                <View style={styles.buttonContainer}>
                    {isFollowing ? (
                        <Button mode="outlined" onPress={handleUnfollow} style={styles.unfollowButton} labelStyle={{color: colors.textSecondary}} loading={isFollowLoading} disabled={isFollowLoading}>
                            Takibi Bırak
                        </Button>
                    ) : (
                        <Button mode="contained" onPress={handleFollow} buttonColor={colors.accent} loading={isFollowLoading} disabled={isFollowLoading}>
                            Takip Et
                        </Button>
                    )}
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
                     <View style={{width: 50}} /> // Başlığı ortalamak için boş view
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
    unfollowButton: {
        borderColor: colors.border,
    },
});

export default ProfilScreen;