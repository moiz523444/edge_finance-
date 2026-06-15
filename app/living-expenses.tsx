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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useFormData } from "../context/FormDataContext";

const PRIMARY = "#2E8B57"; // Edge Finance Green
const WHITE = "#ffffff";
const TEXT_MAIN = "#1f2937";
const TEXT_SECONDARY = "#64748b";
const BORDER_COLOR = "#cbd5e1";

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
      label: "Education supplies expenses\n(including monthly private school fees)",
      state: educationExpenses,
      setter: setEducationExpenses,
    },
    {
      label: "Healthcare expenses (Monthly)",
      state: healthcareExpenses,
      setter: setHealthcareExpenses,
    },
    {
      label: "Transport expenses (Monthly)",
      state: transportExpenses,
      setter: setTransportExpenses,
    },
    {
      label: "Insurance (Monthly)",
      state: insuranceExpenses,
      setter: setInsuranceExpenses,
    },
    {
      label: "Monthly Rent (if renting)",
      state: rentExpenses,
      setter: setRentExpenses,
    },
    {
      label: "Househelp wage (Monthly)",
      state: househelpExpenses,
      setter: setHousehelpExpenses,
    },
    {
      label: "Expat dependent gov. fees (Monthly)",
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

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeInDown.duration(600).delay(100)}>
              <Text style={styles.pageTitle}>Living Expenses & Obligations</Text>

              {/* Progress Section */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressPercentage}>30% Completed</Text>
                  <Text style={styles.progressSteps}>3 out of 6 completed</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <LinearGradient
                    colors={["#2E8B57", "#34d399"]}
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
                  <View style={[styles.currencyInputContainer, parseFloat(field.state) > 0 && styles.currencyInputContainerActive]}>
                    <TextInput
                      style={styles.textInput}
                      value={field.state}
                      onChangeText={field.setter}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor="#94a3b8"
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
            <TouchableOpacity style={styles.nextBtn} activeOpacity={0.8} onPress={() => router.push("/employment-data")}>
              <Text style={styles.nextBtnText}>Next</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
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
    gap: 20,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    color: TEXT_MAIN,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  currencyInputContainer: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currencyInputContainerActive: {
    borderColor: PRIMARY, // Focus or active state based on Figma screenshot
  },
  textInput: {
    flex: 1,
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "400",
  },
  currencyLabel: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10,
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
