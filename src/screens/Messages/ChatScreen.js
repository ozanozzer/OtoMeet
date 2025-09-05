// src/screens/Messages/ChatScreen.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Appbar, ActivityIndicator, TextInput, IconButton, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import colors from '../../constants/colors';

// Mesaj baloncuklarını render edecek basit bir component
const MessageBubble = ({ message, isCurrentUser }) => (
    <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
        <Text style={{ color: isCurrentUser ? '#fff' : '#000' }}>{message.content}</Text>
    </View>
);

const ChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { conversationId, otherUserName } = route.params;
    const flatListRef = useRef();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);


    useEffect(() => {
    // Konuştuğumuz kişinin ID'sini route'dan alıyoruz
    const otherUserId = route.params?.otherUserId; 
    
    // Eğer bir şekilde ID gelmediyse, bir şey yapma
    if (!otherUserId) return;

    console.log(`>>> ${otherUserId} ID'li kullanıcı için online durumu dinleniyor...`);

    const channel = supabase.channel('online-users');
    
    channel.on('presence', { event: 'sync' }, () => {
        // Kanaldaki tüm online kullanıcıların durumunu al
        const presenceState = channel.presenceState();
        
        // --- İŞTE DÜZELTME BURADA ---
        // 'presenceState' objesinin anahtarları (key'leri) online olan kullanıcıların ID'leridir.
        // Bizim konuştuğumuz kişinin ID'si bu anahtarların içinde var mı?
        const isUserOnline = presenceState[otherUserId];

        // 'isUserOnline' undefined değilse (yani listede varsa), kullanıcı online'dır.
        setIsOtherUserOnline(!!isUserOnline); 
        
        console.log(`>>> ${otherUserName} online mı?`, !!isUserOnline);
    });

    channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            // Kanala abone olduğumuzda, kendi durumumuzu da takip edelim ki
            // karşı taraf bizi online görebilsin. Bu App.js'te zaten yapılıyor
            // ama burada da yapmak garantidir.
            const currentUserKey = supabase.auth.session()?.user.id;
            if(currentUserKey) {
                channel.track({ online_at: new Date().toISOString() });
            }
        }
    });


        return () => {
            supabase.removeChannel(channel);
        };
    }, [route.params?.otherUserId]);


    // Geçmiş mesajları çek
    useEffect(() => {
        const fetchInitialData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUser(user);

            const { data: pastMessages, error } = await supabase
                .from('messages')
                .select('id, content, created_at, sender_id')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true }); // Mesajları eskiden yeniye sırala

            if (!error && pastMessages) {
                setMessages(pastMessages);
            }
            setLoading(false);
        };
        fetchInitialData();
    }, [conversationId]);

    // Yeni mesajları dinle (Realtime)
    useEffect(() => {
        if (!conversationId) return;

        const channel = supabase
            .channel(`public:messages:conversation_id=eq.${conversationId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    setMessages(previousMessages => [...previousMessages, payload.new]);
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [conversationId]);

    // Yeni mesaj gönder
    const onSend = async () => {
        if (newMessage.trim().length === 0) return;

        const { error } = await supabase
            .from('messages')
            .insert({
                content: newMessage.trim(),
                sender_id: currentUser.id,
                conversation_id: conversationId,
            });
        
        setNewMessage(''); // Input'u temizle
        if (error) console.error('Mesaj gönderme hatası:', error);
    };

    if (loading || !currentUser) {
        return <ActivityIndicator style={{ flex: 1 }} color={colors.accent} />;
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={colors.text} />
                {/* YENİ: Başlığa online durumunu ekle */}
                <Appbar.Content 
                    title={otherUserName} 
                    titleStyle={styles.title}
                    subtitle={isOtherUserOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                    subtitleStyle={[styles.subtitle, { color: isOtherUserOnline ? '#2ecc71' : colors.textSecondary }]}
                />
            </Appbar.Header>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MessageBubble message={item} isCurrentUser={item.sender_id === currentUser.id} />
                    )}
                    contentContainerStyle={{ padding: 10 }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Bir mesaj yaz..."
                        mode="outlined"
                        multiline
                    />
                    <IconButton
                        icon="send"
                        iconColor={colors.accent}
                        size={28}
                        onPress={onSend}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.surface },
    title: { fontWeight: 'bold' },
    subtitle: {
        fontSize: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: colors.surface,
    },
    textInput: {
        flex: 1,
        marginRight: 8,
    },
    messageContainer: {
        padding: 12,
        borderRadius: 18,
        marginVertical: 4,
        maxWidth: '80%',
    },
    currentUserMessage: {
        backgroundColor: colors.accent,
        alignSelf: 'flex-end',
    },
    otherUserMessage: {
        backgroundColor: '#e5e5e5',
        alignSelf: 'flex-start',
    },
});

export default ChatScreen;