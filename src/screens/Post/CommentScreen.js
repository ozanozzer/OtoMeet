// src/screens/Post/CommentsScreen.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button, Avatar, Text, ActivityIndicator, Divider, IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import colors from '../../constants/colors';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';


// --- AKILLI YORUM BİLEŞENİ ---
const CommentItem = ({ comment, onReply, onLike }) => {
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const currentPageRef = useRef(1); 
    const [loadingReplies, setLoadingReplies] = useState(false);

    const fetchReplies = useCallback(async () => {
        setLoadingReplies(true);
        try {
            const { data, error } = await supabase.rpc('get_replies_for_comment', {
                parent_id: comment.id,
                page: currentPageRef.current, 
                page_size: 5
            });

            if (error) throw error;
            
            if (data && data.length > 0) {
                setReplies(prevReplies => [...prevReplies, ...data]);
                currentPageRef.current += 1; 
            }
        } catch (error) {
            Alert.alert("Hata", "Yanıtlar yüklenirken bir sorun oluştu.");
        } finally {
            setLoadingReplies(false);
        }
    }, [comment.id]);

    const handleToggleReplies = () => {
        const newShowState = !showReplies;
        setShowReplies(newShowState);
        if (newShowState && replies.length === 0) {
            fetchReplies();
        }
    };

    const formatTimestamp = (ts) => formatDistanceToNow(new Date(ts), { addSuffix: true, locale: tr });

    return (
        <View style={styles.commentWrapper}>
            <View style={styles.commentContainer}>
                <Avatar.Image size={36} source={{ uri: comment.avatar_url || 'https://via.placeholder.com/150' }} />
                <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                        <Text style={styles.commentUsername}>{comment.username}</Text>
                        <Text style={styles.timestamp}>{formatTimestamp(comment.created_at)}</Text>
                    </View>
                    <Text>{comment.content}</Text>
                    <View style={styles.commentActions}>
                        <Button onPress={() => onLike(comment.id, comment.is_liked_by_user)} textColor={colors.textSecondary}>
                            {comment.like_count > 0 ? `${comment.like_count} Beğeni` : 'Beğen'}
                        </Button>
                        <Button onPress={() => onReply(comment.username, comment.id)} textColor={colors.textSecondary}>Yanıtla</Button>
                    </View>
                </View>
            </View>

            {comment.reply_count > 0 && (
                <TouchableOpacity onPress={handleToggleReplies} style={styles.replyToggle}>
                    <Text style={styles.replyToggleText}>
                        {showReplies ? 'Yanıtları gizle' : `${comment.reply_count} yanıtı görüntüle`}
                    </Text>
                </TouchableOpacity>
            )}

            {showReplies && (
                <View style={styles.repliesContainer}>
                    {/* --- İŞTE BÜTÜN DÜZELTME BU SATIRDA --- */}
                    {replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} onReply={onReply} onLike={onLike} />
                    ))}
                    {loadingReplies && <ActivityIndicator style={{ marginVertical: 10 }} />}
                    {replies.length < comment.reply_count && !loadingReplies && (
                        <Button onPress={fetchReplies}>
                            {`Kalan ${comment.reply_count - replies.length} yanıtı göster`}
                        </Button>
                    )}
                </View>
            )}
        </View>
    );
};


// --- ANA YORUM EKRANI (DEĞİŞİKLİK YOK) ---
const CommentsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { postId, postCaption } = route.params;

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const textInputRef = useRef(null);


    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setCurrentUser(user);
            }
        });
    }, []);



    const fetchComments = useCallback(async () => {
        const { data, error } = await supabase.rpc('get_comments_for_post', { post_id_in: postId });
        if (error) {
            Alert.alert("Hata", "Yorumlar yüklenemedi.");
        } else {
            setComments(data || []);
        }
        setLoading(false);
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handlePostComment = async () => {
        if (!newComment.trim() || !currentUser) return;

        const contentToPost = newComment.trim();
        const parentId = replyingTo ? replyingTo.commentId : null;

        setNewComment('');
        setReplyingTo(null);

        const { error } = await supabase
            .from('comments')
            .insert({ 
                post_id: postId, 
                user_id: currentUser.id, 
                content: contentToPost,
                parent_comment_id: parentId
            });

        if (error) {
            Alert.alert("Hata", "Yorum gönderilemedi.");
            setNewComment(contentToPost);
            setReplyingTo(parentId ? replyingTo : null);
        } else {
            fetchComments();
        }
    };

    const handleLikeComment = async (commentId, isCurrentlyLiked) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const updatedComments = comments.map(c => {
            if (c.id === commentId) {
                return { 
                    ...c, 
                    is_liked_by_user: !isCurrentlyLiked, 
                    like_count: c.like_count + (isCurrentlyLiked ? -1 : 1)
                };
            }
            return c;
        });
        setComments(updatedComments);

        if (isCurrentlyLiked) {
            await supabase.from('comment_likes').delete().match({ comment_id: commentId, user_id: user.id });
        } else {
            await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id });
        }
    };

    const handleReply = (username, commentId) => {
        setReplyingTo({ username, commentId });
        textInputRef.current?.focus(); 
    };


    if (loading) { return <ActivityIndicator style={styles.centered} />; }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Yorumlar" />
            </Appbar.Header>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <CommentItem comment={item} onReply={handleReply} onLike={handleLikeComment} />
                    )}
                    ListHeaderComponent={() => (
                        <View style={styles.postInfoContainer}>
                            <Text>{postCaption}</Text>
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.centered}>
                            <Text>Henüz hiç yorum yapılmamış. İlk yorumu sen yap!</Text>
                        </View>
                    )}
                />
                
                <View style={styles.inputOuterContainer}>
                    {replyingTo && (
                        <View style={styles.replyingContainer}>
                            <Text style={styles.replyingText}>@{replyingTo.username} kullanıcısına yanıt veriliyor</Text>
                            <IconButton icon="close-circle" size={16} onPress={() => { setReplyingTo(null); }} />
                        </View>
                    )}
                    <View style={styles.inputInnerContainer}>
                        <TextInput
                            ref={textInputRef}
                            style={styles.textInput}
                            value={newComment}
                            onChangeText={setNewComment}
                            placeholder={replyingTo ? `@${replyingTo.username}...` : "Yorum ekle..."}
                            mode="outlined"
                            multiline
                        />
                        <Button onPress={handlePostComment}>Paylaş</Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.surface },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    postInfoContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface, },
    commentWrapper: { borderBottomWidth: 1, borderBottomColor: colors.border, },
    commentContainer: { flexDirection: 'row', padding: 16, },
    commentContent: { marginLeft: 12, flex: 1 },
    commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    commentUsername: { fontWeight: 'bold' },
    timestamp: { fontSize: 12, color: colors.textSecondary },
    commentActions: { flexDirection: 'row', marginTop: 8, marginLeft: -8 },
    replyToggle: { paddingLeft: 64, paddingBottom: 12, },
    replyToggleText: { color: colors.textSecondary, fontWeight: 'bold' },
    repliesContainer: { marginLeft: 48, borderLeftWidth: 2, borderLeftColor: colors.border, },
    inputOuterContainer: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
    },
    replyingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingTop: 8,
        backgroundColor: '#f0f0f0',
    },
    replyingText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    inputInnerContainer: {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        marginRight: 8,
    },
});

export default CommentsScreen;