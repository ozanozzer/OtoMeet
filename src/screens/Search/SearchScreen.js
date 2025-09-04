// src/screens/Search/SearchScreen.js

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Searchbar, ActivityIndicator, Text, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import debounce from 'lodash.debounce'; // Arama performansını artırmak için

import { supabase } from '../../services/supabase';
import colors from '../../constants/colors';

// Arama sonuçlarında her bir kullanıcıyı gösterecek basit bileşen
const UserListItem = ({ user, onPress }) => (
    <TouchableOpacity style={styles.userItem} onPress={onPress}>
        <Avatar.Image size={48} source={{ uri: user.avatar_url || 'https://via.placeholder.com/150' }} />
        <View style={styles.userInfo}>
            <Text style={styles.fullName}>{user.full_name || 'İsimsiz'}</Text>
            <Text style={styles.username}>@{user.username}</Text>
        </View>
    </TouchableOpacity>
);

const SearchScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    
    // Arama fonksiyonu
    const searchUsers = async (query) => {
        if (!query.trim()) {
            setUsers([]);
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                // Arama: username VEYA full_name içinde arama metni geçenleri getir
                .select('*')
                .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
                .limit(10);

            if (error) throw error;
            setUsers(data || []);

        } catch (error) {
            Alert.alert("Hata", "Kullanıcı aranırken bir sorun oluştu.");
        } finally {
            setLoading(false);
        }
    };

    // Her tuşa basıldığında arama yapmasın, kullanıcı yazmayı bıraktıktan 500ms sonra yapsın.
    // Bu, veritabanını gereksiz yere yormaz.
    const debouncedSearch = useCallback(debounce(searchUsers, 500), []);

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        debouncedSearch(query);
    };

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Kullanıcı veya grup ara..."
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={styles.searchbar}
            />
            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <UserListItem 
                            user={item} 
                            onPress={() => navigation.navigate('Profil', { userId: item.id })} // Profil ekranına yönlendir
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text>Aramak için yazmaya başla.</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: 50 }, // paddingTop eklendi
    searchbar: { margin: 16 },
    userItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    userInfo: { marginLeft: 16 },
    fullName: { fontWeight: 'bold' },
    username: { color: colors.textSecondary },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }
});

export default SearchScreen;