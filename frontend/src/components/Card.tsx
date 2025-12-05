
import React from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import { useTheme } from '../theme'

export default function Card({ title, subtitle, image, onPress }: { title: string, subtitle?: string, image?: string, onPress?: () => void }) {
  const theme = useTheme()
  return (
    <Pressable onPress={onPress} style={[{ backgroundColor: theme.colors.card, borderRadius: theme.radius, padding: 12, marginVertical: 8 }, theme.shadow]}>
      {image ? <Image source={{ uri: image }} style={{ height: 140, borderRadius: 12, marginBottom: 10 }} /> : null}
      <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text }}>{title}</Text>
      {subtitle ? <Text style={{ color: theme.colors.muted, marginTop: 4 }}>{subtitle}</Text> : null}
    </Pressable>
  )
}
