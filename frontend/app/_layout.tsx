import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../src/theme'

export default function Layout() {
  const theme = useTheme()
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      edges={['top', 'left', 'right']} // 👈 Adds safe insets only at top & sides
    >
      <StatusBar barStyle={theme.mode === 'dark' ? "light-content" : "dark-content"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </SafeAreaView>
  )
}
