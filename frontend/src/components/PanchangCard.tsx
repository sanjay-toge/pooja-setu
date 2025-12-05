import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { PanchangData } from '../services/panchang';

type Props = {
    panchang: PanchangData;
};

export default function PanchangCard({ panchang }: Props) {
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="calendar" size={24} color={theme.colors.primary} />
                <Text style={styles.title}>Today's Panchang</Text>
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
        </View>
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
        infoItem: {
            flex: 1,
            minWidth: '48%',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
        },
        infoLabel: {
            fontSize: 12,
            marginTop: 4,
        },
        infoValue: {
            fontSize: 14,
            fontWeight: '600',
            marginTop: 2,
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
    });
