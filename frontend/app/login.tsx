import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { useTheme } from '../src/theme'
import { useStore } from '../src/store'
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter()
    const theme = useTheme()
    const login = useStore((state: any) => state.login)
    const googleLogin = useStore((state: any) => state.googleLogin)
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)

    // Google Auth Request
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: '792026226863-k34pt3t0gq5kgbtbnlhldl77j36a8teg.apps.googleusercontent.com',
        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        webClientId: '792026226863-87onfka2382imst8b5221ed36tfv1j0m.apps.googleusercontent.com',
        redirectUri: 'https://auth.expo.io/@sanjaytoge/poojasetu'
    });

    React.useEffect(() => {
        if (request) {
            console.log('Current Redirect URI:', request.redirectUri);
        }
    }, [request]);

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleSignIn(id_token);
        }
    }, [response]);

    const handleGoogleSignIn = async (token: string) => {
        setLoading(true);
        try {
            const user = await googleLogin(token);
            if (!user.isProfileComplete) {
                router.replace('/onboarding');
            } else {
                router.replace('/(tabs)');
            }
        } catch (error) {
            Alert.alert('Google Login Failed', 'Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (method: 'google' | 'facebook' | 'phone') => {
        if (method === 'phone' && phone.length < 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number')
            return
        }

        setLoading(true)
        try {
            await login(method, { phone: `+91${phone}`, name: 'User' })
            // Check if profile is complete (for phone login too)
            const user = useStore.getState().user;
            if (user && !user.isProfileComplete) {
                router.replace('/onboarding');
            } else {
                router.replace('/(tabs)');
            }
        } catch (error) {
            Alert.alert('Login Failed', 'Unable to login. Please try again.')
            console.error('Login error:', error)
        } finally {
            setLoading(false)
        }
    }

    const styles = getStyles(theme)

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://img.icons8.com/color/480/om.png' }}
                    style={styles.logo}
                />
                <Text style={styles.title}>PoojaSetu</Text>
                <Text style={styles.subtitle}>Your Gateway to Divine Blessings</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Log in or Sign up</Text>

                {/* Phone Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.countryCode}>+91</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Mobile Number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        maxLength={10}
                        placeholderTextColor={theme.colors.muted}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    onPress={() => handleLogin('phone')}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line} />
                </View>

                {/* Social Login */}
                <TouchableOpacity
                    style={[styles.socialButton, { opacity: !request ? 0.5 : 1 }]}
                    onPress={() => promptAsync()}
                    disabled={!request}
                >
                    <Ionicons name="logo-google" size={24} color="#DB4437" />
                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton} onPress={() => handleLogin('facebook')}>
                    <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                    <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
                By continuing, you agree to our Terms & Privacy Policy
            </Text>
        </View>
    )
}

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.muted,
        marginTop: 8,
    },
    form: {
        backgroundColor: theme.colors.card,
        padding: 24,
        borderRadius: theme.radius,
        ...theme.shadow,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: theme.colors.text,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        marginBottom: 16,
        backgroundColor: theme.mode === 'dark' ? '#404040' : '#fff',
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
    },
    button: {
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    orText: {
        marginHorizontal: 12,
        color: theme.colors.muted,
        fontSize: 14,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        height: 50,
        marginBottom: 12,
        backgroundColor: theme.mode === 'dark' ? '#404040' : '#fff',
    },
    socialButtonText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.text,
    },
    footerText: {
        textAlign: 'center',
        marginTop: 24,
        color: theme.colors.muted,
        fontSize: 12,
    },
})
