import React from 'react'
import { View, Text } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { theme } from '../../src/theme'
import Button from '../../src/components/Button'
import { useStore } from '../../src/store'

export default function PaymentSuccess() {
  const { bookingId } = useLocalSearchParams()
  const { bookings, getPoojaById, getTempleById } = useStore()
  const booking = bookings.find(b => b.id === bookingId)
  const pooja = booking ? getPoojaById(booking.poojaId) : null
  const temple = booking ? getTempleById(booking.templeId) : null

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color: theme.colors.primary, marginBottom: 16 }}>🎉 Payment Successful!</Text>

      {booking && (
        <>
          <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 6 }}>
            {pooja?.title}
          </Text>
          <Text style={{ color: theme.colors.muted, marginBottom: 6 }}>
            Temple: {temple?.name}
          </Text>
          <Text style={{ color: theme.colors.muted, marginBottom: 6 }}>
            Date: {booking.date} | Slot: {booking.slotId}
          </Text>
          <Text style={{ color: theme.colors.muted, marginBottom: 20 }}>
            Amount: ₹{booking.amountINR}
          </Text>
        </>
      )}

      <Button
        title="Go to My Bookings"
        onPress={() => router.push('/(tabs)/bookings')}
        style={{ width: '80%' }}
      />

      <Text style={{ marginTop: 30, color: theme.colors.muted, textAlign: 'center', lineHeight: 20 }}>
        You’ll receive a notification when the live stream or recording is available.
      </Text>
    </View>
  )
}
