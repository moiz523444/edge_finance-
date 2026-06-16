import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import CallConfirmationModal from '../components/CallConfirmationModal';

const PRIMARY = '#2E8B57'; // Edge Finance Green
const WHITE = '#ffffff';
const TEXT_MAIN = '#1e2937';
const TEXT_SECONDARY = '#64748b';
const BORDER = '#e2e8f0';

export default function IbanScreen() {
  const router = useRouter();
  const [iban, setIban] = useState('');
  const [confirmIban, setConfirmIban] = useState('');
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleVerify = () => {
    // Show the modal after IBAN verification instead of navigating
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          
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
            
            {/* Title Section */}
            <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.titleSection}>
              <Text style={styles.pageTitle}>IBAN Confirmation</Text>
              <Text style={styles.pageSubtitle}>
                Enter your IBAN. Confirm and get the{"\n"}financing amount.
              </Text>
            </Animated.View>

            {/* Bank Icon */}
            <Animated.View entering={ZoomIn.duration(600).delay(200)} style={styles.iconContainer}>
              <Image 
                source={require('../assets/images/iban.png')} 
                style={styles.bankIcon} 
              />
            </Animated.View>

            {/* Form Section */}
            <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.formSection}>
              
              {/* IBAN Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>IBAN</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Enter your IBAN"
                    placeholderTextColor="#94a3b8"
                    style={styles.input}
                    value={iban}
                    onChangeText={setIban}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              {/* Confirm IBAN Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm IBAN</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Enter your Confirm IBAN"
                    placeholderTextColor="#94a3b8"
                    style={styles.input}
                    value={confirmIban}
                    onChangeText={setConfirmIban}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              {/* ReCAPTCHA Mock */}
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.captchaContainer}
                onPress={() => setIsCaptchaChecked(!isCaptchaChecked)}
              >
                <View style={styles.captchaLeft}>
                  <View style={[styles.checkbox, isCaptchaChecked && styles.checkboxChecked]}>
                    {isCaptchaChecked && <Ionicons name="checkmark" size={16} color={PRIMARY} />}
                  </View>
                  <Text style={styles.captchaText}>I'm not a robot</Text>
                </View>
                <View style={styles.captchaRight}>
                  <Ionicons name="sync-circle" size={32} color="#4285F4" />
                  <Text style={styles.captchaLogoText}>reCAPTCHA</Text>
                  <Text style={styles.captchaSubText}>Privacy - Terms</Text>
                </View>
              </TouchableOpacity>

              {/* Verify Button */}
              <TouchableOpacity 
                style={styles.verifyBtn} 
                activeOpacity={0.8}
                onPress={handleVerify}
              >
                <Text style={styles.verifyBtnText}>Verify</Text>
              </TouchableOpacity>

            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Call Confirmation Modal */}
      <CallConfirmationModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onCallNow={() => {
          setIsModalVisible(false);
          // Proceed to loan-approved after calling
          router.push('/loan-approved');
        }}
      />
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
    paddingTop: 20,
  },
  
  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_MAIN,
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  bankIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },

  formSection: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    backgroundColor: WHITE,
  },
  input: {
    flex: 1,
    color: TEXT_MAIN,
    fontSize: 15,
  },

  captchaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
    alignSelf: 'center',
    width: '90%',
  },
  captchaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#c1c1c1',
    borderRadius: 2,
    backgroundColor: WHITE,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: PRIMARY,
  },
  captchaText: {
    fontSize: 14,
    color: '#3f3f46',
    fontWeight: '500',
  },
  captchaRight: {
    alignItems: 'center',
  },
  captchaLogoText: {
    fontSize: 10,
    color: '#52525b',
    fontWeight: '600',
    marginTop: -4,
  },
  captchaSubText: {
    fontSize: 8,
    color: '#71717a',
    marginTop: 2,
  },

  verifyBtn: { 
    width: '100%',
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyBtnText: { 
    color: WHITE,
    fontSize: 16,
    fontWeight: "700",
  },
});
