import { CircleCheck, MinusCircle, ThumbsDown, ThumbsUp, X, XCircle } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { FeedbackData } from '../types/landings';
import { useForecast } from '../hooks/useForecast';
import { postFeedback } from '../../../../api/landingsApi';


interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  visible, 
  onClose
}) => {
  const {
      accuracy,
      setAccuracy,
      actualCatch,
      setActualCatch,
      isUseful,
      setIsUseful,
      trust,
      setTrust,
      comment,
      setComment,
      feedbackComments,
      setFeedbackComments,
      docId,
      submitFeedback
    } = useForecast();

  // Reset form when opening
  useEffect(() => {
    if (visible) {
      setAccuracy(null);
      setActualCatch('');
      setIsUseful(null);
      setTrust(null);
      setComment('');
    }
  }, [visible]);

  const handleSubmitFeedback = async () => {
    const data = {
      actualValue: actualCatch,
      accuracyRating: accuracy,
      isUseful: isUseful,
      trustLevel: trust,
      comment: comment,
      feedbackComments: feedbackComments
    }
    await postFeedback(data as any as FeedbackData, docId);
    onClose();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Feedback</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* --- SECTION 1: REALITY CHECK --- */}
            <View style={styles.section}>
              <Text style={styles.question}>
                How accurate was the <Text style={styles.highlight}>Forecast</Text>?
                {"\n"}Did the actual catch match?
              </Text>
              
              <View style={styles.row}>
                <TouchableOpacity 
                  style={[styles.bigBtn, accuracy === 'GOOD' && styles.btnGreen]}
                  onPress={() => setAccuracy('GOOD')}
                >
                  <CircleCheck size={28} color={accuracy === 'GOOD' ? "#FFF" : "#4CAF50"} />
                  <Text style={[styles.btnText, accuracy === 'GOOD' && styles.textWhite]}>Spot On</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.bigBtn, accuracy === 'OK' && styles.btnYellow]}
                  onPress={() => setAccuracy('OK')}
                >
                  <MinusCircle size={28} color={accuracy === 'OK' ? "#FFF" : "#FFC107"} />
                  <Text style={[styles.btnText, accuracy === 'OK' && styles.textWhite]}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.bigBtn, accuracy === 'BAD' && styles.btnRed]}
                  onPress={() => setAccuracy('BAD')}
                >
                  <XCircle size={28} color={accuracy === 'BAD' ? "#FFF" : "#F44336"} />
                  <Text style={[styles.btnText, accuracy === 'BAD' && styles.textWhite]}>Wrong</Text>
                </TouchableOpacity>
              </View>

              {/* Conditional Input */}
              {(accuracy === 'BAD' || accuracy === 'OK') && (
                <View style={styles.correctionBox}>
                  <Text style={styles.subLabel}>What was the actual amount (tonnes)?</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 1.5"
                    keyboardType="numeric"
                    value={actualCatch}
                    onChangeText={setActualCatch}
                  />
                </View>
              )}
            </View>

            {/* --- SECTION 2: USEFULNESS --- */}
            <View style={styles.section}>
              <Text style={styles.question}>Did this forecast help you plan?</Text>
              <View style={styles.row}>
                <TouchableOpacity 
                  style={[styles.mediumBtn, isUseful === true && styles.btnBlue]}
                  onPress={() => setIsUseful(true)}
                >
                  <ThumbsUp size={24} color={isUseful === true ? "#FFF" : "#2196F3"} />
                  <Text style={[styles.btnText, isUseful === true && styles.textWhite]}>Yes, Helpful</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.mediumBtn, isUseful === false && styles.btnGrey]}
                  onPress={() => setIsUseful(false)}
                >
                  <ThumbsDown size={24} color={isUseful === false ? "#FFF" : "#757575"} />
                  <Text style={[styles.btnText, isUseful === false && styles.textWhite]}>Not Really</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* --- SECTION 3: TRUST --- */}
            <View style={styles.section}>
              <Text style={styles.question}>Will you trust our advice next time?</Text>
              <View style={styles.sliderRow}>
                {['LOW', 'MEDIUM', 'HIGH'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.pillBtn, 
                      trust === level && styles.btnDark
                    ]}
                    onPress={() => setTrust(level as any)}
                  >
                    <Text style={[styles.pillText, trust === level && styles.textWhite]}>
                      {level === 'HIGH' ? 'Yes' : level === 'MEDIUM' ? 'Maybe' : 'No'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* --- SECTION 4: COMMENTS --- */}
            <View style={styles.section}>
              <Text style={styles.question}>Comments</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. I really enjoyed the forecast..."
                multiline
                value={feedbackComments}
                onChangeText={setFeedbackComments}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitBtn, (!accuracy || !trust) && styles.submitBtnDisabled]}
              disabled={!accuracy || !trust}
              onPress={() => handleSubmitFeedback()}
            >
              <Text style={styles.submitBtnText}>Submit Report</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: '800', 
    color: '#1A1A1A',
  },
  closeBtn: {
    padding: 5,
  },
  section: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 20,
  },
  question: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
  highlight: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
  // --- BUTTON STYLES ---
  bigBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  mediumBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  pillBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
  },
  // --- ACTIVE STATES ---
  btnGreen: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  btnYellow: { backgroundColor: '#FFC107', borderColor: '#FFC107' },
  btnRed: { backgroundColor: '#F44336', borderColor: '#F44336' },
  btnBlue: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  btnGrey: { backgroundColor: '#757575', borderColor: '#757575' },
  btnDark: { backgroundColor: '#333' },
  
  // --- TEXT STYLES ---
  btnText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  textWhite: { color: '#FFF' },

  // --- INPUTS ---
  correctionBox: {
    marginTop: 15,
    backgroundColor: '#F5F9FF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1E3FF',
  },
  subLabel: {
    fontSize: 13,
    color: '#1565C0',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // --- SUBMIT ---
  submitBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitBtnDisabled: {
    backgroundColor: '#B0BEC5',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});