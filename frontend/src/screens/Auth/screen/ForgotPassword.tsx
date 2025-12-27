import { useNavigation } from '@react-navigation/native';
import React from 'react'; 
import { View, Text, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, TextInput, Platform, StyleSheet } from 'react-native';
import Background from '../../../components/background';
import { AlertCircle, ArrowLeft, CheckCircle, Mail } from 'lucide-react-native';
import { useForgotPassword } from '../hooks/useForgotPassword';

export default function ForgotPassword() {
    const navigation = useNavigation<any>();
    
    // 1. Destructure accountDoesNotExist from the hook
    const { 
        email, 
        setEmail, 
        isSubmitted, 
        handleResetPassword, 
        error, 
        isLoading, 
        accountDoesNotExist 
    } = useForgotPassword();

    return (
        <Background disableTopEdge={true}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={styles.container}
            >
                {/* Nav Header */}
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color="#000000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.card}>
                        
                        {!isSubmitted ? (
                            // === STATE 1: INPUT FORM ===
                            <>
                                <Text style={styles.title}>Reset Password</Text>
                                <Text style={styles.subtitle}>
                                    Enter the email associated with your account and we'll send you a link to reset your password.
                                </Text>

                                {/* Input Field */}
                                <View style={styles.inputContainer}>
                                    <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#9CA3AF"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                {/* Error Message from Store */}
                                {error ? (
                                    <View style={styles.errorContainer}>
                                        <AlertCircle size={16} color="#DC2626" style={{ marginRight: 6 }} />
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}

                                {/* === NEW: Account Does Not Exist Link === */}
                                {accountDoesNotExist && (
                                    <TouchableOpacity 
                                        style={styles.createAccountContainer}
                                        onPress={() => navigation.navigate('Signup')}
                                    >
                                        <Text style={styles.createAccountText}>
                                            No account found? <Text style={styles.createAccountLink}>Create one now.</Text>
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                {/* Submit Button */}
                                <TouchableOpacity 
                                    style={styles.primaryButton} 
                                    onPress={() => handleResetPassword(email)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.buttonText}>Send Reset Link</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        ) : (
                            // === STATE 2: SUCCESS MESSAGE ===
                            <View style={styles.successContainer}>
                                <View style={styles.iconCircle}>
                                    <CheckCircle size={40} color="#10B981" />
                                </View>
                                
                                <Text style={styles.successTitle}>Check your inbox</Text>
                                <Text style={styles.successText}>
                                    We have sent a password reset link to:
                                </Text>
                                <Text style={styles.emailHighlight}>{email}</Text>
                                
                                <Text style={styles.infoText}>
                                    Didn't receive the email? Check your spam folder or try again.
                                </Text>

                                <TouchableOpacity 
                                    style={styles.primaryButton} 
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text style={styles.buttonText}>Back to Login</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                    </View>
                </View>
            </KeyboardAvoidingView>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    navBar: { paddingHorizontal: 20, paddingTop: 50 },
    content: { flex: 1, justifyContent: 'center', padding: 20 },

    // Card Design
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    
    // Text Styles
    title: { fontSize: 24, fontWeight: '700', color: '#1F2937', marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 30, lineHeight: 20 },

    // Input
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F3F4F6', borderRadius: 12,
        paddingHorizontal: 16, height: 56, marginBottom: 16,
        borderWidth: 1, borderColor: '#E5E7EB'
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, color: '#1F2937', fontSize: 16 },

    // Error
    errorContainer: { 
        flexDirection: 'row', alignItems: 'center', 
        backgroundColor: '#FEF2F2', padding: 10, borderRadius: 8, marginBottom: 20 
    },
    errorText: { color: '#DC2626', fontSize: 13, flex: 1 },

    // === NEW STYLES for Create Account Link ===
    createAccountContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    createAccountText: {
        fontSize: 14,
        color: '#6B7280',
    },
    createAccountLink: {
        color: '#4A90E2',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },

    // Button
    primaryButton: {
        backgroundColor: '#4A90E2', height: 56, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#4A90E2', shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.3, elevation: 4, paddingHorizontal: 32
    },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

    // Success State
    successContainer: { alignItems: 'center', paddingVertical: 10 },
    iconCircle: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#D1FAE5', // Light Green
        justifyContent: 'center', alignItems: 'center', marginBottom: 20
    },
    successTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
    successText: { fontSize: 14, color: '#6B7280' },
    emailHighlight: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginVertical: 4 },
    infoText: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 16, marginBottom: 30 },
});