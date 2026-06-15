import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PRIMARY = '#2E8B57'; // Green
const SECONDARY = '#2E8B57'; // Green
const BACKGROUND = '#ffffff';
const CARD_BG = '#ffffff';
const WHITE = '#ffffff';
const TEXT_MAIN = '#111827';
const TEXT_SECONDARY = '#6B7280';
const BORDER = '#D1D5DB';
const ERROR = '#ef4444';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color={TEXT_MAIN} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logoImage} 
              resizeMode="contain" 
            />
          </View>

          <Text style={styles.titleText}>Privacy Policy</Text>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
            <Animated.View entering={FadeInDown.delay(200)}>
              <Text style={styles.bodyText}>
                {"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n\n"}
                {"It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\n"}
                {"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.\n\n"}
                {"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."}
              </Text>
            </Animated.View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => router.replace('/success')}
          >
            <Text style={styles.actionBtnText}>Accept And Continue</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logoImage: { width: 140, height: 60 },
  titleText: { fontSize: 24, fontWeight: '600', color: TEXT_MAIN, textAlign: 'center', marginBottom: 25 },
  scrollView: { flex: 1, marginBottom: 20, paddingRight: 10 },
  bodyText: { fontSize: 14, color: TEXT_SECONDARY, lineHeight: 24, textAlign: 'left' },
  actionBtn: { width: '100%', height: 56, borderRadius: 16, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  actionBtnText: { fontSize: 16, fontWeight: '600', color: WHITE },
});
