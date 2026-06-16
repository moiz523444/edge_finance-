import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const PRIMARY = '#2E8B57'; // Edge Finance Green
const WHITE = '#ffffff';
const TEXT_MAIN = '#334155';
const TEXT_SECONDARY = '#94a3b8';
const BORDER = '#e2e8f0';

export default function LoanApprovedScreen() {
  const router = useRouter();

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
              source={require('../../assets/images/logo.png')} 
              style={{ width: 140, height: 40, resizeMode: 'contain' }} 
            />
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.content}>
            
            <Animated.View entering={ZoomIn.duration(600).delay(100)} style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <View style={styles.innerCircle}>
                  <Ionicons name="checkmark" size={32} color={PRIMARY} />
                </View>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.textContainer}>
              <Text style={styles.title}>Congratulations</Text>
              <Text style={styles.subtitle}>
                After reviewing your application, we are pleased to offer you a loan with details below
              </Text>
            </Animated.View>

            {/* Timer Section */}
            <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.timerSection}>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>2</Text>
              </View>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>4</Text>
              </View>
              <Text style={styles.colon}>:</Text>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>0</Text>
              </View>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>0</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(600).delay(400)}>
              <Text style={styles.transferInfo}>
                Your finance amount will be transferred to your bank account in 24 hours.
              </Text>
            </Animated.View>

            {/* Details Table */}
            <Animated.View entering={FadeInDown.duration(600).delay(500)} style={styles.detailsContainer}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Loan amount</Text>
                <View style={styles.valueWithIcon}>
                  <Image source={require('../../assets/images/riyal.png')} style={styles.riyalIcon} />
                  <Text style={styles.rowValueGreen}>25,000</Text>
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Total outstanding</Text>
                <View style={styles.valueWithIcon}>
                  <Image source={require('../../assets/images/riyal.png')} style={styles.riyalIcon} />
                  <Text style={styles.rowValueGreen}>22,987</Text>
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.rowLabel}>EMI</Text>
                <View style={styles.valueWithIcon}>
                  <Image source={require('../../assets/images/riyal.png')} style={styles.riyalIcon} />
                  <Text style={styles.rowValueGreen}>2083</Text>
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Due Date</Text>
                <Text style={styles.rowValueGreen}>15 March, 2024</Text>
              </View>
            </Animated.View>

            {/* Footer Buttons */}
            <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.footerSection}>
              <TouchableOpacity>
                <Text style={styles.viewDetailsText}>View details</Text>
              </TouchableOpacity>
              
              <View style={styles.shareWrapper}>
                <TouchableOpacity style={styles.shareBtn}>
                  <Ionicons name="share-social-outline" size={24} color={WHITE} />
                </TouchableOpacity>
                <Text style={styles.shareText}>Share</Text>
              </View>
            </Animated.View>

          </View>
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
    paddingBottom: 100, // Make room for tab bar
  },
  content: {
    paddingHorizontal: 30,
    alignItems: 'center',
    paddingTop: 20,
  },
  
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E6F43', // Darker green ring
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_MAIN,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },

  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  timerBox: {
    width: 44,
    height: 54,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  timerText: {
    fontSize: 28,
    fontWeight: '600',
    color: PRIMARY,
  },
  colon: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e11d48', // Red colon
    marginHorizontal: 4,
    paddingBottom: 4,
  },

  transferInfo: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 10,
  },

  detailsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 14,
    color: TEXT_MAIN,
    fontWeight: '500',
  },
  rowValueGreen: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '600',
  },
  valueWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riyalIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginRight: 4,
    tintColor: PRIMARY,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },

  footerSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  viewDetailsText: {
    fontSize: 13,
    color: PRIMARY,
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  shareWrapper: {
    alignItems: 'center',
  },
  shareBtn: {
    width: 48,
    height: 48,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  shareText: {
    fontSize: 12,
    color: PRIMARY,
  },
});
