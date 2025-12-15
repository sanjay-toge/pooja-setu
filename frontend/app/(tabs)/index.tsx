import React, { useEffect } from 'react'
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { useTheme } from '../../src/theme'
import { router } from 'expo-router'
import PoojaCard from '../../src/components/PoojaCard'
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
  const filteredPoojas = poojas.filter(p => {
    const q = filters.query?.toLowerCase() || ''
    if (!q) return true

    // Check Pooja Name
    if (p.title?.toLowerCase().includes(q)) return true

    // Check Deity (if available, assuming p.deity or similar structure if exists, otherwise skipping)
    // if (p.deity?.toLowerCase().includes(q)) return true

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
      {/* <PanchangCard panchang={panchangData} /> */}

      <View style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 12, marginBottom: 12, marginTop: 8 }}>
        <Text style={{ marginBottom: 6, color: theme.colors.text }}>Search</Text>
        <TextInput
          value={filters.query || ''}
          onChangeText={t => setFilter('query', t)}
          placeholder='Search Poojas...'
          placeholderTextColor={theme.colors.muted}
          style={{ backgroundColor: theme.mode === 'dark' ? '#404040' : '#fff', color: theme.colors.text, padding: 12, borderRadius: 8 }}
        />
      </View>

      {/* AI Recommendations */}
      {user && recommendations.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: '700', marginBottom: 8, color: theme.colors.primary }}>✨ Recommended for You (AI)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendations.map(p => (
              <View key={p.id} style={{ width: 200, marginRight: 12 }}>
                <PoojaCard
                  title={p.title}
                  subtitle={p.description}
                  price={p.basePriceINR}
                  image={p.imageUrl}
                  duration={`${p.durationMinutes} mins`}
                  participants={p.participantCount}
                  onPress={() => router.push(`/pooja/${p.id}`)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <Text style={{ fontWeight: '700', marginBottom: 8, color: theme.colors.text }}>Popular Poojas</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
      ) : (
        filteredPoojas.map(p => (
          <PoojaCard
            key={p.id}
            title={p.title}
            subtitle={p.description}
            price={p.basePriceINR}
            image={p.imageUrl}
            duration={`${p.durationMinutes} mins`}
            participants={p.participantCount}
            onPress={() => router.push(`/pooja/${p.id}`)}
          />
        ))
      )}
    </ScrollView>
  )
}
