import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';
import { tr } from 'date-fns/locale';

// YENİ EKLENEN YARDIMCI FONKSİYON
const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isToday(date)) {
        return format(date, 'HH:mm'); // Bugün ise: "15:42"
    }
    if (isYesterday(date)) {
        return 'Dün'; // Dün ise: "Dün"
    }
    return format(date, 'dd.MM.yyyy'); // Daha eski ise: "05.09.2025"
};

// 'chat'in yanına 'onPress' de prop olarak eklendi
const ChatItem = ({ chat, onPress }) => (
    // TouchableOpacity'ye onPress olayı bağlandı
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.avatarContainer}>
            {/* YENİ: Avatar URL'i yoksa varsayılan bir resim göster */}
            <Image 
                source={{ uri: chat.user.avatar || 'https://via.placeholder.com/150' }} 
                style={styles.avatar} 
            />
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
            {/* YENİ: Tarih formatlama fonksiyonu kullanıldı */}
            <Text style={styles.timestamp}>
                {formatTimestamp(chat.lastMessage.timestamp)}
            </Text>
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