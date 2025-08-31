import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';

// Basit bir kart bileşeni
const FeatureCard = ({ icon, title, description }) => (
    <View style={styles.card}>
        <Ionicons name={icon} size={32} color={colors.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
    </View>
);

const HomeScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Ana Sayfa</Text>
                    <Text style={styles.headerSubtitle}>Hoş geldin, kullanıcı!</Text>
                </View>

                <FeatureCard
                    icon="qr-code-outline"
                    title="QR Kod Okut"
                    description="Hızlı ve güvenli bir şekilde QR kodlarını okutarak işlemlerini tamamla."
                />
                <FeatureCard
                    icon="stats-chart-outline"
                    title="İstatistikler"
                    description="Kullanım verilerini ve geçmiş aktivitelerini buradan görüntüle."
                />
                <FeatureCard
                    icon="notifications-outline"
                    title="Bildirimler"
                    description="Sana özel yeni bildirimleri ve duyuruları kaçırma."
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        padding: 20,
    },
    header: {
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: colors.text,
    },
    headerSubtitle: {
        fontSize: 18,
        color: colors.textSecondary,
        marginTop: 5,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
        marginTop: 10,
    },
    cardDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 5,
        lineHeight: 20,
    },
});

export default HomeScreen;