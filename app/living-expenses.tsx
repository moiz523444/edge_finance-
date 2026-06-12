import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useFormData } from "../context/FormDataContext";

const PRIMARY = "#10b981"; // Emerald
const SECONDARY = "#eab308"; // Gold/Orange Theme
const BACKGROUND = "#0a0a0f";
const GLASS = "rgba(255,255,255,0.07)";

export default function LivingExpensesScreen() {
  const router = useRouter();
  const { declaredData } = useFormData();

  // Inputs state
  const [foodExpenses, setFoodExpenses] = useState("0.00");
  const [educationExpenses, setEducationExpenses] = useState("0.00");
  const [healthcareExpenses, setHealthcareExpenses] = useState("0.00");
  const [transportExpenses, setTransportExpenses] = useState("0.00");
  const [insuranceExpenses, setInsuranceExpenses] = useState("0.00");
  const [rentExpenses, setRentExpenses] = useState("0.00");
  const [househelpExpenses, setHousehelpExpenses] = useState("0.00");
  const [expatFees, setExpatFees] = useState("0.00");
  const [otherObligations, setOtherObligations] = useState("0.00");
  const [remittances, setRemittances] = useState("0.00");

  useEffect(() => {
    if (declaredData) {
      if (declaredData.COREEXPENSES) {
        const ce = declaredData.COREEXPENSES;
        if (ce.FOOD !== undefined) setFoodExpenses(String(ce.FOOD));
        if (ce.EDUCATION !== undefined) setEducationExpenses(String(ce.EDUCATION));
        if (ce.HEALTH !== undefined) setHealthcareExpenses(String(ce.HEALTH));
        if (ce.TRANSPORT !== undefined) setTransportExpenses(String(ce.TRANSPORT));
      }
      
      if (declaredData.LIVINGEXPENSES) {
        const le = declaredData.LIVINGEXPENSES;
        if (le.MONTHLYRENT !== undefined) setRentExpenses(String(le.MONTHLYRENT));
        if (le.INSURANCE !== undefined) setInsuranceExpenses(String(le.INSURANCE));
        if (le.HOUSEHELP !== undefined) setHousehelpExpenses(String(le.HOUSEHELP));
        if (le.DEPENDENTFEE !== undefined) setExpatFees(String(le.DEPENDENTFEE));
      }

      if (declaredData.OBLIGATIONS) {
        const ob = declaredData.OBLIGATIONS;
        if (ob.TOTALOBLIGATIONS !== undefined) setOtherObligations(String(ob.TOTALOBLIGATIONS));
        if (ob.REMITTANCES !== undefined) setRemittances(String(ob.REMITTANCES));
      }
    }
  }, [declaredData]);

  const fields = [
    {
      label: "Food and living expenses (Monthly)",
      state: foodExpenses,
      setter: setFoodExpenses,
    },
    {
      label: "Education supplies expenses (including monthly private school fees)",
      state: educationExpenses,
      setter: setEducationExpenses,
    },
    {
      label: "Healthcare expenses (monthly)",
      state: healthcareExpenses,
      setter: setHealthcareExpenses,
    },
    {
      label: "Transport expenses (monthly)",
      state: transportExpenses,
      setter: setTransportExpenses,
    },
    {
      label: "Insurance (Monthly)",
      state: insuranceExpenses,
      setter: setInsuranceExpenses,
    },
    {
      label: "Monthly Rent (If renting)",
      state: rentExpenses,
      setter: setRentExpenses,
    },
    {
      label: "Househelp wage (monthly)",
      state: househelpExpenses,
      setter: setHousehelpExpenses,
    },
    {
      label: "Expat dependent gov. fees (monthly)",
      state: expatFees,
      setter: setExpatFees,
    },
    {
      label:
        "Any other credit obligations he/she has, such as loans from his/her employer, friends or relatives, whether current or expected.",
      state: otherObligations,
      setter: setOtherObligations,
    },
    {
      label: "Monthly remittances to home country for family maintenance",
      state: remittances,
      setter: setRemittances,
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
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

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeInDown.duration(600).delay(100)}>
              <Text style={styles.pageTitle}>Living Expenses</Text>
              <Text style={styles.pageSubtitle}>& Obligations</Text>

              {/* Progress Section */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressPercentage}>30% Completed</Text>
                  <Text style={styles.progressSteps}>Step 3 of 6</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <LinearGradient
                    colors={[SECONDARY, "#ca8a04"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: "30%" }]}
                  />
                </View>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(600).delay(200)}
              style={styles.formSection}
            >
              {fields.map((field, idx) => (
                <View key={idx} style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>{field.label}</Text>
                  <View style={styles.currencyInputContainer}>
                    <TextInput
                      style={styles.textInput}
                      value={field.state}
                      onChangeText={field.setter}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor="#64748b"
                    />
                    <Text style={styles.currencyLabel}>SAR</Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          </ScrollView>

          {/* Footer Action */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(300)}
            style={styles.footer}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/employment-data")}>
              <LinearGradient
                colors={[SECONDARY, "#ca8a04"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextBtn}
              >
                <Text style={styles.nextBtnText}>Next</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 10,
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
    marginTop: 4,
    marginBottom: 35,
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
    gap: 24,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  currencyInputContainer: {
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
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  currencyLabel: {
    color: SECONDARY,
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 10,
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
