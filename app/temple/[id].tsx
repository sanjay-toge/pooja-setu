
import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useStore } from '../../src/store'
import { useTheme } from '../../src/theme'
import Card from '../../src/components/Card'

export default function TempleDetail() {
  const { id } = useLocalSearchParams()
  const theme = useTheme()
  const { temples, poojas } = useStore()

  const t = temples.find(x => x.id === id)
  const templePoojas = poojas.filter(p => p.templeId === id)

  if (!t) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}><Text style={{ color: theme.colors.text }}>Temple not found</Text></View>

  return (
    <ScrollView style={{ padding: 16, backgroundColor: theme.colors.background }}>
      <Card title={t.name} subtitle={`${t.city} • ★ ${t.rating}`} image={t.heroImageUrl} />
      <Text style={{ marginTop: 10, color: theme.colors.text }}>{t.description}</Text>
      <Text style={{ fontWeight: '700', marginVertical: 10, color: theme.colors.text }}>Available Poojas</Text>
      {templePoojas.map(p => (
        <Card key={p.id} title={p.title} subtitle={`₹${p.basePriceINR} • ${p.durationMinutes} mins`} onPress={() => router.push(`/pooja/${p.id}`)} />
      ))}
    </ScrollView>
  )
}
