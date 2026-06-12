import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
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

interface CustomSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

// Custom Slider Component
const CustomSlider = ({ value, min = 0, max = 100000, onChange }: CustomSliderProps) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const percentage = ((value - min) / (max - min)) * 100;

  const handleTouch = (evt: any) => {
    if (sliderWidth === 0) return;
    const x = evt.nativeEvent.locationX;
    const pct = Math.max(0, Math.min(1, x / sliderWidth));
    const calculatedVal = Math.round(pct * (max - min) + min);
    onChange(calculatedVal);
  };

  return (
    <View 
      style={styles.sliderContainer}
      onLayout={(evt) => setSliderWidth(evt.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleTouch}
      onResponderMove={handleTouch}
    >
      <View style={styles.sliderTrackBg}>
        <LinearGradient
          colors={[SECONDARY, "#ca8a04"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.sliderTrackFill, { width: `${percentage}%` }]}
        />
        <View style={[styles.sliderThumb, { left: `${percentage}%` }]} />
      </View>
    </View>
  );
};

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

// Custom Switch Component
const CustomSwitch = ({ value, onValueChange }: CustomSwitchProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.switchBg,
        value ? { backgroundColor: SECONDARY } : { backgroundColor: "rgba(255,255,255,0.05)" }
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      <View style={[styles.switchCircle, value ? { alignSelf: "flex-end" } : { alignSelf: "flex-start" }]} />
    </TouchableOpacity>
  );
};

