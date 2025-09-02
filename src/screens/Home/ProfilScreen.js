// src/screens/Profile/ProfilScreen.js

import React from 'react';
// DEĞİŞİKLİK: FlatList, Dimensions ve Image import edildi
import { StyleSheet, View, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileBio from '../../components/profile/ProfileBio';
// ProfileContent import'u kaldırıldı

// Ekran genişliğini alarak 3 sütunlu bir grid oluşturalım
const { width } = Dimensions.get('window');
const postSize = (width) / 3; // Kenar boşluksuz tam 3'e bölme

// YENİ: FlatList içinde her bir gönderiyi render edecek bileşen
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
    // Modal ve Logout mantığı için gereken state ve fonksiyonları geri ekleyebilirsin
    // const navigation = useNavigation();
    // const [isSettingsVisible, setSettingsVisible] = useState(false);
    // const handleLogout = () => { ... };

    const userData = {
        name: 'Aziz',
        username: 'aziz_dev',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
        bio: '🚗 BMW F30 | Yazılım Geliştirici\nAnkara Buluşmaları Organizatörü',
        stats: {
            posts: 125,
            followers: '12.5k',
            following: 320,
        }
    };

    const userPosts = [
        { id: '1', image: 'https://i0.shbdn.com/photos/19/23/19/x5_1256192319ogz.jpg', type: 'image' },
        { id: '2', image: 'https://images.unsplash.com/photo-1617886322207-6f504e7472c5?w=500&q=80', type: 'image' },
        { id: '3', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', type: 'image' },
        { id: '4', image: 'https://images.unsplash.com/photo-1599551349122-19266e797a14?w=800&q=80', type: 'image' },
        { id: '5', image: 'https://images.unsplash.com/photo-1617083293817-91361c4a179b?w=500&q=80', type: 'image' },
        { id: '6', image: 'https://images.unsplash.com/photo-1617886322207-6f504e7472c5?w=500&q=80', type: 'image' },
    ];

    // FlatList'in başlık bileşeni
    const ListHeader = () => (
        <>
            <ProfileHeader user={userData} onSettingsPress={() => { /* setSettingsVisible(true) */ }} />
            <ProfileBio bio={userData.bio} />
        </>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <FlatList
                data={userPosts}
                renderItem={({ item }) => <PostItem post={item} />}
                keyExtractor={item => item.id}
                numColumns={3} // Izgaranın 3 sütunlu olmasını sağlar
                ListHeaderComponent={ListHeader} // Başlık ve Bio'yu listenin en üstüne ekler
                showsVerticalScrollIndicator={false}
            />
            {/* Modal kodunu buraya geri ekleyebilirsin */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    // YENİ: PostItem stilleri
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