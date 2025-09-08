// src/screens/Post/CommentsScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, TextInput, Button, Avatar, Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import colors from '../../constants/colors';

// Her bir yorum satırını gösterecek bileşen
const CommentItem = ({ comment }) => (
    <View style={styles.commentContainer}>
        <Avatar.Image size={36} source={{ uri: comment.profiles.avatar_url || 'https://via.placeholder.com/150' }} />
        <View style={styles.commentContent}>
            <Text style={styles.commentUsername}>{comment.profiles.username}</Text>
            <Text>{comment.content}</Text>
        </View>
    </View>
);

const CommentsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { postId, postImageUrl, postCaption } = route.params;

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchComments = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    id, content, created_at, user_id,
                    profiles ( username, avatar_url )
                `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true });
            
            if (error) throw error;
            setComments(data || []);
        } catch (error) {
            Alert.alert("Hata", "Yorumlar yüklenemedi.");
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user));
        fetchComments();
    }, [fetchComments]);

    const handlePostComment = async () => {
        if (!newComment.trim() || !currentUser) return;

        const commentToPost = newComment.trim();
        setNewComment(''); // Input'u anında temizle

        const { error } = await supabase
            .from('comments')
            .insert({ post_id: postId, user_id: currentUser.id, content: commentToPost });

        if (error) {
            Alert.alert("Hata", "Yorum gönderilemedi.");
            setNewComment(commentToPost); // Hata olursa yazdığı yorumu geri koy
        } else {
            fetchComments(); // Başarılı olursa listeyi yenile
        }
    };

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} />;
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Yorumlar" />
            </Appbar.Header>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CommentItem comment={item} />}
                    ListEmptyComponent={() => (
                        <View style={styles.centered}>
                            <Text>Henüz hiç yorum yapılmamış.</Text>
                        </View>
                    )}
                    // Yorum yapılan gönderiyi en üste sabit bir başlık olarak ekliyoruz
                    ListHeaderComponent={() => (
                        <View style={styles.postInfoContainer}>
                            <Text>{postCaption}</Text>
                        </View>
                    )}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder="Yorum ekle..."
                        mode="outlined"
                    />
                    <Button onPress={handlePostComment}>Paylaş</Button>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.surface },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
    postInfoContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
    },
    commentContainer: {
        flexDirection: 'row',
        padding: 16,
    },
    commentContent: {
        marginLeft: 12,
        flex: 1,
    },
    commentUsername: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
    },
    textInput: {
        flex: 1,
        marginRight: 8,
    },
});

export default CommentsScreen;