import { HapticTab } from '@/components/haptic-tab';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getToken } from '@/services/secureStore';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (!token) {
        console.log("[TabLayout] No token found, redirecting to onboarding...");
        router.replace('/onboarding');
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const PRIMARY = '#2E8B57';
  const SECONDARY = '#2E8B57';
  const BACKGROUND = '#ffffff';
  const CARD_BG = '#ffffff';
  const INACTIVE = '#9CA3AF';
  const BORDER = '#E5E7EB';

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BACKGROUND }}>
        <ActivityIndicator size="large" color={SECONDARY} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.select({ ios: insets.bottom || 20, default: 20 }),
          left: 20,
          right: 20,
          backgroundColor: CARD_BG,
          borderRadius: 35,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 0,
          paddingTop: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: 5 },
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
          marginBottom: 2,
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons size={28} name={focused ? "home-variant" : "home-variant-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finances',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons size={28} name={focused ? "chart-bar" : "chart-bar"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="apply"
        options={{
          title: 'Apply Now',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons size={28} name={focused ? "calendar-text" : "calendar-text-outline"} color={PRIMARY} />
          ),
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '800',
            marginTop: 2,
            marginBottom: 2,
            color: PRIMARY,
          }
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Support',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons size={28} name={focused ? "headset" : "headset"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons size={28} name={focused ? "account" : "account-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="loan-approved"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});

