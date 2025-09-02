import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Ekran genişliğini alarak 3 sütunlu bir grid oluşturalım
const { width } = Dimensions.get('window');
const postSize = (width - 4) / 3; // Kenarlardaki boşlukları hesaba katıyoruz

const ProfileContent = ({ posts }) => (
    <View style={styles.container}>
        {posts.map(post => (
            <TouchableOpacity key={post.id} style={styles.postItem}>
                <Image source={{ uri: post.image }} style={styles.postImage} />
                {post.type === 'video' && (
                    <Ionicons name="play" size={24} color="white" style={styles.videoIcon} />
                )}
            </TouchableOpacity>
        ))}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    postItem: {
        width: postSize,
        height: postSize,
        margin: 1,
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    videoIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});

export default ProfileContent;