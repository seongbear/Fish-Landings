import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  Image, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import { Camera, User, Mail, ChevronLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useEditProfile, useUserProfile } from '../hooks/useUserProfile';
import { StatusModal } from '../../../../components/status_modal';
import Background from '../../../../components/background';

export default function EditProfile() {
    const navigation = useNavigation();
    const user = useUserProfile();
    const { editProfile, success } = useEditProfile();
    
    // State 
    const [name, setName] = useState('');
    const [image, setImage] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user?.profile?.name) {
            setName(user.profile.name);
        }
    }, [user?.profile?.name]);

  // Logic: Pick Image 
  const pickImage = async () => {
    // Request Permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to change your profile picture.");
      return;
    }

    // Launch Picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square crop
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

    // --- Logic: Save ---
    const handleSave = async () => {
        await editProfile(name, image || undefined);
    };

    const handleCloseSuccessModal = () => {
        user.refetch();
        navigation.goBack();
    }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Background>
        <View style={styles.scrollContent}>
            {/* --- Avatar Section --- */}
            <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                <View style={styles.imageWrapper}>
                <Image 
                    source={{ uri: image || user?.profile?.imageUrl || 'https://img.freepik.com/premium-vector/cute-cartoon-fish-cute-little-fish_1057-117676.jpg?w=360' }} 
                    style={styles.avatar} 
                />
                {/* Camera Badge */}
                <View style={styles.cameraBadge}>
                    <Camera size={18} color="white" />
                </View>
                </View>
            </TouchableOpacity>
            <Text style={styles.changePhotoText}>Tap to change photo</Text>
            </View>

            {/* --- Form Section --- */}
            <View style={styles.form}>
            
            {/* Name Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                    <User size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>
            </View>

            {/* --- Action Buttons --- */}
            <View style={styles.footer}>
            <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={handleSave}
                disabled={isLoading}
            >
                {isLoading ? (
                <ActivityIndicator color="white" />
                ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
            </TouchableOpacity>
            </View>

            <StatusModal
                visible={success}
                type="success"
                message="Profile updated successfully!"
                onClose={() => handleCloseSuccessModal()}
            />
        </View>
      </Background>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Avatar
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  imageWrapper: {
    position: 'relative',
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 999,
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6', // Primary Blue
    padding: 10,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'white',
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },

  // Form
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56, // Comfortable touch target
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  // Text Area specific styles
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  textArea: {
    height: '100%',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },

  // Footer Actions
  footer: {
    marginTop: 'auto', // Push to bottom if content is short
  },
  saveBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 50,
  },
  saveBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});