import React, { useEffect } from 'react'
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { useTheme } from '../../src/theme'
import { router } from 'expo-router'
import Card from '../../src/components/Card'
import { useStore } from '../../src/store'
import { getRecommendations } from '../../src/utils/ai'

export default function Home() {
  const { filters, setFilter, temples, poojas, isLoading, fetchData, user } = useStore()
  const theme = useTheme()
  const recommendations = getRecommendations(user)

  useEffect(() => {
    fetchData()
  }, [])

  // Filter Logic
  const filteredTemples = temples.filter(t => {
    const q = filters.query?.toLowerCase() || ''
    if (!q) return true

    // Check City
    if (t.city.toLowerCase().includes(q)) return true

    // Check Deity
    if (t.deities.some((d: string) => d.toLowerCase().includes(q))) return true

    // Check Pooja Type
    const templePoojaTypes = poojas
      .filter(p => p.templeId === t.id)
      .map(p => p.type?.toLowerCase())

    if (templePoojaTypes.some(type => type?.includes(q))) return true

    return false
  })

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: '800', color: theme.colors.text }}>PoojaSetu</Text>
      <Text style={{ color: theme.colors.muted, marginBottom: 12 }}>Book poojas online • Watch live darshan</Text>
      <View style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 12, marginBottom: 12 }}>
        <Text style={{ marginBottom: 6, color: theme.colors.text }}>Search</Text>
        <TextInput
          value={filters.query || ''}
          onChangeText={t => setFilter('query', t)}
          placeholder='Search by City, Deity, or Pooja Type'
          placeholderTextColor={theme.colors.muted}
          style={{ backgroundColor: theme.mode === 'dark' ? '#404040' : '#fff', color: theme.colors.text, padding: 12, borderRadius: 8 }}
        />

        <Pressable onPress={() => router.push('/(tabs)/temples')} style={{ marginTop: 12, padding: 12, backgroundColor: theme.colors.primary, borderRadius: 12, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Search Temples</Text>
        </Pressable>
      </View>

      {/* AI Recommendations */}
      {user && recommendations.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: '700', marginBottom: 8, color: theme.colors.primary }}>✨ Recommended for You (AI)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendations.map(p => (
              <View key={p.id} style={{ width: 200, marginRight: 12 }}>
                <Card
                  title={p.title}
                  subtitle={`₹${p.basePriceINR}`}
                  onPress={() => router.push(`/pooja/${p.id}`)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <Text style={{ fontWeight: '700', marginBottom: 8, color: theme.colors.text }}>Featured Temples</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
      ) : (
        filteredTemples.map(t => (
          <Card key={t.id} title={t.name} subtitle={`${t.city} • ★ ${t.rating}`} image={t.heroImageUrl} onPress={() => router.push(`/temple/${t.id}`)} />
        ))
      )}
    </ScrollView>
  )
}
