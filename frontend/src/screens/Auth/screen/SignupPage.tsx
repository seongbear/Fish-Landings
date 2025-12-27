import React, { useState } from 'react';
import { 
  TextInput, Image, StyleSheet, Text, View, KeyboardAvoidingView, 
  Platform, ScrollView, TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { useAppStore } from '../../../store/store';
import Background from '../../../components/background';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native'; // Removed CreditCard icon
import { useNavigation } from '@react-navigation/native';
import { useSignup } from '../hooks/useSignup';

export default function SignupPage() {
  const navigation = useNavigation<any>();
  const { name, setName, email, setEmail, password, setPassword, showPassword, setShowPassword, handleSignup, error, isLoading } = useSignup();

  return (
    <Background>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
            </View>
            <Text style={styles.appTitle}>FisheriesCast</Text>
          </View>

          {/* Signup Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign Up</Text>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Mail size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Lock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  
  header: { alignItems: 'center', marginBottom: 30 },
  logoContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center',
    marginBottom: 12, elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: {width:0, height:4}
  },
  logoImage: { width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 100 },
  appTitle: { fontSize: 24, fontWeight: 'bold', color: '#000000', letterSpacing: 0.5 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 5
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 20, textAlign: 'center' },

  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 12,
    paddingHorizontal: 16, height: 56, marginBottom: 16,
    borderWidth: 1, borderColor: '#E5E7EB'
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#1F2937', fontSize: 16 },

  errorText: { color: '#DC2626', marginBottom: 10, textAlign: 'center' },

  primaryButton: {
    backgroundColor: '#4A90E2', height: 56, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginTop: 10,
    shadowColor: '#4A90E2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, elevation: 4
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#6B7280' }, 
  linkText: { color: '#4A90E2', fontWeight: 'bold', textDecorationLine: 'underline' },
});