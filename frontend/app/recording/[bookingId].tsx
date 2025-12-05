import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../src/theme';

export default function Recording() {
    const { bookingId, recordingUrl } = useLocalSearchParams();
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text, fontSize: 18, marginBottom: 16 }}>Pooja Recording</Text>
            <Text style={{ color: theme.colors.muted }}>Booking ID: {bookingId}</Text>
            <View style={styles.placeholder}>
                <Text style={{ color: theme.colors.text }}>Recording will play here</Text>
                <Text style={{ color: theme.colors.muted, marginTop: 8 }}>Recording URL: {recordingUrl}</Text>
            </View>
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
        padding: 20,
        backgroundColor: '#333',
        borderRadius: 12,
        alignItems: 'center'
    }
});
