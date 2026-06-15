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
  Image,
} from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const PRIMARY = '#2E8B57'; // Green
const SECONDARY = '#2E8B57'; // Green
const BACKGROUND = '#ffffff';
const CARD_BG = '#ffffff';
const WHITE = '#ffffff';
const TEXT_MAIN = '#111827';
const TEXT_SECONDARY = '#6B7280';

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logoImage} 
              resizeMode="contain" 
            />
          </View>

          <View style={styles.centerSection}>
            <Animated.View entering={ZoomIn.duration(800)} style={styles.successCircle}>
              <Image 
                source={require('../assets/images/arrow.png')} 
                style={{ width: 160, height: 160, resizeMode: 'contain' }} 
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.textSection}>
              <Text style={styles.titleText}>Account Created!</Text>
              <Text style={styles.subText}>
                Dear user your account has been created successfully. Sign in to start using app
              </Text>
            </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.footerSection}>
            <TouchableOpacity 
              style={styles.continueBtn} 
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
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
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logoImage: { width: 140, height: 60 },
  centerSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  successCircle: { width: 160, height: 160, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  textSection: { alignItems: 'center' },
  titleText: { fontSize: 26, fontWeight: '700', color: TEXT_MAIN, marginBottom: 15, textAlign: 'center' },
  subText: { fontSize: 14, color: TEXT_SECONDARY, textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  footerSection: { marginBottom: 30 },
  continueBtn: { width: '100%', height: 56, borderRadius: 16, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center' },
  continueBtnText: { fontSize: 16, fontWeight: '600', color: WHITE },
});
