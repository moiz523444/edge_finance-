import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          
          <View style={styles.logoSection}>
            <View style={[styles.logoBadge, { backgroundColor: PRIMARY + '15' }]}>
              <Ionicons name="flash" size={42} color={PRIMARY} />
            </View>
            <Text style={styles.brandName}>EDGE <Text style={{ color: PRIMARY }}>FINANCE</Text></Text>
          </View>

          <View style={styles.centerSection}>
            <Animated.View entering={ZoomIn.duration(800)} style={styles.successCircle}>
              <View style={[styles.innerCircle, { backgroundColor: SECONDARY }]}>
                <Ionicons name="checkmark" size={80} color={BACKGROUND} />
              </View>
              {/* Decorative rings */}
              <View style={[styles.ring, { borderColor: SECONDARY + '30', width: 200, height: 200 }]} />
              <View style={[styles.ring, { borderColor: SECONDARY + '10', width: 250, height: 250 }]} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.textSection}>
              <Text style={styles.titleText}>Account Created!</Text>
              <Text style={styles.subText}>
                Dear user your account has been created successfully. Sign in to start using app.
              </Text>
            </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.footerSection}>
            <TouchableOpacity 
              style={[styles.continueBtn, { backgroundColor: SECONDARY }]} 
              onPress={() => router.replace('/login')}
            >
              <Text style={[styles.continueBtnText, { color: BACKGROUND }]}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40, justifyContent: 'space-between' },
  logoSection: { alignItems: 'center' },
  logoBadge: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  brandName: { fontSize: 28, fontWeight: '900', color: WHITE, letterSpacing: -0.5 },
  centerSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  successCircle: { width: 160, height: 160, justifyContent: 'center', alignItems: 'center', marginBottom: 50 },
  innerCircle: { width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center', zIndex: 2, elevation: 15, shadowColor: SECONDARY, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  ring: { position: 'absolute', borderRadius: 150, borderWidth: 2 },
  textSection: { alignItems: 'center' },
  titleText: { fontSize: 32, fontWeight: '900', color: WHITE, marginBottom: 15, textAlign: 'center' },
  subText: { fontSize: 16, color: TEXT_SECONDARY, textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },
  footerSection: { marginBottom: 30 },
  continueBtn: { height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: SECONDARY, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  continueBtnText: { fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
});
