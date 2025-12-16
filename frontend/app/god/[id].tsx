import React from 'react'
import { View, Text, ScrollView, Image, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useStore } from '../../src/store'
import { useTheme } from '../../src/theme'
import { Ionicons } from '@expo/vector-icons'

export default function GodDetail() {
    const { id } = useLocalSearchParams()
    const { getGodById } = useStore()
    const theme = useTheme()
    const god = getGodById(id as string)
    const styles = getStyles(theme)

    if (!god) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={{ color: theme.colors.text }}>God details not found.</Text>
                <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: theme.colors.primary }}>Go Back</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header Image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: god.image }} style={styles.image} />
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <View style={styles.titleOverlay}>
                    <Text style={styles.title}>{god.name}</Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* Description */}
                <Text style={styles.description}>{god.description}</Text>

                {/* Teachings Section */}
                {god.teachings && god.teachings.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>✨ Divine Teachings</Text>
                        {god.teachings.map((teaching: string, index: number) => (
                            <View key={index} style={styles.listItem}>
                                <Ionicons name="flower-outline" size={16} color={theme.colors.primary} style={{ marginTop: 2 }} />
                                <Text style={styles.listText}>{teaching}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Mantras Section */}
                {god.mantras && god.mantras.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🕉️ Powerful Mantras</Text>
                        {god.mantras.map((mantra: any, index: number) => (
                            <View key={index} style={styles.card}>
                                <Text style={styles.mantraTitle}>{mantra.title}</Text>
                                <Text style={styles.mantraText}>{mantra.text}</Text>
                                <Text style={styles.mantraMeaning}>{mantra.meaning}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Stories Section */}
                {god.stories && god.stories.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📜 Legend & Stories</Text>
                        {god.stories.map((story: any, index: number) => (
                            <View key={index} style={styles.card}>
                                <Text style={styles.storyTitle}>{story.title}</Text>
                                <Text style={styles.storyContent}>{story.content}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Top Mandirs Section */}
                {god.topMandirs && god.topMandirs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Temple Abodes</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {god.topMandirs.map((mandir: any, index: number) => (
                                <View key={index} style={styles.mandirCard}>
                                    <Text style={styles.mandirName}>{mandir.name}</Text>
                                    <Text style={styles.mandirLocation}>{mandir.location}</Text>
                                    <Text style={styles.mandirDesc} numberOfLines={2}>{mandir.description}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

            </View>
        </ScrollView>
    )
}

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: 300,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 8,
    },
    titleOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingTop: 40,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', // Note: linear-gradient not supported in RN usually without library, using simpler approach
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    content: {
        padding: 20,
    },
    description: {
        fontSize: 16,
        color: theme.colors.text,
        lineHeight: 24,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.primary,
        marginBottom: 12,
    },
    listItem: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    listText: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.text,
        lineHeight: 22,
    },
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
    },
    mantraTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 4,
    },
    mantraText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: theme.colors.primary,
        marginBottom: 8,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    },
    mantraMeaning: {
        fontSize: 14,
        color: theme.colors.muted,
    },
    storyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 6
    },
    storyContent: {
        fontSize: 14,
        color: theme.colors.text,
        lineHeight: 20
    },
    mandirCard: {
        width: 200,
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    mandirName: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.colors.text,
    },
    mandirLocation: {
        fontSize: 12,
        color: theme.colors.muted,
        marginBottom: 4,
    },
    mandirDesc: {
        fontSize: 12,
        color: theme.colors.text,
    }
})

import { Platform } from 'react-native'
