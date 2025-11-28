
import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useTheme } from '../../src/theme'

export default function Notifications() {
  const theme = useTheme()
  const items = [
    { id: 'n1', text: 'Your booking BKG123456 is confirmed', at: 'Today 08:00' },
    { id: 'n2', text: 'Stream for Ganesh Abhishek starts in 30 min', at: 'Today 07:30' },
    { id: 'n3', text: 'Recording is now available', at: 'Today 09:30' },
  ]
  return (
    <ScrollView style={{ padding: 16, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8, color: theme.colors.text }}>Notifications</Text>
      {items.map(n => (
        <View key={n.id} style={{ backgroundColor: theme.colors.card, borderRadius: 12, padding: 12, marginBottom: 10 }}>
          <Text style={{ fontWeight: '600', color: theme.colors.text }}>{n.text}</Text>
          <Text style={{ color: theme.colors.muted }}>{n.at}</Text>
        </View>
      ))}
    </ScrollView>
  )
}
