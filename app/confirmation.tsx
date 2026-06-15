import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useFormData } from "../context/FormDataContext";

const PRIMARY = '#2E8B57'; // Edge Finance Green
const WHITE = '#ffffff';
const TEXT_MAIN = '#1f2937';
const TEXT_SECONDARY = '#64748b';
const BORDER_COLOR = '#e2e8f0';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { declaredData } = useFormData();

  const [confirmDisclosure, setConfirmDisclosure] = useState(false);
  const [agreeSimah, setAgreeSimah] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock data fallbacks
  const basicInfo = declaredData?.BASICINFO || {};
  const livingExp = declaredData?.LIVINGEXPENSES || {};
  const oblig = declaredData?.OBLIGATIONS || {};

  const handleConfirm = () => {
    if (confirmDisclosure && agreeSimah) {
      setShowSuccessModal(true);
    } else {
      alert("Please confirm all disclosures to proceed.");
    }
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    router.replace('/eligible-offers');
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
          {/* Top Icon and Title */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.iconSection}>
            <View style={styles.checkCircleBg}>
              <Ionicons name="checkmark" size={50} color={WHITE} />
            </View>
            <Text style={styles.mainTitle}>Confirmation</Text>
          </Animated.View>

          {/* Family Information Section */}
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Family Information</Text>
              <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/basic-info')}>
                <Ionicons name="pencil-outline" size={14} color={TEXT_SECONDARY} />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Residential situation</Text>
              <Text style={styles.rowValueDark}>{basicInfo.RESIDENTIALSITUATION_VBCODE || "Rental"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Residential type</Text>
              <Text style={styles.rowValueDark}>{basicInfo.RESIDENTIALTYPE_VBCODE || "Apartment"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Marital status</Text>
              <Text style={styles.rowValueDark}>{basicInfo.MARITALSTATUS_VBCODE || "Married"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Family's breadwinner</Text>
              <Text style={styles.rowValueDark}>{basicInfo.ISBREADWINNER ? "Yes" : "Yes"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>No of children/dependents</Text>
              <Text style={styles.rowValueGreen}>{basicInfo.NOOFDEPENDANTS || "0"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>No of domestic workers</Text>
              <Text style={styles.rowValueGreen}>{basicInfo.NOOFDOMESTICWORKERS || "0"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>No of dependents in private schools</Text>
              <Text style={styles.rowValueGreen}>{basicInfo.NOOFDEPENDANTSINPRIVATESCHOOL || "0"}</Text>
            </View>
          </Animated.View>

          {/* Living Expenses Section */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Living Expenses</Text>
              <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/living-expenses')}>
                <Ionicons name="pencil-outline" size={14} color={TEXT_SECONDARY} />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Insurance</Text>
              <Text style={styles.rowValueGreen}>{livingExp.INSURANCE !== undefined ? livingExp.INSURANCE.toFixed(2) : "0.00"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Monthly Rent</Text>
              <Text style={styles.rowValueGreen}>{livingExp.MONTHLYRENT !== undefined ? livingExp.MONTHLYRENT.toFixed(2) : "1000.00"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Househelp wage</Text>
              <Text style={styles.rowValueGreen}>{livingExp.HOUSEHELP !== undefined ? livingExp.HOUSEHELP.toFixed(2) : "0.00"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Expat dependent gov fee</Text>
              <Text style={styles.rowValueGreen}>{livingExp.DEPENDENTFEE !== undefined ? livingExp.DEPENDENTFEE.toFixed(2) : "0.00"}</Text>
            </View>
          </Animated.View>

          {/* Other Obligations Section */}
          <Animated.View entering={FadeInDown.duration(600).delay(300)} style={[styles.sectionCard, { borderBottomWidth: 0 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Other Obligations</Text>
              <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/living-expenses')}>
                <Ionicons name="pencil-outline" size={14} color={TEXT_SECONDARY} />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Other monthly obligations</Text>
              <Text style={styles.rowValueGreen}>{oblig.TOTALOBLIGATIONS !== undefined ? oblig.TOTALOBLIGATIONS.toFixed(2) : "0.00"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Monthly remittance to home country for family maintenance</Text>
              <Text style={styles.rowValueGreen}>{oblig.REMITTANCES !== undefined ? oblig.REMITTANCES.toFixed(2) : "2000.00"}</Text>
            </View>

            {/* Checkboxes */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={styles.checkboxRow} 
                onPress={() => setConfirmDisclosure(!confirmDisclosure)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkboxBox, confirmDisclosure && styles.checkboxBoxActive]}>
                  {confirmDisclosure && <Ionicons name="checkmark" size={16} color={PRIMARY} />}
                </View>
                <Text style={styles.checkboxLabel}>
                  I Confirm <Text style={styles.linkText} onPress={() => router.push('/financial-disclosure')}>Accurate Financial Disclosure</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxRow} 
                onPress={() => setAgreeSimah(!agreeSimah)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkboxBox, agreeSimah && styles.checkboxBoxActive]}>
                  {agreeSimah && <Ionicons name="checkmark" size={16} color={PRIMARY} />}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree <Text style={styles.linkText} onPress={() => router.push('/simah-consent')}>SIMAH Consent</Text>
                </Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </ScrollView>

        {/* Footer Confirm Button */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.footer}>
          <TouchableOpacity 
            style={[styles.confirmBtn, (!confirmDisclosure || !agreeSimah) && { opacity: 0.5 }]} 
            activeOpacity={0.8}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmBtnText}>Confirm</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalBackdrop}>
            <Animated.View entering={ZoomIn.duration(400)} style={styles.modalCard}>
              <View style={styles.modalIconBg}>
                <Ionicons name="checkmark" size={50} color={WHITE} />
              </View>
              <Text style={styles.modalTitle}>Success</Text>
              <Text style={styles.modalText}>
                Your application has been initiated and your application ID is: 10264
              </Text>
              <TouchableOpacity style={styles.modalOkBtn} onPress={handleModalOk}>
                <Text style={styles.modalOkBtnText}>OK</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

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
  
  iconSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  checkCircleBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: PRIMARY,
  },

  sectionCard: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    paddingBottom: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontWeight: "500",
    textDecorationLine: "underline",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 13,
    color: TEXT_SECONDARY,
    paddingRight: 20,
  },
  rowValueDark: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_MAIN,
    textAlign: "right",
  },
  rowValueGreen: {
    fontSize: 13,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "right",
  },

  checkboxContainer: {
    marginTop: 10,
    gap: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
  },
  checkboxBoxActive: {
    // Keep white bg, just show checkmark according to Figma (it shows green check inside white box)
  },
  checkboxLabel: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  linkText: {
    color: PRIMARY,
    textDecorationLine: "underline",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 34,
    backgroundColor: WHITE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  confirmBtn: { 
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: { 
    color: WHITE,
    fontSize: 16,
    fontWeight: "600",
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(46, 139, 87, 0.4)", // Translucent green tint
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: PRIMARY,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  modalOkBtn: {
    width: "100%",
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOkBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "700",
  },
});
