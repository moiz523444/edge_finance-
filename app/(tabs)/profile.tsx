import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Platform, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp, SlideInLeft } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { deleteToken, deleteRefreshToken } from '@/services/secureStore';

const { width } = Dimensions.get('window');

const PRIMARY = '#10b981';
const SECONDARY = '#eab308';
const BACKGROUND = '#0a0f1c';
const CARD_BG = '#111827';
const WHITE = '#FFFFFF';
const TEXT_SECONDARY = '#94a3b8';
const BORDER = 'rgba(255, 255, 255, 0.08)';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await deleteToken();
      await deleteRefreshToken();
      console.log("[Profile] Session tokens deleted. Redirecting to login...");
      router.replace('/login');
    } catch (error) {
      console.error("[Profile] Error during sign out:", error);
    }
  };

  const menuItems = [
    { icon: 'person', title: 'Personal Information', color: PRIMARY },
    { icon: 'wallet', title: 'Bank Details', color: SECONDARY },
    { icon: 'shield-checkmark', title: 'Security & Privacy', color: PRIMARY },
    { icon: 'notifications', title: 'Notification Settings', color: SECONDARY },
    { icon: 'help-circle', title: 'Help & Support', color: PRIMARY },
  ];

  return (
    <View style={[styles.container, { backgroundColor: BACKGROUND }]}>
      <StatusBar style="light" />

      {/* Decorative Glows */}
      <View style={styles.decorationContainer}>
        <View style={[styles.glowCircle, { backgroundColor: SECONDARY, left: -100, top: -100, opacity: 0.1 }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header - Premium Dashboard Style */}
          <Animated.View
            entering={FadeInDown.duration(800)}
            style={styles.profileHeader}
          >
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarBorder, { borderColor: PRIMARY }]}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/150?u=abdullah' }}
                  style={styles.avatar}
                />
              </View>
              <TouchableOpacity style={[styles.editBadge, { backgroundColor: SECONDARY }]}>
                <Ionicons name="camera" size={16} color={BACKGROUND} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>Abdullah Al-Dosari</Text>
            <Text style={styles.userEmail}>abdullah.dosari@example.com</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1,250</Text>
                <Text style={styles.statLabel}>Reward Points</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: BORDER }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: PRIMARY }]}>Platinum</Text>
                <Text style={styles.statLabel}>Member Tier</Text>
              </View>
            </View>
          </Animated.View>

          {/* Menu Section */}
          <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            {menuItems.map((item, index) => (
              <Animated.View
                key={index}
                entering={SlideInLeft.duration(600).delay(200 + index * 100)}
              >
                <TouchableOpacity style={[styles.menuItem, { backgroundColor: CARD_BG, borderColor: BORDER }]}>
                  <View style={styles.menuLeft}>
                    <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                      <Ionicons name={item.icon as any} size={22} color={item.color} />
                    </View>
                    <Text style={styles.menuText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={TEXT_SECONDARY} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Logout Button */}
          <Animated.View
            entering={FadeInUp.duration(800).delay(800)}
            style={styles.logoutWrapper}
          >
            <TouchableOpacity 
              style={[styles.logoutBtn, { borderColor: 'rgba(239, 68, 68, 0.3)' }]}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={22} color="#ef4444" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
            <Text style={styles.version}>Version 2.4.0 (Build 902)</Text>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    overflow: 'hidden',
  },
  glowCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0a0f1c',
  },
  userName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 28,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 24,
  },
  menuContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '800',
  },
  version: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
});
