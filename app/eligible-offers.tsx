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
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const PRIMARY = '#2E8B57'; // Edge Finance Green
const WHITE = '#ffffff';
const TEXT_MAIN = '#1f2937';
const TEXT_SECONDARY = '#94a3b8';
const BORDER_COLOR = '#e2e8f0';

// Mock Offers (To be replaced by API)
const INITIAL_MOCK_OFFERS = [
  { id: '1', amount: '25,000', profitRate: '20%', tenure: '24 Months', installment: '1,277' },
  { id: '2', amount: '20,000', profitRate: '20%', tenure: '24 Months', installment: '1,277' },
  { id: '3', amount: '15,000', profitRate: '20%', tenure: '24 Months', installment: '1,277' },
  { id: '4', amount: '10,000', profitRate: '20%', tenure: '24 Months', installment: '1,277' },
];

export default function EligibleOffersScreen() {
  const router = useRouter();
  
  // State for API data
  const [offers, setOffers] = useState(INITIAL_MOCK_OFFERS);
  const [selectedOfferId, setSelectedOfferId] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);

  // TODO: API INTEGRATION
  // Uncomment and update this when your backend is ready
  /*
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        // Example: const response = await apiService.get('/user/eligible-offers');
        // setOffers(response.data.offers);
        // setSelectedOfferId(response.data.offers[0].id); // Auto-select first offer
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffers();
  }, []);
  */

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

          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.offersGrid}>
            {offers.map((offer, index) => {
              const isSelected = selectedOfferId === offer.id;

              return (
                <TouchableOpacity
                  key={offer.id}
                  activeOpacity={0.7}
                  style={[
                    styles.offerCard,
                    isSelected ? styles.offerCardActive : styles.offerCardInactive
                  ]}
                  onPress={() => {
                    console.log("Selected Offer:", offer.id);
                    setSelectedOfferId(offer.id);
                  }}
                >
                  <View pointerEvents="none">
                    <Text style={[styles.cardTitle, isSelected ? { color: WHITE } : { color: TEXT_SECONDARY }]}>
                      Get Loan of
                    </Text>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                      <Image 
                        source={require('../assets/images/riyal.png')} 
                        style={{ width: 18, height: 18, tintColor: isSelected ? WHITE : PRIMARY, marginRight: 4 }} 
                        resizeMode="contain" 
                      />
                      <Text style={[styles.cardAmount, isSelected ? { color: WHITE } : { color: PRIMARY }, { marginBottom: 0 }]}>
                        {offer.amount}
                      </Text>
                    </View>

                    <View style={styles.cardDetails}>
                      <Text style={[styles.detailText, isSelected ? { color: 'rgba(255,255,255,0.8)' } : { color: TEXT_SECONDARY }]}>
                        Profit Rate: {offer.profitRate}
                      </Text>
                      <Text style={[styles.detailText, isSelected ? { color: 'rgba(255,255,255,0.8)' } : { color: TEXT_SECONDARY }]}>
                        Tenure: {offer.tenure}
                      </Text>
                      <Text style={[styles.detailText, isSelected ? { color: 'rgba(255,255,255,0.8)' } : { color: TEXT_SECONDARY }]}>
                        Installments:{' '}
                        <Image 
                          source={require('../assets/images/riyal.png')} 
                          style={{ width: 10, height: 10, tintColor: isSelected ? 'rgba(255,255,255,0.8)' : TEXT_SECONDARY }} 
                          resizeMode="contain" 
                        />{' '}
                        {offer.installment}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

        </ScrollView>

        {/* Footer Action */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.footer}>
          <TouchableOpacity 
            style={styles.nextBtn} 
            activeOpacity={0.8}
            onPress={() => router.push("/offer-details")}
          >
            <Text style={styles.nextBtnText}>Next</Text>
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
    paddingBottom: 100, // Space for floating button
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
    color: '#64748b', // slightly darker grey for readability
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  offersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  offerCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  offerCardInactive: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  offerCardActive: {
    backgroundColor: PRIMARY,
    borderWidth: 1,
    borderColor: PRIMARY,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
  },
  
  cardDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    fontWeight: '400',
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
  nextBtn: { 
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnText: { 
    color: WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
});
