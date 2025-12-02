import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useStore } from '../../src/store';
import { api } from '../../src/api/api';
import dayjs from 'dayjs';
import Button from '../../src/components/Button';

export default function BookingDetail() {
    const { id } = useLocalSearchParams();
    const theme = useTheme();
    const { getPoojaById, getTempleById } = useStore();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        loadBooking();
    }, [id]);

    const loadBooking = async () => {
        try {
            const data = await api.getBookingById(id as string);
            setBooking(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load booking:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!booking) return;

        const timer = setInterval(() => {
            const bookingTime = dayjs(`${booking.date} ${booking.slotId}`, 'YYYY-MM-DD HH:mm');
            const now = dayjs();
            const diff = bookingTime.diff(now);

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setCountdown('Pooja time!');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [booking]);

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!booking) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.text }}>Booking not found</Text>
            </View>
        );
    }

    const pooja = getPoojaById(booking.poojaId);
    const temple = getTempleById(booking.templeId);
    const streamStatus = booking.streamStatus || 'upcoming';

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{pooja?.title}</Text>
                <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{temple?.name}</Text>
                <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
                    {booking.date} at {booking.slotId}
                </Text>
            </View>

            {streamStatus === 'upcoming' && (
                <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>⏰ Countdown to Pooja</Text>
                    <Text style={[styles.countdown, { color: theme.colors.primary }]}>{countdown}</Text>
                    <Text style={[styles.hint, { color: theme.colors.muted }]}>
                        Live stream will start when the pooja begins
                    </Text>
                </View>
            )}

            {streamStatus === 'live' && (
                <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>🔴 Live Now!</Text>
                    <View style={styles.videoContainer}>
                        <Text style={{ color: theme.colors.text, marginBottom: 12 }}>Live Stream</Text>
                        {/* Placeholder for video - in production, use actual video player */}
                        <View style={styles.videoPlaceholder}>
                            <Text style={{ color: '#fff' }}>🙏 Live Pooja Stream</Text>
                            <Text style={{ color: '#ccc', fontSize: 12, marginTop: 8 }}>
                                Video feed from temple
                            </Text>
                        </View>
                    </View>
                    <Button
                        title="Watch Live Stream"
                        onPress={() => router.push({
                            pathname: '/live/[bookingId]',
                            params: { bookingId: booking._id, streamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
                        })}
                        style={{ marginTop: 16 }}
                    />
                </View>
            )}

            {streamStatus === 'completed' && booking.recordingUrl && (
                <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>✅ Pooja Completed</Text>
                    <Text style={[styles.hint, { color: theme.colors.muted }]}>
                        Your pooja has been completed. Watch the recording below.
                    </Text>
                    <Button
                        title="Watch Recording"
                        onPress={() => router.push({
                            pathname: '/recording/[bookingId]',
                            params: { bookingId: booking._id, recordingUrl: booking.recordingUrl }
                        })}
                        style={{ marginTop: 16 }}
                    />
                </View>
            )}

            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Booking Details</Text>
                <DetailRow label="Booking ID" value={booking._id} theme={theme} />
                <DetailRow label="Amount Paid" value={`₹${booking.amountINR}`} theme={theme} />
                <DetailRow label="Status" value={booking.status} theme={theme} />
                {booking.inputs?.gotra && <DetailRow label="Gotra" value={booking.inputs.gotra} theme={theme} />}
                {booking.inputs?.nakshatra && <DetailRow label="Nakshatra" value={booking.inputs.nakshatra} theme={theme} />}
                {booking.inputs?.intentions && <DetailRow label="Intentions" value={booking.inputs.intentions} theme={theme} />}
            </View>
        </ScrollView>
    );
}

const DetailRow = ({ label, value, theme }: any) => (
    <View style={{ marginVertical: 4 }}>
        <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: theme.colors.text, fontSize: 16 }}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    countdown: {
        fontSize: 32,
        fontWeight: '800',
        textAlign: 'center',
        marginVertical: 20,
    },
    hint: {
        fontSize: 14,
        textAlign: 'center',
    },
    videoContainer: {
        marginTop: 12,
    },
    videoPlaceholder: {
        backgroundColor: '#1a1a1a',
        height: 200,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
