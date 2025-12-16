import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, Alert, Modal } from 'react-native';
import { useStore } from '../src/store';
import { useTheme } from '../src/theme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

export default function OnboardingScreen() {
    const { user, updateUser } = useStore();
    const theme = useTheme();
    const styles = getStyles(theme);

    // State for form fields
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        dob: user?.dob || '', // YYYY-MM-DD
        pob: user?.pob || '',
        gotra: user?.gotra || '',
        rashi: user?.rashi || '',
        nakshatra: user?.nakshatra || ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dropdown options (Simplified for now - can be expanded)
    const rashis = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
    const genders = ['Male', 'Female', 'Other'];

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleComplete = async () => {
        if (!formData.name || !formData.gender || !formData.dob) {
            Alert.alert('Missing Details', 'Please fill in Name, Gender and Date of Birth');
            return;
        }

        try {
            setIsSubmitting(true);
            await useStore.getState().completeProfile(formData);
            Alert.alert('Success', 'Profile completed successfully!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Complete Your Profile</Text>
                <Text style={styles.headerSubtitle}>Help us personalize your spiritual journey</Text>
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>

                {/* Personal Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Details</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(t) => handleChange('name', t)}
                            placeholder="Enter your full name"
                            placeholderTextColor={theme.colors.muted}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Gender *</Text>
                            <View style={styles.genderContainer}>
                                {genders.map(g => (
                                    <Pressable
                                        key={g}
                                        style={[styles.genderChip, formData.gender === g && styles.genderChipActive]}
                                        onPress={() => handleChange('gender', g)}
                                    >
                                        <Text style={[styles.genderText, formData.gender === g && styles.genderTextActive]}>{g}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date of Birth (YYYY-MM-DD) *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.dob}
                            onChangeText={(t) => handleChange('dob', t)}
                            placeholder="e.g. 1990-01-01"
                            placeholderTextColor={theme.colors.muted}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Place of Birth</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.pob}
                            onChangeText={(t) => handleChange('pob', t)}
                            placeholder="City, State"
                            placeholderTextColor={theme.colors.muted}
                        />
                    </View>
                </View>

                {/* Contact (Read Only if from Auth) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={formData.phone}
                            editable={!user?.phone} // Editable only if not provided by login
                            onChangeText={(t) => handleChange('phone', t)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={formData.email}
                            editable={!user?.email}
                            onChangeText={(t) => handleChange('email', t)}
                        />
                    </View>
                </View>

                {/* Astrological Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Astrological Details (Optional)</Text>
                    <Text style={styles.sectionSubtitle}>For better Pooja sankalp</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Gotra</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.gotra}
                            onChangeText={(t) => handleChange('gotra', t)}
                            placeholder="Enter Gotra"
                            placeholderTextColor={theme.colors.muted}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Rashi (Zodiac)</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                            {rashis.map(r => (
                                <Pressable
                                    key={r}
                                    style={[styles.chip, formData.rashi === r && styles.chipActive]}
                                    onPress={() => handleChange('rashi', r)}
                                >
                                    <Text style={[styles.chipText, formData.rashi === r && styles.chipTextActive]}>{r}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nakshatra</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.nakshatra}
                            onChangeText={(t) => handleChange('nakshatra', t)}
                            placeholder="Enter Nakshatra"
                            placeholderTextColor={theme.colors.muted}
                        />
                    </View>
                </View>

                <Pressable
                    style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
                    onPress={handleComplete}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? 'Saving...' : 'Complete Profile'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </Pressable>
            </ScrollView>
        </View>
    );
}

const getStyles = (theme: any) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 60,
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: theme.colors.muted,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 16,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: theme.colors.muted,
        marginTop: -12,
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: theme.colors.text,
    },
    disabledInput: {
        opacity: 0.7,
        backgroundColor: theme.mode === 'dark' ? '#333' : '#f0f0f0',
    },
    row: {
        flexDirection: 'row',
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    genderChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.card,
    },
    genderChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    genderText: {
        fontSize: 14,
        color: theme.colors.text,
    },
    genderTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    chipScroll: {
        flexDirection: 'row',
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.card,
        marginRight: 8,
    },
    chipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        fontSize: 14,
        color: theme.colors.text,
    },
    chipTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        gap: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    }
});
