// src/components/HomeHeader.js

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors'; // Dosya yolu güncellendi

const HomeHeader = () => (
    <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Akış</Text>
            <Ionicons name="chevron-down" size={20} color={colors.text} />
        </View>
        <TouchableOpacity>
            <Image
                source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' }}
                style={styles.headerProfileImage}
            />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: colors.surface,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginRight: 4,
    },
    headerProfileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
});

export default HomeHeader;