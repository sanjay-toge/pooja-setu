import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Pressable, Modal, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useStore } from '../../src/store';
import { useTheme } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/api/api';
import dayjs from 'dayjs';
import { Calendar } from 'react-native-calendars';

export default function TempleDetail() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const { temples, poojas } = useStore();
  const [vipModalVisible, setVipModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<'earlyMorning' | 'morning' | 'afternoon' | 'lateAfternoon' | 'evening' | 'night' | null>(null);
  const [purchaseDate, setPurchaseDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [isLoading, setIsLoading] = useState(false);

  const minDate = dayjs().add(0, 'day').format('YYYY-MM-DD');
  const maxDate = dayjs().add(3, 'month').format('YYYY-MM-DD');

  const temple = temples.find((x: any) => x.id === id);
  const templePoojas = poojas.filter((p: any) => p.templeId === id);

  if (!temple) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Temple not found</Text>
      </View>
    );
  }

  const handleVipPurchase = async () => {
    if (!selectedSlot) {
      Alert.alert('Select Time Slot', 'Please select a time slot for your VIP pass');
      return;
    }

    try {
      setIsLoading(true);
      const slotData = temple.vipPricing[`${selectedSlot}Slot`];
      const formattedDate = purchaseDate;

      console.log('Purchasing VIP pass:', {
        templeId: temple.id,
        templeName: temple.name,
        date: formattedDate,
        timeSlot: selectedSlot,
        timeRange: slotData.timeRange,
        amountPaidINR: slotData.priceINR
      });

      await api.purchaseVipPass({
        templeId: temple.id,
        templeName: temple.name,
        date: formattedDate,
        timeSlot: selectedSlot,
        timeRange: slotData.timeRange,
        amountPaidINR: slotData.priceINR
      });

      Alert.alert(
        'Success!',
        `VIP Pass purchased for ${temple.name}`,
        [
          {
            text: 'View My Passes',
            onPress: () => {
              setVipModalVisible(false);
              router.push('/(tabs)/vip');
            }
          },
          {
            text: 'OK',
            onPress: () => setVipModalVisible(false)
          }
        ]
      );
    } catch (error: any) {
      console.error('VIP Purchase Error:', error);
      Alert.alert('Purchase Failed', error.message || 'Unable to purchase VIP pass');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = getStyles(theme);

  return (
    <ScrollView style={styles.container}>
      {/* Hero Image */}
      {temple.heroImageUrl && (
        <Image source={{ uri: temple.heroImageUrl }} style={styles.heroImage} />
      )}

      {/* Temple Info */}
      <View style={styles.content}>
        <Text style={styles.title}>{temple.name}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location" size={16} color={theme.colors.muted} />
            <Text style={styles.metaText}>{temple.city}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.metaText}>{temple.rating}</Text>
          </View>
        </View>
        <Text style={styles.description}>{temple.description}</Text>

        {/* Deities */}
        <View style={styles.deitiesContainer}>
          {temple.deities?.map((deity: string, index: number) => (
            <View key={index} style={styles.deityChip}>
              <Text style={styles.deityText}>{deity}</Text>
            </View>
          ))}
        </View>

        {/* VIP Pass Section */}
        {temple.vipPricing?.enabled && (
          <View style={styles.vipSection}>
            <View style={styles.vipHeader}>
              <View style={styles.vipHeaderLeft}>
                <Ionicons name="star" size={24} color="#FFD700" />
                <Text style={styles.vipTitle}>Premium VIP Access</Text>
              </View>
            </View>
            <Text style={styles.vipSubtitle}>
              Skip the queue • Priority darshan • Dedicated entry
            </Text>

            <View style={styles.vipSlots}>
              {temple.vipPricing?.morningSlot?.priceINR > 0 && (
                <View style={styles.vipSlot}>
                  <Ionicons name="sunny" size={20} color="#FFA500" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.vipSlotTitle}>Morning Darshan</Text>
                    <Text style={styles.vipSlotTime}>{temple.vipPricing.morningSlot.timeRange}</Text>
                  </View>
                  <Text style={styles.vipSlotPrice}>₹{temple.vipPricing.morningSlot.priceINR}</Text>
                </View>
              )}
              {temple.vipPricing?.afternoonSlot?.priceINR > 0 && (
                <View style={styles.vipSlot}>
                  <Ionicons name="partly-sunny" size={20} color="#FF6B6B" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.vipSlotTitle}>Afternoon Darshan</Text>
                    <Text style={styles.vipSlotTime}>{temple.vipPricing.afternoonSlot.timeRange}</Text>
                  </View>
                  <Text style={styles.vipSlotPrice}>₹{temple.vipPricing.afternoonSlot.priceINR}</Text>
                </View>
              )}
              {temple.vipPricing?.eveningSlot?.priceINR > 0 && (
                <View style={styles.vipSlot}>
                  <Ionicons name="moon" size={20} color="#9B59B6" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.vipSlotTitle}>Evening Darshan</Text>
                    <Text style={styles.vipSlotTime}>{temple.vipPricing.eveningSlot.timeRange}</Text>
                  </View>
                  <Text style={styles.vipSlotPrice}>₹{temple.vipPricing.eveningSlot.priceINR}</Text>
                </View>
              )}
            </View>

            <Pressable style={styles.vipButton} onPress={() => setVipModalVisible(true)}>
              <Ionicons name="ticket" size={20} color="#fff" />
              <Text style={styles.vipButtonText}>Get VIP Pass</Text>
            </Pressable>
          </View>
        )}

        {/* Poojas Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Poojas</Text>
          {templePoojas.length > 0 ? (
            templePoojas.map((pooja: any) => (
              <Pressable
                key={pooja.id}
                style={styles.poojaCard}
                onPress={() => router.push(`/pooja/${pooja.id}`)}
              >
                <View style={styles.poojaInfo}>
                  <Text style={styles.poojaTitle}>{pooja.title}</Text>
                  <View style={styles.poojaDetails}>
                    <View style={styles.poojaDetail}>
                      <Ionicons name="cash-outline" size={14} color={theme.colors.muted} />
                      <Text style={styles.poojaDetailText}>₹{pooja.basePriceINR}</Text>
                    </View>
                    <View style={styles.poojaDetail}>
                      <Ionicons name="time-outline" size={14} color={theme.colors.muted} />
                      <Text style={styles.poojaDetailText}>{pooja.durationMinutes} mins</Text>
                    </View>
                    {pooja.type && (
                      <View style={styles.poojaDetail}>
                        <Ionicons name="flower-outline" size={14} color={theme.colors.muted} />
                        <Text style={styles.poojaDetailText}>{pooja.type}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
              </Pressable>
            ))
          ) : (
            <Text style={styles.emptyText}>No poojas available at this temple</Text>
          )}
        </View>
      </View>

      {/* VIP Purchase Modal */}
      <Modal
        visible={vipModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setVipModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Purchase VIP Pass</Text>
              <Pressable onPress={() => setVipModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>{temple.name}</Text>

            {/* Date Picker */}
            <View style={styles.dateSection}>
              <Text style={styles.slotLabel}>Select Date:</Text>
              <Calendar
                current={purchaseDate}
                minDate={minDate}
                maxDate={maxDate}
                onDayPress={(day) => {
                  setPurchaseDate(day.dateString);
                }}
                markedDates={{
                  [purchaseDate]: {
                    selected: true,
                    selectedColor: theme.colors.primary,
                  },
                }}
                theme={{
                  backgroundColor: theme.colors.background,
                  calendarBackground: theme.colors.card,
                  textSectionTitleColor: theme.colors.text,
                  selectedDayBackgroundColor: theme.colors.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: theme.colors.primary,
                  dayTextColor: theme.colors.text,
                  textDisabledColor: theme.colors.muted,
                  monthTextColor: theme.colors.text,
                  indicatorColor: theme.colors.primary,
                  textDayFontWeight: '500',
                  textMonthFontWeight: '700',
                  textDayHeaderFontWeight: '600',
                  textDayFontSize: 15,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 13,
                }}
                style={styles.calendar}
              />
            </View>

            <Text style={styles.slotLabel}>Select Time Slot:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsContainer}>
              {temple.vipPricing?.earlyMorningSlot?.priceINR > 0 && (
                <Pressable
                  style={[styles.slotCard, selectedSlot === 'earlyMorning' && styles.slotCardActive]}
                  onPress={() => setSelectedSlot('earlyMorning')}
                >
                  <Ionicons name="moon" size={24} color={selectedSlot === 'earlyMorning' ? '#fff' : '#9B59B6'} />
                  <Text style={[styles.slotCardTitle, selectedSlot === 'earlyMorning' && styles.slotCardTextActive]}>
                    Early Morning
                  </Text>
                  <Text style={[styles.slotCardTime, selectedSlot === 'earlyMorning' && styles.slotCardTextActive]}>
                    {temple.vipPricing.earlyMorningSlot.timeRange}
                  </Text>
                  <Text style={[styles.slotCardPrice, selectedSlot === 'earlyMorning' && styles.slotCardTextActive]}>
                    ₹{temple.vipPricing.earlyMorningSlot.priceINR}
                  </Text>
                </Pressable>
              )}
              {temple.vipPricing?.morningSlot?.priceINR > 0 && (
                <Pressable
                  style={[styles.slotCard, selectedSlot === 'morning' && styles.slotCardActive]}
                  onPress={() => setSelectedSlot('morning')}
                >
                  <Ionicons name="sunny" size={24} color={selectedSlot === 'morning' ? '#fff' : '#FFA500'} />
                  <Text style={[styles.slotCardTitle, selectedSlot === 'morning' && styles.slotCardTextActive]}>
                    Morning
                  </Text>
                  <Text style={[styles.slotCardTime, selectedSlot === 'morning' && styles.slotCardTextActive]}>
                    {temple.vipPricing.morningSlot.timeRange}
                  </Text>
                  <Text style={[styles.slotCardPrice, selectedSlot === 'morning' && styles.slotCardTextActive]}>
                    ₹{temple.vipPricing.morningSlot.priceINR}
                  </Text>
                </Pressable>
              )}
              {temple.vipPricing?.afternoonSlot?.priceINR > 0 && (
                <Pressable
                  style={[styles.slotCard, selectedSlot === 'afternoon' && styles.slotCardActive]}
                  onPress={() => setSelectedSlot('afternoon')}
                >
                  <Ionicons name="partly-sunny" size={24} color={selectedSlot === 'afternoon' ? '#fff' : '#FF6B6B'} />
                  <Text style={[styles.slotCardTitle, selectedSlot === 'afternoon' && styles.slotCardTextActive]}>
                    Afternoon
                  </Text>
                  <Text style={[styles.slotCardTime, selectedSlot === 'afternoon' && styles.slotCardTextActive]}>
                    {temple.vipPricing.afternoonSlot.timeRange}
                  </Text>
                  <Text style={[styles.slotCardPrice, selectedSlot === 'afternoon' && styles.slotCardTextActive]}>
                    ₹{temple.vipPricing.afternoonSlot.priceINR}
                  </Text>
                </Pressable>
              )}
              {temple.vipPricing?.lateAfternoonSlot?.priceINR > 0 && (
                <Pressable
                  style={[styles.slotCard, selectedSlot === 'lateAfternoon' && styles.slotCardActive]}
                  onPress={() => setSelectedSlot('lateAfternoon')}
                >
                  <Ionicons name="cloudy" size={24} color={selectedSlot === 'lateAfternoon' ? '#fff' : '#FF8C42'} />
                  <Text style={[styles.slotCardTitle, selectedSlot === 'lateAfternoon' && styles.slotCardTextActive]}>
                    Late Afternoon
                  </Text>
                  <Text style={[styles.slotCardTime, selectedSlot === 'lateAfternoon' && styles.slotCardTextActive]}>
                    {temple.vipPricing.lateAfternoonSlot.timeRange}
                  </Text>
                  <Text style={[styles.slotCardPrice, selectedSlot === 'lateAfternoon' && styles.slotCardTextActive]}>
                    ₹{temple.vipPricing.lateAfternoonSlot.priceINR}
                  </Text>
                </Pressable>
              )}
              {temple.vipPricing?.eveningSlot?.priceINR > 0 && (
                <Pressable
                  style={[styles.slotCard, selectedSlot === 'evening' && styles.slotCardActive]}
                  onPress={() => setSelectedSlot('evening')}
                >
                  <Ionicons name="moon-outline" size={24} color={selectedSlot === 'evening' ? '#fff' : '#9B59B6'} />
                  <Text style={[styles.slotCardTitle, selectedSlot === 'evening' && styles.slotCardTextActive]}>
                    Evening
                  </Text>
                  <Text style={[styles.slotCardTime, selectedSlot === 'evening' && styles.slotCardTextActive]}>
                    {temple.vipPricing.eveningSlot.timeRange}
                  </Text>
                  <Text style={[styles.slotCardPrice, selectedSlot === 'evening' && styles.slotCardTextActive]}>
                    ₹{temple.vipPricing.eveningSlot.priceINR}
                  </Text>
                </Pressable>
              )}
              {temple.vipPricing?.nightSlot?.priceINR > 0 && (
                <Pressable
                  style={[styles.slotCard, selectedSlot === 'night' && styles.slotCardActive]}
                  onPress={() => setSelectedSlot('night')}
                >
                  <Ionicons name="moon" size={24} color={selectedSlot === 'night' ? '#fff' : '#4A148C'} />
                  <Text style={[styles.slotCardTitle, selectedSlot === 'night' && styles.slotCardTextActive]}>
                    Night
                  </Text>
                  <Text style={[styles.slotCardTime, selectedSlot === 'night' && styles.slotCardTextActive]}>
                    {temple.vipPricing.nightSlot.timeRange}
                  </Text>
                  <Text style={[styles.slotCardPrice, selectedSlot === 'night' && styles.slotCardTextActive]}>
                    ₹{temple.vipPricing.nightSlot.priceINR}
                  </Text>
                </Pressable>
              )}
            </ScrollView>

            <Pressable
              style={[styles.purchaseButton, isLoading && styles.purchaseButtonDisabled]}
              onPress={handleVipPurchase}
              disabled={isLoading}
            >
              <Text style={styles.purchaseButtonText}>
                {isLoading ? 'Processing...' : 'Confirm Purchase'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    heroImage: {
      width: '100%',
      height: 250,
      resizeMode: 'cover',
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: theme.colors.text,
      marginBottom: 8,
    },
    metaRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 12,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    description: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text,
      marginBottom: 16,
    },
    deitiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    deityChip: {
      backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f0f0f0',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    deityText: {
      fontSize: 13,
      color: theme.colors.text,
      fontWeight: '600',
    },
    vipSection: {
      backgroundColor: theme.mode === 'dark' ? '#2a1a4a' : '#f3e5f5',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: theme.colors.primary + '30',
    },
    vipHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    vipHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    vipTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.text,
    },
    vipSubtitle: {
      fontSize: 13,
      color: theme.colors.muted,
      marginBottom: 16,
    },
    vipSlots: {
      gap: 8,
      marginBottom: 16,
    },
    vipSlot: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.mode === 'dark' ? '#1a1a1a' : '#fff',
      padding: 12,
      borderRadius: 12,
    },
    vipSlotTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    vipSlotTime: {
      fontSize: 12,
      color: theme.colors.muted,
      marginTop: 2,
    },
    vipSlotPrice: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    vipButton: {
      backgroundColor: theme.colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 14,
      borderRadius: 12,
      gap: 8,
    },
    vipButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 12,
    },
    poojaCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadow,
    },
    poojaInfo: {
      flex: 1,
    },
    poojaTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
    },
    poojaDetails: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    poojaDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    poojaDetailText: {
      fontSize: 13,
      color: theme.colors.muted,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.muted,
      textAlign: 'center',
      paddingVertical: 20,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.text,
    },
    modalSubtitle: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 16,
    },
    dateSection: {
      marginBottom: 20,
    },
    calendar: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    datePicker: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12,
    },
    dateText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    slotLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    slotsContainer: {
      gap: 12,
      paddingRight: 20,
      marginBottom: 20,
    },
    slotCard: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: 140,
      alignItems: 'center',
      justifyContent: 'center',
    },
    slotCardActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    slotCardTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.text,
      marginTop: 8,
      textAlign: 'center',
    },
    slotCardTime: {
      fontSize: 12,
      color: theme.colors.muted,
      marginTop: 4,
      textAlign: 'center',
    },
    slotCardPrice: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.colors.primary,
      marginTop: 8,
    },
    slotCardTextActive: {
      color: '#fff',
    },
    purchaseButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    purchaseButtonDisabled: {
      opacity: 0.6,
    },
    purchaseButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
  });
