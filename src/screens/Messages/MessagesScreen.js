// src/screens/Messages/MessagesScreen.js

import React, { useState, useCallback, useEffect } from 'react'; // useEffect eklendi
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../services/supabase';
import colors from '../../constants/colors';
import MessagesHeader from '../../components/messages/MessagesHeader';
import SearchBar from '../../components/messages/SearchBar';
import ChatItem from '../../components/messages/ChatItem';

const MessagesScreen = () => { // İsim düzeltildi
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);

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

    // --- DEĞİŞİKLİK BURADA BAŞLIYOR: REALTIME DİNLEYİCİSİ EKLENDİ ---
    useEffect(() => {
        // Bu useEffect, component yüklendiğinde SADECE BİR KEZ çalışır.
        // Görevi, Realtime kanalını kurmak ve dinlemeye başlamaktır.

        const channel = supabase
            .channel('public:conversations')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'messages' }, 
                (payload) => {
                    // Mesajlar tablosunda herhangi bir değişiklik olduğunda (yeni, güncelleme, silme)
                    // sohbet listesini yeniden çekerek güncel tut.
                    console.log('Yeni mesaj algılandı, liste güncelleniyor...');
                    fetchConversations();
                }
            )
            .subscribe();

        // Component ekrandan kaldırıldığında kanalı temizle
        return () => {
            supabase.removeChannel(channel);
        };
    }, []); // Boş dizi sayesinde sadece bir kez kurulur.

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchConversations();
        }, [])
    );

    if (loading) { /* ... aynı ... */ }

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
                    // --- BÜTÜN DÜZELTME BU renderItem BLOĞUNUN İÇİNDE ---
                    renderItem={({ item }) => {
                        // Supabase'den gelen 'item'ı, ChatItem'ın beklediği 'chat' formatına çeviriyoruz
                        const chatItemProps = {
                            id: item.conversation_id,
                            user: {
                                id: item.other_user_id,
                                name: item.other_user_full_name || item.other_user_username,
                                avatar: item.other_user_avatar_url, // Artık 'avatar' var
                                isOnline: true, 
                            },
                            lastMessage: {
                                text: item.last_message_content || 'Henüz mesaj yok.',
                                timestamp: item.last_message_created_at,
                                isRead: true, 
                            }
                        };

                        // ChatItem'a, formatlanmış olan bu yeni objeyi gönderiyoruz
                        return (
                            <ChatItem 
                                chat={chatItemProps} 
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

const styles = StyleSheet.create({ /* ... aynı ... */ });

export default MessagesScreen; // İsim düzeltildi