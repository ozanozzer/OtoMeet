// src/components/messages/MessagesHeader.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const MessagesHeader = () => (
    <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mesajlar</Text>
        <TouchableOpacity style={styles.newMessageButton}>
            <Ionicons name="create-outline" size={26} color={colors.accent} />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10, // Sadece alttan boşluk veriyoruz
        backgroundColor: colors.surface,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    newMessageButton: {
        padding: 5,
    },
});

export default MessagesHeader;