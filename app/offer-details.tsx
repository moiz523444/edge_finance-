import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
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
const BORDER_COLOR = '#e2e8f0';

interface CustomSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

// Reusable Slider Component
const CustomSlider = ({ value, min = 0, max = 100000, onChange }: CustomSliderProps) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const handleTouch = (evt: any) => {
    if (sliderWidth === 0) return;
    const x = evt.nativeEvent.locationX;
    const pct = Math.max(0, Math.min(1, x / sliderWidth));
    const calculatedVal = Math.round(pct * (max - min) + min);
    onChange(calculatedVal);
  };

  return (
    <View 
      style={styles.sliderContainer}
      onLayout={(evt) => setSliderWidth(evt.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleTouch}
      onResponderMove={handleTouch}
    >
      <View style={styles.sliderTrackBg}>
        <View style={[styles.sliderTrackFill, { width: `${percentage}%` }]} />
        <View style={[styles.sliderThumb, { left: `${percentage}%` }]} />
      </View>
    </View>
  );
};

export default function OfferDetailsScreen() {
  const router = useRouter();
  
  // State for interactive UI
  const [financeAmount, setFinanceAmount] = useState(25000);
  
  // State for API data
  const [offerDetails, setOfferDetails] = useState({
    maxAmount: 25000,
    minAmount: 20001,
    profitRate: "20%",
    profitRateNumber: 15, // E.g., for the badge
    tenure: "36 months",
    tenureBottom: "24 Month",
    installment: "1,277"
  });
  const [isLoading, setIsLoading] = useState(false);

  // TODO: API INTEGRATION
  // Uncomment and update this when your backend is ready
  /*
  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        setIsLoading(true);
        // Example: const response = await apiService.get('/user/offer-details');
        // setOfferDetails(response.data);
        // setFinanceAmount(response.data.maxAmount); // Set initial slider value
      } catch (error) {
        console.error("Failed to fetch offer details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOfferDetails();
  }, []);
  */

  const incrementAmount = () => setFinanceAmount(prev => Math.min(offerDetails.maxAmount, prev + 1000));
  const decrementAmount = () => setFinanceAmount(prev => Math.max(offerDetails.minAmount, prev - 1000));

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
          
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.titleSection}>
            <Text style={styles.pageTitle}>Eligible Offers</Text>
            <Text style={styles.pageSubtitle}>
              As per your provided information, you are eligible to apply for below mentioned offers
            </Text>
          </Animated.View>

          {/* Top Big Green Card */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <View style={styles.mainOfferCard}>
              <TouchableOpacity style={styles.iconBtn} onPress={incrementAmount} activeOpacity={0.7}>
                <Ionicons name="add" size={24} color={PRIMARY} />
              </TouchableOpacity>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image 
                  source={require('../assets/images/riyal.png')} 
                  style={{ width: 20, height: 20, tintColor: WHITE, marginRight: 6 }} 
                  resizeMode="contain" 
                />
                <Text style={styles.mainOfferAmount}>{financeAmount.toLocaleString()}</Text>
              </View>
              
              <TouchableOpacity style={styles.iconBtn} onPress={decrementAmount} activeOpacity={0.7}>
                <Ionicons name="remove" size={24} color={PRIMARY} />
              </TouchableOpacity>
            </View>

            {/* Info Row Below Main Card */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="calendar" size={22} color={PRIMARY} />
                <Text style={styles.infoText}>Tenure: {offerDetails.tenure}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="pricetag" size={22} color={PRIMARY} />
                <Text style={styles.infoText}>Profit Rate: {offerDetails.profitRateNumber}%</Text>
              </View>
            </View>
          </Animated.View>

          {/* Slider Card */}
          <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.sliderCard}>
            <View style={styles.sliderCardHeader}>
              <View>
                <Text style={styles.sliderCardLabel}>Finance Amount</Text>
                <Text style={styles.sliderSubLabel}>
                  <Image 
                    source={require('../assets/images/riyal.png')} 
                    style={{ width: 12, height: 12, tintColor: TEXT_SECONDARY }} 
                    resizeMode="contain" 
                  /> 40,000
                </Text>
              </View>
              <View style={styles.sliderInputBox}>
                <TextInput
                  style={styles.sliderInputText}
                  value={String(financeAmount)}
                  onChangeText={(val) => setFinanceAmount(Number(val) || 20001)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <CustomSlider value={financeAmount} min={offerDetails.minAmount} max={offerDetails.maxAmount} onChange={setFinanceAmount} />
            
            <View style={styles.sliderBounds}>
              <Text style={styles.boundText}>
                <Image 
                  source={require('../assets/images/riyal.png')} 
                  style={{ width: 10, height: 10, tintColor: TEXT_SECONDARY }} 
                  resizeMode="contain" 
                /> {offerDetails.minAmount}
              </Text>
              <Text style={styles.boundText}>
                <Image 
                  source={require('../assets/images/riyal.png')} 
                  style={{ width: 10, height: 10, tintColor: TEXT_SECONDARY }} 
                  resizeMode="contain" 
                /> {offerDetails.maxAmount.toLocaleString()}
              </Text>
            </View>

            <View style={styles.sliderFooter}>
              <Text style={styles.footerInfoText}>Profit Rate: {offerDetails.profitRate}</Text>
              <Text style={styles.footerInfoText}>Tenure: {offerDetails.tenureBottom}</Text>
              <Text style={styles.footerInfoText}>Installments: {offerDetails.installment}</Text>
            </View>
          </Animated.View>

        </ScrollView>

        {/* Footer Action */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.footer}>
          <TouchableOpacity 
            style={styles.applyBtn} 
            activeOpacity={0.8}
            onPress={() => router.push('/confirm-offer')}
          >
            <Text style={styles.applyBtnText}>Apply Now</Text>
          </TouchableOpacity>
        </Animated.View>

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
    paddingBottom: 130, // Space for footer
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
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  mainOfferCard: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  iconBtn: {
    backgroundColor: WHITE,
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainOfferAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: WHITE,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: TEXT_MAIN,
    fontWeight: '500',
  },

  sliderCard: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 16,
    padding: 20,
    gap: 18,
  },
  sliderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderCardLabel: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "700",
  },
  sliderSubLabel: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  sliderInputBox: {
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 80,
    maxWidth: 120,
    alignItems: "center",
  },
  sliderInputText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    padding: 0,
    margin: 0,
    width: "100%",
  },
  sliderContainer: {
    height: 30,
    justifyContent: "center",
  },
  sliderTrackBg: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    position: "relative",
  },
  sliderTrackFill: {
    height: "100%",
    backgroundColor: PRIMARY,
    borderRadius: 3,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: PRIMARY,
    position: "absolute",
    top: -7,
    transform: [{ translateX: -10 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sliderBounds: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boundText: {
    color: TEXT_SECONDARY,
    fontSize: 12,
    fontWeight: "500",
  },
  sliderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerInfoText: {
    fontSize: 10,
    color: TEXT_SECONDARY,
    fontWeight: '500',
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
  },
  applyBtn: { 
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: { 
    color: WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
});
