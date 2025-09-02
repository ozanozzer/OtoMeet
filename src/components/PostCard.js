// src/components/PostCard.js

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const PostCard = ({ post }) => (
    <View style={styles.postCard}>
        <View style={styles.postHeader}>
            <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
            <View>
                <Text style={styles.username}>{post.username}</Text>
                <Text style={styles.postDate}>{post.timestamp}</Text>
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
            <View style={styles.statItem}>
                <Ionicons name="arrow-up-circle-outline" size={22} color={colors.icon} />
                <Text style={styles.statText}>{post.likeCount}</Text>
            </View>
            <View style={styles.statItem}>
                <Ionicons name="chatbubble-outline" size={20} color={colors.icon} />
                <Text style={styles.statText}>{post.commentCount}</Text>
            </View>
            <TouchableOpacity style={styles.shareIcon}>
                <Ionicons name="share-social-outline" size={22} color={colors.icon} />
            </TouchableOpacity>
        </View>
    </View>
);

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