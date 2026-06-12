import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { getToken } from '@/services/secureStore';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const isSmallDevice = height < 780;

const PRIMARY = "#10b981"; // Emerald
const SECONDARY = "#eab308"; // Gold
const BACKGROUND = "#0a0a0f";
const CARD_BG = "#111827";
const GLASS = "rgba(255,255,255,0.07)";

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ar">("en");

  const shine = useSharedValue(0);

  useEffect(() => {
    shine.value = withRepeat(withTiming(1.5, { duration: 2500 }), -1, true);

    const checkSession = async () => {
      const token = await getToken();
      if (token) {
        console.log("[Session Recovery] Found valid token, but auto-redirect is disabled for testing onboarding.");
        // router.replace('/(tabs)/dashboard');
      }
    };
    checkSession();
  }, []);

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else router.push("/signup");
  };

  const skip = () => router.push("/login");

  const LogoHeader = () => (
    <Animated.View entering={FadeInDown.duration(1000)} style={styles.header}>
      <LinearGradient
        colors={[PRIMARY + "25", SECONDARY + "15"]}
        style={styles.logoBadge}
      >
        <Ionicons name="flash" size={44} color="#fff" />
      </LinearGradient>
      <Text style={styles.brandName}>
        EDGE <Text style={{ color: PRIMARY }}>FINANCE</Text>
      </Text>
      <Text style={styles.tagline}>PREMIUM • SECURE • INSTANT</Text>
    </Animated.View>
  );

  const renderStep0 = () => (
    <Animated.View
      entering={FadeIn}
      exiting={SlideOutLeft}
      style={styles.stepContainer}
    >
      <LogoHeader />

      <View style={styles.contentSection}>
        <Text style={styles.mainTitle}>Choose Language</Text>

        <View style={styles.langList}>
          {(["en", "ar"] as const).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.langCard,
                selectedLanguage === lang && styles.langCardActive,
              ]}
              onPress={() => setSelectedLanguage(lang)}
            >
              <Text
                style={[
                  styles.langLabel,
                  selectedLanguage === lang && styles.langLabelActive,
                ]}
              >
                {lang === "en" ? "English" : "العربية"}
              </Text>
              <View
                style={[
                  styles.radio,
                  selectedLanguage === lang && { borderColor: SECONDARY },
                ]}
              >
                {selectedLanguage === lang && (
                  <View style={[styles.radioInner, { backgroundColor: SECONDARY }]} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={nextStep}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[SECONDARY, "#facc15", SECONDARY]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBtn}
        >
          <Text style={styles.primaryBtnText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={24} color="#0a0a0f" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderStep1 = () => (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={styles.stepContainer}
    >
      <LogoHeader />

      <View style={styles.illustrationWrap}>
        <Animated.View
          entering={ZoomIn.delay(300)}
          style={[styles.glowCircle, { backgroundColor: SECONDARY }]}
        />
        <View style={[styles.iconBox, { borderColor: SECONDARY + "40" }]}>
          <Ionicons name="shield-checkmark" size={isSmallDevice ? 80 : 120} color={SECONDARY} />
        </View>
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.stepHeader, { color: SECONDARY }]}>
          Military Grade Security
        </Text>
        <Text style={styles.stepSub}>
          End-to-end encryption • Biometric protection • Your assets are
          untouchable.
        </Text>
      </View>

      <View style={styles.pagination}>
        <View style={[styles.dot, styles.activeDotSecondary]} />
        <View style={styles.dot} />
      </View>

      <View style={styles.footerRow}>
        <TouchableOpacity onPress={skip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.primaryBtnSmall, { backgroundColor: SECONDARY }]} onPress={nextStep}>
          <Text style={styles.primaryBtnTextSmall}>Next</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={styles.stepContainer}
    >
      <LogoHeader />

      <View style={styles.illustrationWrap}>
        <Animated.View
          entering={ZoomIn.delay(300)}
          style={[styles.glowCircle, { backgroundColor: SECONDARY }]}
        />
        <View style={[styles.iconBox, { borderColor: SECONDARY + "40" }]}>
          <View style={[styles.playBtn, { backgroundColor: SECONDARY + "20" }]}>
            <Ionicons name="play" size={isSmallDevice ? 40 : 58} color={SECONDARY} />
          </View>
        </View>
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.stepHeader, { color: SECONDARY }]}>
          Master in 45 Seconds
        </Text>
        <Text style={styles.stepSub}>
          Watch this quick tutorial and unlock the full power of Edge Finance.
        </Text>
      </View>

      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDotSecondary]} />
      </View>

      <View style={styles.footerCol}>
        <TouchableOpacity style={styles.goldBtn} onPress={nextStep}>
          <LinearGradient
            colors={[SECONDARY, "#facc15"]}
            style={styles.gradientBtn}
          >
            <Text style={styles.goldBtnText}>Create My Account</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomLinkRow}>
          <Text style={styles.bottomLinkText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background Gradient Overlay */}
      <LinearGradient
        colors={[BACKGROUND, "#0f172a", BACKGROUND]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            {step === 0 && renderStep0()}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },

  mainContent: { flex: 1, paddingHorizontal: 24 },

  stepContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: isSmallDevice ? 15 : 30,
    alignItems: "center",
  },

  header: { alignItems: "center", marginTop: isSmallDevice ? 10 : 20 },
  logoBadge: {
    width: isSmallDevice ? 60 : 80,
    height: isSmallDevice ? 60 : 80,
    borderRadius: isSmallDevice ? 18 : 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: isSmallDevice ? 8 : 12,
  },
  brandName: {
    fontSize: isSmallDevice ? 26 : 32,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1.5,
  },
  tagline: {
    fontSize: isSmallDevice ? 11 : 13.5,
    fontWeight: "600",
    color: "#64748b",
    letterSpacing: 2,
    marginTop: 4,
  },

  contentSection: { width: "100%", marginVertical: isSmallDevice ? 15 : 25 },
  mainTitle: {
    fontSize: isSmallDevice ? 24 : 29,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: isSmallDevice ? 20 : 32,
  },

  langList: { gap: isSmallDevice ? 12 : 18 },
  langCard: {
    flexDirection: "row",
    height: isSmallDevice ? 70 : 86,
    backgroundColor: CARD_BG,
    borderRadius: isSmallDevice ? 20 : 26,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    borderWidth: 1.5,
    borderColor: GLASS,
  },
  langCardActive: {
    borderColor: SECONDARY,
    backgroundColor: SECONDARY + "08",
    shadowColor: SECONDARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  langLabel: {
    fontSize: isSmallDevice ? 17 : 19.5,
    fontWeight: "700",
    color: "#94a3b8",
  },
  langLabelActive: { color: "#fff" },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: "#475569",
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: { borderColor: PRIMARY },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY,
  },

  illustrationWrap: {
    height: isSmallDevice ? 210 : 280,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: isSmallDevice ? 10 : 20,
  },
  glowCircle: {
    position: "absolute",
    width: isSmallDevice ? 190 : 260,
    height: isSmallDevice ? 190 : 260,
    borderRadius: isSmallDevice ? 95 : 130,
    opacity: 0.15,
  },
  iconBox: {
    width: isSmallDevice ? 150 : 200,
    height: isSmallDevice ? 150 : 200,
    borderRadius: isSmallDevice ? 75 : 100,
    backgroundColor: CARD_BG,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  playBtn: {
    width: isSmallDevice ? 70 : 98,
    height: isSmallDevice ? 70 : 98,
    borderRadius: isSmallDevice ? 35 : 50,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: isSmallDevice ? 6 : 8,
  },

  textWrap: { alignItems: "center", paddingHorizontal: 12 },
  stepHeader: {
    fontSize: isSmallDevice ? 26 : 35,
    fontWeight: "900",
    marginBottom: isSmallDevice ? 10 : 16,
    textAlign: "center",
    letterSpacing: -1.2,
  },
  stepSub: {
    fontSize: isSmallDevice ? 14 : 16.8,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: isSmallDevice ? 22 : 26.5,
  },

  pagination: {
    flexDirection: "row",
    gap: 12,
    marginVertical: isSmallDevice ? 15 : 25,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  activeDotPrimary: { width: 32, backgroundColor: PRIMARY },
  activeDotSecondary: { width: 32, backgroundColor: SECONDARY },

  // Buttons
  primaryBtn: {
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: SECONDARY,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 20,
  },
  gradientBtn: {
    height: isSmallDevice ? 56 : 68,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  primaryBtnText: {
    fontSize: isSmallDevice ? 17 : 19.5,
    fontWeight: "900",
    color: "#0a0a0f",
    letterSpacing: 0.6,
  },

  primaryBtnSmall: {
    backgroundColor: PRIMARY,
    paddingVertical: isSmallDevice ? 14 : 18,
    paddingHorizontal: isSmallDevice ? 45 : 62,
    borderRadius: 30,
  },
  primaryBtnTextSmall: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "800",
    color: "#0a0a0f",
  },

  goldBtn: {
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: SECONDARY,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 20,
  },
  goldBtnText: {
    fontSize: isSmallDevice ? 17 : 19.5,
    fontWeight: "900",
    color: "#0a0a0f",
  },

  footerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#64748b",
  },

  footerCol: { width: "100%", alignItems: "center" },
  bottomLinkRow: { flexDirection: "row", marginTop: isSmallDevice ? 18 : 32 },
  bottomLinkText: { color: "#94a3b8", fontSize: 16 },
  signInLink: { color: PRIMARY, fontSize: 16, fontWeight: "800" },
});
