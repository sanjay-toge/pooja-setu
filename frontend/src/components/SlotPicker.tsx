import React from 'react'
import { View, Pressable, Text } from 'react-native'
import { theme } from '../theme'

export default function SlotPicker({
  slots,
  onPick,
  picked,
}: {
  slots: any[]
  onPick: (s: any) => void
  picked?: string
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {slots.map((item) => {
        const active = picked === item.id
        return (
          <Pressable
            key={item.id}
            onPress={() => onPick(item)}
            disabled={!item.remaining}
            style={{
              width: '48%',
              margin: '1%',
              padding: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: active ? theme.colors.primary : theme.colors.border,
              opacity: item.remaining ? 1 : 0.5,
            }}
          >
            <Text
              style={{
                fontWeight: '700',
                color: active ? theme.colors.primary : theme.colors.text,
              }}
            >
              {item.start} – {item.end}
            </Text>
            <Text style={{ color: theme.colors.muted }}>
              {item.remaining} left
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
