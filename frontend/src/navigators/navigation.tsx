import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAppStore } from '../store/store';

import HomePage from '../screens/(tabs)/home/screens/home';
import ProfilePage from '../screens/(tabs)/profile/screens/profile';
import AIHelpPage from '../screens/(tabs)/ai_help/screens/aiHelp';
import { KnowledgeCenterScreen } from '../screens/(tabs)/home/screens/knowledge/knowledge_center';
import { KnowledgeDetailScreen } from '../screens/(tabs)/home/screens/knowledge/knowledge_detail';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator (bottom tabs)
function TabNavigator() {
  const user = useAppStore((state) => state.user);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: route.name,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'AI Help') iconName = 'chatbubble';
          else if (route.name === 'Profile') iconName = 'person';

          return (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? '#1c47d4ff' : 'gray'}
            />
          );
        },
        tabBarActiveTintColor: '#1c47d4ff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home">
        {() => <HomePage user={user?.email || 'User'} />}
      </Tab.Screen>

      <Tab.Screen name="AI Help" component={AIHelpPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

// MAIN NAVIGATION (Stack)
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Bottom Tabs */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* Stack Pages */}
        <Stack.Screen 
          name="KnowledgeCenter" 
          component={KnowledgeCenterScreen} 
          options={{ 
            headerShown: true,
            title: 'Knowledge Center', 
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitle,
          }}
        >
          
        </Stack.Screen> 
        <Stack.Screen
          name="KnowledgeDetail"
          options={({ route }: any) => ({
            headerShown: true,
            title: 'Article Details',
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitle,
          })}
        >
          {({ navigation, route }: any) => (
            <KnowledgeDetailScreen navigation={navigation} route={route} />
          )}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
  }
});
