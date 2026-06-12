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
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { apiService } from "../services/api";

const { width } = Dimensions.get("window");
const PRIMARY = "#10b981"; // Emerald
const SECONDARY = "#eab308"; // Gold/Orange Theme
const BACKGROUND = "#0a0a0f";
const CARD_BG = "#111827";
const GLASS = "rgba(255,255,255,0.07)";

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
      // Hardcoded ID number matching the JSON mock/doc requirement
      const idNumber = "1023321548";
      const productCode = "TWQ";
      const response = await apiService.loan.getProductDetails(idNumber, productCode);
      
      if (response.SUCCEEDED && response.DATA) {
        let dataObj: any = response.DATA;
        // The API might return an array wrapper as per docs
        if (Array.isArray(dataObj)) {
          dataObj = dataObj[0];
        }
        
        const details = dataObj?.PRODUCT_DETAILS?.[0];
        if (details) {
          setProductDetails({
            title: details.PRODUCTTITLE || "Microfinance",
            desc: details.PRODUCTDETAILS || "Get Finance upto 50,000 SAR with instant approval",
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

  const defaultBenefits = ["Get Instant Approval", "Best Rates Available", "Repayment Period up to 36 months"];
  const defaultRequirements = ["Minimum age 18 years", "Salaried Government Or Private Organization Employee", "Minimum Salary 4,000 SAR"];

  const displayBenefits = productDetails?.benefits?.length ? productDetails.benefits : defaultBenefits;
  const displayRequirements = productDetails?.requirements?.length ? productDetails.requirements : defaultRequirements;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Global Background Gradient */}
      <LinearGradient
        colors={[BACKGROUND, "#0f172a", BACKGROUND]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerLogo}>
            <Ionicons name="flash" size={20} color={PRIMARY} />
            <Text style={styles.headerBrand}>
              EDGE <Text style={{ color: PRIMARY }}>FINANCE</Text>
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={SECONDARY} />
            <Text style={{ color: "#94a3b8", marginTop: 16 }}>Loading Product Offers...</Text>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.titleContainer}>
                <Text style={styles.applyForText}>Apply For</Text>
                <Text style={styles.titleText}>Personal Finance</Text>
                <Text style={styles.subtitleText}>
                  Start your personal finance application and check your eligible
                  offer instantly
                </Text>
              </Animated.View>

              {/* Type Selector */}
              <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.typeRow}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => setSelectedType("microfinance")}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={selectedType === "microfinance" ? [SECONDARY, "#ca8a04"] : [CARD_BG, CARD_BG]}
                    style={[
                      styles.typeCard,
                      selectedType === "microfinance" ? styles.typeCardActive : styles.typeCardInactive,
                    ]}
                  >
                    <View style={[styles.typeIconCircle, selectedType === "microfinance" && { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                      <Ionicons
                        name="business-outline"
                        size={32}
                        color={selectedType === "microfinance" ? "#fff" : SECONDARY}
                      />
                    </View>
                    <Text style={[styles.typeLabel, selectedType === "microfinance" ? { color: "#fff" } : { color: "#94a3b8" }]}>
                      Microfinance
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => setSelectedType("topup")}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={selectedType === "topup" ? [SECONDARY, "#ca8a04"] : [CARD_BG, CARD_BG]}
                    style={[
                      styles.typeCard,
                      selectedType === "topup" ? styles.typeCardActive : styles.typeCardInactive,
                    ]}
                  >
                    <View style={[styles.typeIconCircle, selectedType === "topup" && { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                      <Ionicons
                        name="wallet-outline"
                        size={32}
                        color={selectedType === "topup" ? "#fff" : SECONDARY}
                      />
                    </View>
                    <Text style={[styles.typeLabel, selectedType === "topup" ? { color: "#fff" } : { color: "#94a3b8" }]}>
                      Topup
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Conditional Content based on Selection */}
              {selectedType === "microfinance" ? (
                <>
                  {/* Offer Details */}
                  <Animated.View entering={FadeInDown.duration(600).delay(300)}>
                    <LinearGradient
                      colors={["rgba(30, 41, 59, 0.8)", "rgba(15, 23, 42, 0.8)"]}
                      style={styles.detailsCard}
                    >
                      <View style={styles.detailsCardGlow} />
                      <Text style={styles.detailsTitle}>{productDetails?.title || "Microfinance"}</Text>
                      <Text style={styles.detailsDesc}>
                        {productDetails?.desc || "Get Finance with instant approval. Tailored to meet your immediate needs."}
                      </Text>
                    </LinearGradient>
                  </Animated.View>

                  {/* Benefits */}
                  <Animated.View entering={FadeInRight.duration(600).delay(400)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Benefits</Text>
                    <View style={styles.bulletList}>
                      {displayBenefits.map((item: string, index: number) => (
                        <View key={index} style={styles.bulletItem}>
                          <Ionicons name="checkmark-circle" size={20} color={SECONDARY} style={styles.bulletIcon} />
                          <Text style={styles.bulletText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </Animated.View>

                  {/* Requirements */}
                  <Animated.View entering={FadeInRight.duration(600).delay(500)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Requirements</Text>
                    <View style={styles.bulletList}>
                      {displayRequirements.map((item: string, index: number) => (
                        <View key={index} style={styles.bulletItem}>
                          <Ionicons name="shield-checkmark" size={20} color={PRIMARY} style={styles.bulletIcon} />
                          <Text style={styles.bulletText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </Animated.View>
                </>
              ) : (
                <Animated.View entering={FadeInDown.duration(400)} style={styles.comingSoonCard}>
                  <Ionicons name="construct-outline" size={48} color={SECONDARY} style={{ marginBottom: 16 }} />
                  <Text style={styles.comingSoonTitle}>Topup Screen</Text>
                  <Text style={styles.comingSoonDesc}>
                    The Topup application flow is separate and will be available soon.
                  </Text>
                </Animated.View>
              )}
            </ScrollView>

            {/* Footer Action - Only show for Microfinance for now */}
            {selectedType === "microfinance" && (
              <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.footer}>
                <TouchableOpacity 
                  onPress={() => router.push("/pep")}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[SECONDARY, "#ca8a04"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.applyBtn}
                  >
                    <Text style={styles.applyBtnText}>Apply Now</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                  </LinearGradient>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: GLASS,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerLogo: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerBrand: {
    fontSize: 17,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 130, // Space for absolute footer
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 10,
  },
  applyForText: {
    color: SECONDARY,
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  titleText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  subtitleText: {
    color: "#94a3b8",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  typeRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 35,
  },
  typeCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  typeCardInactive: {
    borderColor: GLASS,
  },
  typeCardActive: {
    borderColor: SECONDARY,
    shadowColor: SECONDARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  typeIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: "800",
  },

  detailsCard: {
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: GLASS,
    marginBottom: 35,
    position: "relative",
    overflow: "hidden",
  },
  detailsCardGlow: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    backgroundColor: SECONDARY,
    borderRadius: 75,
    opacity: 0.1,
  },
  detailsTitle: {
    color: SECONDARY,
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  amountLabel: {
    color: "#94a3b8",
    fontSize: 16,
  },
  amountValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  detailsDesc: {
    color: "#cbd5e1",
    fontSize: 14.5,
    lineHeight: 24,
  },

  section: {
    marginBottom: 35,
    backgroundColor: "rgba(17, 24, 39, 0.4)",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: GLASS,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 20,
  },
  
  comingSoonCard: {
    backgroundColor: CARD_BG,
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: GLASS,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  comingSoonTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
  },
  comingSoonDesc: {
    color: "#94a3b8",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
  },

  bulletList: {
    gap: 16,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  bulletIcon: {
    marginRight: 14,
  },
  bulletText: {
    color: "#e2e8f0",
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
    fontWeight: "500",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 34,
    backgroundColor: BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: GLASS,
  },
  applyBtn: {
    flexDirection: "row",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: SECONDARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  applyBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },
});
