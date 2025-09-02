// src/components/events/EventCard.js

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

// DEĞİŞİKLİK: 'onPress' adında yeni bir prop alıyoruz
const EventCard = ({ event, onPress }) => (
    // DEĞİŞİKLİK: TouchableOpacity'nin onPress'ini bu prop'a bağlıyoruz
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image source={{ uri: event.coverImage }} style={styles.cardImage} />
        <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeDay}>{event.date.day}</Text>
            <Text style={styles.dateBadgeMonth}>{event.date.month}</Text>
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>{event.title}</Text>
            <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>{event.location}</Text>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>{event.time}</Text>
            </View>
            <View style={styles.attendeesContainer}>
                <View style={styles.attendeeImages}>
                    <Image source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} style={styles.attendeeImage} />
                    <Image source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' }} style={[styles.attendeeImage, { marginLeft: -10 }]} />
                    <Image source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' }} style={[styles.attendeeImage, { marginLeft: -10 }]} />
                </View>
                <Text style={styles.attendeeText}>{event.attendees} kişi katılıyor</Text>
            </View>
        </View>
    </TouchableOpacity>
);

// Stiller aynı kalabilir, sadece cardTitle'a numberOfLines ekledim
const styles = StyleSheet.create({
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
        minHeight: 44, // Başlığın 2 satır kaplaması için
    },
    // ... diğer tüm stiller aynı
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    dateBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
    },
    dateBadgeDay: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    dateBadgeMonth: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    cardContent: {
        padding: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoText: {
        color: colors.textSecondary,
        marginLeft: 8,
    },
    attendeesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.background,
        paddingTop: 12,
    },
    attendeeImages: {
        flexDirection: 'row',
    },
    attendeeImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: colors.surface,
    },
    attendeeText: {
        marginLeft: 8,
        color: colors.textSecondary,
        fontWeight: '500',
    },
});

export default EventCard;