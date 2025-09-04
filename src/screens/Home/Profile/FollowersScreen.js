// src/screens/Profile/FollowersScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Appbar, Avatar, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../../services/supabase';
import colors from '../../../constants/colors';

// Listedeki her bir kullanıcı satırını temsil eden bileşen
const UserRow = ({ user, onFollowToggle, currentUserId }) => {
    const navigation = useNavigation();
    const [isFollowing, setIsFollowing] = useState(user.is_following);

    const handleToggle = async () => {
        setIsFollowing(!isFollowing); // Anında UI güncellemesi için
        await onFollowToggle(user.id, !isFollowing);
    };

    return (
        <TouchableOpacity 
            style={styles.userRow} 
            onPress={() => navigation.push('Profil', { userId: user.id })}
        >
            <Avatar.Image size={48} source={{ uri: user.avatar_url || 'https://via.placeholder.com/150' }} />
            <View style={styles.userInfo}>
                <Text style={styles.fullName}>{user.full_name || 'İsimsiz'}</Text>
                <Text style={styles.username}>@{user.username}</Text>
            </View>
            {/* Kullanıcı kendi kendini takip edemez, o yüzden butonu gizle */}
            {user.id !== currentUserId && (
                isFollowing ? (
                    <Button mode="outlined" onPress={handleToggle} style={styles.unfollowButton}>Takibi Bırak</Button>
                ) : (
                    <Button mode="contained" onPress={handleToggle} buttonColor={colors.accent}>Takip Et</Button>
                )
            )}
        </TouchableOpacity>
    );
};


const FollowersScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { profileId, screenTitle } = route.params; // Profil sahibinin ID'si ve ekran başlığı

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user.id);

            // Gelen `screenTitle`'a göre doğru Supabase fonksiyonunu çağır
            const functionName = screenTitle === 'Takipçiler' ? 'get_followers' : 'get_following';
            const { data, error } = await supabase.rpc(functionName, { profile_id: profileId });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            Alert.alert("Hata", "Liste yüklenirken bir sorun oluştu.");
        } finally {
            setLoading(false);
        }
    }, [profileId, screenTitle]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleFollowToggle = async (targetUserId, shouldFollow) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (shouldFollow) {
                // Takip Et
                await supabase.from('followers').insert({ follower_id: user.id, following_id: targetUserId });
            } else {
                // Takibi Bırak
                await supabase.from('followers').delete().match({ follower_id: user.id, following_id: targetUserId });
            }
        } catch (error) {
            // Hata durumunda UI'ı geri alabiliriz veya bir uyarı gösterebiliriz.
            Alert.alert("Hata", "İşlem sırasında bir sorun oluştu.");
            // Buton durumunu eski haline getir
            setUsers(currentUsers => currentUsers.map(u => 
                u.id === targetUserId ? { ...u, is_following: !shouldFollow } : u
            ));
        }
    };


    if (loading) {
        return <ActivityIndicator style={styles.centered} color={colors.accent} size="large" />;
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={screenTitle} />
            </Appbar.Header>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <UserRow user={item} onFollowToggle={handleFollowToggle} currentUserId={currentUserId} />
                )}
                ListEmptyComponent={() => (
                    <View style={styles.centered}>
                        <Text>Bu listede kimse yok.</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.surface },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    userRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    userInfo: { flex: 1, marginLeft: 16 },
    fullName: { fontWeight: 'bold' },
    username: { color: colors.textSecondary },
    unfollowButton: { borderColor: colors.textSecondary },
});

export default FollowersScreen;