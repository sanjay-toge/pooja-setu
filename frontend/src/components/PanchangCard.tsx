import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { PanchangData } from '../services/panchang';
import { getDailyHoroscope } from '../utils/dailyHoroscope';

type Props = {
    panchang: PanchangData;
};

export default function PanchangCard({ panchang }: Props) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const [isFlipped, setIsFlipped] = useState(false);
    const flipAnimation = useRef(new Animated.Value(0)).current;
    const horoscope = getDailyHoroscope();

    const handleFlip = () => {
        Animated.spring(flipAnimation, {
            toValue: isFlipped ? 0 : 180,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
        setIsFlipped(!isFlipped);
    };

    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    return (
        <Pressable onPress={handleFlip} style={styles.cardContainer}>
            {/* Front Side - Panchang */}
            <Animated.View style={[styles.card, frontAnimatedStyle, isFlipped && styles.hidden]}>
                <View style={styles.header}>
                    <Ionicons name="calendar" size={24} color={theme.colors.primary} />
                    <Text style={styles.title}>Today's Panchang</Text>
                    <Ionicons name="swap-horizontal" size={16} color={theme.colors.muted} style={{ marginLeft: 'auto' }} />
                </View>

                <Text style={styles.date}>{panchang.date}</Text>

                <View style={styles.grid}>
                    <InfoItem icon="moon" label="Tithi" value={panchang.tithi} theme={theme} />
                    <InfoItem icon="star" label="Nakshatra" value={panchang.nakshatra} theme={theme} />
                    <InfoItem icon="infinite" label="Yoga" value={panchang.yoga} theme={theme} />
                    <InfoItem icon="ellipsis-horizontal" label="Karana" value={panchang.karana} theme={theme} />
                </View>

                <View style={styles.timings}>
                    <View style={styles.timingRow}>
                        <View style={styles.timingItem}>
                            <Ionicons name="sunny" size={20} color="#FDB813" />
                            <Text style={styles.timingLabel}>Sunrise</Text>
                            <Text style={styles.timingValue}>{panchang.sunrise}</Text>
                        </View>
                        <View style={styles.timingItem}>
                            <Ionicons name="moon" size={20} color="#FFB84D" />
                            <Text style={styles.timingLabel}>Sunset</Text>
                            <Text style={styles.timingValue}>{panchang.sunset}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.inauspiciousSection}>
                        <Text style={styles.inauspiciousTitle}>⚠️ Inauspicious Timings</Text>
                        <View style={styles.timingRow}>
                            <View style={styles.timingItem}>
                                <Text style={styles.timingLabel}>Rahukaal</Text>
                                <Text style={styles.timingValue}>{panchang.rahukaal}</Text>
                            </View>
                            <View style={styles.timingItem}>
                                <Text style={styles.timingLabel}>Gulika Kaal</Text>
                                <Text style={styles.timingValue}>{panchang.gulikaKaal}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.hint}>
                    <Text style={styles.hintText}>Tap to view today's horoscope</Text>
                </View>
            </Animated.View>

            {/* Back Side - Horoscope */}
            <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, !isFlipped && styles.hidden]}>
                <View style={styles.header}>
                    <Ionicons name="star" size={24} color={theme.colors.primary} />
                    <Text style={styles.title}>Today's Horoscope</Text>
                    <Ionicons name="swap-horizontal" size={16} color={theme.colors.muted} style={{ marginLeft: 'auto' }} />
                </View>

                <Text style={styles.date}>{horoscope.date}</Text>

                <View style={styles.horoscopeSection}>
                    <RatingItem
                        icon="fitness"
                        label="Health"
                        rating={horoscope.health.rating}
                        description={horoscope.health.description}
                        theme={theme}
                    />
                    <RatingItem
                        icon="heart"
                        label="Love & Relationships"
                        rating={horoscope.love.rating}
                        description={horoscope.love.description}
                        theme={theme}
                    />
                    <RatingItem
                        icon="briefcase"
                        label="Work & Business"
                        rating={horoscope.work.rating}
                        description={horoscope.work.description}
                        theme={theme}
                    />
                    <RatingItem
                        icon="sunny"
                        label="Overall Day"
                        rating={horoscope.overall.rating}
                        description={horoscope.overall.description}
                        theme={theme}
                        isOverall
                    />
                </View>

                <View style={styles.hint}>
                    <Text style={styles.hintText}>Tap to view panchang</Text>
                </View>
            </Animated.View>
        </Pressable>
    );
}

type InfoItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    theme: any;
};

function InfoItem({ icon, label, value, theme }: InfoItemProps) {
    const infoItemStyles = StyleSheet.create({
        item: {
            flex: 1,
            width: '48%',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center' as const,
            backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f5f5f5'
        },
        label: {
            fontSize: 12,
            marginTop: 4,
            color: theme.colors.muted
        },
        value: {
            fontSize: 14,
            fontWeight: '600' as const,
            marginTop: 2,
            color: theme.colors.text
        }
    });

    return (
        <View style={infoItemStyles.item}>
            <Ionicons name={icon} size={18} color={theme.colors.primary} />
            <Text style={infoItemStyles.label}>{label}</Text>
            <Text style={infoItemStyles.value}>{value}</Text>
        </View>
    );
}

type RatingItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    rating: number;
    description: string;
    theme: any;
    isOverall?: boolean;
};

function RatingItem({ icon, label, rating, description, theme, isOverall }: RatingItemProps) {
    const ratingStyles = StyleSheet.create({
        container: {
            marginBottom: 16,
            padding: 14,
            borderRadius: 12,
            backgroundColor: isOverall
                ? (theme.mode === 'dark' ? '#2a2a3a' : '#f0f0ff')
                : (theme.mode === 'dark' ? '#2a2a2a' : '#f5f5f5'),
            borderWidth: isOverall ? 1 : 0,
            borderColor: theme.colors.primary + '40',
        },
        headerRow: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            marginBottom: 8,
        },
        label: {
            fontSize: 15,
            fontWeight: '700' as const,
            color: theme.colors.text,
            marginLeft: 8,
            flex: 1,
        },
        stars: {
            flexDirection: 'row' as const,
            gap: 4,
        },
        description: {
            fontSize: 13,
            color: theme.colors.muted,
            marginTop: 4,
            lineHeight: 18,
        }
    });

    return (
        <View style={ratingStyles.container}>
            <View style={ratingStyles.headerRow}>
                <Ionicons name={icon} size={20} color={theme.colors.primary} />
                <Text style={ratingStyles.label}>{label}</Text>
                <View style={ratingStyles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                            key={star}
                            name={star <= rating ? 'star' : 'star-outline'}
                            size={16}
                            color={star <= rating ? '#FFD700' : theme.colors.muted}
                        />
                    ))}
                </View>
            </View>
            <Text style={ratingStyles.description}>{description}</Text>
        </View>
    );
}

const getStyles = (theme: any) =>
    StyleSheet.create({
        cardContainer: {
            marginBottom: 16,
            height: 450,
        },
        card: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius,
            padding: 16,
            ...theme.shadow,
            backfaceVisibility: 'hidden',
        },
        cardBack: {
            position: 'absolute',
        },
        hidden: {
            display: 'none',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginLeft: 8,
        },
        date: {
            fontSize: 14,
            color: theme.colors.muted,
            marginBottom: 16,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
        },
        timings: {
            backgroundColor: theme.mode === 'dark' ? '#1a1a1a' : '#fafafa',
            borderRadius: 8,
            padding: 12,
        },
        timingRow: {
            flexDirection: 'row',
            justifyContent: 'space-around',
        },
        timingItem: {
            alignItems: 'center',
            flex: 1,
        },
        timingLabel: {
            fontSize: 12,
            color: theme.colors.muted,
            marginTop: 4,
        },
        timingValue: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginTop: 2,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: 12,
        },
        inauspiciousSection: {
            paddingTop: 4,
        },
        inauspiciousTitle: {
            fontSize: 13,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
            textAlign: 'center',
        },
        hint: {
            position: 'absolute',
            bottom: 12,
            left: 0,
            right: 0,
            alignItems: 'center',
        },
        hintText: {
            fontSize: 11,
            color: theme.colors.muted,
            fontStyle: 'italic',
        },
        horoscopeSection: {
            flex: 1,
        },
    });
