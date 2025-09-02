// src/screens/Events/BulusmalarScreen.js

import React, { useState } from 'react';
// DEĞİŞİKLİK 1: Gerekli importları düzenliyoruz
import { StyleSheet, ScrollView, Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

import EventsHeader from '../../components/events/EventsHeader';
import EventsFilterBar from '../../components/events/EventsFilterBar';
import EventCard from '../../components/events/EventCard';

const BulusmalarScreen = () => {
    // DEĞİİKLİK 2: Hook'u çağırıyoruz
    const insets = useSafeAreaInsets();
    const [selectedEvent, setSelectedEvent] = useState(null);

    const eventData = [
        {
            id: 1,
            title: 'Ankara Gece Sürüşü & Fotoğraf Çekimi',
            location: 'Anıttepe Otoparkı, Ankara',
            date: { day: '28', month: 'EYL' },
            time: '21:00 - 00:00',
            coverImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
            attendees: 48,
        },
        {
            id: 2,
            title: 'İstanbul Park Pist Günü Buluşması',
            location: 'Intercity İstanbul Park, Tuzla',
            date: { day: '05', month: 'EKM' },
            time: '10:00 - 17:00',
            coverImage: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqYsVDTgui-20CwutQUKDG8dd0o5sswh1jOqBPjiA9YvxV7V5tFhn26PtTj5d-o3w6TGSZOG2paenZzlv0dmiLCzowg3OBnPKflJZ7C2DmFmS4h8XSGxJm9mMLwGiEgq2wrqIw=s680-w680-h510-rw',
            attendees: 126,
        },
    ];

    return (
        // DEĞİŞİKLİK 3: Ana View'e dinamik paddingTop veriyoruz
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <EventsHeader />
            <EventsFilterBar />

            <ScrollView
                style={styles.scrollViewStyle}
                contentContainerStyle={styles.scrollContainer}
            >
                {eventData.map(event => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onPress={() => setSelectedEvent(event)}
                    />
                ))}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={selectedEvent !== null}
                onRequestClose={() => setSelectedEvent(null)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        onPress={() => setSelectedEvent(null)}
                    />

                    <View style={styles.modalContent}>
                        <View style={styles.handleBar} />
                        <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>

                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
                            <Text style={styles.infoText}>{selectedEvent?.location}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
                            <Text style={styles.infoText}>{selectedEvent?.time}</Text>
                        </View>

                        <TouchableOpacity style={styles.joinButton}>
                            <Text style={styles.joinButtonText}>Katıl</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// DEĞİŞİKLİK 4: Stil dosyasını güncelliyoruz
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    scrollViewStyle: {
        backgroundColor: colors.background,
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 120, // Floating navigasyon barı için boşluk
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingTop: 10,
        alignItems: 'center',
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: colors.border,
        borderRadius: 3,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    infoText: {
        color: colors.textSecondary,
        marginLeft: 10,
        fontSize: 16,
    },
    joinButton: {
        backgroundColor: colors.accent,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    joinButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BulusmalarScreen;