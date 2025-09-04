// src/screens/Messages/MesajlarScreen.js

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '../../services/supabase';

import colors from '../../constants/colors';
import MessagesHeader from '../../components/messages/MessagesHeader';
import SearchBar from '../../components/messages/SearchBar';
import ChatItem from '../../components/messages/ChatItem';

const MesajlarScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation(); // Navigasyon eklendi

    // --- YENİ EKLENEN STATE'LER ---
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);

    // --- YENİ EKLENEN VERİ ÇEKME FONKSİYONU ---
    const fetchConversations = async () => {
        try {
            const { data, error } = await supabase.rpc('get_conversations_for_user');
            if (error) throw error;
            setConversations(data || []);
        } catch (error) {
            Alert.alert("Hata", "Sohbetler yüklenirken bir sorun oluştu.");
            console.error("Sohbet yükleme hatası: ", error);
        } finally {
            setLoading(false);
        }
    };

    // --- YENİ EKLENEN useFocusEffect ---
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchConversations();
        }, [])
    );

    // --- YENİ EKLENEN YÜKLENİYOR DURUMU ---
    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, { paddingTop: insets.top }]}>
                <MessagesHeader />
                <SearchBar />
                <ActivityIndicator style={{ marginTop: 50 }} color={colors.accent} size="large" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <MessagesHeader />
            <SearchBar />

            {/* --- YENİ EKLENEN FLATLIST VE BOŞ DURUMU KONTROLÜ --- */}
            {conversations.length === 0 ? (
                <View style={styles.centerContent}>
                    <Text>Henüz bir sohbetin yok.</Text>
                </View>
            ) : (
                // ESKİ ScrollView yerine FlatList kullanıyoruz, daha performanslı
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.conversation_id.toString()}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => {
                        // Supabase'den gelen veriyi senin ChatItem component'inin beklediği formata çeviriyoruz
                        const chatItemProps = {
                            id: item.conversation_id,
                            user: {
                                id: item.other_user_id,
                                name: item.other_user_full_name || item.other_user_username,
                                avatar: item.other_user_avatar_url,
                                isOnline: true, // Şimdilik statik, ileride eklenebilir
                            },
                            lastMessage: {
                                text: item.last_message_content || 'Henüz mesaj yok.',
                                timestamp: item.last_message_created_at, // Bunu ChatItem'da formatlaman gerekecek
                                isRead: true, // Şimdilik statik
                            }
                        };

                        return (
                            <ChatItem 
                                chat={chatItemProps} 
                                // Tıklandığında ChatScreen'e yönlendirme
                                onPress={() => navigation.navigate('ChatScreen', { 
                                    conversationId: item.conversation_id,
                                    otherUserName: chatItemProps.user.name,
                                    otherUserAvatar: chatItemProps.user.avatar
                                })}
                            />
                        );
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    listContainer: {
        paddingBottom: 100,
    },
    // YENİ EKLENEN STİL
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MesajlarScreen;