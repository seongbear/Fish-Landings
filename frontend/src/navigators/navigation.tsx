import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '../store/store';

import HomePage from '../screens/(tabs)/home/screens/Home';
import AIHelpPage from '../screens/(tabs)/ai_help/screens/AiHelp';
import { KnowledgeCenterScreen } from '../screens/(tabs)/home/screens/knowledge/KnowledgeCenter';
import { KnowledgeDetailScreen } from '../screens/(tabs)/home/screens/knowledge/KnowledgeDetail';
import DaysWeather from '../screens/(tabs)/home/screens/weather/DaysWeather';
import { ChartColumnBig, Home, MessageCircle, User } from 'lucide-react-native';
import CatchHistory from '../screens/(tabs)/home/screens/record/CatchHistory';
import EditProfile from '../screens/(tabs)/profile/screens/EditProfile';
import Settings from '../screens/(tabs)/profile/screens/Settings';
import DashboardPage from '../screens/(tabs)/dashboard/screens/dashboard';
import ProfilePage from '../screens/(tabs)/profile/screens/profile';
import { Forecast } from '../screens/(tabs)/dashboard/screens/forecast';

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
          let Icon = Home;

          if (route.name === 'Home') Icon = Home;
          else if (route.name === 'AI Help') Icon = MessageCircle;
          else if (route.name === 'Profile') Icon = User;
          else if (route.name === 'Dashboard') Icon = ChartColumnBig;
          return <Icon size={24} color={focused ? '#1c47d4ff' : 'gray'} />;
        },
        tabBarActiveTintColor: '#1c47d4ff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home">
        {() => <HomePage user={user?.email || 'User'} />}
      </Tab.Screen>
      <Tab.Screen name="AI Help" component={AIHelpPage} />
      <Tab.Screen name="Dashboard" component={DashboardPage} />
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

        <Stack.Screen 
          name="DaysWeather" 
          component={DaysWeather} 
          options={({ route }: any) => ({
            headerShown: true,
            title: 'Weather Forecast',
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitle,
          })}
        />

        <Stack.Screen 
          name="CatchHistory" 
          component={CatchHistory} 
          options={({ route }: any) => ({
            headerShown: true,
            title: 'Catch History',
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitle,
          })}
        />

        <Stack.Screen 
          name="EditProfile" 
          component={EditProfile} 
          options={({ route }: any) => ({
            headerShown: true,
            title: 'Edit Profile',
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitle,
          })}
        />

        <Stack.Screen 
          name="Settings" 
          component={Settings}
          options={{
            headerShown: true,
            title: 'Settings',
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitle,
          }}
        />

        <Stack.Screen
          name="Forecast"
          component={Forecast}
          options={{
            headerShown: true,
            title: 'Forecast Fish Landings',
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitle,
          }}
        />
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
