import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  Image,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { apiService } from "../services/api";

const { width } = Dimensions.get("window");
const PRIMARY = "#2E8B57"; // Green theme matching Figma
const BACKGROUND = "#f8fafc";
const WHITE = "#ffffff";
const TEXT_MAIN = "#1f2937";
const TEXT_SECONDARY = "#94a3b8";
const INACTIVE_CARD = "#f1f5f9";

export default function PersonalFinanceScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("microfinance");
  
  const [isLoading, setIsLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<any>(null);

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const parseList = (data: any, isRequirement: boolean = false): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) {
      return data.map((item: any) => 
        isRequirement ? (item.REQDESCRIPTION || item.description || "") : (item.BENEFITDESCRIPTION || item.description || "")
      ).filter(Boolean);
    }
    if (typeof data === "string") {
      return data.split("\n").map(s => s.replace(/•\t/g, "").replace(/• /g, "").trim()).filter(s => s.length > 0);
    }
    return [];
  };

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      const idNumber = "1023321548";
      const productCode = "TWQ";
      const response = await apiService.loan.getProductDetails(idNumber, productCode);
      
      if (response.SUCCEEDED && response.DATA) {
        let dataObj: any = response.DATA;
        if (Array.isArray(dataObj)) {
          dataObj = dataObj[0];
        }
        
        const details = dataObj?.PRODUCT_DETAILS?.[0];
        if (details) {
          setProductDetails({
            title: details.PRODUCTTITLE || "Microfinance",
            desc: details.PRODUCTDETAILS || "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            amount: "25,000",
            benefits: parseList(details.BENEFITS, false),
            requirements: parseList(details.REQUIREMENTS, true),
          });
        }
      } else {
        if (response.RESPONSEPOPUP) {
          Alert.alert(response.MESSAGETITLE || "Notice", response.MESSAGETEXT || response.RESPONSEDESCRIPTION);
        } else {
          Alert.alert("Error", response.RESPONSEDESCRIPTION || "Failed to load product details.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch product details", err);
      Alert.alert("Error", "An unexpected error occurred while fetching product details.");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultBenefits = ["Get Instant Approval Best Rates*", "Repayment Period up to 36 months"];
  const defaultRequirements = ["* Minimum age 18 years", "* Salaried", "Government Or Private Organization Employee", "* Minimum Salary 4,000"];

  const displayBenefits = productDetails?.benefits?.length ? productDetails.benefits : defaultBenefits;
  const displayRequirements = productDetails?.requirements?.length ? productDetails.requirements : defaultRequirements;

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

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text style={{ color: TEXT_SECONDARY, marginTop: 16 }}>Loading Product Offers...</Text>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.titleContainer}>
                <Text style={styles.applyForText}>Apply For</Text>
                <Text style={styles.titleText}>Personal Finance</Text>
                <Text style={styles.subtitleText}>
                  Start your personal finance application and check your eligible offer
                </Text>
              </Animated.View>

              {/* Type Selector */}
              <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.typeRow}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => setSelectedType("microfinance")}
                  activeOpacity={0.8}
                >
                  <View style={[styles.typeCard, selectedType === "microfinance" ? styles.typeCardActive : styles.typeCardInactive]}>
                    {selectedType === "microfinance" && <View style={styles.diagonalShadow} />}
                    <View style={[styles.typeIconCircle, selectedType === "microfinance" ? styles.iconCircleActive : styles.iconCircleInactive]}>
                      <Ionicons
                        name="library-outline"
                        size={32}
                        color={selectedType === "microfinance" ? PRIMARY : PRIMARY}
                      />
                    </View>
                    <Text style={[styles.typeLabel, selectedType === "microfinance" ? { color: WHITE } : { color: PRIMARY }]}>
                      Microfinance
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => setSelectedType("topup")}
                  activeOpacity={0.8}
                >
                  <View style={[styles.typeCard, selectedType === "topup" ? styles.typeCardActive : styles.typeCardInactive]}>
                    {selectedType === "topup" && <View style={styles.diagonalShadow} />}
                    <View style={[styles.typeIconCircle, selectedType === "topup" ? styles.iconCircleActive : styles.iconCircleInactive]}>
                      <Ionicons
                        name="wallet-outline"
                        size={32}
                        color={selectedType === "topup" ? PRIMARY : PRIMARY}
                      />
                    </View>
                    <Text style={[styles.typeLabel, selectedType === "topup" ? { color: WHITE } : { color: PRIMARY }]}>
                      Topup
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>

              {/* Conditional Content */}
              {selectedType === "microfinance" ? (
                <>
                  <Animated.View entering={FadeInDown.duration(600).delay(300)}>
                    <View style={styles.offerCard}>
                      <Text style={styles.offerTitle}>{productDetails?.title || "Microfinance"}</Text>
                      <View style={styles.offerAmountRow}>
                        <Text style={styles.offerUpTo}>Up to</Text>
                        <Text style={styles.offerAmountVal}> SAR {productDetails?.amount || "25,000"}</Text>
                      </View>
                      <Text style={styles.offerDesc}>
                        {productDetails?.desc || "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                      </Text>
                    </View>
                  </Animated.View>

                  {/* Benefits */}
                  <Animated.View entering={FadeInRight.duration(600).delay(400)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Benefits</Text>
                    <View style={styles.textContent}>
                      {displayBenefits.map((item: string, index: number) => (
                        <Text key={index} style={styles.listText}>{item}</Text>
                      ))}
                    </View>
                  </Animated.View>

                  {/* Requirements */}
                  <Animated.View entering={FadeInRight.duration(600).delay(500)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Requirements</Text>
                    <View style={styles.textContent}>
                      {displayRequirements.map((item: string, index: number) => (
                        <Text key={index} style={styles.listText}>{item}</Text>
                      ))}
                    </View>
                  </Animated.View>
                </>
              ) : (
                <Animated.View entering={FadeInDown.duration(400)} style={styles.offerCard}>
                  <Text style={styles.offerTitle}>Topup</Text>
                  <Text style={styles.offerDesc}>
                    The Topup application flow is separate and will be available soon.
                  </Text>
                </Animated.View>
              )}
            </ScrollView>

            {selectedType === "microfinance" && (
              <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.footer}>
                <TouchableOpacity 
                  style={styles.applyBtn}
                  onPress={() => router.push("/pep")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.applyBtnText}>Apply Now</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
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
    paddingBottom: 130,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 35,
    marginTop: 5,
  },
  applyForText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  titleText: {
    color: TEXT_MAIN,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitleText: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 30,
  },

  typeRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 30,
  },
  typeCard: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    height: 160,
    overflow: 'hidden',
  },
  typeCardInactive: {
    backgroundColor: INACTIVE_CARD,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  typeCardActive: {
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  diagonalShadow: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: '#1f663e',
    opacity: 0.5,
    transform: [{ rotate: '-45deg' }],
    bottom: -100,
    right: -50,
  },
  typeIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    zIndex: 2,
  },
  iconCircleInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  iconCircleActive: {
    backgroundColor: WHITE,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "700",
    zIndex: 2,
  },

  offerCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  offerTitle: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  offerAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  offerUpTo: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: "500",
  },
  offerAmountVal: {
    color: TEXT_MAIN,
    fontSize: 20,
    fontWeight: "800",
  },
  offerDesc: {
    color: "#a1a1aa",
    fontSize: 12,
    lineHeight: 18,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: TEXT_MAIN,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  textContent: {
    gap: 6,
  },
  listText: {
    color: "#52525b",
    fontSize: 13,
    lineHeight: 20,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: BACKGROUND,
  },
  applyBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "700",
  },
});
