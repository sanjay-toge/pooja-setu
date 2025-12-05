
import React from 'react'
import { View, Text, ScrollView, TextInput } from 'react-native'
import { theme } from '../../src/theme'
import Button from '../../src/components/Button'
export default function Dashboard(){
  const [price, setPrice] = React.useState('801')
  const [slot, setSlot] = React.useState('08:00-08:30')
  const [addon, setAddon] = React.useState('Prasad Courier (₹151)')
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize:18, fontWeight:'800' }}>Temple Dashboard (UI)</Text>
      <View style={{ backgroundColor: theme.colors.card, borderRadius: 12, padding: 12, marginTop: 10 }}>
        <Text style={{ fontWeight:'700' }}>Pricing</Text>
        <TextInput value={price} onChangeText={setPrice} keyboardType='numeric' style={{ backgroundColor:'#fff', padding: 12, borderRadius: 8, marginVertical: 6 }} />
        <Text style={{ fontWeight:'700', marginTop: 6 }}>Add slot</Text>
        <TextInput value={slot} onChangeText={setSlot} style={{ backgroundColor:'#fff', padding: 12, borderRadius: 8, marginVertical: 6 }} />
        <Text style={{ fontWeight:'700', marginTop: 6 }}>Add-on</Text>
        <TextInput value={addon} onChangeText={setAddon} style={{ backgroundColor:'#fff', padding: 12, borderRadius: 8, marginVertical: 6 }} />
        <Button title="Save (Dummy)" style={{ marginTop: 8 }} />
      </View>
    </ScrollView>
  )
}
