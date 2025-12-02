import React from 'react'
import { View, Text, ScrollView, TextInput, Switch, Pressable } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { dummy } from '../../../src/data/dummy'
import { useTheme } from '../../../src/theme'
import SlotPicker from '../../../src/components/SlotPicker'
import Button from '../../../src/components/Button'
import dayjs from 'dayjs'
import { useStore } from '../../../src/store'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

export default function Book() {
  const { poojaId } = useLocalSearchParams()
  const theme = useTheme()
  const { poojas } = useStore()
  const p = poojas.find((x) => x.id === poojaId)
  const [picked, setPicked] = React.useState<any>(null)
  const [date, setDate] = React.useState(new Date())
  const [showPicker, setShowPicker] = React.useState(false)
  const [gotra, setGotra] = React.useState('')
  const [nak, setNak] = React.useState('')
  const [intent, setIntent] = React.useState('Blessings for family health')
  const [addons, setAddons] = React.useState<string[]>([])
  const { createBooking } = useStore()

  if (!p) return null

  // Generate time slots from current time to end of day
  const generateTimeSlots = () => {
    const slots = [];
    const now = dayjs();
    const isToday = dayjs(date).isSame(now, 'day');

    // Start from current hour if today, otherwise from 6 AM
    let startHour = isToday ? now.hour() + 1 : 6;
    const endHour = 20; // 8 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      const timeStart = `${hour.toString().padStart(2, '0')}:00`;
      const timeEnd = `${(hour + 1).toString().padStart(2, '0')}:00`;
      slots.push({
        id: timeStart,
        start: timeStart,
        end: timeEnd,
        remaining: 5 // Available spots
      });
    }

    return slots;
  };

  const slots = generateTimeSlots();

  const toggleAdd = (id: string) =>
    setAddons((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const total =
    p.basePriceINR +
    p.addOns.filter((a: any) => addons.includes(a.id)).reduce((s: any, a: any) => s + a.priceINR, 0)

  const confirm = async () => {
    if (!picked) {
      alert('Please select a time slot');
      return;
    }

    // Check if user is logged in
    const { isAuthenticated, user } = useStore.getState();
    if (!isAuthenticated || !user) {
      alert('Please login first to book a pooja');
      router.push('/login');
      return;
    }

    try {
      const formattedDate = dayjs(date).format('YYYY-MM-DD')
      const id = await createBooking({
        poojaId: p.id,
        templeId: p.templeId,
        date: formattedDate,
        slotId: picked.id,
        addOnIds: addons,
        amountINR: total,
        inputs: {
          gotra: gotra || undefined,
          nakshatra: nak || undefined,
          intentions: intent,
        },
      })
      router.replace(`/payment-success/${id}`)
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    }
  }

  const inputStyle = {
    backgroundColor: theme.mode === 'dark' ? '#404040' : '#fff',
    color: theme.colors.text,
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: theme.mode === 'dark' ? 0 : 1,
    borderColor: theme.colors.border,
  }

  return (
    <ScrollView style={{ padding: 16, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 10, color: theme.colors.text }}>{p.title}</Text>

      {/* 📅 Date Picker */}
      <Text style={{ fontWeight: '700', marginTop: 12, color: theme.colors.text }}>Select Date</Text>
      <Pressable
        onPress={() => setShowPicker(true)}
        style={{
          backgroundColor: theme.mode === 'dark' ? '#404040' : '#fff',
          padding: 12,
          borderRadius: 8,
          marginVertical: 6,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <Text style={{ color: theme.colors.text }}>{dayjs(date).format('YYYY-MM-DD')}</Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={showPicker}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(d) => {
          setShowPicker(false)
          setDate(d)
        }}
        onCancel={() => setShowPicker(false)}
        isDarkModeEnabled={theme.mode === 'dark'}
      />

      {/* ⏰ Slot Picker */}
      <Text style={{ fontSize: 20, fontWeight: '800', marginTop: 12, color: theme.colors.text }}>Select a Slot</Text>
      <SlotPicker slots={slots} picked={picked?.id} onPick={setPicked} />

      {/* 🧘 Devotee Details */}
      <Text style={{ fontWeight: '700', marginTop: 12, color: theme.colors.text }}>Devotee Details</Text>

      <Text style={{ color: theme.colors.text }}>Gotra</Text>
      <TextInput
        value={gotra}
        onChangeText={setGotra}
        placeholder="e.g. Kashyap"
        placeholderTextColor={theme.colors.muted}
        style={inputStyle}
      />

      <Text style={{ color: theme.colors.text }}>Nakshatra</Text>
      <TextInput
        value={nak}
        onChangeText={setNak}
        placeholder="e.g. Rohini"
        placeholderTextColor={theme.colors.muted}
        style={inputStyle}
      />

      <Text style={{ color: theme.colors.text }}>Intentions</Text>
      <TextInput
        value={intent}
        onChangeText={setIntent}
        multiline
        numberOfLines={3}
        style={inputStyle}
      />

      {/* 🛍️ Add-ons */}
      <Text style={{ fontWeight: '700', marginTop: 10, color: theme.colors.text }}>Add-ons</Text>
      {p.addOns.map((a) => (
        <View
          key={a.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 12,
            marginVertical: 6,
          }}
        >
          <Text style={{ color: theme.colors.text }}>
            {a.name} (₹{a.priceINR})
          </Text>
          <Switch value={addons.includes(a.id)} onValueChange={() => toggleAdd(a.id)} trackColor={{ false: '#767577', true: theme.colors.primary }} />
        </View>
      ))}

      {/* 💰 Total */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
        <Text style={{ fontWeight: '800', color: theme.colors.text }}>Total</Text>
        <Text style={{ fontWeight: '800', color: theme.colors.text }}>₹{total}</Text>
      </View>

      {/* ✅ Confirm */}
      <Button title="Pay & Confirm (Dummy)" style={{ marginTop: 12 }} onPress={confirm} />
    </ScrollView>
  )
}
