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
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useFormData } from "../context/FormDataContext";
import CustomDropdown from "../components/CustomDropdown";

const PRIMARY = "#2E8B57"; // Edge Finance Green
const WHITE = "#ffffff";
const TEXT_MAIN = "#1f2937";
const TEXT_SECONDARY = "#64748b";
const BORDER_COLOR = "#cbd5e1";

export default function BasicInfoScreen() {
  const router = useRouter();
  const { declaredData } = useFormData();

  // States
  const [purpose, setPurpose] = useState("Private");
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
    { id: "home_owner", title: "Home owner", icon: "home-outline" },
    { id: "renting", title: "Renting", icon: "key-outline" },
    { id: "company_provided", title: "Company provided", icon: "business-outline" },
    { id: "parents", title: "Living with parents", icon: "people-outline" },
  ];

  const maritalOptions = [
    { id: "single", title: "Single", icon: "person-outline" },
    { id: "married", title: "Married", icon: "heart-outline" },
    { id: "others", title: "Others", icon: "ellipsis-horizontal-outline" },
  ];

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
            <Text style={styles.pageTitle}>Basic Info</Text>

            {/* Progress Section */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressPercentage}>20% Completed</Text>
                <Text style={styles.progressSteps}>2 out of 6 completed</Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={["#2E8B57", "#34d399"]}
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
              <CustomDropdown
                options={[
                  { label: "Private", value: "Private" },
                  { label: "Business", value: "Business" },
                  { label: "Other", value: "Other" },
                ]}
                selectedValue={purpose}
                onSelect={setPurpose}
                placeholder="Select purpose"
              />
            </View>

            {/* My residential situation */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>My residential situation</Text>
              <View style={styles.cardsRow}>
                {residentialOptions.map((opt) => (
                  <View key={opt.id} style={styles.cardItem}>
                    <TouchableOpacity
                      style={[
                        styles.selectionBox,
                        residentialSituation === opt.id && styles.selectionBoxActive
                      ]}
                      onPress={() => setResidentialSituation(opt.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={opt.icon as any}
                        size={28}
                        color={residentialSituation === opt.id ? WHITE : TEXT_MAIN}
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.cardText,
                        residentialSituation === opt.id && { color: PRIMARY, fontWeight: "600" }
                      ]}
                    >
                      {opt.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Residential Type */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Residential Type</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity style={styles.radioOption} onPress={() => setResidentialType("apartment")} activeOpacity={0.8}>
                  <View style={[styles.radioOuter, residentialType === "apartment" && styles.radioOuterActive]}>
                    {residentialType === "apartment" && <Animated.View entering={ZoomIn} style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>Apartment</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.radioOption} onPress={() => setResidentialType("villa")} activeOpacity={0.8}>
                  <View style={[styles.radioOuter, residentialType === "villa" && styles.radioOuterActive]}>
                    {residentialType === "villa" && <Animated.View entering={ZoomIn} style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>Villa</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Marital Status */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Marital Status</Text>
              <View style={styles.cardsRowCentered}>
                {maritalOptions.map((opt) => (
                  <View key={opt.id} style={styles.cardItem}>
                    <TouchableOpacity
                      style={[
                        styles.selectionBox,
                        maritalStatus === opt.id && styles.selectionBoxActive
                      ]}
                      onPress={() => setMaritalStatus(opt.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={opt.icon as any}
                        size={28}
                        color={maritalStatus === opt.id ? WHITE : TEXT_MAIN}
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.cardText,
                        maritalStatus === opt.id && { color: PRIMARY, fontWeight: "600" }
                      ]}
                    >
                      {opt.title}
                    </Text>
                  </View>
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
                  placeholderTextColor="#94a3b8"
                />
              </View>
            ))}

          </Animated.View>
        </ScrollView>

        {/* Footer Action */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.footer}>
          <TouchableOpacity style={styles.nextBtn} activeOpacity={0.8} onPress={() => router.push("/living-expenses")}>
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

  formSection: {
    gap: 24,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "600",
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

  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  cardsRowCentered: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 16,
  },
  cardItem: {
    alignItems: "center",
    width: 70,
  },
  selectionBox: {
    width: 60,
    height: 60,
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  selectionBoxActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardText: {
    color: TEXT_SECONDARY,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
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

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 34,
    backgroundColor: WHITE,
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
