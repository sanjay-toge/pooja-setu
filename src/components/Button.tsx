
import React from 'react'
import { Pressable, Text, ViewStyle } from 'react-native'
import { theme } from '../theme'
export default function Button({ title, onPress, style }: { title: string, onPress?: ()=>void, style?: ViewStyle }){
  return (
    <Pressable onPress={onPress} style={[{ backgroundColor: theme.colors.primary, padding: 14, borderRadius: theme.radius, alignItems:'center'}, style]}>
      <Text style={{ color:'#fff', fontWeight:'700'}}>{title}</Text>
    </Pressable>
  )
}
