import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const SearchBar = () => (
    <View style={styles.container}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.icon} />
        <TextInput
            placeholder="Sohbetlerde ara..."
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginHorizontal: 16,
        marginBottom: 10,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 40,
        color: colors.text,
    },
});

export default SearchBar;