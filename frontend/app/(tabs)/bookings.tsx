
import React, { useEffect } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { useStore } from '../../src/store'
import { useTheme } from '../../src/theme'
import { router } from 'expo-router'

export default function Bookings() {
  const { bookings, poojas, temples, fetchBookings, user } = useStore()
  const theme = useTheme()

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const getPoojaById = (id: string) => poojas.find((p: any) => p.id === id)
  const getTempleById = (id: string) => temples.find((t: any) => t.id === id)

  return (
    <ScrollView style={{ padding: 16, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8, color: theme.colors.text }}>My Bookings</Text>
      {bookings.map((b: any) => {
        const p = getPoojaById(b.poojaId)
        const t = getTempleById(b.templeId)

        if (!p || !t) return null // Skip if pooja or temple not found

        const bookingId = b.id || b._id

        return (
          <Pressable
            key={bookingId}
            onPress={() => router.push(`/booking-detail/${bookingId}`)}
            style={{ backgroundColor: theme.colors.card, borderRadius: 12, padding: 12, marginBottom: 10 }}
          >
            <Text style={{ fontWeight: '700', color: theme.colors.text }}>{p.title}</Text>
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
