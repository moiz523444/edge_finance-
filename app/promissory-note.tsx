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

export default function PromissoryNoteScreen() {
  const router = useRouter();

  const handleProceed = () => {
    // Navigate to IBAN screen
    router.push('/iban');
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
                  <Text style={styles.cardTitle}>Promissory Note Signing</Text>
                  <Text style={styles.cardDescription}>
                    A SMS has been sent for promissory note approval, kindly approve the request in order to proceed
                  </Text>
                  <Text style={styles.cardDescriptionSecondary}>
                    After signing contract and approving promissory note, Please click below to proceed
                  </Text>
                </View>
                
                {/* Grey Icon Tab */}
                <Animated.View entering={FadeInRight.duration(500).delay(400)} style={styles.iconTab}>
                  <Image 
                    source={require('../assets/images/edit.png')} 
                    style={{ width: 32, height: 32, resizeMode: 'contain', tintColor: WHITE }} 
                  />
                </Animated.View>
              </View>

              <TouchableOpacity 
                style={styles.signBtn} 
                activeOpacity={0.8}
                onPress={handleProceed}
              >
                <Text style={styles.signBtnText}>Proceed</Text>
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
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
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
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 22,
  },
  cardDescriptionSecondary: {
    fontSize: 12,
    color: '#1e293b',
    lineHeight: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  
  iconTab: {
    position: 'absolute',
    right: -24,
    top: -24,
    backgroundColor: '#475569',
    width: 60,
    height: 85,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
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
