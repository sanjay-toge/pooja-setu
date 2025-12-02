import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../src/theme';
import Button from '../../src/components/Button';

export default function LiveStream() {
    const { bookingId, streamUrl } = useLocalSearchParams();
    const theme = useTheme();

    const openYouTube = () => {
        // Open YouTube video - using a sample pooja video
        const youtubeUrl = 'https://www.youtube.com/watch?v=Eq4LJd_2rys'; // Sample Ganesh pooja video
        Linking.openURL(youtubeUrl);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '700', marginBottom: 16 }}>
                🔴 Live Pooja Stream
            </Text>
            <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>Booking ID: {bookingId}</Text>

            <View style={styles.placeholder}>
                <Text style={{ color: '#fff', fontSize: 18, marginBottom: 12 }}>🙏 Live from Temple</Text>
                <Text style={{ color: '#ccc', textAlign: 'center', marginBottom: 20 }}>
                    Watch your pooja ceremony happening live at the temple
                </Text>
                <Button title="Open Live Stream (YouTube)" onPress={openYouTube} />
            </View>

            <Text style={{ color: theme.colors.muted, fontSize: 12, marginTop: 16, textAlign: 'center' }}>
                For demo purposes, this opens a sample video. In production, this will show your actual live pooja feed.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    placeholder: {
        marginTop: 20,
        padding: 24,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        alignItems: 'center'
    }
});
