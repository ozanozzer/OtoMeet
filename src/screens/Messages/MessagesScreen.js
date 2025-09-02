// src/screens/Messages/MesajlarScreen.js

import React from 'react';
// DEĞİŞİKLİK 1: `SafeAreaView` yerine `useSafeAreaInsets` hook'unu import ediyoruz
import { StyleSheet, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

import MessagesHeader from '../../components/messages/MessagesHeader';
import SearchBar from '../../components/messages/SearchBar';
import ChatItem from '../../components/messages/ChatItem';

const MesajlarScreen = () => {
    // DEĞİŞİKLİK 2: Hook'u kullanarak güvenli alan boşluklarını alıyoruz
    const insets = useSafeAreaInsets();

    const chatData = [
        {
            id: 'chat_1',
            user: {
                id: 'user_2',
                name: 'can_sahin',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
                isOnline: true,
            },
            lastMessage: {
                text: 'Dostum yarınki buluşma saat kaçtaydı? Konumu da atarsan süper olur.',
                timestamp: '15:42',
                isRead: false,
            }
        },
        {
            id: 'chat_2',
            user: {
                id: 'user_3',
                name: 'aylin_garage',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
                isOnline: false,
            },
            lastMessage: {
                text: 'Harika, teşekkürler!',
                timestamp: 'Dün',
                isRead: true,
            }
        },
    ];

    return (
        // DEĞİŞİKLİK 3: `SafeAreaView` yerine normal `View` kullanıyoruz
        // ve içine manuel olarak üstten boşluk (paddingTop) veriyoruz.
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <MessagesHeader />
            <SearchBar />
            <ScrollView contentContainerStyle={styles.listContainer}>
                {chatData.map((chat) => (
                    <ChatItem key={chat.id} chat={chat} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface, // Arka planın tamamı beyaz olsun
    },
    listContainer: {
        paddingBottom: 100, // Navigasyon barı için boşluk
    },
});

export default MesajlarScreen;