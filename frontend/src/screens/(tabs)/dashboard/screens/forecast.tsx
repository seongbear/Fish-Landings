import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import Background from '../../../../components/background'; // Your custom background
import { useForecast } from '../hooks/useForecast'; // Import the hook you created
import { STATE_DATA } from '../../../../constants/stateMap';
import { SPECIES_DATA } from '../../../../constants/speciesMap';
import { GEAR_DATA } from '../../../../constants/gearMap';
import { ForecastDropdown } from '../components/render_helper/ForecastDropdown';
import { ForecastInput } from '../components/render_helper/ForecastInput';
import { ForecastModal } from '../components/render_helper/ForecastModal';

export const Forecast = () => {
    // 1. Local Form State
    const [formData, setFormData] = useState({
        species: '',    
        state: '',      
        gear_type: '', 
        year: '',
        month: '',
        temperature: '',
        pressure: '',
        dew_point: '',
        humidity: '',
        wind_speed: '',
        wind_chill: '',
        uv_index: ''
    });

    // 2. Custom Hook for Logic
    const { loading, prediction, explanation, llmExplanation, generateForecast } = useForecast();

    // 3. Modal Picker State
    const [modalVisible, setModalVisible] = useState(false);
    const [currentField, setCurrentField] = useState('');
    const [pickerOptions, setPickerOptions] = useState<Array<{ label: string; value: string }>>([]);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    
    // --- Handlers ---
    const handleInputChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    const openPicker = (field: string, options: Array<{ label: string; value: string }>) => {
        setCurrentField(field);
        setPickerOptions(options);
        setModalVisible(true);
    };

    const selectOption = (item: { label: string; value: string | number }) => {
        handleInputChange(currentField, String(item.value));
        setModalVisible(false);
    };

  const onSubmit = () => {
    const requiredFields = [
        'species', 'state', 'gear_type', 'year', 'month', 
        'temperature', 'pressure', 'dew_point', 'humidity', 'wind_speed', 'uv_index'
    ];

    // Find which fields are empty
    const missingFields = requiredFields.filter(field => {
        const value = formData[field as keyof typeof formData];
        return !value || value.toString().trim() === '';
    });

    // If any are missing, show alert and stop
    if (missingFields.length > 0) {
        Alert.alert(
            "Incomplete Data",
            "Please fill in all required fields before generating a forecast.\n\nMissing: " + missingFields.join(", ")
        );
        return;
    }

    // Convert string values to numbers for the forecast payload
    const payload = {
      species: parseFloat(formData.species),
      state: parseFloat(formData.state),
      gear_type: parseFloat(formData.gear_type),
      year: parseFloat(formData.year),
      month: parseFloat(formData.month),
      temperature: parseFloat(formData.temperature),
      pressure: parseFloat(formData.pressure),
      dew_point: parseFloat(formData.dew_point),
      humidity: parseFloat(formData.humidity),
      wind_speed: parseFloat(formData.wind_speed),
      wind_chill: formData.wind_chill ? parseFloat(formData.wind_chill) : undefined,
      uv_index: parseFloat(formData.uv_index)
    };
    generateForecast(payload);
  };

  const renderFormattedText = (text: string | null) => {
    if (!text) return null;

    // Split text by the markdown bold marker **
    const parts = text.split(/\*\*(.*?)\*\*/g);

    return parts.map((part, index) => {
      // Odd indices correspond to the text that was inside **...**
      if (index % 2 === 1) {
        return (
          <Text key={index} style={{ fontWeight: 'bold', color: '#000' }}>
            {part}
          </Text>
        );
      }
      // Even indices are the normal text
      return <Text key={index}>{part}</Text>;
    });
  };

  // Feedback Modal
  const openFeedbackModal = () => {
    setFeedbackModalVisible(true);
  };

  return (
    <Background disableTopEdge={true}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.header}>Fishery Forecast AI</Text>
          <Text style={styles.subHeader}>Enter operational details to predict catch.</Text>

          {/* --- SECTION 1: Operations --- */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Operational Details</Text>
            <View style={styles.row}>
              {ForecastInput('Year', 'year', '2025', formData, handleInputChange)}
              {ForecastInput('Month', 'month', '1-12', formData, handleInputChange)}
            </View>
            {ForecastDropdown('State', 'state', STATE_DATA, formData, openPicker)}
            {ForecastDropdown('Species', 'species', SPECIES_DATA, formData, openPicker)}
            {ForecastDropdown('Gear Type', 'gear_type', GEAR_DATA, formData, openPicker)}
          </View>

          {/* --- SECTION 2: Weather --- */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Weather Conditions</Text>
            <View style={styles.row}>
              {ForecastInput('Temp (°C)', 'temperature', '28.5', formData, handleInputChange)}
              {ForecastInput('Wind (km/h)', 'wind_speed', '15', formData, handleInputChange)}
            </View>
            <View style={styles.row}>
              {ForecastInput('Humidity (%)', 'humidity', '80', formData, handleInputChange)}
              {ForecastInput('Pressure', 'pressure', '1012', formData, handleInputChange)}
            </View>
            <View style={styles.row}>
              {ForecastInput('Dew Point', 'dew_point', '24', formData, handleInputChange)}
              {ForecastInput('UV Index', 'uv_index', '8', formData, handleInputChange)}
            </View>
            {ForecastInput('Wind Chill (Optional)', 'wind_chill', 'e.g. 26', formData, handleInputChange)}
          </View>

          {/* --- ACTION BUTTON --- */}
          <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>GENERATE FORECAST</Text>
            )}
          </TouchableOpacity>

          {/* --- RESULTS --- */}
          {prediction !== null && (
            <View style={styles.resultsContainer}>
              {/* Prediction Card */}
              <View style={[styles.card, styles.predictionCard]}>
                <Text style={styles.predLabel}>ESTIMATED LANDINGS</Text>
                <Text style={styles.predValue}>
                {Math.max(0, prediction * 1000).toFixed(4)} <Text style={styles.unit}>kg</Text>
                </Text>
              </View>

              {/* Explanation / XAI */}
              {explanation  && llmExplanation && (
                <View>
                  <Text style={styles.resultsHeader}>Analysis</Text>
                  
                  {/* Top Drivers List */}
                  <View style={styles.card}>
                    <Text style={styles.chartTitle}>Key Drivers</Text>
                    {explanation.drivers.map((d, i) => (
                      <View key={i} style={styles.driverRow}>
                        {/* 1. FIX: Use 'd.feature' instead of 'd[0]' */}
                        <Text style={styles.driverName}>
                          {i + 1}. {d.feature}
                        </Text>

                        {/* 2. FIX: Use 'd.shap_impact' instead of 'd[1]' */}
                        <Text style={{ 
                          fontWeight: 'bold', 
                          color: d.shap_impact > 0 ? '#34C759' : '#FF3B30' 
                        }}>
                          {d.shap_impact > 0 ? '+' : ''}
                          {/* Optional: Limit decimals to keep UI clean */}
                          {Number(d.shap_impact).toFixed(4)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Waterfall Plot */}
                  <View style={styles.card}>
                    <Text style={styles.chartTitle}>Feature Breakdown</Text>
                    <Image
                      source={{ uri: `data:image/png;base64,${explanation.waterfall}` }}
                      style={styles.chartImage}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Force Plot */}
                  <View style={styles.card}>
                    <Text style={styles.chartTitle}>Impact Balance</Text>
                    <Image
                      source={{ uri: `data:image/png;base64,${explanation.force}` }}
                      style={styles.wideChartImage}
                      resizeMode="contain"
                    />
                  </View>

                  {/* LLM Explanation */}
                  <View style={styles.card}>
                    <Text style={styles.chartTitle}>Explanation</Text>
                    <Text style={{ fontSize: 14, color: '#444', lineHeight: 20 }}>
                      {/* Call the helper function here instead of raw text */}
                      {renderFormattedText(llmExplanation)}
                    </Text>
                  </View>

                  {/* Provide Feedback Button*/}
                  <TouchableOpacity style={styles.button} onPress={openFeedbackModal}>
                    <Text style={styles.buttonText}>PROVIDE FEEDBACK</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      {/* --- CUSTOM PICKER MODAL --- */}
      <ForecastModal visible={modalVisible} setModalVisible={setModalVisible} pickerOptions={pickerOptions} currentField={currentField} formData={formData} selectOption={selectOption} />

    </Background>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },

  header: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 20 },

  // Form Components
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    // Shadow
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: '#007AFF',
    marginBottom: 12, borderBottomWidth: 1, borderColor: '#f0f0f0', paddingBottom: 8
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },

  // Button
  button: {
    backgroundColor: '#007AFF', height: 50, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginVertical: 10,
    shadowColor: '#007AFF', shadowOpacity: 0.4, shadowOffset: {width:0, height:4}, elevation: 5
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Results
  resultsContainer: { marginTop: 10 },
  predictionCard: { alignItems: 'center', borderLeftWidth: 5, borderLeftColor: '#34C759' },
  predLabel: { fontSize: 12, color: '#888', letterSpacing: 1, fontWeight: '600' },
  predValue: { fontSize: 36, fontWeight: 'bold', color: '#222', marginTop: 4 },
  unit: { fontSize: 18, color: '#666', fontWeight: '400' },
  
  resultsHeader: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 10, marginTop: 10 },
  driverRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  driverName: { fontSize: 14, color: '#444' },
  
  chartTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 10 },
  chartImage: { width: '100%', height: 250, borderRadius: 8 },
  wideChartImage: { width: '100%', height: 120, borderRadius: 8 },
});