import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const EventsHeader = () => (
    <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Buluşmalar</Text>
        <TouchableOpacity style={styles.createEventButton}>
            <Ionicons name="add" size={28} color={colors.accent} />
            <Text style={styles.createEventButtonText}>Buluşma Oluştur</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: colors.surface,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    createEventButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E7F3FF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    createEventButtonText: {
        color: colors.accent,
        fontWeight: '600',
        marginLeft: 4,
    },
});

export default EventsHeader;