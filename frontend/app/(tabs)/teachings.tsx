import React, { useEffect } from 'react'
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Dimensions } from 'react-native'
import { useStore } from '../../src/store'
import { useTheme } from '../../src/theme'
import { router } from 'expo-router'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2

export default function Teachings() {
    const { gods, fetchData, isLoading } = useStore()
    const theme = useTheme()

    useEffect(() => {
        fetchData()
    }, [])

    const styles = getStyles(theme)

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Divine Teachings</Text>
                <Text style={styles.subtitle}>Explore the wisdom of the Gods</Text>
            </View>

            <View style={styles.grid}>
                {gods.map((god: any) => (
                    <Pressable
                        key={god.id}
                        style={styles.card}
                        onPress={() => router.push(`/god/${god.id}`)}
                    >
                        <Image source={{ uri: god.image }} style={styles.image} />
                        <View style={styles.cardContent}>
                            <Text style={styles.godName}>{god.name}</Text>
                            <Text numberOfLines={2} style={styles.description}>{god.description}</Text>
                        </View>
                    </Pressable>
                ))}
            </View>

            {gods.length === 0 && !isLoading && (
                <View style={styles.emptyContainer}>
                    <Text style={{ color: theme.colors.muted }}>Loading divine knowledge...</Text>
                </View>
            )}
        </ScrollView>
    )
}

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.muted,
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        paddingBottom: 40,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 12,
    },
    godName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        color: theme.colors.muted,
        lineHeight: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50
    }
})
