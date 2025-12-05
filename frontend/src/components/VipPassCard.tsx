import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../theme';
import dayjs from 'dayjs';

type Props = {
    pass: any;
    onPress?: () => void;
};

export default function VipPassCard({ pass, onPress }: Props) {
    const theme = useTheme();
    const [isQRVisible, setIsQRVisible] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');

    useEffect(() => {
        checkQRVisibility();
        const interval = setInterval(checkQRVisibility, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [pass]);

    const checkQRVisibility = () => {
        const now = dayjs();
        const passDate = dayjs(pass.date);
        const slotTime = getSlotStartTime(pass.timeSlot);
        const passDateTime = passDate.set('hour', slotTime.hour).set('minute', slotTime.minute);

        // Show QR 1 hour before slot starts
        const oneHourBefore = passDateTime.subtract(1, 'hour');
        const slotEnd = passDateTime.add(3, 'hour'); // 3-hour slots

        const visible = now.isAfter(oneHourBefore) && now.isBefore(slotEnd);
        setIsQRVisible(visible);

        if (!visible && now.isBefore(oneHourBefore)) {
            const diff = oneHourBefore.diff(now);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeRemaining(`${hours}h ${minutes}m`);
        }
    };

    const getSlotStartTime = (slot: string) => {
        const times = {
            morning: { hour: 6, minute: 0 },
            afternoon: { hour: 12, minute: 0 },
            evening: { hour: 17, minute: 0 }
        };
        return times[slot as keyof typeof times] || times.morning;
    };

    const getStatusColor = () => {
        if (pass.status === 'used') return '#4CAF50';
        if (pass.status === 'expired') return '#9E9E9E';
        if (pass.status === 'cancelled') return '#F44336';
        return theme.colors.primary;
    };

    const getStatusIcon = () => {
        if (pass.status === 'used') return 'checkmark-circle';
        if (pass.status === 'expired') return 'time-outline';
        if (pass.status === 'cancelled') return 'close-circle';
        return 'ticket';
    };

    const styles = getStyles(theme, getStatusColor());

    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name={getStatusIcon()} size={24} color={getStatusColor()} />
                    <Text style={styles.title}>{pass.templeName}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor() }]}>
                        {pass.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color={theme.colors.muted} />
                    <Text style={styles.detailText}>{dayjs(pass.date).format('ddd, DD MMM YYYY')}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color={theme.colors.muted} />
                    <Text style={styles.detailText}>{pass.timeRange}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="person" size={16} color={theme.colors.muted} />
                    <Text style={styles.detailText}>VIP {pass.timeSlot} Slot</Text>
                </View>
            </View>

            {pass.status === 'active' && (
                <View style={styles.qrSection}>
                    {isQRVisible ? (
                        <>
                            <Text style={styles.qrTitle}>Show this QR at temple entrance</Text>
                            <View style={styles.qrContainer}>
                                <QRCode
                                    value={pass.qrCodeData}
                                    size={200}
                                    backgroundColor="white"
                                    color="black"
                                />
                            </View>
                            <Text style={styles.qrSubtitle}>Scan to validate VIP access</Text>
                        </>
                    ) : (
                        <View style={styles.countdown}>
                            <Ionicons name="lock-closed" size={32} color={theme.colors.muted} />
                            <Text style={styles.countdownText}>QR Code will be visible in</Text>
                            <Text style={styles.countdownTime}>{timeRemaining}</Text>
                            <Text style={styles.countdownSubtext}>1 hour before your slot time</Text>
                        </View>
                    )}
                </View>
            )}

            {pass.status === 'used' && pass.validatedAt && (
                <View style={styles.usedInfo}>
                    <Text style={styles.usedText}>
                        ✓ Used on {dayjs(pass.validatedAt).format('DD MMM YYYY, hh:mm A')}
                    </Text>
                </View>
            )}
        </Pressable>
    );
}

const getStyles = (theme: any, statusColor: string) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius,
            padding: 16,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: statusColor,
            ...theme.shadow,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        headerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginLeft: 8,
            flex: 1,
        },
        statusBadge: {
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
        },
        statusText: {
            fontSize: 11,
            fontWeight: '700',
        },
        details: {
            gap: 8,
            marginBottom: 16,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        detailText: {
            fontSize: 14,
            color: theme.colors.text,
        },
        qrSection: {
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            alignItems: 'center',
        },
        qrTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 12,
        },
        qrContainer: {
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginVertical: 8,
        },
        qrSubtitle: {
            fontSize: 12,
            color: theme.colors.muted,
            marginTop: 8,
        },
        countdown: {
            alignItems: 'center',
            paddingVertical: 20,
        },
        countdownText: {
            fontSize: 14,
            color: theme.colors.text,
            marginTop: 12,
        },
        countdownTime: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.primary,
            marginTop: 4,
        },
        countdownSubtext: {
            fontSize: 12,
            color: theme.colors.muted,
            marginTop: 4,
        },
        usedInfo: {
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
        usedText: {
            fontSize: 13,
            color: theme.colors.muted,
            textAlign: 'center',
        },
    });
