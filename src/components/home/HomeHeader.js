// src/components/home/HomeHeader.js

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

// Component artık 'userAvatar' prop'unu alıyor
const HomeHeader = ({ userAvatar, stackNavigation }) => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>OtoMeet</Text>
            
            <View style={styles.rightIcons}>
                <TouchableOpacity 
                    onPress={() => stackNavigation.navigate('CreatePost')} 
                    style={styles.iconButton}
                >
                    <Ionicons name="add-circle-outline" size={32} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => stackNavigation.navigate('BottomTabs', { screen: 'Profil' })} 
                    style={styles.iconButton}
                >
                    <Image source={{ uri: userAvatar || '...' }} style={styles.avatar} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 16, // İkonlar arasına boşluk koy
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
});

export default HomeHeader;