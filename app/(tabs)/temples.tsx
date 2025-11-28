
import React from 'react'
import { Text, ScrollView } from 'react-native'
import { dummy } from '../../src/data/dummy'
import Card from '../../src/components/Card'
import { useTheme } from '../../src/theme'
import { useStore } from '../../src/store'
import { router } from 'expo-router'

export default function Temples() {
  const { filters } = useStore()
  const theme = useTheme()
  const list = dummy.temples.filter(t => (!filters.city || t.city.toLowerCase().includes(String(filters.city).toLowerCase())) && (!filters.deity || t.deities.includes(String(filters.deity))))

  return (
    <ScrollView style={{ padding: 16, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8, color: theme.colors.text }}>Temples</Text>
      {list.map(t => (
        <Card key={t.id} title={t.name} subtitle={`${t.city} • ★ ${t.rating}`} image={t.heroImageUrl} onPress={() => router.push(`/temple/${t.id}`)} />
      ))}
      {!list.length && <Text style={{ color: theme.colors.muted }}>No temples match your search.</Text>}
    </ScrollView>
  )
}
