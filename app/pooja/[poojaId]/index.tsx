
import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useTheme } from '../../../src/theme'
import Button from '../../../src/components/Button'
import { dummy } from '../../../src/data/dummy'

export default function PoojaDetail() {
  const { poojaId } = useLocalSearchParams()
  const theme = useTheme()
  const p = dummy.poojas.find(x => x.id === poojaId)

  if (!p) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}><Text style={{ color: theme.colors.text }}>Pooja not found</Text></View>

  return (
    <ScrollView style={{ padding: 16, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: theme.colors.text }}>{p.title}</Text>
      <Text style={{ color: theme.colors.muted, marginVertical: 6 }}>Base Price: ₹{p.basePriceINR} • Duration {p.durationMinutes} mins</Text>
      <Text style={{ fontWeight: '700', marginTop: 10, color: theme.colors.text }}>Add-ons</Text>
      {p.addOns.map(a => (<Text key={a.id} style={{ color: theme.colors.text }}>• {a.name} (₹{a.priceINR})</Text>))}
      <Button title="Book this Pooja" style={{ marginTop: 16 }} onPress={() => router.push(`/pooja/${p.id}/book`)} />
    </ScrollView>
  )
}
