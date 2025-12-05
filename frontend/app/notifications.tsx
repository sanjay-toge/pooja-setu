import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function NotificationsScreen() {
    const theme = useTheme();
    const styles = getStyles(theme);

    // Mock notifications data - in production this would come from your backend
    const notifications = [
        {
            id: '1',
            type: 'booking',
            title: 'Booking Confirmed',
            message: 'Your pooja booking for tomorrow has been confirmed',
            time: '2 hours ago',
            read: false,
            icon: 'checkmark-circle' as const,
            color: '#4CAF50'
        },
        {
            id: '2',
            type: 'vip',
            title: 'VIP Pass Active',
            message: 'Your VIP pass QR code is now visible. Show it at the temple entrance',
            time: '5 hours ago',
            read: false,
            icon: 'star' as const,
            color: '#FFD700'
        },
        {
            id: '3',
            type: 'reminder',
            title: 'Pooja Reminder',
            message: 'Your scheduled pooja is tomorrow at 10:00 AM',
            time: '1 day ago',
            read: true,
            icon: 'time' as const,
            color: '#2196F3'
        },
        {
            id: '4',
            type: 'offer',
            title: 'Special Offer',
            message: 'Get 20% off on VIP passes this week',
            time: '2 days ago',
            read: true,
            icon: 'gift' as const,
            color: '#FF9800'
        },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <Pressable
                            key={notification.id}
                            style={[
                                styles.notificationCard,
                                !notification.read && styles.unreadCard
                            ]}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: notification.color + '20' }]}>
                                <Ionicons name={notification.icon} size={24} color={notification.color} />
                            </View>
                            <View style={styles.notificationContent}>
                                <Text style={styles.notificationTitle}>{notification.title}</Text>
                                <Text style={styles.notificationMessage}>{notification.message}</Text>
                                <Text style={styles.notificationTime}>{notification.time}</Text>
                            </View>
                            {!notification.read && <View style={styles.unreadDot} />}
                        </Pressable>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={80} color={theme.colors.muted} />
                        <Text style={styles.emptyTitle}>No Notifications</Text>
                        <Text style={styles.emptyText}>
                            You're all caught up! Notifications will appear here.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 60,
            paddingBottom: 16,
            backgroundColor: theme.colors.background,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        backButton: {
            padding: 8,
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.colors.text,
        },
        content: {
            flex: 1,
            padding: 16,
        },
        notificationCard: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            backgroundColor: theme.colors.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            ...theme.shadow,
        },
        unreadCard: {
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary,
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        notificationContent: {
            flex: 1,
        },
        notificationTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: 4,
        },
        notificationMessage: {
            fontSize: 14,
            color: theme.colors.text,
            lineHeight: 20,
            marginBottom: 6,
        },
        notificationTime: {
            fontSize: 12,
            color: theme.colors.muted,
        },
        unreadDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: theme.colors.primary,
            marginLeft: 8,
            marginTop: 4,
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 100,
        },
        emptyTitle: {
            fontSize: 22,
            fontWeight: '700',
            color: theme.colors.text,
            marginTop: 20,
            marginBottom: 8,
        },
        emptyText: {
            fontSize: 15,
            color: theme.colors.muted,
            textAlign: 'center',
            paddingHorizontal: 40,
            lineHeight: 22,
        },
    });
