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
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useFormData } from "../context/FormDataContext";

const PRIMARY = "#10b981"; // Emerald
const SECONDARY = "#eab308"; // Gold/Orange Theme
const BACKGROUND = "#0a0a0f";
const CARD_BG = "#111827";
const GLASS = "rgba(255,255,255,0.07)";

export default function BasicInfoScreen() {
  const router = useRouter();
  const { declaredData } = useFormData();

  // States
  const [residentialSituation, setResidentialSituation] = useState("home_owner");
  const [residentialType, setResidentialType] = useState("apartment");
  const [maritalStatus, setMaritalStatus] = useState("single");
  const [domesticWorkers, setDomesticWorkers] = useState("0");
  const [children, setChildren] = useState("0");
  const [privateSchool, setPrivateSchool] = useState("0");
  const [publicSchool, setPublicSchool] = useState("0");

  useEffect(() => {
    if (declaredData?.FAMILYINFO) {
      const fi = declaredData.FAMILYINFO;
      if (fi.RESIDENTIALSTATUS_VBCODE) setResidentialSituation(fi.RESIDENTIALSTATUS_VBCODE.toLowerCase());
      if (fi.RESIDENCETYPE_VBCODE) setResidentialType(fi.RESIDENCETYPE_VBCODE.toLowerCase());
      if (fi.MARITALSTATUS_VBCODE) setMaritalStatus(fi.MARITALSTATUS_VBCODE.toLowerCase());
      if (fi.NOOFDOMESTICWORKER !== undefined) setDomesticWorkers(String(fi.NOOFDOMESTICWORKER));
      if (fi.NOOFDEPENDENTS !== undefined) setChildren(String(fi.NOOFDEPENDENTS));
      if (fi.NOOFDEPPRIVATESCHOOL !== undefined) setPrivateSchool(String(fi.NOOFDEPPRIVATESCHOOL));
      if (fi.NOOFDEPPUBLICSCHOOL !== undefined) setPublicSchool(String(fi.NOOFDEPPUBLICSCHOOL));
    }
  }, [declaredData]);

  const residentialOptions = [
    { id: "home_owner", title: "Home owner", icon: "home" },
    { id: "renting", title: "Renting", icon: "key" },
    { id: "company_provided", title: "Company provided", icon: "business" },
    { id: "parents", title: "Living with parents", icon: "people" },
  ];

  const maritalOptions = [
    { id: "single", title: "Single", icon: "person" },
    { id: "married", title: "Married", icon: "heart" },
    { id: "others", title: "Others", icon: "ellipsis-horizontal" },
  ];

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
            <Text style={styles.pageTitle}>Basic Info</Text>

            {/* Progress Section */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressPercentage}>20% Completed</Text>
                <Text style={styles.progressSteps}>Step 2 of 6</Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={[SECONDARY, "#ca8a04"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: "20%" }]}
                />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.formSection}>
            
            {/* Purpose of Finance */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Purpose of Finance? <Text style={{ color: "red" }}>*</Text></Text>
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownText}>Private</Text>
                <Ionicons name="chevron-down" size={20} color="#94a3b8" />
              </View>
            </View>

            {/* My residential situation */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>My residential situation</Text>
              <View style={styles.cardsRow}>
                {residentialOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.selectionCard,
                      residentialSituation === opt.id && styles.selectionCardActive
                    ]}
                    onPress={() => setResidentialSituation(opt.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.cardIconContainer, residentialSituation === opt.id && { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                      <Ionicons
                        name={opt.icon as any}
                        size={22}
                        color={residentialSituation === opt.id ? "#fff" : SECONDARY}
                      />
                    </View>
                    <Text
                      style={[
                        styles.cardText,
                        residentialSituation === opt.id && { color: "#fff", fontWeight: "700" }
                      ]}
                    >
                      {opt.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Residential Type */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Residential Type</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity style={styles.radioOption} onPress={() => setResidentialType("apartment")} activeOpacity={0.8}>
                  <View style={[styles.radioOuter, residentialType === "apartment" && { borderColor: SECONDARY }]}>
                    {residentialType === "apartment" && <Animated.View entering={ZoomIn} style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.radioLabel, residentialType === "apartment" && { color: "#fff" }]}>Apartment</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.radioOption} onPress={() => setResidentialType("villa")} activeOpacity={0.8}>
                  <View style={[styles.radioOuter, residentialType === "villa" && { borderColor: SECONDARY }]}>
                    {residentialType === "villa" && <Animated.View entering={ZoomIn} style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.radioLabel, residentialType === "villa" && { color: "#fff" }]}>Villa</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Marital Status */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Marital Status</Text>
              <View style={styles.cardsRowCentered}>
                {maritalOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.selectionCard,
                      { flex: 0, width: "30%" },
                      maritalStatus === opt.id && styles.selectionCardActive
                    ]}
                    onPress={() => setMaritalStatus(opt.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.cardIconContainer, maritalStatus === opt.id && { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                      <Ionicons
                        name={opt.icon as any}
                        size={22}
                        color={maritalStatus === opt.id ? "#fff" : SECONDARY}
                      />
                    </View>
                    <Text
                      style={[
                        styles.cardText,
                        maritalStatus === opt.id && { color: "#fff", fontWeight: "700" }
                      ]}
                    >
                      {opt.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Number Inputs */}
            {[
              { label: "Number of domestic worker", state: domesticWorkers, setter: setDomesticWorkers },
              { label: "Number of children/dependents", state: children, setter: setChildren },
              { label: "Number of dependents in private schools", state: privateSchool, setter: setPrivateSchool },
              { label: "Number of dependents in public schools", state: publicSchool, setter: setPublicSchool },
            ].map((inputData, index) => (
              <View key={index} style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>{inputData.label}</Text>
                <TextInput
                  style={styles.textInput}
                  value={inputData.state}
                  onChangeText={inputData.setter}
                  keyboardType="numeric"
                  placeholderTextColor="#64748b"
                />
              </View>
            ))}

          </Animated.View>
        </ScrollView>

        {/* Footer Action */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.footer}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/living-expenses")}>
            <LinearGradient
              colors={[SECONDARY, "#ca8a04"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextBtn}
            >
              <Text style={styles.nextBtnText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
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
    paddingBottom: 130, // Space for footer
  },
  pageTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 35,
    letterSpacing: -0.5,
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

  formSection: {
    gap: 28,
  },
  inputWrapper: {
    gap: 10,
  },
  inputLabel: {
    color: "#cbd5e1",
    fontSize: 14.5,
    fontWeight: "700",
  },
  dropdownContainer: {
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    borderWidth: 1,
    borderColor: GLASS,
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: "#fff",
    fontSize: 15,
  },
  textInput: {
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    borderWidth: 1,
    borderColor: GLASS,
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 56,
    color: "#fff",
    fontSize: 16,
  },

  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  cardsRowCentered: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  selectionCard: {
    width: "48%",
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    borderWidth: 1,
    borderColor: GLASS,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  selectionCardActive: {
    backgroundColor: SECONDARY,
    borderColor: SECONDARY,
    shadowColor: SECONDARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },

  radioGroup: {
    flexDirection: "row",
    gap: 30,
    marginTop: 4,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: SECONDARY,
  },
  radioLabel: {
    color: "#94a3b8",
    fontSize: 15,
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
  nextBtn: {
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
  nextBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },
});
