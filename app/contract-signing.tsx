import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const PRIMARY = '#2E8B57'; // Edge Finance Green
const WHITE = '#ffffff';
const TEXT_MAIN = '#1f2937';
const TEXT_SECONDARY = '#94a3b8';
const GREY_TAB = '#4b5563'; // Dark grey for the icon tab

export default function ContractSigningScreen() {
  const router = useRouter();

  const handleSignContract = () => {
    // Navigate to next screen (e.g., OTP or Nafath or Success)
    router.push('/otp');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_MAIN} />
          </TouchableOpacity>
          <View style={styles.headerLogo}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={{ width: 140, height: 40, resizeMode: 'contain' }} 
            />
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Title Section */}
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.titleSection}>
            <Text style={styles.pageTitle}>Contract Signing</Text>
            <Text style={styles.pageSubtitle}>
              Please Click below to sign contract. Same Link has been sent by SMS also.
            </Text>
          </Animated.View>

          {/* Main Card */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.cardWrapper}>
            <View style={styles.cardContainer}>
              
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Contract Signing</Text>
                  <Text style={styles.cardDescription}>
                    Please Click below to sign contract.{"\n"}Same Link has been sent by SMS also.
                  </Text>
                </View>
                
                {/* Grey Icon Tab */}
                <Animated.View entering={FadeInRight.duration(500).delay(400)} style={styles.iconTab}>
                  <Ionicons name="document-text-outline" size={28} color={WHITE} />
                </Animated.View>
              </View>

              <TouchableOpacity 
                style={styles.signBtn} 
                activeOpacity={0.8}
                onPress={handleSignContract}
              >
                <Text style={styles.signBtnText}>Sign Contract</Text>
              </TouchableOpacity>
              
            </View>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 15,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: { flex: 1, alignItems: "center" },

  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_MAIN,
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    position: 'relative',
  },
  textContainer: {
    flex: 1,
    paddingRight: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  
  iconTab: {
    position: 'absolute',
    right: -24,
    top: -24,
    backgroundColor: GREY_TAB,
    width: 56,
    height: 80,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10, // Adjust icon position within tab
  },

  signBtn: { 
    width: '100%',
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  signBtnText: { 
    color: WHITE,
    fontSize: 15,
    fontWeight: "700",
  },
});
