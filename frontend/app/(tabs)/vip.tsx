import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../src/theme';
import { useStore } from '../../src/store';
import { api } from '../../src/api/api';
import VipPassCard from '../../src/components/VipPassCard';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function VipScreen() {
    const theme = useTheme();
    const { user } = useStore();
    const [passes, setPasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'used'>('all');

    useEffect(() => {
        if (user) {
            fetchPasses();
        } else {
            setIsLoading(false);
        }
    }, [filter, user]);

    const fetchPasses = async () => {
        try {
            setIsLoading(true);
            const status = filter === 'all' ? undefined : filter;
            const data = await api.getMyVipPasses(status);
            setPasses(data);
        } catch (error) {
            console.error('Error fetching VIP passes:', error);
            // Silently fail - will show empty state which has CTA to browse temples
            setPasses([]);
        } finally {
            setIsLoading(false);
        }
    };

    const activePasses = passes.filter((p: any) => p.status === 'active');
    const upcomingPasses = activePasses.filter((p: any) => new Date(p.date) > new Date());
    const pastPasses = passes.filter((p: any) => ['used', 'expired'].includes(p.status));

    const styles = getStyles(theme);

    // Show login prompt if not authenticated
    if (!user) {
        return (
            <View style={styles.container}>
                <View style={styles.loginPrompt}>
                    <Ionicons name="lock-closed" size={80} color={theme.colors.muted} />
                    <Text style={styles.loginTitle}>Login Required</Text>
                    <Text style={styles.loginText}>
                        Please login to view and manage your VIP passes
                    </Text>
                    <Pressable
                        style={styles.loginButton}
                        onPress={() => router.push('/login')}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>My VIP Passes</Text>
                <Text style={styles.subtitle}>Premium temple access</Text>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <Pressable
                    style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                        All
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
                    onPress={() => setFilter('active')}
                >
                    <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
                        Active
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.filterTab, filter === 'used' && styles.filterTabActive]}
                    onPress={() => setFilter('used')}
                >
                    <Text style={[styles.filterText, filter === 'used' && styles.filterTextActive]}>
                        Used
                    </Text>
                </Pressable>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : passes.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="ticket-outline" size={80} color={theme.colors.muted} />
                    <Text style={styles.emptyTitle}>No VIP Passes Yet</Text>
                    <Text style={styles.emptyText}>
                        Purchase VIP passes for priority temple access with exclusive benefits
                    </Text>
                    <Pressable
                        style={styles.browseButton}
                        onPress={() => router.push('/(tabs)/temples')}
                    >
                        <Text style={styles.browseButtonText}>Browse Temples</Text>
                    </Pressable>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Active/Upcoming Passes */}
                    {activePasses.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                🎟️ Active Passes ({activePasses.length})
                            </Text>
                            {activePasses.map((pass: any) => (
                                <VipPassCard key={pass._id} pass={pass} />
                            ))}
                        </View>
                    )}

                    {/* Past Passes */}
                    {pastPasses.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                📋 Past Passes ({pastPasses.length})
                            </Text>
                            {pastPasses.map((pass: any) => (
                                <VipPassCard key={pass._id} pass={pass} />
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}

            {/* VIP Benefits Footer */}
            {!isLoading && passes.length > 0 && (
                <View style={styles.benefitsFooter}>
                    <Text style={styles.benefitsTitle}>✨ VIP Benefits</Text>
                    <Text style={styles.benefitsText}>
                        • Skip the queue • Priority darshan • Dedicated entry
                    </Text>
                </View>
            )}
        </View>
    );
}

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        loginPrompt: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
        },
        loginTitle: {
            fontSize: 24,
            fontWeight: '800',
            color: theme.colors.text,
            marginTop: 20,
            marginBottom: 8,
        },
        loginText: {
            fontSize: 16,
            color: theme.colors.muted,
            textAlign: 'center',
            marginBottom: 30,
            lineHeight: 24,
        },
        loginButton: {
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 40,
            paddingVertical: 14,
            borderRadius: 25,
        },
        loginButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
        },
        header: {
            padding: 16,
            paddingTop: 20,
        },
        title: {
            fontSize: 28,
            fontWeight: '800',
            color: theme.colors.text,
        },
        subtitle: {
            fontSize: 15,
            color: theme.colors.muted,
            marginTop: 4,
        },
        filterContainer: {
            flexDirection: 'row',
            paddingHorizontal: 16,
            marginBottom: 16,
            gap: 8,
        },
        filterTab: {
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f0f0f0',
        },
        filterTabActive: {
            backgroundColor: theme.colors.primary,
        },
        filterText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
        },
        filterTextActive: {
            color: '#fff',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        scrollView: {
            flex: 1,
            paddingHorizontal: 16,
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: 12,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
        },
        emptyTitle: {
            fontSize: 22,
            fontWeight: '700',
            color: theme.colors.text,
            marginTop: 20,
        },
        emptyText: {
            fontSize: 15,
            color: theme.colors.muted,
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 22,
        },
        browseButton: {
            marginTop: 24,
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 12,
        },
        browseButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
        },
        benefitsFooter: {
            backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f9f9f9',
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
        benefitsTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: 4,
        },
        benefitsText: {
            fontSize: 13,
            color: theme.colors.muted,
            lineHeight: 20,
        },
    });
