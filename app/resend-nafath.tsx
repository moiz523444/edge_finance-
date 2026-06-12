import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const PRIMARY = '#10b981'; // Emerald
const SECONDARY = '#eab308'; // Amber
const BACKGROUND = '#0a0f1c';
const CARD_BG = '#111827';
const WHITE = '#FFFFFF';
const TEXT_SECONDARY = '#94a3b8';
const BORDER = 'rgba(255, 255, 255, 0.08)';

export default function ResendNafathScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tpuRecId?: string; transactionId?: string; idNumber?: string }>();
  const tpuRecId = params.tpuRecId || '';
  const transactionId = params.transactionId || '';
  const idNumber = params.idNumber || '';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color={WHITE} />
          </TouchableOpacity>

          <View style={styles.logoSection}>
            <View style={[styles.logoBadge, { backgroundColor: PRIMARY + '15' }]}>
              <Ionicons name="flash" size={42} color={PRIMARY} />
            </View>
            <Text style={styles.brandName}>EDGE <Text style={{ color: PRIMARY }}>FINANCE</Text></Text>
          </View>

          <View style={styles.flexCenter}>
            <Animated.View entering={FadeInDown.duration(800)} style={styles.card}>
              <Animated.View entering={ZoomIn.delay(300).duration(600)} style={[styles.iconCircle, { backgroundColor: SECONDARY + '15' }]}>
                <Ionicons name="ribbon-outline" size={70} color={SECONDARY} />
                <View style={styles.smallCheck}>
                  <Ionicons name="checkmark-circle" size={30} color={SECONDARY} />
                </View>
              </Animated.View>

              <Text style={styles.cardTitle}>Resend Code via Nafath</Text>
              <Text style={styles.cardDesc}>
                Request a new Nafath code to continue your verification process.
              </Text>

              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: SECONDARY }]}
                onPress={() => router.replace({
                  pathname: '/nafath',
                  params: { tpuRecId, transactionId, idNumber }
                })}
              >
                <Text style={[styles.actionBtnText, { color: BACKGROUND }]}>Resend</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.replace('/(tabs)/dashboard')}>
                <Text style={[styles.dashboardLink, { color: PRIMARY }]}>Go to Dashboard</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 20 },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoBadge: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  brandName: { fontSize: 28, fontWeight: '900', color: WHITE, letterSpacing: -0.5 },
  flexCenter: { flex: 1, justifyContent: 'center' },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 35,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  smallCheck: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: CARD_BG,
    borderRadius: 15,
  },
  cardTitle: { fontSize: 26, fontWeight: '900', color: WHITE, marginBottom: 15, textAlign: 'center' },
  cardDesc: { fontSize: 16, color: TEXT_SECONDARY, textAlign: 'center', lineHeight: 24, marginBottom: 35, paddingHorizontal: 10 },
  actionBtn: { width: '100%', height: 62, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: SECONDARY, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8, marginBottom: 25 },
  actionBtnText: { fontSize: 18, fontWeight: '900' },
  dashboardLink: { fontSize: 16, fontWeight: '800' },
});