export default function EmploymentDataScreen() {
  const router = useRouter();
  const { declaredData } = useFormData();

  // States
  const [employmentType, setEmploymentType] = useState("salary");
  const [sector, setSector] = useState("Private");
  const [designation, setDesignation] = useState("Administrator");
  const [income, setIncome] = useState(40000);
  const [hasOtherIncome, setHasOtherIncome] = useState(true);
  const [otherIncome, setOtherIncome] = useState(40000);
  const [hasMonthlyObligation, setHasMonthlyObligation] = useState(false);
  const [hasMortgageSupport, setHasMortgageSupport] = useState(false);

  useEffect(() => {
    if (declaredData) {
      if (declaredData.EMPLOYMENT) {
        const emp = declaredData.EMPLOYMENT;
        if (emp.EMPLOYMENTTYPE_VBCODE) setEmploymentType(emp.EMPLOYMENTTYPE_VBCODE.toLowerCase());
        if (emp.DESIGNATION_VBCODE) setDesignation(emp.DESIGNATION_VBCODE);
        if (emp.MILITARYRANK_VBCODE) {
          setSector("Military");
          setDesignation(emp.MILITARYRANK_VBCODE);
        }
        if (emp.MONTHLYINCOME !== undefined) setIncome(emp.MONTHLYINCOME);
        if (emp.OTHERINCOME !== undefined) {
          setHasOtherIncome(emp.OTHERINCOME > 0);
          setOtherIncome(emp.OTHERINCOME);
        }
      }

      if (declaredData.OBLIGATIONS) {
        const ob = declaredData.OBLIGATIONS;
        if (ob.TOTALOBLIGATIONS !== undefined && ob.TOTALOBLIGATIONS > 0) {
          setHasMonthlyObligation(true);
        }
        if (ob.MORTGAGELOANEXISTS !== undefined) {
          const mExists = ob.MORTGAGELOANEXISTS;
          setHasMortgageSupport(mExists === true || mExists === "true" || mExists === "TRUE");
        }
      }
    }
  }, [declaredData]);

  const toggleSector = () => {
    if (sector === "Private") {
      setSector("Military");
      setDesignation("Sergeant");
    } else {
      setSector("Private");
      setDesignation("Administrator");
    }
  };

  const getDesignationLabel = () => {
    if (sector === "Military") {
      return "Rank";
    }
    if (employmentType === "retire") {
      return "Role";
    }
    return "Designation";
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
            <Text style={styles.pageTitle}>Employment Data</Text>

            {/* Progress Section */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressPercentage}>50% Completed</Text>
                <Text style={styles.progressSteps}>5 out of 6 completed</Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={[SECONDARY, "#ca8a04"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: "83%" }]}
                />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.formSection}>
            
            {/* Employment Type */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Employment Type</Text>
              <View style={styles.cardsRow}>
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    employmentType === "salary" && styles.selectionCardActive
                  ]}
                  onPress={() => setEmploymentType("salary")}
                  activeOpacity={0.8}
                >
                  <View style={[styles.cardIconContainer, employmentType === "salary" && { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                    <Ionicons
                      name="mail-open-outline"
                      size={22}
                      color={employmentType === "salary" ? "#fff" : SECONDARY}
                    />
                  </View>
                  <Text style={[styles.cardText, employmentType === "salary" && { color: "#fff", fontWeight: "700" }]}>
                    Salary
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    employmentType === "retire" && styles.selectionCardActive
                  ]}
                  onPress={() => setEmploymentType("retire")}
                  activeOpacity={0.8}
                >
                  <View style={[styles.cardIconContainer, employmentType === "retire" && { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={22}
                      color={employmentType === "retire" ? "#fff" : SECONDARY}
                    />
                  </View>
                  <Text style={[styles.cardText, employmentType === "retire" && { color: "#fff", fontWeight: "700" }]}>
                    Retire
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Employment Sector */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Employment Sector</Text>
              <TouchableOpacity style={styles.dropdownContainer} onPress={toggleSector} activeOpacity={0.8}>
                <Text style={styles.dropdownText}>{sector}</Text>
                <Ionicons name="chevron-down" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Designation / Rank / Role */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{getDesignationLabel()}</Text>
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownText}>{designation}</Text>
                <Ionicons name="chevron-down" size={20} color="#94a3b8" />
              </View>
            </View>

            {/* Monthly Income Slider Card */}
            <View style={styles.sliderCard}>
              <View style={styles.sliderCardHeader}>
                <View style={styles.sliderCardLabelRow}>
                  <Ionicons name="cash-outline" size={20} color={SECONDARY} />
                  <Text style={styles.sliderCardLabel}>Monthly Income</Text>
                </View>
                <View style={styles.valueDisplayBox}>
                  <Text style={styles.valueDisplayText}>{income}</Text>
                </View>
              </View>
              <Text style={styles.selectedValText}>SAR {income.toLocaleString()}</Text>
              
              <CustomSlider value={income} onChange={setIncome} />
              
              <View style={styles.sliderBounds}>
                <Text style={styles.boundText}>SAR 0</Text>
                <Text style={styles.boundText}>SAR 100,000</Text>
              </View>
            </View>

            {/* Other Incomes Slider Card */}
            <View style={styles.sliderCard}>
              <View style={styles.sliderCardHeader}>
                <View style={styles.sliderCardLabelRow}>
                  <Ionicons name="wallet-outline" size={20} color={SECONDARY} />
                  <Text style={styles.sliderCardLabel}>Other Incomes</Text>
                  <CustomSwitch value={hasOtherIncome} onValueChange={setHasOtherIncome} />
                </View>
                <View style={styles.valueDisplayBox}>
                  <Text style={styles.valueDisplayText}>{otherIncome}</Text>
                </View>
              </View>
              {hasOtherIncome && (
                <>
                  <Text style={styles.selectedValText}>SAR {otherIncome.toLocaleString()}</Text>
                  
                  <CustomSlider value={otherIncome} onChange={setOtherIncome} />
                  
                  <View style={styles.sliderBounds}>
                    <Text style={styles.boundText}>SAR 0</Text>
                    <Text style={styles.boundText}>SAR 100,000</Text>
                  </View>
                </>
              )}
            </View>

            {/* Monthly Obligation Toggle */}
            <View style={styles.rowItem}>
              <Text style={styles.rowItemLabel}>Monthly Obligation</Text>
              <CustomSwitch value={hasMonthlyObligation} onValueChange={setHasMonthlyObligation} />
            </View>

            {/* Mortgage Support Toggle */}
            <View style={styles.rowItem}>
              <Text style={styles.rowItemLabel}>Mortgage Support</Text>
              <CustomSwitch value={hasMortgageSupport} onValueChange={setHasMortgageSupport} />
            </View>

          </Animated.View>
        </ScrollView>

        {/* Footer Action */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.footer}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/financial-disclosure")}>
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

  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },

  sliderCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: GLASS,
    borderRadius: 24,
    padding: 24,
    gap: 14,
  },
  sliderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderCardLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sliderCardLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginRight: 8,
  },
  valueDisplayBox: {
    backgroundColor: "rgba(234, 179, 8, 0.05)",
    borderWidth: 1.5,
    borderColor: "rgba(234, 179, 8, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  valueDisplayText: {
    color: SECONDARY,
    fontSize: 16,
    fontWeight: "800",
  },
  selectedValText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  sliderContainer: {
    height: 30,
    justifyContent: "center",
    marginVertical: 4,
  },
  sliderTrackBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 3,
    position: "relative",
  },
  sliderTrackFill: {
    height: "100%",
    borderRadius: 3,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: SECONDARY,
    position: "absolute",
    top: -7,
    transform: [{ translateX: -10 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  sliderBounds: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boundText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
  },

  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(17, 24, 39, 0.4)",
    borderWidth: 1,
    borderColor: GLASS,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  rowItemLabel: {
    color: "#cbd5e1",
    fontSize: 15,
    fontWeight: "700",
  },

  switchBg: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: GLASS,
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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
