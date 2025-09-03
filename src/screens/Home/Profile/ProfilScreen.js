// src/screens/Profile/ProfilScreen.js

// 1. ADIM: Gerekli bileşenler import listesine eklendi
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// Menu ve IconButton import edildi
import { Avatar, Text, Button, ActivityIndicator, Divider, Title, Paragraph, IconButton } from 'react-native-paper'; 
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../services/supabase';
import colors from '../../../constants/colors';// TEMİZLENMİŞ KODU BURADAN KOPYALA

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
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Kullanıcı bulunamadı.");

                const { data, error } = await supabase
                    .from('profiles')
                    .select(`username, full_name, avatar_url, biography`)
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                if (data) setProfile(data);

            } catch (error) {
                Alert.alert('Hata', 'Profil bilgileri yüklenemedi: ' + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);


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
                <Button onPress={handleLogout}>Çıkış Yap</Button>
            </View>
        );
    }

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
                    <View style={styles.statItem}><Text style={styles.statNumber}>125</Text><Text>Gönderi</Text></View>
                    <View style={styles.statItem}><Text style={styles.statNumber}>12.5k</Text><Text>Takipçi</Text></View>
                    <View style={styles.statItem}><Text style={styles.statNumber}>320</Text><Text>Takip</Text></View>
                </View>
            </View>
            <View style={styles.bioContainer}>
                <Title style={styles.fullName}>{profile.full_name || 'İsim Belirtilmemiş'}</Title>
                <Paragraph style={styles.username}>@{profile.username}</Paragraph>
                <Paragraph style={styles.bio}>{profile.biography || 'Henüz bir biyografi eklenmemiş.'}</Paragraph>
            </View>
            <Divider style={styles.divider} />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.customHeader}>
                <View style={{width: 50}} />
                <Title style={styles.headerTitle}>@{profile.username}</Title>

                <IconButton
                    icon="cog-outline"
                    iconColor={colors.text}
                    size={28}
                    onPress={() => navigation.navigate('Settings')} // Tıklanınca Settings'e git!
                />
                
            </View>
            <FlatList
                data={userPosts}
                renderItem={({ item }) => <PostItem post={item} />}
                keyExtractor={item => item.id}
                numColumns={3}
                ListHeaderComponent={ListHeader}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    customHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: colors.surface,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statsContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        marginLeft: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    bioContainer: {
        marginTop: 12,
    },
    fullName: {
        fontWeight: 'bold',
    },
    username: {
        color: colors.textSecondary,
        marginTop: -5,
    },
    bio: {
        marginTop: 8,
    },
    logoutButton: {
        marginTop: 16,
    },
    divider: {
        marginTop: 16,
    },
    postItem: {
        width: postSize,
        height: postSize,
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    videoIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});

export default ProfilScreen;