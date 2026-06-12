import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInRight, ZoomIn } from "react-native-reanimated";
import { useFormData } from "../context/FormDataContext";

const PRIMARY = "#10b981"; // Emerald
const SECONDARY = "#eab308"; // Gold/Orange Theme
const BACKGROUND = "#0a0a0f";
const CARD_BG = "#111827";
const GLASS = "rgba(255,255,255,0.07)";

export default function PEPScreen() {
  const router = useRouter();
  const { declaredData, isLoadingData, fetchDeclaredInfo } = useFormData();
  const [isPEP, setIsPEP] = useState<boolean | null>(false);

  useEffect(() => {
    // We assume ID is available or fetched from another auth context.
    // Hardcoded for demonstration based on the API docs provided.
    fetchDeclaredInfo("1023321548");
  }, []);

  useEffect(() => {
    if (declaredData?.AFFILIATION) {
      // API might return "true"/"false" strings or boolean
      const pepValue = declaredData.AFFILIATION.PEP;
      if (pepValue === true || pepValue === "true" || pepValue === "TRUE") {
        setIsPEP(true);
      } else if (pepValue === false || pepValue === "false" || pepValue === "FALSE") {
        setIsPEP(false);
      }
    }
  }, [declaredData]);

  const handleContinue = () => {
    if (isPEP === true) {
      router.push("/pep-details");
    } else {
      router.push("/basic-info");
    }
  };

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
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/dashboard")}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerLogo}>
            <Ionicons name="flash" size={20} color={PRIMARY} />
            <Text style={styles.headerBrand}>
              EDGE <Text style={{ color: PRIMARY }}>FINANCE</Text>
            </Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {isLoadingData ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={SECONDARY} />
            <Text style={{ color: "#94a3b8", marginTop: 16 }}>Loading your details...</Text>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Animated.View entering={FadeInDown.duration(600).delay(100)}>
            <Text style={styles.pageTitle}>Compliance Check</Text>
            <Text style={styles.pageSubtitle}>Politically Exposed Person (PEP)</Text>

            {/* Progress Section */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressPercentage}>10% Completed</Text>
                <Text style={styles.progressSteps}>Step 1 of 6</Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={[SECONDARY, "#ca8a04"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: "10%" }]}
                />
              </View>
            </View>
          </Animated.View>

          {/* Question */}
          <Animated.View entering={FadeInRight.duration(600).delay(200)} style={styles.questionCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle-outline" size={28} color={SECONDARY} />
            </View>
            <Text style={styles.questionText}>
              Have you, any of your immediate family members, or any person with whom
              you have a financial or close personal relationship ever worked in a
              prominent public or political position inside or outside the Kingdom,
              whether currently or in the past?
            </Text>
          </Animated.View>

          {/* Radio Buttons */}
          <Animated.View entering={FadeInRight.duration(600).delay(300)} style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioOptionCard,
                isPEP === false && styles.radioOptionCardActive
              ]}
              onPress={() => setIsPEP(false)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.radioOuter,
                  isPEP === false && { borderColor: SECONDARY },
                ]}
              >
                {isPEP === false && <Animated.View entering={ZoomIn} style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioLabel, isPEP === false && { color: "#fff" }]}>{"No, I don't"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioOptionCard,
                isPEP === true && styles.radioOptionCardActive
              ]}
              onPress={() => setIsPEP(true)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.radioOuter,
                  isPEP === true && { borderColor: SECONDARY },
                ]}
              >
                {isPEP === true && <Animated.View entering={ZoomIn} style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioLabel, isPEP === true && { color: "#fff" }]}>Yes, I do</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* Footer Action */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.footer}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleContinue}>
            <LinearGradient
              colors={[SECONDARY, "#ca8a04"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueBtn}
            >
              <Text style={styles.continueBtnText}>Continue securely</Text>
              <Ionicons name="lock-closed" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
    paddingBottom: 130, // Space for footer
  },
  pageTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    color: SECONDARY,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 6,
    marginBottom: 40,
  },

  progressContainer: {
    backgroundColor: "rgba(17, 24, 39, 0.4)",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GLASS,
    marginBottom: 40,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  progressPercentage: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  progressSteps: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },

  questionCard: {
    backgroundColor: CARD_BG,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GLASS,
    marginBottom: 25,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  questionText: {
    color: "#e2e8f0",
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "500",
  },

  radioGroup: {
    gap: 16,
    marginBottom: 30,
  },
  radioOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: GLASS,
  },
  radioOptionCardActive: {
    borderColor: SECONDARY,
    backgroundColor: "rgba(234, 179, 8, 0.05)",
  },
  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: SECONDARY,
  },
  radioLabel: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "600",
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
  continueBtn: {
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
  continueBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },
});
