// src/components/home/PostCard.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
// YENİ EKLENEN SATIR
import { Menu, Divider, IconButton } from 'react-native-paper'; 
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import colors from '../../constants/colors';
import { supabase } from '../../services/supabase';

const PostCard = ({ post, onLikeToggle, currentUser }) => {
    
    const navigation = useNavigation(); 

    const [isMenuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleDeletePost = async () => {
        closeMenu(); // Menüyü kapat
        Alert.alert(
            "Gönderiyi Sil",
            "Bu gönderiyi kalıcı olarak silmek istediğinden emin misin?",
            [
                { text: "Vazgeç", style: "cancel" },
                { 
                    text: "Sil", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            // Önce Storage'dan resmi sil
                            const fileName = post.postImage.split('/').pop();
                            await supabase.storage.from('posts').remove([fileName]);
                            // Sonra veritabanından gönderiyi sil
                            await supabase.from('posts').delete().eq('id', post.id);
                            // Not: Akışın anında güncellenmesi için HomeScreen'de bir state yönetimi gerekir.
                            // Şimdilik en basit haliyle, sayfa yenilendiğinde kaybolacaktır.
                        } catch (error) {
                            Alert.alert("Hata", "Gönderi silinirken bir sorun oluştu.");
                        }
                    } 
                }
            ]
        );
    };

    // Zamanı formatlayan yardımcı fonksiyon
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: tr });
    };

    const isMyPost = currentUser?.id === post.userId; // `HomeScreen`'den `userId`'yi de göndermemiz gerekecek


    return (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
                <View style={styles.headerContent}>
                    <Text style={styles.username}>{post.username}</Text>
                    <Text style={styles.postDate}>{formatTimestamp(post.timestamp)}</Text>
                </View>

                <Menu
                    visible={isMenuVisible}
                    onDismiss={closeMenu}
                    anchor={
                        <IconButton
                            icon="dots-horizontal"
                            size={24}
                            onPress={openMenu}
                            style={{ marginLeft: 'auto' }} // Bu, ikonu en sağa yaslar
                        />
                    }
                    contentStyle={{ backgroundColor: colors.surface }}
                >
                    {isMyPost ? (
                        <>
                            {/* DÜZENLEME DAHA YAPILMADI */}
                            <Menu.Item onPress={() => {closeMenu()}} title="Düzenle" />
                            <Menu.Item onPress={handleDeletePost} title="Sil" titleStyle={{ color: colors.error }} />
                        </>
                    ) : (
                        <>
                            <Menu.Item onPress={() => {closeMenu()}} title="Şikayet Et" titleStyle={{ color: colors.error }} />
                            <Menu.Item onPress={() => {closeMenu()}} title="Engelle" />
                        </>
                    )}
                </Menu>
            </View>

            <Text style={styles.caption}>{post.caption}</Text>

            {post.postImage && (
                <Image source={{ uri: post.postImage }} style={styles.postImage} />
            )}

            <View style={styles.statsContainer}>
                {/* --- BÜTÜN DEĞİŞİKLİK BU BLOKTA --- */}
                <TouchableOpacity 
                    style={styles.statItem}
                    onPress={() => onLikeToggle(post.id, post.isLiked)}
                    activeOpacity={0.7}
                >
                    {/* İkon artık 'isLiked' durumuna göre değişiyor */}
                    <Ionicons 
                        name={post.isLiked ? "heart" : "heart-outline"} 
                        size={22} 
                        color={post.isLiked ? colors.error : colors.icon} 
                    />
                    {/* Beğeni sayısı artık dinamik */}
                    <Text style={styles.statText}>{post.likeCount}</Text>
                </TouchableOpacity>

                 <TouchableOpacity 
                    style={styles.statItem} 
                    onPress={() => navigation.navigate('Comments', {
                        postId: post.id,
                        postImageUrl: post.postImage,
                        postCaption: post.caption,
                    })}
                >
                    <Ionicons name="chatbubble-outline" size={20} color={colors.icon} />
                    <Text style={styles.statText}>{post.commentCount}</Text>
                    
                </TouchableOpacity>

                <TouchableOpacity style={styles.shareIcon}>
                    <Ionicons name="share-social-outline" size={22} color={colors.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    postCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerContent: {
        flex: 1, // Bu, "mevcut tüm boş alanı kapla" demektir
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
        color: colors.text,
    },
    postDate: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    moreOptionsButton: {
        marginLeft: 'auto',
    },
    caption: {
        color: colors.text,
        lineHeight: 22,
        marginTop: 10,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F2F5',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    statText: {
        marginLeft: 6,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    shareIcon: {
        marginLeft: 'auto',
    },
});

export default PostCard;