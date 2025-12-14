import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle, XCircle } from 'lucide-react-native';

interface StatusModalProps {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({ visible, type, message, onClose }) => {
  const isSuccess = type === 'success';

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {isSuccess ? (
            <CheckCircle size={48} color="#10B981" style={styles.icon} />
          ) : (
            <XCircle size={48} color="#EF4444" style={styles.icon} />
          )}
          
          <Text style={styles.title}>{isSuccess ? 'Success!' : 'Oops!'}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity 
            style={[styles.button, isSuccess ? styles.btnSuccess : styles.btnError]} 
            onPress={onClose}
          >
            <Text style={styles.buttonText}>{isSuccess ? 'Great' : 'Try Again'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  icon: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  message: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  button: { paddingVertical: 12, paddingHorizontal: 32, borderRadius: 10, width: '100%', alignItems: 'center' },
  btnSuccess: { backgroundColor: '#10B981' },
  btnError: { backgroundColor: '#EF4444' },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
});