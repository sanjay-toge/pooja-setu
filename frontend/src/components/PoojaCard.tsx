import React from 'react'
import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../theme'
import { Ionicons } from '@expo/vector-icons'

export type PoojaCardProps = {
    title: string
    subtitle?: string
    price: number
    image?: string
    duration?: string
    participants?: number
    onPress?: () => void
}

export default function PoojaCard({
    title,
    subtitle,
    price,
    image,
    duration,
    participants,
    onPress
}: PoojaCardProps) {
    const theme = useTheme()

    return (
        <Pressable
            onPress={onPress}
            style={[{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius,
                marginVertical: 8,
                overflow: 'hidden'
            }, theme.shadow]}
        >
            {/* Image Section */}
            {image && (
                <View style={{ height: 180, width: '100%' }}>
                    <Image
                        source={{ uri: image }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                    {/* Price Tag Overlay */}
                    <View style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                    }}>
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                            ₹{price}
                        </Text>
                    </View>
                </View>
            )}

            {/* Content Section */}
            <View style={{ padding: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 8 }}>
                    {title}
                </Text>

                {subtitle && (
                    <Text style={{ color: theme.colors.muted, fontSize: 14, marginBottom: 12 }} numberOfLines={2}>
                        {subtitle}
                    </Text>
                )}

                <View style={{ height: 1, backgroundColor: theme.colors.border, marginBottom: 12 }} />

                {/* Info Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                    {/* Duration */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                            backgroundColor: theme.mode === 'dark' ? '#333' : '#f0f0f0',
                            padding: 6,
                            borderRadius: 8,
                            marginRight: 8
                        }}>
                            <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                        </View>
                        <View>
                            <Text style={{ fontSize: 11, color: theme.colors.muted }}>Duration</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.text }}>
                                {duration || '1 hr'}
                            </Text>
                        </View>
                    </View>

                    {/* Participants */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                            backgroundColor: theme.mode === 'dark' ? '#333' : '#f0f0f0',
                            padding: 6,
                            borderRadius: 8,
                            marginRight: 8
                        }}>
                            <Ionicons name="people-outline" size={16} color={theme.colors.primary} />
                        </View>
                        <View>
                            <Text style={{ fontSize: 11, color: theme.colors.muted }}>For Family</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.text }}>
                                {participants ? `${participants} People` : 'Family'}
                            </Text>
                        </View>
                    </View>

                </View>
            </View>
        </Pressable>
    )
}
