import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api/api';
import { useTheme } from '../theme';

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

interface AddressManagerProps {
    selectedAddress?: Address | null;
    onSelectAddress: (address: Address) => void;
}

export const AddressManager: React.FC<AddressManagerProps> = ({ selectedAddress, onSelectAddress }) => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Address>({
        label: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const data = await api.getAddresses();
            setAddresses(data);
            // If no address is selected and we have addresses, select the default or first one
            // Only select automatically if onSelectAddress is provided and meaningful (not no-op)
            // Checking simple equality to empty function is hard, relying on prop purpose
            if (onSelectAddress && !selectedAddress && data.length > 0) {
                const defaultAddr = data.find((a: Address) => a.isDefault) || data[0];
                onSelectAddress(defaultAddr);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
            Alert.alert('Error', 'Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.label || !formData.line1 || !formData.city || !formData.state || !formData.pincode) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            if (editingId) {
                const updated = await api.updateAddress(editingId, formData);
                setAddresses(updated);
            } else {
                const updated = await api.addAddress(formData);
                setAddresses(updated);
            }
            setModalVisible(false);
            resetForm();
        } catch (error) {
            console.error('Error saving address:', error);
            Alert.alert('Error', 'Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this address?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        setLoading(true);
                        const updated = await api.deleteAddress(id);
                        setAddresses(updated);
                        if (selectedAddress?._id === id) {
                            onSelectAddress(null as any);
                        }
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete address');
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ]);
    };

    const handleEdit = (addr: Address) => {
        setFormData(addr);
        setEditingId(addr._id || null);
        setModalVisible(true);
    };

    const resetForm = () => {
        setFormData({
            label: '',
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: '',
            isDefault: false
        });
        setEditingId(null);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Select Address</Text>
                <TouchableOpacity onPress={() => { resetForm(); setModalVisible(true); }} style={styles.addButton}>
                    <Ionicons name="add" size={20} color={theme.colors.primary} />
                    <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.list}>
                {addresses.map((addr) => (
                    <TouchableOpacity
                        key={addr._id}
                        style={[styles.card, selectedAddress?._id === addr._id && styles.selectedCard]}
                        onPress={() => onSelectAddress(addr)}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardLabel}>{addr.label}</Text>
                            <View style={styles.actionButtons}>
                                <TouchableOpacity onPress={() => handleEdit(addr)}>
                                    <Ionicons name="pencil" size={16} color={theme.colors.muted} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => addr._id && handleDelete(addr._id)} style={{ marginLeft: 8 }}>
                                    <Ionicons name="trash" size={16} color={theme.colors.muted} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.addressText} numberOfLines={2}>
                            {addr.line1}, {addr.line2 ? addr.line2 + ', ' : ''}{addr.city}, {addr.state} - {addr.pincode}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingId ? 'Edit Address' : 'Add New Address'}</Text>

                        <TextInput
                            placeholder="Label (e.g., Home, Work)"
                            style={styles.input}
                            value={formData.label}
                            onChangeText={(text) => setFormData({ ...formData, label: text })}
                            placeholderTextColor={theme.colors.muted}
                        />
                        <TextInput
                            placeholder="Address Line 1"
                            style={styles.input}
                            value={formData.line1}
                            onChangeText={(text) => setFormData({ ...formData, line1: text })}
                            placeholderTextColor={theme.colors.muted}
                        />
                        <TextInput
                            placeholder="Address Line 2 (Optional)"
                            style={styles.input}
                            value={formData.line2}
                            onChangeText={(text) => setFormData({ ...formData, line2: text })}
                            placeholderTextColor={theme.colors.muted}
                        />
                        <View style={styles.row}>
                            <TextInput
                                placeholder="City"
                                style={[styles.input, { flex: 1, marginRight: 8 }]}
                                value={formData.city}
                                onChangeText={(text) => setFormData({ ...formData, city: text })}
                                placeholderTextColor={theme.colors.muted}
                            />
                            <TextInput
                                placeholder="State"
                                style={[styles.input, { flex: 1 }]}
                                value={formData.state}
                                onChangeText={(text) => setFormData({ ...formData, state: text })}
                                placeholderTextColor={theme.colors.muted}
                            />
                        </View>
                        <TextInput
                            placeholder="Pincode"
                            style={styles.input}
                            value={formData.pincode}
                            keyboardType="numeric"
                            onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                            placeholderTextColor={theme.colors.muted}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Save Address</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButtonText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    list: {
        paddingBottom: 5,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: 12,
        borderRadius: 8,
        marginRight: 12,
        width: 250,
        borderWidth: 1,
        borderColor: theme.colors.border,
        elevation: 2,
    },
    selectedCard: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10', // Light tint of primary
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    cardLabel: {
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    addressText: {
        color: theme.colors.muted,
        fontSize: 13,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: theme.colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 15,
        color: theme.colors.text,
        backgroundColor: theme.colors.background,
    },
    row: {
        flexDirection: 'row',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        marginRight: 8,
        backgroundColor: theme.colors.background,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cancelButtonText: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    saveButton: {
        flex: 1,
        padding: 12,
        marginLeft: 8,
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});
