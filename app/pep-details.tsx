import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInRight, ZoomIn } from "react-native-reanimated";
import { useFormData } from "../context/FormDataContext";
import CustomDropdown from "../components/CustomDropdown";

const PRIMARY = "#2E8B57"; // Edge Finance Green
const WHITE = "#ffffff";
const TEXT_MAIN = "#1f2937";
const TEXT_SECONDARY = "#64748b";
const BORDER_COLOR = "#cbd5e1";

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
          <Animated.View entering={FadeInDown.duration(600).delay(100)}>
            <Text style={styles.pageTitle}>PEP</Text>

            {/* Progress Section */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressPercentage}>10% Completed</Text>
                <Text style={styles.progressSteps}>1 out of 6 completed</Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={["#2E8B57", "#34d399"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: "10%" }]}
                />
              </View>
            </View>
          </Animated.View>

          {/* Question matching PEP screen */}
          <Animated.View entering={FadeInRight.duration(600).delay(200)} style={styles.questionSection}>
            <Text style={styles.questionText}>
              Have you, any of your immediate family members, or any person with whom
              you have a financial or close personal relationship ever worked in a
              prominent public or political position inside or outside the Kingdom,
              whether currently or in the past?
            </Text>
          </Animated.View>

          {/* Radio Buttons (Fixed Selection as they are already here) */}
          <Animated.View entering={FadeInRight.duration(600).delay(300)} style={styles.radioGroup}>
            <View style={styles.radioOption}>
              <View style={styles.radioOuter}>
                {/* empty inner */}
              </View>
              <Text style={styles.radioLabel}>No I don't</Text>
            </View>

            <View style={styles.radioOption}>
              <View style={[styles.radioOuter, styles.radioOuterActive]}>
                <View style={styles.radioInner} />
              </View>
              <Text style={styles.radioLabel}>Yes I do</Text>
            </View>
          </Animated.View>

          {/* Hint Text */}
          <Animated.View entering={FadeInRight.duration(600).delay(400)}>
            <Text style={styles.hintText}>
              If "Yes", please open the following to be filed by the customer provide the following details:
            </Text>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View entering={FadeInDown.duration(600).delay(500)} style={styles.formContainer}>
            <View style={styles.formGroup}>
              {/* Full name / Related members */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Full name / Related members"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* Position */}
              <CustomDropdown
                options={[
                  { label: "Minister", value: "Minister" },
                  { label: "Ambassador", value: "Ambassador" },
                  { label: "Military Rank", value: "Military Rank" },
                  { label: "Other", value: "Other" },
                ]}
                selectedValue={position}
                onSelect={setPosition}
                placeholder="Position"
              />

              {/* Government entity or country */}
              <CustomDropdown
                options={[
                  { label: "Saudi Arabia", value: "Saudi Arabia" },
                  { label: "Ministry of Defense", value: "Ministry of Defense" },
                  { label: "Ministry of Interior", value: "Ministry of Interior" },
                ]}
                selectedValue={entity}
                onSelect={setEntity}
                placeholder="Government entity or country"
              />

              {/* Nature of relationship */}
              <CustomDropdown
                options={[
                  { label: "Direct", value: "Direct" },
                  { label: "Relative", value: "Relative" },
                  { label: "Business Partner", value: "Business Partner" },
                ]}
                selectedValue={relationship}
                onSelect={setRelationship}
                placeholder="Nature of relationship"
              />

              {/* Time period */}
              <CustomDropdown
                options={[
                  { label: "Less than 1 year", value: "Less than 1 year" },
                  { label: "1 - 5 years", value: "1 - 5 years" },
                  { label: "More than 5 years", value: "More than 5 years" },
                ]}
                selectedValue={timePeriod}
                onSelect={setTimePeriod}
                placeholder="Time period if applicable"
              />
            </View>
          </Animated.View>
        </ScrollView>

        {/* Footer Action */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.footer}>
          <TouchableOpacity style={styles.continueBtn} activeOpacity={0.8} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>Continue</Text>
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
  pageTitle: {
    color: TEXT_MAIN,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 30,
  },

  progressContainer: {
    marginBottom: 30,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  progressPercentage: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "600",
  },
  progressSteps: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "500",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  questionSection: {
    marginBottom: 20,
  },
  questionText: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "400",
  },

  radioGroup: {
    flexDirection: "row",
    gap: 30,
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: WHITE,
  },
  radioOuterActive: {
    borderColor: PRIMARY,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY,
  },
  radioLabel: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: "500",
  },

  hintText: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 30,
  },

  formContainer: {
    gap: 16,
  },
  formGroup: {
    gap: 16,
  },
  inputWrapper: {
    gap: 8,
  },
  textInput: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "400",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 34,
    backgroundColor: WHITE,
  },
  continueBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
});
