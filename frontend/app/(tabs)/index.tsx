import React, { useEffect } from 'react'
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { useTheme } from '../../src/theme'
import { router } from 'expo-router'
import Card from '../../src/components/Card'
import PanchangCard from '../../src/components/PanchangCard'
import HoroscopeCard from '../../src/components/HoroscopeCard'
import { useStore } from '../../src/store'
import { getRecommendations } from '../../src/utils/ai'
import { getTodayPanchang } from '../../src/services/panchang'
import { getHoroscopeByDOB } from '../../src/services/horoscope'
import { Ionicons } from '@expo/vector-icons'

export default function Home() {
  const { filters, setFilter, temples, poojas, isLoading, fetchData, user } = useStore()
  const theme = useTheme()
  const recommendations = getRecommendations(user)

  useEffect(() => {
    fetchData()
  }, [])

  // Get Panchang data
  const panchangData = getTodayPanchang()

  // Get Horoscope data (if user has DOB)
  const horoscopeData = user?.dob ? getHoroscopeByDOB(user.dob) : null

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
      {/* Header with personalized greeting and notification icon */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: theme.colors.text }}>
            🙏 Namaste{user ? `, ${user.name}` : ''}
          </Text>
          <Text style={{ fontSize: 15, color: theme.colors.muted, marginTop: 4 }}>
            May your day be filled with divine blessings
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/notifications')}
          style={{
            padding: 8,
            backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f0f0f0',
            borderRadius: 20,
            marginLeft: 12
          }}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
        </Pressable>
      </View>

      {/* Daily Horoscope (only if user has DOB) */}
      {horoscopeData && <HoroscopeCard horoscope={horoscopeData} />}

      {/* Daily Panchang */}
      <PanchangCard panchang={panchangData} />


      {/* VIP Access Promotion */}
      <Pressable
        style={{
          backgroundColor: theme.mode === 'dark' ? '#2a1a4a' : '#f3e5f5',
          borderRadius: theme.radius,
          padding: 20,
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          ...theme.shadow,
        }}
        onPress={() => router.push('/(tabs)/temples')}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={{ fontSize: 18, fontWeight: '800', color: theme.colors.text, marginLeft: 6 }}>
              Premium VIP Access
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: theme.colors.muted, marginBottom: 8 }}>
            Skip the queue • Priority darshan • Exclusive entry
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: theme.colors.primary, fontWeight: '600' }}>
              Get VIP Pass
            </Text>
            <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} style={{ marginLeft: 4 }} />
          </View>
        </View>
        <Ionicons name="ticket" size={48} color={theme.colors.primary} style={{ opacity: 0.3 }} />
      </Pressable>

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
