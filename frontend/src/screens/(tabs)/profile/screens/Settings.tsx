import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Alert, Modal } from 'react-native';
import { Bell, Globe, LogOut, ChevronRight, Mail } from 'lucide-react-native';
import { useAppStore } from '../../../../store/store';
import Background from '../../../../components/background';
import { LANGUAGES } from '../../../../constants/language';
import { SettingRow } from '../components/settingRow';


export default function Settings() {
  const signOutUser = useAppStore((state) => state.signOutUser);

  // --- State ---
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]); // Default English
  const [isLangModalVisible, setLangModalVisible] = useState(false);

  // --- Actions ---
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: async () => {
             try {
               await signOutUser();
               // Navigation logic handled by your Auth Stack usually
             } catch (error) {
               console.error(error);
             }
          }
        }
      ]
    );
  };

  const selectLanguage = (lang: typeof LANGUAGES[0]) => {
    setCurrentLang(lang);
    setLangModalVisible(false);
    // Here you would trigger your i18n logic
    
  };

  return (
    <View style={styles.container}>
        <Background disableTopEdge={true}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Section 1: Notifications */}
                <Text style={styles.sectionTitle}>Notifications</Text>
                <View style={styles.sectionCard}>
                <SettingRow 
                    icon={<Bell size={20} color="#3B82F6" />}
                    label="Push Notifications"
                    rightElement={
                    <Switch 
                        value={pushEnabled} 
                        onValueChange={setPushEnabled} 
                        trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                        thumbColor={pushEnabled ? "#3B82F6" : "#f4f3f4"}
                    />
                    }
                />
                <View style={styles.separator} />
                <SettingRow 
                    isLast
                    icon={<Mail size={20} color="#8B5CF6" />}
                    label="Email Updates"
                    rightElement={
                    <Switch 
                        value={emailEnabled} 
                        onValueChange={setEmailEnabled}
                        trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                        thumbColor={emailEnabled ? "#3B82F6" : "#f4f3f4"}
                    />
                    }
                />
                </View>

                {/* Section 2: Preferences */}
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.sectionCard}>
                <SettingRow 
                    isLast
                    icon={<Globe size={20} color="#10B981" />}
                    label="Language"
                    onPress={() => setLangModalVisible(true)}
                    rightElement={
                    <View style={styles.rowRight}>
                        <Text style={styles.valueText}>{currentLang.label}</Text>
                        <ChevronRight size={16} color="#9CA3AF" />
                    </View>
                    }
                />
                </View>

                {/* Section 3: Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.2 (Build 240)</Text>
            </ScrollView>
        </Background>


      {/* --- Language Modal --- */}
      <Modal
        visible={isLangModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
                {LANGUAGES.map((lang, index) => (
                    <TouchableOpacity 
                        key={lang.id} 
                        style={[
                            styles.langOption, 
                            index === LANGUAGES.length - 1 && styles.langOptionLast,
                            currentLang.id === lang.id && styles.langOptionSelected
                        ]}
                        onPress={() => selectLanguage(lang)}
                    >
                        <Text style={[
                            styles.langText, 
                            currentLang.id === lang.id && styles.langTextSelected
                        ]}>
                            {lang.label}
                        </Text>
                        {currentLang.id === lang.id && <View style={styles.dot} />}
                    </TouchableOpacity>
                ))}
            <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setLangModalVisible(false)}
            >
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, // Adjust for safe area
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  backBtn: { padding: 4 },

  scrollContent: { padding: 20 },

  // Sections
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 8, marginTop: 16, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCard: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 56 }, // Indented separator

  // Rows
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16 },
  rowLast: { borderBottomWidth: 0 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconContainer: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowLabel: { fontSize: 16, color: '#1F2937', fontWeight: '500' },
  valueText: { fontSize: 14, color: '#6B7280' },

  // Logout
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', paddingVertical: 16, borderRadius: 16, marginTop: 32, gap: 8 },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
  versionText: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 20 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 24, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20, color: '#1F2937' },
  langOption: { width: '100%', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  langOptionLast: { borderBottomWidth: 0 },
  langOptionSelected: { backgroundColor: '#F0F9FF', borderRadius: 8, paddingHorizontal: 12, borderBottomWidth: 0 },
  langText: { fontSize: 16, color: '#374151' },
  langTextSelected: { color: '#0284C7', fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0284C7' },
  cancelBtn: { marginTop: 16, padding: 10 },
  cancelText: { color: '#6B7280', fontWeight: '600' },
});