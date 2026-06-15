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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useFormData } from "../context/FormDataContext";
import CustomDropdown from "../components/CustomDropdown";

const PRIMARY = "#2E8B57"; // Edge Finance Green
const WHITE = "#ffffff";
const TEXT_MAIN = "#1f2937";
const TEXT_SECONDARY = "#64748b";
const BORDER_COLOR = "#cbd5e1";

interface CustomSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

// Custom Slider Component Light Theme
const CustomSlider = ({ value, min = 0, max = 100000, onChange }: CustomSliderProps) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

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
        <View style={[styles.sliderTrackFill, { width: `${percentage}%` }]} />
        <View style={[styles.sliderThumb, { left: `${percentage}%` }]} />
      </View>
    </View>
  );
};

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

// Custom Switch Component Light Theme
const CustomSwitch = ({ value, onValueChange }: CustomSwitchProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.switchBg,
        value ? { backgroundColor: PRIMARY, borderColor: PRIMARY } : { backgroundColor: "#f1f5f9", borderColor: BORDER_COLOR }
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      <View style={[styles.switchCircle, value ? { alignSelf: "flex-end" } : { alignSelf: "flex-start", backgroundColor: TEXT_SECONDARY }]} />
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
            <Text style={styles.pageTitle}>Employment Data</Text>

            {/* Progress Section */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressPercentage}>50% Completed</Text>
                <Text style={styles.progressSteps}>5 out of 6 completed</Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={["#2E8B57", "#34d399"]}
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
              <View style={styles.cardsRowCentered}>
                {/* Salary */}
                <View style={styles.cardItem}>
                  <TouchableOpacity
                    style={[
                      styles.selectionBox,
                      employmentType === "salary" && styles.selectionBoxActive
                    ]}
                    onPress={() => setEmploymentType("salary")}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="mail-open-outline"
                      size={28}
                      color={employmentType === "salary" ? PRIMARY : TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.cardText,
                      employmentType === "salary" && { color: TEXT_MAIN, fontWeight: "600" }
                    ]}
                  >
                    Salary
                  </Text>
                </View>

                {/* Retire */}
                <View style={styles.cardItem}>
                  <TouchableOpacity
                    style={[
                      styles.selectionBox,
                      employmentType === "retire" && styles.selectionBoxActive
                    ]}
                    onPress={() => setEmploymentType("retire")}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={28}
                      color={employmentType === "retire" ? PRIMARY : TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.cardText,
                      employmentType === "retire" && { color: TEXT_MAIN, fontWeight: "600" }
                    ]}
                  >
                    Retire
                  </Text>
                </View>
              </View>
            </View>

            {/* Employment Sector */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Employment Sector</Text>
              <CustomDropdown
                options={[
                  { label: "Private", value: "Private" },
                  { label: "Military", value: "Military" },
                  { label: "Government", value: "Government" },
                ]}
                selectedValue={sector}
                onSelect={(val) => {
                  setSector(val);
                  if(val === "Military") setDesignation("Sergeant");
                  else setDesignation("Administrator");
                }}
                placeholder="Employment Sector"
              />
            </View>

            {/* Designation / Rank / Role */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{getDesignationLabel()}</Text>
              <CustomDropdown
                options={
                  sector === "Military" 
                  ? [{ label: "Sergeant", value: "Sergeant" }, { label: "Captain", value: "Captain" }] 
                  : [{ label: "Administrator", value: "Administrator" }, { label: "Manager", value: "Manager" }]
                }
                selectedValue={designation}
                onSelect={setDesignation}
                placeholder={`Select ${getDesignationLabel()}`}
              />
            </View>

            {/* Monthly Income Slider Card */}
            <View style={styles.sliderCard}>
              <View style={styles.sliderCardHeader}>
                <Text style={styles.sliderCardLabel}>Monthly Income</Text>
                <View style={styles.sliderInputBox}>
                  <TextInput
                    style={styles.sliderInputText}
                    value={String(income)}
                    onChangeText={(val) => setIncome(Number(val) || 0)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
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
                  <Text style={styles.sliderCardLabel}>Other Incomes</Text>
                  <CustomSwitch value={hasOtherIncome} onValueChange={setHasOtherIncome} />
                </View>
                {hasOtherIncome && (
                  <View style={styles.sliderInputBox}>
                    <TextInput
                      style={styles.sliderInputText}
                      value={String(otherIncome)}
                      onChangeText={(val) => setOtherIncome(Number(val) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
                )}
              </View>
              
              {hasOtherIncome && (
                <>
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
          <TouchableOpacity style={styles.nextBtn} activeOpacity={0.8} onPress={() => router.push("/financial-disclosure")}>
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
    gap: 12,
  },
  inputLabel: {
    color: TEXT_MAIN,
    fontSize: 13,
    fontWeight: "600",
  },

  cardsRowCentered: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 16,
  },
  cardItem: {
    alignItems: "center",
    width: 80,
  },
  selectionBox: {
    width: 64,
    height: 64,
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  selectionBoxActive: {
    borderColor: PRIMARY,
    backgroundColor: "#f0fdf4", // Light green tint
  },
  cardText: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },

  sliderCard: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 16,
    padding: 20,
    gap: 18,
  },
  sliderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderCardLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sliderCardLabel: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "600",
  },
  sliderInputBox: {
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 80,
    maxWidth: 120, // Prevents overflow
    alignItems: "center",
  },
  sliderInputText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    padding: 0,
    margin: 0,
    width: "100%", // Ensures text input doesn't force box to expand indefinitely
  },
  sliderContainer: {
    height: 30,
    justifyContent: "center",
  },
  sliderTrackBg: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    position: "relative",
  },
  sliderTrackFill: {
    height: "100%",
    backgroundColor: PRIMARY,
    borderRadius: 3,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    position: "absolute",
    top: -7,
    transform: [{ translateX: -10 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sliderBounds: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boundText: {
    color: TEXT_SECONDARY,
    fontSize: 12,
    fontWeight: "500",
  },

  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  rowItemLabel: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "600",
  },

  switchBg: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
    borderWidth: 1,
  },
  switchCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: WHITE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
