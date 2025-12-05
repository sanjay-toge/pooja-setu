import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { HoroscopeData } from '../services/horoscope';

type Props = {
    horoscope: HoroscopeData;
};

const zodiacIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Aries: 'flame',
    Taurus: 'leaf',
    Gemini: 'people',
    Cancer: 'water',
    Leo: 'sunny',
    Virgo: 'analytics',
    Libra: 'scale',
    Scorpio: 'bug',
    Sagittarius: 'arrow-up',
    Capricorn: 'triangle',
    Aquarius: 'water-outline',
    Pisces: 'fish',
};

export default function HoroscopeCard({ horoscope }: Props) {
    const theme = useTheme();
    const styles = getStyles(theme);

    const renderStars = () => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
                key={i}
                name={i < horoscope.rating ? 'star' : 'star-outline'}
                size={16}
                color="#FFD700"
            />
        ));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.zodiacIcon}>
                    <Ionicons
                        name={zodiacIcons[horoscope.sign]}
                        size={32}
                        color={theme.colors.primary}
                    />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.title}>{horoscope.sign}</Text>
                    <Text style={styles.date}>{horoscope.date}</Text>
                </View>
            </View>

            <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Today's Rating: </Text>
                <View style={styles.stars}>{renderStars()}</View>
            </View>

            <Text style={styles.prediction}>{horoscope.prediction}</Text>

            <View style={styles.luckySection}>
                <View style={styles.luckyItem}>
                    <Ionicons name="dice" size={18} color={theme.colors.primary} />
                    <Text style={styles.luckyLabel}>Lucky Number</Text>
                    <Text style={styles.luckyValue}>{horoscope.luckyNumber}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.luckyItem}>
                    <Ionicons name="color-palette" size={18} color={theme.colors.primary} />
                    <Text style={styles.luckyLabel}>Lucky Color</Text>
                    <Text style={styles.luckyValue}>{horoscope.luckyColor}</Text>
                </View>
            </View>

            <View style={styles.adviceSection}>
                <View style={styles.adviceHeader}>
                    <Ionicons name="bulb" size={16} color="#FFB84D" />
                    <Text style={styles.adviceTitle}>Spiritual Guidance</Text>
                </View>
                <Text style={styles.adviceText}>{horoscope.advice}</Text>
            </View>
        </View>
    );
}

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius,
            padding: 16,
            marginBottom: 16,
            ...theme.shadow,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        zodiacIcon: {
            width: 60,
            height: 60,
            backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        headerText: {
            flex: 1,
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        date: {
            fontSize: 13,
            color: theme.colors.muted,
            marginTop: 2,
        },
        ratingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        ratingLabel: {
            fontSize: 14,
            color: theme.colors.text,
            fontWeight: '600',
        },
        stars: {
            flexDirection: 'row',
            gap: 2,
        },
        prediction: {
            fontSize: 15,
            lineHeight: 22,
            color: theme.colors.text,
            marginBottom: 16,
        },
        luckySection: {
            flexDirection: 'row',
            backgroundColor: theme.mode === 'dark' ? '#1a1a1a' : '#fafafa',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
        },
        luckyItem: {
            flex: 1,
            alignItems: 'center',
        },
        luckyLabel: {
            fontSize: 12,
            color: theme.colors.muted,
            marginTop: 4,
        },
        luckyValue: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.text,
            marginTop: 2,
        },
        divider: {
            width: 1,
            backgroundColor: theme.colors.border,
            marginHorizontal: 12,
        },
        adviceSection: {
            backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#fff3e0',
            borderRadius: 8,
            padding: 12,
            borderLeftWidth: 3,
            borderLeftColor: '#FFB84D',
        },
        adviceHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
        },
        adviceTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginLeft: 6,
        },
        adviceText: {
            fontSize: 13,
            lineHeight: 19,
            color: theme.colors.text,
        },
    });
