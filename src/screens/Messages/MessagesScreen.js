// src/screens/Messages/MessagesScreen.js

import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../services/supabase';
import colors from '../../constants/colors';
import MessagesHeader from '../../components/messages/MessagesHeader';
import SearchBar from '../../components/messages/SearchBar';
import ChatItem from '../../components/messages/ChatItem';

const MessagesScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);
    
    // --- YENİ EKLENEN STATE ---
    // Online olan kullanıcıların ID'lerini bir Set içinde tutacağız.
    const [onlineUserIds, setOnlineUserIds] = useState(new Set());

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

    // Bu useEffect mesajlardaki değişiklikleri dinler (değişiklik yok)
    useEffect(() => {
        const messageChannel = supabase
            .channel('public:messages') // Kanal adı daha spesifik olabilir
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'messages' }, 
                (payload) => {
                    console.log('Yeni mesaj algılandı, liste güncelleniyor...');
                    fetchConversations();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(messageChannel);
        };
    }, []);

    // --- YENİ EKLENEN useEffect (PRESENCE İÇİN) ---
    useEffect(() => {
        // Bu useEffect, online olan kullanıcıları dinler
        const presenceChannel = supabase.channel('online-users');

        presenceChannel.on('presence', { event: 'sync' }, () => {
            const presenceState = presenceChannel.presenceState();
            const onlineUsers = new Set(Object.keys(presenceState));
            setOnlineUserIds(onlineUsers);
        });

        presenceChannel.subscribe();

        return () => {
            supabase.removeChannel(presenceChannel);
        };
    }, []); // Boş dizi sayesinde sadece bir kez kurulur.

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchConversations();
        }, [])
    );

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

            {conversations.length === 0 ? (
                <View style={styles.centerContent}>
                    <Text>Henüz bir sohbetin yok.</Text>
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.conversation_id.toString()}
                    contentContainerStyle={styles.listContainer}
                    // --- YENİ EKLENEN PROP ---
                    // onlineUserIds state'i değiştiğinde listeyi yeniden render etmeye zorlar.
                    extraData={onlineUserIds}
                    renderItem={({ item }) => {
                        // --- DEĞİŞİKLİK BURADA ---
                        // Artık isOnline durumunu canlı olarak onlineUserIds set'inden kontrol ediyoruz.
                        const isUserOnline = onlineUserIds.has(item.other_user_id);

                        const chatItemProps = {
                            id: item.conversation_id,
                            user: {
                                id: item.other_user_id,
                                name: item.other_user_full_name || item.other_user_username,
                                avatar: item.other_user_avatar_url,
                                isOnline: isUserOnline, // Artık statik 'false' değil, dinamik!
                            },
                            lastMessage: {
                                text: item.last_message_content || 'Henüz mesaj yok.',
                                timestamp: item.last_message_created_at,
                                isRead: true, 
                            }
                        };

                        return (
                            <ChatItem 
                                chat={chatItemProps} 
                                onPress={() => navigation.navigate('ChatScreen', { 
                                    conversationId: item.conversation_id,
                                    otherUserName: chatItemProps.user.name,
                                    otherUserAvatar: chatItemProps.user.avatar,
                                    otherUserId: item.other_user_id
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
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MessagesScreen;