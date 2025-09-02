// src/components/FilterBar.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const FilterBar = () => (
    <View style={styles.filterBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>Buluşmalar</Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>Ankara</Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>Bu Hafta</Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    filterBarContainer: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.background,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
    },
    filterButtonText: {
        color: colors.text,
        fontWeight: '500',
        marginRight: 4,
    },
});

export default FilterBar;