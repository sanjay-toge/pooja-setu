
import React from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { useStore } from '../../src/store'
import { useTheme } from '../../src/theme'
import { router } from 'expo-router'

export default function Bookings() {
  const { bookings, getPoojaById, getTempleById } = useStore()
  const theme = useTheme()

  return (
    <ScrollView style={{ padding: 16, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8, color: theme.colors.text }}>My Bookings</Text>
      {bookings.map(b => {
        const p = getPoojaById(b.poojaId); const t = getTempleById(b.templeId)
        return (
          <Pressable
            key={b.id}
            onPress={() => router.push(`/booking-detail/${b.id}`)}
            style={{ backgroundColor: theme.colors.card, borderRadius: 12, padding: 12, marginBottom: 10 }}
          >
            <Text style={{ fontWeight: '700', color: theme.colors.text }}>{p?.title} @ {t?.name}</Text>
            <Text style={{ color: theme.colors.muted }}>On {b.date} • Slot {b.slotId}</Text>
            <Text style={{ color: theme.colors.text }}>Status: {b.status}</Text>
            <Text style={{ color: theme.colors.primary, marginTop: 4 }}>Tap to view details →</Text>
          </Pressable>
        )
      })}
      {!bookings.length && <Text style={{ color: theme.colors.muted }}>No bookings yet.</Text>}
    </ScrollView>
  )
}
