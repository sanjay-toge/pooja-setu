import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../../src/theme';
import { useStore } from '../../../src/store';
import { Ionicons } from '@expo/vector-icons';

export default function PoojaDetail() {
  const { poojaId } = useLocalSearchParams();
  const theme = useTheme();
  const { poojas, temples } = useStore();
  const [termsExpanded, setTermsExpanded] = useState(false);

  const pooja = poojas.find(x => x.id === poojaId);
  const temple = pooja ? temples.find(t => t.id === pooja.templeId) : null;

  if (!pooja) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Pooja not found</Text>
      </View>
    );
  }

  const styles = getStyles(theme);

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.title}>{pooja.title}</Text>
        {temple && (
          <View style={styles.templeInfo}>
            <Ionicons name="location" size={16} color={theme.colors.muted} />
            <Text style={styles.templeText}>{temple.name}</Text>
          </View>
        )}
        <View style={styles.priceRow}>
          <View style={styles.priceTag}>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.price}>₹{pooja.basePriceINR}</Text>
          </View>
          <View style={styles.durationTag}>
            <Ionicons name="time-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.durationText}>{pooja.durationMinutes} mins</Text>
          </View>
        </View>
      </View>

      {/* Description Section */}
      {pooja.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this Pooja</Text>
          <View style={styles.card}>
            <Text style={styles.description}>{pooja.description}</Text>
          </View>
        </View>
      )}

      {/* What's Included Section */}
      {pooja.includedInTicket && pooja.includedInTicket.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Included in the Ticket</Text>
          <View style={styles.card}>
            {pooja.includedInTicket.map((item: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Special Notes Section */}
      {pooja.specialNotes && pooja.specialNotes.length > 0 && (
        <View style={styles.section}>
          <View style={styles.specialNotesHeader}>
            <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Special Notes</Text>
          </View>
          <View style={[styles.card, styles.specialNotesCard]}>
            {pooja.specialNotes.map((note: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="alert-circle-outline" size={18} color={theme.colors.primary} />
                <Text style={styles.listItemText}>{note}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Add-ons Section */}
      {pooja.addOns && pooja.addOns.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optional Add-ons</Text>
          {pooja.addOns.map((addon: any) => (
            <View key={addon.id} style={styles.addonCard}>
              <View style={styles.addonIcon}>
                <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.addonInfo}>
                <Text style={styles.addonName}>{addon.name}</Text>
                <Text style={styles.addonPrice}>+₹{addon.priceINR}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
            </View>
          ))}
        </View>
      )}

      {/* Terms & Conditions Section */}
      {pooja.termsAndConditions && pooja.termsAndConditions.length > 0 && (
        <View style={styles.section}>
          <Pressable
            style={styles.termsHeader}
            onPress={() => setTermsExpanded(!termsExpanded)}
          >
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <Ionicons
              name={termsExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color={theme.colors.text}
            />
          </Pressable>
          {termsExpanded && (
            <View style={styles.card}>
              {pooja.termsAndConditions.map((term: string, index: number) => (
                <View key={index} style={styles.termItem}>
                  <Text style={styles.termNumber}>{index + 1}.</Text>
                  <Text style={styles.termText}>{term}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Book Button */}
      <View style={styles.bookingSection}>
        <Pressable
          style={styles.bookButton}
          onPress={() => router.push(`/pooja/${pooja.id}/book`)}
        >
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.bookButtonText}>Book this Pooja</Text>
        </Pressable>
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  heroSection: {
    padding: 20,
    backgroundColor: theme.mode === 'dark' ? '#1a1a1a' : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 8,
  },
  templeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  templeText: {
    fontSize: 15,
    color: theme.colors.muted,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceTag: {
    flex: 1,
    backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  priceLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginBottom: 4,
    fontWeight: '600',
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  durationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    ...theme.shadow,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.colors.text,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text,
  },
  specialNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  specialNotesCard: {
    backgroundColor: theme.mode === 'dark' ? '#2a2a1a' : '#fffbf0',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  addonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    ...theme.shadow,
  },
  addonIcon: {
    marginRight: 12,
  },
  addonInfo: {
    flex: 1,
  },
  addonName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  addonPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  termsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  termNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginRight: 8,
    minWidth: 20,
  },
  termText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text,
  },
  bookingSection: {
    padding: 16,
    paddingTop: 8,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 10,
    ...theme.shadow,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
