import React from 'react';
import { StyleSheet } from 'react-native'; // ✅ Import StyleSheet
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useAppStore } from '../store/store';
import HomePage from '../screens/(tabs)/home/screens/home';
import ProfilePage from '../screens/(tabs)/profile/screens/profile';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const user = useAppStore((state) => state.user);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // hide top header
          tabBarLabel: route.name,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarIcon: ({ focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }

            return <Ionicons name={iconName} size={24} color={focused ? '#1c47d4ff' : 'gray'} />;
          },
          tabBarActiveTintColor: '#1c47d4ff',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home">
          {() => <HomePage user={user?.email || 'User'} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" component={ProfilePage} />
          
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '500',
  }
});
