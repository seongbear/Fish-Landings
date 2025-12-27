import React from 'react';
import { View, StyleSheet,  TouchableOpacity,  Dimensions } from 'react-native';
import { Fish } from 'lucide-react-native';
import Background from '../../../../components/background';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';

const { width } = Dimensions.get('window');
const API_BASE_URL = process.env.API_BASE;
const DASHBOARD_URL = API_BASE_URL + '/dashboard';

export default function DashboardPage() {
  const navigation = useNavigation<any>();

  // Handle fab press 
  const handleFabPress = () => {
    navigation.navigate('Forecast');
  }

  return (
    <Background >
      <View style={styles.container}>
        <WebView 
          source={{ uri: DASHBOARD_URL }} 
          style={styles.webview}
          // Enable Javascript (Required for Chart.js)
          javaScriptEnabled={true}
          // Enable DOM Storage (Required for some interactive elements)
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>
      <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
        <Fish size={24} color="white" />
      </TouchableOpacity>
    </Background>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  // FAB Styles
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF', // Blue color (Change to match your theme)
    borderRadius: 30, // Makes it circular (half of width/height)
    elevation: 8,     // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginTop: -2, // Slight adjustment to center the "+" perfectly
  },
});