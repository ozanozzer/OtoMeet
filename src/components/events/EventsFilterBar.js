import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';

const EventsFilterBar = () => (
    <View style={styles.filterBarContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
            <Text style={[styles.filterButtonText, styles.activeFilterText]}>Yaklaşanlar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Popüler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Geçmiş</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    filterBarContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 15,
        backgroundColor: colors.surface,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: colors.background,
    },
    filterButtonText: {
        color: colors.textSecondary,
        fontWeight: '500',
    },
    activeFilter: {
        backgroundColor: colors.accent,
    },
    activeFilterText: {
        color: '#FFFFFF',
    },
});

export default EventsFilterBar;