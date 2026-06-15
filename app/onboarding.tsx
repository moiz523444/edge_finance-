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
  Image,
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
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ar" | null>(null);

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
      <Image 
        source={require('../assets/images/logo.png')} 
        style={styles.logoImage} 
        resizeMode="contain" 
      />
    </Animated.View>
  );

  const renderStep0 = () => (
    <Animated.View
      entering={FadeIn}
      exiting={SlideOutLeft}
      style={[styles.stepContainer, { paddingHorizontal: 0, backgroundColor: '#ffffff', justifyContent: 'flex-start' }]}
    >
      <View style={styles.topSection}>
        <LogoHeader />

        <View style={[styles.contentSection, { marginTop: isSmallDevice ? 30 : 50 }]}>
          <Text style={styles.mainTitleLight}>Select Language</Text>

          <View style={styles.langListLight}>
            {(["en", "ar"] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langBtnLight,
                  selectedLanguage === lang ? styles.langBtnActiveLight : styles.langBtnInactiveLight,
                ]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <Text
                  style={[
                    styles.langTextLight,
                    selectedLanguage === lang ? styles.langTextActiveLight : styles.langTextInactiveLight,
                  ]}
                >
                  {lang === "en" ? "English" : "العربيه"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionSectionLight}>
          <TouchableOpacity
            style={selectedLanguage ? styles.filledBtnLight : styles.outlineBtnLight}
            onPress={() => {
              if (selectedLanguage) nextStep();
            }}
            activeOpacity={0.8}
          >
            <Text style={selectedLanguage ? styles.filledBtnTextLight : styles.outlineBtnTextLight}>
              Let's Get Started Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View pointerEvents="none" style={styles.footerPatternContainer}>
        <Image 
          source={require('../assets/images/footer.png')} 
          style={styles.footerPattern} 
          resizeMode="cover" 
        />
        <Image 
          source={require('../assets/images/fotter1.png')} 
          style={styles.footerGradient} 
          resizeMode="cover" 
        />
      </View>
    </Animated.View>
  );

  const renderStep1 = () => (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={[styles.stepContainer, { paddingHorizontal: 24, justifyContent: 'flex-start' }]}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <LogoHeader />
        <Image 
          source={require('../assets/images/ongoing.png')} 
          style={{ width: isSmallDevice ? 220 : 280, height: isSmallDevice ? 220 : 280, resizeMode: 'contain', marginBottom: isSmallDevice ? 20 : 30, marginTop: isSmallDevice ? 10 : 20 }} 
        />

        <Text style={[styles.mainTitleLight, { marginBottom: 16 }]}>Fast & Secure</Text>
        <Text style={[styles.stepSub, { color: '#6B7280', paddingHorizontal: 20 }]}>
          Don't worry about 3rd Party Hacks. It is fast and secure
        </Text>

        <View style={[styles.pagination, { gap: 8, marginVertical: isSmallDevice ? 30 : 40 }]}>
          <View style={[styles.dotLight, styles.activeDotLight]} />
          <View style={styles.dotLight} />
          <View style={styles.dotLight} />
          <View style={styles.dotLight} />
        </View>

        <TouchableOpacity style={styles.outlineBtnLight} onPress={nextStep}>
          <Text style={styles.outlineBtnTextLight}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={skip} style={{ marginTop: 24, padding: 10 }}>
          <Text style={{ color: '#2E8B57', fontSize: 16, fontWeight: '500' }}>Skip</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={[styles.stepContainer, { paddingHorizontal: 24, justifyContent: 'flex-start' }]}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <LogoHeader />
        <Image 
          source={require('../assets/images/video_player.png')} 
          style={{ width: isSmallDevice ? 250 : 320, height: isSmallDevice ? 180 : 240, resizeMode: 'contain', marginBottom: isSmallDevice ? 30 : 50, marginTop: isSmallDevice ? 10 : 20 }} 
        />

        <Text style={[styles.mainTitleLight, { color: '#111827', marginBottom: 16 }]}>Watch Tutorial</Text>
        <Text style={[styles.stepSub, { color: '#6B7280', paddingHorizontal: 20, marginBottom: isSmallDevice ? 40 : 60 }]}>
          If you are new on this and need help, watch this short tutorial clip to get started.
        </Text>

        <TouchableOpacity style={styles.filledBtnLight} onPress={nextStep}>
          <Text style={styles.filledBtnTextLight}>Let's Create an account</Text>
        </TouchableOpacity>

        <View style={[styles.bottomLinkRow, { marginTop: 30, alignItems: 'center' }]}>
          <Text style={styles.bottomLinkTextLight}>Already have an account? - </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.signInLinkLight}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#ffffff' }]}>
      <StatusBar style="dark" />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.mainContent, step === 0 && { paddingHorizontal: 0 }]}>
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

  // New Light Mode Styles for Step 0
  logoImage: {
    width: 200,
    height: 80,
    marginTop: 20,
  },
  topSection: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "center",
    zIndex: 10,
  },
  mainTitleLight: {
    fontSize: isSmallDevice ? 22 : 26,
    fontWeight: "600",
    color: "#2E8B57",
    textAlign: "center",
    marginBottom: isSmallDevice ? 20 : 32,
  },
  langListLight: {
    gap: isSmallDevice ? 12 : 16,
    width: "100%",
  },
  langBtnLight: {
    width: "100%",
    height: isSmallDevice ? 50 : 60,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  langBtnActiveLight: {
    backgroundColor: "#2E8B57",
  },
  langBtnInactiveLight: {
    backgroundColor: "#F3F4F6",
  },
  langTextLight: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "500",
  },
  langTextActiveLight: {
    color: "#ffffff",
  },
  langTextInactiveLight: {
    color: "#4B5563",
  },
  actionSectionLight: {
    width: "100%",
    marginTop: isSmallDevice ? 30 : 50,
    gap: 16,
  },
  outlineBtnLight: {
    width: "100%",
    height: isSmallDevice ? 50 : 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#2E8B57",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  outlineBtnTextLight: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#2E8B57",
  },
  filledBtnLight: {
    width: "100%",
    height: isSmallDevice ? 50 : 56,
    borderRadius: 12,
    backgroundColor: "#2E8B57",
    alignItems: "center",
    justifyContent: "center",
  },
  filledBtnTextLight: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  footerPatternContainer: {
    width: "100%",
    height: isSmallDevice ? 150 : 200,
    position: "absolute",
    bottom: 0,
  },
  footerPattern: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  footerGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  dotLight: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
  },
  activeDotLight: {
    backgroundColor: "#2E8B57",
  },
  bottomLinkTextLight: {
    color: '#6B7280',
    fontSize: 14,
  },
  signInLinkLight: {
    color: '#2E8B57',
    fontSize: 14,
    fontWeight: '600',
  },
});
