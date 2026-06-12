import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';
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

  const PRIMARY = '#10b981';
  const SECONDARY = '#eab308';
  const BACKGROUND = '#0a0f1c';
  const CARD_BG = '#111827';
  const INACTIVE = '#64748b';
  const BORDER = 'rgba(255, 255, 255, 0.08)';

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
        tabBarActiveTintColor: SECONDARY, // Active color to match Amber highlights
        tabBarInactiveTintColor: INACTIVE,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: CARD_BG,
          borderTopWidth: 1,
          borderTopColor: BORDER,
          minHeight: Platform.select({ ios: 90, default: 75 }),
          paddingBottom: Platform.select({ ios: insets.bottom || 20, default: 0 }),
          paddingTop: 10,
          elevation: 25,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: -5 },
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          marginTop: 4,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finance',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? "wallet" : "wallet-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="apply"
        options={{
          title: 'Apply',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.centerBtn, { backgroundColor: focused ? SECONDARY : BACKGROUND, borderColor: SECONDARY }]}>
              <Ionicons size={28} name="add" color={focused ? BACKGROUND : SECONDARY} />
            </View>
          ),
          tabBarLabel: () => null, // Hide label for center button
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? "document-text" : "document-text-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? "person" : "person-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerBtn: {
    width: 54,
    height: 54,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#eab308',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  }
});
