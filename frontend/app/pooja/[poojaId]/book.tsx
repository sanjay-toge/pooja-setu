import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, TextInput, Switch, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useTheme } from '../../../src/theme'
import Button from '../../../src/components/Button'
import dayjs from 'dayjs'
import { useStore } from '../../../src/store'
import { Calendar } from 'react-native-calendars'
import { api } from '../../../src/api/api'
import { Ionicons } from '@expo/vector-icons'
import { AddressManager } from '../../../src/components/AddressManager'

interface Address {
  _id?: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function Book() {
  const { poojaId } = useLocalSearchParams()
  const theme = useTheme()
  const { poojas, createBooking, user, isAuthenticated } = useStore()

  // State
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'))
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [gotra, setGotra] = useState('')
  const [nakshatra, setNakshatra] = useState('')
  const [intentions, setIntentions] = useState('')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [serviceMode, setServiceMode] = useState<'online' | 'offline'>('offline')
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pooja = poojas.find((x) => x.id === poojaId)

  const styles = getStyles(theme)

  if (!pooja) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Pooja not found</Text>
      </View>
    )
  }

  // Generate time slots
  const slots = useMemo(() => {
    const generatedSlots = []
    const startHour = 6 // 6 AM
    const endHour = 20 // 8 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      const timeStart = `${hour.toString().padStart(2, '0')}:00`
      generatedSlots.push({
        id: timeStart,
        label: dayjs().hour(hour).minute(0).format('h:mm A'),
        period: hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'
      })
    }
    return generatedSlots
  }, [])

  // Calculate totals
  const addonsTotal = pooja.addOns
    .filter((a: any) => selectedAddons.includes(a.id))
    .reduce((sum: number, a: any) => sum + a.priceINR, 0)

  const totalAmount = pooja.basePriceINR + addonsTotal

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleBooking = async () => {
    if (!selectedSlot) {
      Alert.alert('Selection Required', 'Please select a time slot for your pooja.')
      return
    }

    if (!isAuthenticated || !user) {
      Alert.alert('Login Required', 'Please login to book a pooja', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/login') }
      ])
      return
    }

    if (serviceMode === 'offline' && !selectedAddress) {
      Alert.alert('Address Required', 'Please select an address for offline pooja.')
      return
    }

    try {
      setIsSubmitting(true)
      const bookingData: any = {
        poojaId: pooja.id,
        templeId: pooja.templeId,
        date: selectedDate,
        slotId: selectedSlot,
        addOnIds: selectedAddons,
        amountINR: totalAmount,
        serviceMode,
        inputs: {
          gotra: gotra || undefined,
          nakshatra: nakshatra || undefined,
          intentions: intentions || undefined,
        },
      }

      if (serviceMode === 'offline' && selectedAddress) {
        bookingData.deliveryAddress = {
          line1: selectedAddress.line1,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode
        }
      }

      const bookingId = await createBooking(bookingData)

      try {
        // Initiate Payment
        const { paymentUrl } = await api.initiatePayment(bookingId)
        if (paymentUrl) {
          // Use Linking to open URL (works on Web and Mobile)
          // For mobile, maybe use WebBrowser for better UX
          // import * as WebBrowser from 'expo-web-browser'; // Add import if not present
          // await WebBrowser.openBrowserAsync(paymentUrl);

          // For now, using Linking as it's simpler
          const { Linking } = require('react-native')
          await Linking.openURL(paymentUrl)

          // Could redirect to a 'Processing' page here, or handle via callback deep link
          // For now, let's keep it simple
        } else {
          Alert.alert('Payment Error', 'Could not initiate payment.')
        }

      } catch (payError) {
        console.error('Payment Init Error:', payError)
        Alert.alert('Payment Error', 'Booking created but payment initiation failed. Please check My Bookings.')
        router.replace('/(tabs)/bookings')
      }

    } catch (error) {
      console.error('Booking error:', error)
      Alert.alert('Booking Failed', 'Unable to create booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }


  const minDate = dayjs().add(1, 'day').format('YYYY-MM-DD')
  const maxDate = dayjs().add(3, 'month').format('YYYY-MM-DD')

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{pooja.title}</Text>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₹{pooja.basePriceINR}</Text>
        </View>
      </View>

      {/* Service Mode Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Service Mode</Text>
        <View style={styles.card}>
          <View style={styles.modeRow}>
            <Text style={styles.modeLabel}>Pooja Mode</Text>
            <View style={styles.modeToggle}>
              <Text style={[styles.modeText, serviceMode === 'offline' && styles.modeTextActive]}>Offline (At Home)</Text>
              <Switch
                value={serviceMode === 'online'}
                onValueChange={(val) => setServiceMode(val ? 'online' : 'offline')}
                trackColor={{ false: theme.colors.primary, true: theme.colors.primary }}
                thumbColor={'#fff'}
              />
              <Text style={[styles.modeText, serviceMode === 'online' && styles.modeTextActive]}>Online</Text>
            </View>
          </View>
          <Text style={styles.modeDescription}>
            {serviceMode === 'offline'
              ? "We will send a Pandit to your address to perform the Pooja."
              : "Pooja will be performed at the temple and streamed live to you."}
          </Text>

          {serviceMode === 'offline' && (
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.label, { marginBottom: 8 }]}>Select Address for Pandit Visit</Text>
              <AddressManager
                selectedAddress={selectedAddress}
                onSelectAddress={setSelectedAddress}
              />
            </View>
          )}
        </View>
      </View>

      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Select Date</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: theme.colors.primary }
            }}
            theme={{
              backgroundColor: theme.colors.card,
              calendarBackground: theme.colors.card,
              textSectionTitleColor: theme.colors.text,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: theme.colors.primary,
              dayTextColor: theme.colors.text,
              textDisabledColor: theme.colors.muted,
              monthTextColor: theme.colors.text,
              arrowColor: theme.colors.primary,
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '500',
            }}
            style={styles.calendar}
          />
        </View>
      </View>

      {/* Slot Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Select Time Slot</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsContainer}>
          {slots.map((slot) => (
            <Pressable
              key={slot.id}
              style={[
                styles.slotButton,
                selectedSlot === slot.id && styles.slotButtonActive
              ]}
              onPress={() => setSelectedSlot(slot.id)}
            >
              <Text style={[
                styles.slotText,
                selectedSlot === slot.id && styles.slotTextActive
              ]}>{slot.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Devotee Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Devotee Details</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gotra (Optional)</Text>
            <TextInput
              style={styles.input}
              value={gotra}
              onChangeText={setGotra}
              placeholder="e.g. Kashyap"
              placeholderTextColor={theme.colors.muted}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nakshatra (Optional)</Text>
            <TextInput
              style={styles.input}
              value={nakshatra}
              onChangeText={setNakshatra}
              placeholder="e.g. Rohini"
              placeholderTextColor={theme.colors.muted}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Intentions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={intentions}
              onChangeText={setIntentions}
              placeholder="Any specific prayers or requests..."
              placeholderTextColor={theme.colors.muted}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </View>

      {/* Add-ons */}
      {pooja.addOns && pooja.addOns.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Add-ons</Text>
          <View style={styles.card}>
            {pooja.addOns.map((addon: any) => (
              <View key={addon.id} style={styles.addonRow}>
                <View style={styles.addonInfo}>
                  <Text style={styles.addonName}>{addon.name}</Text>
                  <Text style={styles.addonPrice}>+₹{addon.priceINR}</Text>
                </View>
                <Switch
                  value={selectedAddons.includes(addon.id)}
                  onValueChange={() => toggleAddon(addon.id)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={'#fff'}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Booking Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Base Price</Text>
            <Text style={styles.summaryValue}>₹{pooja.basePriceINR}</Text>
          </View>
          {selectedAddons.length > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Add-ons Total</Text>
              <Text style={styles.summaryValue}>₹{addonsTotal}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleBooking}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Pay ₹{totalAmount}</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </Pressable>
        <Text style={styles.secureText}>
          <Ionicons name="lock-closed" size={12} color={theme.colors.muted} /> Secure Payment
        </Text>
      </View>
    </ScrollView>
  )
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    flex: 1,
    marginRight: 10,
  },
  priceTag: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  modeTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  modeDescription: {
    fontSize: 13,
    color: theme.colors.muted,
    marginBottom: 8,
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  calendarContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  calendar: {
    borderRadius: 12,
  },
  slotsContainer: {
    gap: 10,
    paddingRight: 20,
  },
  slotButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 100,
    alignItems: 'center',
  },
  slotButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  slotText: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  slotTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.mode === 'dark' ? '#1a1a1a' : '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + '40',
  },
  addonInfo: {
    flex: 1,
  },
  addonName: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  addonPrice: {
    fontSize: 14,
    color: theme.colors.muted,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: theme.colors.muted,
    fontSize: 15,
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    gap: 8,
    marginBottom: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secureText: {
    color: theme.colors.muted,
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
