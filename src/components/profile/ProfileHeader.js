// src/components/profile/ProfileHeader.js

import React from 'react';
// DEĞİŞİKLİK: TouchableOpacity ve Ionicons import edildi
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const StatItem = ({ count, label }) => (
    <View style={styles.statItem}>
        <Text style={styles.statCount}>{count}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

// DEĞİŞİKLİK: 'onSettingsPress' adında yeni bir prop alıyoruz
const ProfileHeader = ({ user, onSettingsPress }) => (
    <View style={styles.container}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.infoContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <View style={styles.statsRow}>
                <StatItem count={user.stats.posts} label="Gönderi" />
                <StatItem count={user.stats.followers} label="Takipçi" />
                <StatItem count={user.stats.following} label="Takip" />
            </View>
        </View>
        {/* YENİ: Ayarlar Butonu */}
        <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.surface,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 16,
    },
    // ... diğer stiller aynı ...
    name: { fontSize: 20, fontWeight: 'bold', color: colors.text },
    username: { fontSize: 14, color: colors.textSecondary },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    statItem: { alignItems: 'center' },
    statCount: { fontSize: 18, fontWeight: 'bold', color: colors.text },
    statLabel: { fontSize: 12, color: colors.textSecondary },
    // YENİ STİL
    settingsButton: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
});

export default ProfileHeader;