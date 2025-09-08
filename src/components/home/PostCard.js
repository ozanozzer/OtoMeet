// src/components/home/PostCard.js

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import colors from '../../constants/colors';

// Component artık 'post' ve 'onLikeToggle' proplarını alıyor
const PostCard = ({ post, onLikeToggle }) => {

    const navigation = useNavigation(); 


    // Zamanı formatlayan yardımcı fonksiyon
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: tr });
    };

    return (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
                <View>
                    <Text style={styles.username}>{post.username}</Text>
                    {/* Tarih artık dinamik olarak formatlanıyor */}
                    <Text style={styles.postDate}>{formatTimestamp(post.timestamp)}</Text>
                </View>
                <TouchableOpacity style={styles.moreOptionsButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color={colors.icon} />
                </TouchableOpacity>
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