import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInRight, ZoomIn } from "react-native-reanimated";
import { useFormData } from "../context/FormDataContext";
import CustomDropdown from "../components/CustomDropdown";

const PRIMARY = "#10b981"; // Emerald
const SECONDARY = "#eab308"; // Gold/Orange Theme
const BACKGROUND = "#0a0a0f";
const CARD_BG = "#111827";
const GLASS = "rgba(255,255,255,0.07)";

export default function PEPDetailsScreen() {
  const router = useRouter();
  const { declaredData } = useFormData();

  // Form States
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [entity, setEntity] = useState("");
  const [relationship, setRelationship] = useState("");
  const [timePeriod, setTimePeriod] = useState("");

  useEffect(() => {
    if (declaredData?.AFFILIATION) {
      const aff = declaredData.AFFILIATION;
      if (aff.PEPFULLNAME) setFullName(aff.PEPFULLNAME);
      if (aff.VB_PEPPOSITION) setPosition(String(aff.VB_PEPPOSITION));
      if (aff.VB_PEPENTITY) setEntity(String(aff.VB_PEPENTITY));
      if (aff.VB_PEPRELATIONSHIP) setRelationship(String(aff.VB_PEPRELATIONSHIP));
      if (aff.RELATIONPERIODINYEARS) setTimePeriod(String(aff.RELATIONPERIODINYEARS));
    }
  }, [declaredData]);

  const handleContinue = () => {
    // API logic will go here
    router.push("/basic-info");
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
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
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

          {/* Question Summary (Selected Yes) */}
          <Animated.View entering={FadeInRight.duration(600).delay(200)} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={22} color={SECONDARY} />
              </View>
              <Text style={styles.questionLabel}>PEP Declaration: YES</Text>
            </View>
            <Text style={styles.questionText}>
              You have declared having a relationship or working in a prominent public/political position.
            </Text>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.formContainer}>
            <Text style={styles.formHeader}>
              Please provide the following details to be filed by the customer:
            </Text>

            <View style={styles.formGroup}>
              {/* Full name / Related members */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Full name / Related members</Text>
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter full name"
                  placeholderTextColor="#64748b"
                />
              </View>

              {/* Position */}
              <CustomDropdown
                label="Position"
                options={[
                  { label: "Minister", value: "Minister" },
                  { label: "Ambassador", value: "Ambassador" },
                  { label: "Military Rank", value: "Military Rank" },
                  { label: "Other", value: "Other" },
                ]}
                selectedValue={position}
                onSelect={setPosition}
                placeholder="Select position"
              />

              {/* Government entity or country */}
              <CustomDropdown
                label="Government entity or country"
                options={[
                  { label: "Saudi Arabia", value: "Saudi Arabia" },
                  { label: "Ministry of Defense", value: "Ministry of Defense" },
                  { label: "Ministry of Interior", value: "Ministry of Interior" },
                ]}
                selectedValue={entity}
                onSelect={setEntity}
                placeholder="Select entity/country"
              />

              {/* Nature of relationship */}
              <CustomDropdown
                label="Nature of relationship"
                options={[
                  { label: "Direct", value: "Direct" },
                  { label: "Relative", value: "Relative" },
                  { label: "Business Partner", value: "Business Partner" },
                ]}
                selectedValue={relationship}
                onSelect={setRelationship}
                placeholder="Select relationship"
              />

              {/* Time period */}
              <CustomDropdown
                label="Time period (if applicable)"
                options={[
                  { label: "Less than 1 year", value: "Less than 1 year" },
                  { label: "1 - 5 years", value: "1 - 5 years" },
                  { label: "More than 5 years", value: "More than 5 years" },
                ]}
                selectedValue={timePeriod}
                onSelect={setTimePeriod}
                placeholder="Select time period"
              />
            </View>
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
              <Text style={styles.continueBtnText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
    paddingBottom: 130,
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
    marginBottom: 35,
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
    backgroundColor: "rgba(234, 179, 8, 0.05)",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.2)",
    marginBottom: 25,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  questionLabel: {
    color: SECONDARY,
    fontSize: 15,
    fontWeight: "800",
  },
  questionText: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 22,
  },

  formContainer: {
    gap: 16,
  },
  formHeader: {
    color: "#94a3b8",
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  formGroup: {
    gap: 18,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "700",
  },
  textInput: {
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    borderWidth: 1.5,
    borderColor: GLASS,
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 56,
    color: "#fff",
    fontSize: 15,
  },
  dropdownContainer: {
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    borderWidth: 1.5,
    borderColor: GLASS,
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: "#64748b",
    fontSize: 15,
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
