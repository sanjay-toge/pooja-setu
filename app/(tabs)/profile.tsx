import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTheme } from '../../src/theme'
import { useStore } from '../../src/store'

export default function ProfileScreen() {
    const router = useRouter()
    const theme = useTheme()
    const { user, logout, updateUser, themeMode, toggleTheme } = useStore()
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState(user?.name || '')
    const [editEmail, setEditEmail] = useState(user?.email || '')
    const [editDob, setEditDob] = useState(user?.dob || '')
    const [editPob, setEditPob] = useState(user?.pob || '')

    const styles = getStyles(theme)

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    logout()
                    router.replace('/login')
                }
            }
        ])
    }

    const handleSave = () => {
        updateUser({ name: editName, email: editEmail, dob: editDob, pob: editPob })
        setIsEditing(false)
        Alert.alert('Success', 'Profile updated successfully')
    }

    if (!user) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.message}>Please login to view profile</Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/login')}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image
                    source={{ uri: user.photo || 'https://i.pravatar.cc/150?img=68' }}
                    style={styles.avatar}
                />
                {isEditing ? (
                    <View style={styles.editContainer}>
                        <TextInput
                            style={styles.editInput}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Name"
                            placeholderTextColor={theme.colors.muted}
                        />
                        <TextInput
                            style={styles.editInput}
                            value={editEmail}
                            onChangeText={setEditEmail}
                            placeholder="Email"
                            keyboardType="email-address"
                            placeholderTextColor={theme.colors.muted}
                        />
                        <TextInput
                            style={styles.editInput}
                            value={editDob}
                            onChangeText={setEditDob}
                            placeholder="DOB (YYYY-MM-DD)"
                            placeholderTextColor={theme.colors.muted}
                        />
                        <TextInput
                            style={styles.editInput}
                            value={editPob}
                            onChangeText={setEditPob}
                            placeholder="Place of Birth"
                            placeholderTextColor={theme.colors.muted}
                        />
                        <View style={styles.editActions}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.info}>{user.email || user.phone}</Text>
                        {user.pob && <Text style={{ color: theme.colors.muted, marginBottom: 4 }}>📍 {user.pob}</Text>}
                        {user.dob && <Text style={{ color: theme.colors.muted, marginBottom: 16 }}>🎂 {user.dob}</Text>}

                        <TouchableOpacity style={styles.editProfileButton} onPress={() => {
                            setEditName(user.name)
                            setEditEmail(user.email || '')
                            setEditDob(user.dob || '')
                            setEditPob(user.pob || '')
                            setIsEditing(true)
                        }}>
                            <Text style={styles.editProfileText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* Menu Items */}
            <View style={styles.menu}>
                <View style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name={themeMode === 'dark' ? 'moon' : 'sunny'} size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.menuLabel}>Dark Mode</Text>
                    <Switch
                        value={themeMode === 'dark'}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: theme.colors.primary }}
                    />
                </View>

                <MenuItem icon="settings-outline" label="Settings" theme={theme} />
                <MenuItem icon="help-circle-outline" label="Help & Support" theme={theme} />
                <MenuItem icon="shield-checkmark-outline" label="Privacy Policy" theme={theme} />
                <MenuItem icon="document-text-outline" label="Terms of Service" theme={theme} />

                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name="log-out-outline" size={24} color={theme.colors.danger} />
                    </View>
                    <Text style={[styles.menuLabel, { color: theme.colors.danger }]}>Logout</Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
                </TouchableOpacity>
            </View>

            <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
    )
}

function MenuItem({ icon, label, onPress, theme }: { icon: any, label: string, onPress?: () => void, theme: any }) {
    const styles = getStyles(theme)
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuIconContainer}>
                <Ionicons name={icon} size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.menuLabel}>{label}</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
        </TouchableOpacity>
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
        backgroundColor: theme.colors.background,
    },
    message: {
        fontSize: 18,
        color: theme.colors.muted,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: theme.colors.card,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...theme.shadow,
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 3,
        borderColor: theme.colors.primary,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    info: {
        fontSize: 16,
        color: theme.colors.muted,
        marginBottom: 16,
    },
    editProfileButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    editProfileText: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    editContainer: {
        width: '100%',
        alignItems: 'center',
    },
    editInput: {
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingVertical: 8,
        marginBottom: 12,
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.text,
    },
    editActions: {
        flexDirection: 'row',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: theme.colors.muted,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    menu: {
        padding: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        ...theme.shadow,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.mode === 'dark' ? '#404040' : '#fff3e6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.text,
    },
    version: {
        textAlign: 'center',
        color: theme.colors.muted,
        marginBottom: 30,
    },
})
