import React, { useState } from 'react';
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
import Animated, { FadeInDown } from 'react-native-reanimated';

const PRIMARY = '#2E8B57'; // Edge Finance Green
const WHITE = '#ffffff';
const TEXT_MAIN = '#1f2937';
const TEXT_SECONDARY = '#64748b';
const BORDER_COLOR = '#2E8B57'; // Green borders for cards
const GREY_BTN = '#858585';

export default function ConfirmOfferScreen() {
  const router = useRouter();
  
  // State for API data
  const [offerData, setOfferData] = useState({
    loanAmount: "25,000",
    tenure: "12 Months",
    profitRate: "8.0 %",
    monthlyInstallment: "2250"
  });
  const [isLoading, setIsLoading] = useState(false);

  // TODO: API INTEGRATION
  // Uncomment and update this when your backend is ready
  /*
  useEffect(() => {
    const fetchConfirmOfferData = async () => {
      try {
        setIsLoading(true);
        // Example: const response = await apiService.get('/user/confirm-offer-details');
        // setOfferData(response.data);
      } catch (error) {
        console.error("Failed to fetch confirm offer details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfirmOfferData();
  }, []);
  */

  const handleAccept = () => {
    // Navigate to Contract Signing
    router.push('/contract-signing');
  };

  const handleReject = () => {
    // Navigate back to dashboard or show rejection message
    router.replace('/(tabs)/dashboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header - No Back Button in mockup, just logo centered */}
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={{ width: 140, height: 40, resizeMode: 'contain' }} 
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.titleSection}>
            <Text style={styles.pageTitle}>Confirm Offer</Text>
            <Text style={styles.pageSubtitle}>
              After reviewing your application, we are pleased to offer you a loan with details below
            </Text>
          </Animated.View>

          {/* Cards Grid */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.gridContainer}>
            
            {/* Card 1: Loan Amount */}
            <View style={[styles.gridCard, styles.cardActive]}>
              <View style={styles.iconWrapper}>
                <Image source={require('../assets/images/loan amount.png')} style={{ width: 40, height: 40, tintColor: WHITE }} resizeMode="contain" />
              </View>
              <Text style={[styles.cardTitle, { color: 'rgba(255,255,255,0.8)' }]}>Loan Amount</Text>
              <View style={styles.valueRow}>
                <Image 
                  source={require('../assets/images/riyal.png')} 
                  style={{ width: 14, height: 14, tintColor: WHITE, marginRight: 4 }} 
                  resizeMode="contain" 
                />
                <Text style={[styles.cardValue, { color: WHITE }]}>{offerData.loanAmount}</Text>
              </View>
            </View>

            {/* Card 2: Loan Tenure */}
            <View style={[styles.gridCard, styles.cardInactive]}>
              <View style={styles.iconWrapper}>
                <Image source={require('../assets/images/loan tenure.png')} style={{ width: 40, height: 40, tintColor: PRIMARY }} resizeMode="contain" />
              </View>
              <Text style={styles.cardTitleInactive}>Loan Tenure</Text>
              <Text style={styles.cardValueGreen}>{offerData.tenure}</Text>
            </View>

            {/* Card 3: Profit Rate */}
            <View style={[styles.gridCard, styles.cardInactive]}>
              <View style={styles.iconWrapper}>
                <Image source={require('../assets/images/profit rate.png')} style={{ width: 40, height: 40, tintColor: PRIMARY }} resizeMode="contain" />
              </View>
              <Text style={styles.cardTitleInactive}>Profit Rate</Text>
              <Text style={styles.cardValueGreen}>{offerData.profitRate}</Text>
            </View>

            {/* Card 4: Monthly Installment */}
            <View style={[styles.gridCard, styles.cardInactive]}>
              <View style={styles.iconWrapper}>
                <Image source={require('../assets/images/monthly installment.png')} style={{ width: 40, height: 40, tintColor: PRIMARY }} resizeMode="contain" />
              </View>
              <Text style={styles.cardTitleInactive}>Monthly Installment</Text>
              <View style={styles.valueRow}>
                <Image 
                  source={require('../assets/images/riyal.png')} 
                  style={{ width: 14, height: 14, tintColor: PRIMARY, marginRight: 4 }} 
                  resizeMode="contain" 
                />
                <Text style={styles.cardValueGreen}>{offerData.monthlyInstallment}</Text>
              </View>
            </View>

          </Animated.View>

        </ScrollView>

        {/* Footer Actions */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.footer}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: GREY_BTN }]} 
            activeOpacity={0.8}
            onPress={handleReject}
          >
            <Text style={styles.actionBtnText}>Reject Offer</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: PRIMARY }]} 
            activeOpacity={0.8}
            onPress={handleAccept}
          >
            <Text style={styles.actionBtnText}>Accept Offer</Text>
          </TouchableOpacity>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 15,
  },
  headerLogo: { alignItems: "center" },

  scrollContent: {
    padding: 24,
    paddingBottom: 120, // Space for footer
  },
  
  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_MAIN,
    marginBottom: 16,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  gridCard: {
    width: '47%',
    aspectRatio: 0.9,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardActive: {
    backgroundColor: PRIMARY,
    borderWidth: 1,
    borderColor: PRIMARY,
  },
  cardInactive: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_COLOR, // Green border
  },

  iconWrapper: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardTitleInactive: {
    fontSize: 11,
    fontWeight: '500',
    color: '#a1a1aa', // light grey title for inactive cards
    marginBottom: 8,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  cardValueGreen: {
    fontSize: 16,
    fontWeight: '800',
    color: PRIMARY,
    textAlign: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 34,
    backgroundColor: WHITE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionBtn: { 
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: { 
    color: WHITE,
    fontSize: 15,
    fontWeight: "600",
  },
});
