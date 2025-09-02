import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';

const ChatItem = ({ chat }) => (
    <TouchableOpacity style={styles.container}>
        <View style={styles.avatarContainer}>
            <Image source={{ uri: chat.user.avatar }} style={styles.avatar} />
            {/* Supabase'den kullanıcının online durumunu alıp gösterebilirsin */}
            {chat.user.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.contentContainer}>
            <Text style={styles.username}>{chat.user.name}</Text>
            <Text
                style={[styles.lastMessage, !chat.lastMessage.isRead && styles.unreadMessage]}
                numberOfLines={1}
            >
                {chat.lastMessage.text}
            </Text>
        </View>

        <View style={styles.infoContainer}>
            <Text style={styles.timestamp}>{chat.lastMessage.timestamp}</Text>
            {/* Eğer mesaj okunmadıysa mavi bir nokta göster */}
            {!chat.lastMessage.isRead && <View style={styles.unreadDot} />}
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
    },
    onlineIndicator: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: '#2ecc71', // Yeşil
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 2,
        borderColor: colors.surface,
    },
    contentContainer: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    lastMessage: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    unreadMessage: {
        fontWeight: 'bold',
        color: colors.text, // Okunmamış mesaj rengi
    },
    infoContainer: {
        alignItems: 'flex-end',
    },
    timestamp: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.accent,
    },
});

export default ChatItem;