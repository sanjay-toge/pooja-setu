import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Pressable, Modal, Alert, Linking } from 'react-native';
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
  const { temples, poojas, user } = useStore();
  const [vipModalVisible, setVipModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [isLoading, setIsLoading] = useState(false);
  const [hoursExpanded, setHoursExpanded] = useState(false);

  // Generate available time slots from temple opening/closing hours
  const generateTimeSlots = (openingTime: string, closingTime: string) => {
    const slots = [];
    const [openHour] = openingTime.split(':').map(Number);
    const [closeHour] = closingTime.split(':').map(Number);

    for (let hour = openHour; hour < closeHour; hour++) {
      slots.push({
        value: `${hour.toString().padStart(2, '0')}:00`,
        label: `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`
      });
    }
    return slots;
  };

  // Helper to format time from HH:MM to 12-hour format
  const formatTempleTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Check if temple is currently open
  const isTempleOpen = () => {
    const now = dayjs();
    const [openHour, openMin] = temple.openingTime.split(':').map(Number);
    const [closeHour, closeMin] = temple.closingTime.split(':').map(Number);

    const openTime = now.set('hour', openHour).set('minute', openMin);
    const closeTime = now.set('hour', closeHour).set('minute', closeMin);

    return now.isAfter(openTime) && now.isBefore(closeTime);
  };

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

  const handleGetVipPass = () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login to purchase VIP pass',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Login',
            onPress: () => router.push('/login')
          }
        ]
      );
      return;
    }
    setVipModalVisible(true);
  };

  const handleVipPurchase = async () => {
    if (!selectedTime) {
      Alert.alert('Select Time', 'Please select a time for your VIP pass');
      return;
    }

    try {
      setIsLoading(true);
      const formattedDate = purchaseDate;

      // Calculate end time for display
      const [hours] = selectedTime.split(':').map(Number);
      const endHour = (hours + 1) % 24;
      const endTime = `${endHour.toString().padStart(2, '0')}:00`;

      console.log('Purchasing VIP pass:', {
        templeId: temple.id,
        templeName: temple.name,
        date: formattedDate,
        startTime: selectedTime,
        amountPaidINR: temple.vipPricing.priceINR
      });

      await api.purchaseVipPass({
        templeId: temple.id,
        templeName: temple.name,
        date: formattedDate,
        startTime: selectedTime,
        amountPaidINR: temple.vipPricing.priceINR
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

        {/* Temple Hours - Expandable */}
        <Pressable
          style={styles.hoursSection}
          onPress={() => setHoursExpanded(!hoursExpanded)}
        >
          <View style={styles.hoursHeader}>
            <View style={styles.hoursHeaderLeft}>
              <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.hoursTitle}>Temple Hours</Text>
                <View style={styles.todayRow}>
                  <Text style={styles.todayLabel}>Today ({dayjs().format('dddd')})</Text>
                  <View style={[styles.statusBadge, { backgroundColor: isTempleOpen() ? '#4CAF50' : '#FF5252' }]}>
                    <Text style={styles.statusText}>{isTempleOpen() ? 'OPEN' : 'CLOSED'}</Text>
                  </View>
                </View>
                <Text style={styles.hoursTime}>
                  {formatTempleTime(temple.openingTime)} - {formatTempleTime(temple.closingTime)}
                </Text>
              </View>
            </View>
            <Ionicons
              name={hoursExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.muted}
            />
          </View>

          {hoursExpanded && (
            <View style={styles.weeklyHours}>
              <View style={styles.divider} />
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                const isToday = dayjs().format('dddd') === day;
                return (
                  <View key={day} style={[styles.dayRow, isToday && styles.dayRowToday]}>
                    <View style={styles.dayLeft}>
                      {isToday && <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />}
                      <Text style={[styles.dayName, isToday && styles.dayNameToday]}>
                        {day}
                      </Text>
                    </View>
                    <Text style={[styles.dayTime, isToday && styles.dayTimeToday]}>
                      {formatTempleTime(temple.openingTime)} - {formatTempleTime(temple.closingTime)}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </Pressable>


        {/* Live Darshan Section */}
        {temple.liveDarshanUrl && (
          <View style={styles.liveDarshanSection}>
            <View style={styles.liveDarshanHeader}>
              <View style={styles.liveDarshanHeaderLeft}>
                <Ionicons name="videocam" size={24} color="#FF0000" />
                <Text style={styles.liveDarshanTitle}>Live Darshan</Text>
              </View>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>FREE</Text>
              </View>
            </View>
            <Text style={styles.liveDarshanSubtitle}>
              Watch live temple darshan on YouTube
            </Text>
            <Pressable
              style={styles.liveDarshanButton}
              onPress={() => Linking.openURL(temple.liveDarshanUrl)}
            >
              <Ionicons name="play-circle" size={20} color="#fff" />
              <Text style={styles.liveDarshanButtonText}>Watch Now</Text>
            </Pressable>
          </View>
        )}

        {/* VIP Pass Section
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

            <View style={styles.vipPriceContainer}>
              <Text style={styles.vipPriceLabel}>Starting from</Text>
              <Text style={styles.vipPrice}>
                ₹{temple.vipPricing.priceINR}
              </Text>
              <Text style={styles.vipPriceNote}>Multiple time slots available</Text>
            </View>

            <Pressable style={styles.vipButton} onPress={handleGetVipPass}>
              <Ionicons name="ticket" size={20} color="#fff" />
              <Text style={styles.vipButtonText}>Get VIP Pass</Text>
            </Pressable>
          </View>
        )} */}

        {/* Blogs Section */}
        {temple.blogs && temple.blogs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Temple Blogs & Articles</Text>
            {temple.blogs.slice(0, 2).map((blog: any, index: number) => (
              <View key={index} style={styles.blogCard}>
                {blog.imageUrl && (
                  <Image source={{ uri: blog.imageUrl }} style={styles.blogImage} />
                )}
                <View style={styles.blogContent}>
                  <Text style={styles.blogTitle}>{blog.title}</Text>
                  <Text style={styles.blogExcerpt} numberOfLines={2}>
                    {blog.excerpt}
                  </Text>
                  <View style={styles.blogMeta}>
                    <Text style={styles.blogAuthor}>By {blog.author}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Image Gallery */}
        {temple.gallery && temple.gallery.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 Photo Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
              {temple.gallery.map((item: any, index: number) => (
                <View key={index} style={styles.galleryItem}>
                  <Image source={{ uri: item.url }} style={styles.galleryImage} />
                  {item.caption && (
                    <Text style={styles.galleryCaption} numberOfLines={1}>
                      {item.caption}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Teachings Section */}
        {temple.teachings && temple.teachings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕉️ Teachings & Mantras</Text>
            {temple.teachings.map((teaching: any, index: number) => (
              <View key={index} style={styles.teachingCard}>
                <View style={styles.teachingHeader}>
                  <Text style={styles.teachingTitle}>{teaching.title}</Text>
                  <View style={[
                    styles.categoryBadge,
                    {
                      backgroundColor:
                        teaching.category === 'mantra' ? '#FF6B6B' :
                          teaching.category === 'story' ? '#4ECDC4' :
                            teaching.category === 'philosophy' ? '#95E1D3' : '#F3A683'
                    }
                  ]}>
                    <Text style={styles.categoryText}>{teaching.category}</Text>
                  </View>
                </View>
                <Text style={styles.teachingContent}>{teaching.content}</Text>
              </View>
            ))}
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

            <Text style={styles.slotLabel}>Select Time:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsContainer}>
              {generateTimeSlots(temple.openingTime, temple.closingTime).map((slot) => {
                const [hours] = slot.value.split(':').map(Number);
                const endHour = (hours + 1) % 24;
                const endTimeLabel = `${endHour % 12 || 12}:00 ${endHour < 12 ? ' AM' : 'PM'}`;

                return (
                  <Pressable
                    key={slot.value}
                    style={[styles.slotCard, selectedTime === slot.value && styles.slotCardActive]}
                    onPress={() => setSelectedTime(slot.value)}
                  >
                    <Ionicons
                      name="time"
                      size={24}
                      color={selectedTime === slot.value ? '#fff' : theme.colors.primary}
                    />
                    <Text style={[styles.slotCardTitle, selectedTime === slot.value && styles.slotCardTextActive]}>
                      {slot.label}
                    </Text>
                    <Text style={[styles.slotCardTime, selectedTime === slot.value && styles.slotCardTextActive]}>
                      Valid for 1 hour
                    </Text>
                    <Text style={[styles.slotCardTime, selectedTime === slot.value && styles.slotCardTextActive]}>
                      ({slot.label} - {endTimeLabel})
                    </Text>
                  </Pressable>
                );
              })}
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
      marginBottom: 10,
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
    hoursSection: {
      backgroundColor: theme.mode === 'dark' ? '#1a2a1a' : '#f0f9f0',
      borderRadius: 16,
      padding: 16,
      marginTop: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.primary + '20',
    },
    hoursHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    hoursHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
    },
    hoursTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 4,
    },
    todayRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 2,
    },
    todayLabel: {
      fontSize: 13,
      color: theme.colors.muted,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    statusText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '700',
    },
    hoursTime: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: 4,
    },
    weeklyHours: {
      marginTop: 12,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginBottom: 12,
    },
    dayRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 8,
    },
    dayRowToday: {
      backgroundColor: theme.colors.primary + '15',
    },
    dayLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    dayName: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
    },
    dayNameToday: {
      fontWeight: '700',
      color: theme.colors.primary,
    },
    dayTime: {
      fontSize: 14,
      color: theme.colors.muted,
    },
    dayTimeToday: {
      color: theme.colors.text,
      fontWeight: '600',
    },
    liveDarshanSection: {
      backgroundColor: theme.mode === 'dark' ? '#2a1a1a' : '#fff5f5',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: '#FF0000' + '30',
    },
    liveDarshanHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    liveDarshanHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    liveDarshanTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.text,
    },
    freeBadge: {
      backgroundColor: '#4CAF50',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    freeBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '700',
    },
    liveDarshanSubtitle: {
      fontSize: 13,
      color: theme.colors.muted,
      marginBottom: 16,
    },
    liveDarshanButton: {
      backgroundColor: '#FF0000',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 14,
      borderRadius: 12,
      gap: 8,
    },
    liveDarshanButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
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
    vipPriceContainer: {
      alignItems: 'center',
      paddingVertical: 16,
      marginBottom: 16,
    },
    vipPriceLabel: {
      fontSize: 14,
      color: theme.colors.muted,
      marginBottom: 8,
    },
    vipPrice: {
      fontSize: 36,
      fontWeight: '800',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    vipPriceNote: {
      fontSize: 12,
      color: theme.colors.muted,
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
    // Blog styles
    blogCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      marginBottom: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    blogImage: {
      width: '100%',
      height: 160,
      resizeMode: 'cover',
    },
    blogContent: {
      padding: 14,
    },
    blogTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 6,
    },
    blogExcerpt: {
      fontSize: 13,
      color: theme.colors.muted,
      lineHeight: 20,
      marginBottom: 8,
    },
    blogMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    blogAuthor: {
      fontSize: 12,
      color: theme.colors.muted,
      fontStyle: 'italic',
    },
    // Gallery styles
    gallery: {
      marginTop: 8,
    },
    galleryItem: {
      marginRight: 12,
    },
    galleryImage: {
      width: 200,
      height: 150,
      borderRadius: 12,
      resizeMode: 'cover',
    },
    galleryCaption: {
      fontSize: 12,
      color: theme.colors.muted,
      marginTop: 6,
      width: 200,
    },
    // Teachings styles
    teachingCard: {
      backgroundColor: theme.colors.card,
      padding: 14,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    teachingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    teachingTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text,
      flex: 1,
    },
    categoryBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    teachingContent: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 22,
    },
  });
