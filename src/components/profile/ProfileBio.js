import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';

const ProfileBio = ({ bio }) => (
    <View style={styles.container}>
        <Text style={styles.bioText}>{bio}</Text>
        <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Profili Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Paylaş</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.background,
    },
    bioText: {
        color: colors.text,
        lineHeight: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 16,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: colors.background,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    primaryButtonText: {
        color: colors.text,
        fontWeight: '600',
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: colors.background,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: colors.text,
        fontWeight: '600',
    },
});

export default ProfileBio;