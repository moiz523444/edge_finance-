import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { apiService } from '@/services/api';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
  ZoomIn
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const PRIMARY = '#10b981'; // Emerald
const SECONDARY = '#eab308'; // Amber
const BACKGROUND = '#0a0f1c';
const CARD_BG = '#111827';
const WHITE = '#FFFFFF';
const TEXT_SECONDARY = '#94a3b8';
const BORDER = 'rgba(255, 255, 255, 0.08)';
const ERROR = '#ef4444';

export default function SignupScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningTitle, setWarningTitle] = useState('Warning');
  const [warningDesc, setWarningDesc] = useState('');
  const [warningButtonText, setWarningButtonText] = useState('Try Again');
  const [warningIcon, setWarningIcon] = useState('warning-outline');
  const [warningIconColor, setWarningIconColor] = useState(SECONDARY);
  const [onWarningAction, setOnWarningAction] = useState<() => void>(() => () => setShowWarning(false));

  // Errors and Touched States
  const [idError, setIdError] = useState('');
  const [idTouched, setIdTouched] = useState(false);

  const [phoneError, setPhoneError] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Helper to validate ID Number (Saudi ID standards: 10 digits starting with 1 or 2)
  const validateId = (id: string) => {
    if (!id) return 'ID Number is required';
    if (!/^\d+$/.test(id)) return 'ID must contain numbers only';
    if (id.length !== 10) return 'ID must be exactly 10 digits';
    if (!id.startsWith('1') && !id.startsWith('2')) {
      return 'Saudi ID must start with 1 (Citizen) or 2 (Resident)';
    }
    return '';
  };

  // Helper to validate Phone Number
  const validatePhone = (phone: string) => {
    if (!phone) return 'Phone number is required';
    if (!/^\d+$/.test(phone)) return 'Phone must contain numbers only';
    return '';
  };

  // Helper to validate Password strength (At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)
  const validatePassword = (pass: string) => {
    if (!pass) return 'Password is required';
    if (pass.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pass)) return 'Must contain at least 1 uppercase letter';
    if (!/[a-z]/.test(pass)) return 'Must contain at least 1 lowercase letter';
    if (!/[0-9]/.test(pass)) return 'Must contain at least 1 digit';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return 'Must contain at least 1 special character';
    return '';
  };

  // Helper to validate Confirm Password
  const validateConfirmPassword = (confirm: string, pass: string) => {
    if (!confirm) return 'Please confirm your password';
    if (confirm !== pass) return 'Passwords do not match';
    return '';
  };

  const handleIdChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');
    setIdNumber(numeric);
    if (idTouched) {
      setIdError(validateId(numeric));
    }
  };

  const handlePhoneChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numeric);
    if (phoneTouched) {
      setPhoneError(validatePhone(numeric));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordTouched) {
      setPasswordError(validatePassword(text));
    }
    if (confirmPasswordTouched) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, text));
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordTouched) {
      setConfirmPasswordError(validateConfirmPassword(text, password));
    }
  };

  const handleIdBlur = () => {
    setIdTouched(true);
    setIdError(validateId(idNumber));
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    setPhoneError(validatePhone(phoneNumber));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(validatePassword(password));
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true);
    setConfirmPasswordError(validateConfirmPassword(confirmPassword, password));
  };

  const handleSignup = async () => {
    // Trigger validation for all fields
    const idValErr = validateId(idNumber);
    const phoneValErr = validatePhone(phoneNumber);
    const passValErr = validatePassword(password);
    const confirmValErr = validateConfirmPassword(confirmPassword, password);

    setIdTouched(true);
    setPhoneTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    setIdError(idValErr);
    setPhoneError(phoneValErr);
    setPasswordError(passValErr);
    setConfirmPasswordError(confirmValErr);

    if (idValErr || phoneValErr || passValErr || confirmValErr) {
      setWarningTitle('Validation Error');
      setWarningDesc('Please correct the highlighted errors in the form before proceeding.');
      setWarningButtonText('Ok');
      setWarningIcon('warning-outline');
      setWarningIconColor(ERROR);
      setOnWarningAction(() => () => setShowWarning(false));
      setShowWarning(true);
      return;
    }

    if (!agreedTerms || !agreedPrivacy) {
      setWarningTitle('Agreement Required');
      setWarningDesc('Please agree to the Terms & Conditions and Privacy Policy to proceed.');
      setWarningButtonText('Ok');
      setWarningIcon('warning-outline');
      setWarningIconColor(SECONDARY);
      setOnWarningAction(() => () => setShowWarning(false));
      setShowWarning(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.auth.register(idNumber, phoneNumber, password);

      setIsLoading(false);

      if (response.SUCCEEDED && response.RESPONSESTATUS !== false) {
        // Success! Navigation to Nafath verification
        const tpuRecId = response.TPURECID ? response.TPURECID.toString() : '';
        const transactionId = response.TRANSACTIONID ? response.TRANSACTIONID.toString() : '';
        router.replace({
          pathname: '/nafath',
          params: {
            tpuRecId,
            transactionId,
            idNumber: idNumber
          }
        });
      } else {
        setWarningTitle('Registration Failed');
        setWarningDesc(response.MESSAGETEXT || response.RESPONSEDESCRIPTION || 'An error occurred during registration.');
        setWarningButtonText('Try Again');
        setWarningIcon('alert-circle-outline');
        setWarningIconColor(ERROR);
        setOnWarningAction(() => () => setShowWarning(false));
        setShowWarning(true);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('[Signup API Error]', error);
      setWarningTitle('Network Error');
      setWarningDesc(error.message || 'Unable to connect to the server. Please check your network.');
      setWarningButtonText('Try Again');
      setWarningIcon('wifi-outline');
      setWarningIconColor(ERROR);
      setOnWarningAction(() => () => setShowWarning(false));
      setShowWarning(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: BACKGROUND }]}>
      <StatusBar style="light" />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              entering={ZoomIn.duration(1000)}
              style={styles.logoSection}
            >
              <View style={[styles.logoBadge, { backgroundColor: PRIMARY + '15' }]}>
                <Ionicons name="flash" size={48} color={PRIMARY} />
              </View>
              <Text style={styles.brandName}>EDGE <Text style={{ color: PRIMARY }}>FINANCE</Text></Text>
              <Text style={styles.brandTagline}>Premium Financing Solutions</Text>
            </Animated.View>

            <Animated.View
              layout={Layout.springify()}
              entering={FadeInDown.duration(800).delay(300)}
              style={styles.formSection}
            >
              <Text style={styles.welcomeText}>Create an Account</Text>
              <Text style={styles.subText}>Join our premium financial network</Text>

              {/* ID Number Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>ID NUMBER</Text>
                <View style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: CARD_BG, 
                    borderColor: idTouched && idError ? ERROR : (idTouched && !idError ? PRIMARY : BORDER) 
                  }
                ]}>
                  <Ionicons name="card-outline" size={20} color={idTouched && idError ? ERROR : PRIMARY} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter 10-digit ID"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={10}
                    value={idNumber}
                    onChangeText={handleIdChange}
                    onBlur={handleIdBlur}
                  />
                  {idTouched && !idError && <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />}
                </View>
                {idTouched && idError ? <Text style={styles.errorText}>{idError}</Text> : null}
              </View>

              {/* Phone Number Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                <View style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: CARD_BG, 
                    borderColor: phoneTouched && phoneError ? ERROR : (phoneTouched && !phoneError ? PRIMARY : BORDER) 
                  }
                ]}>
                  <View style={styles.phonePrefix}>
                    <Text style={{ color: WHITE, fontWeight: '700' }}>+966</Text>
                    <View style={styles.verticalDivider} />
                  </View>
                  <TextInput
                    placeholder="Enter phone number"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.input}
                    keyboardType="phone-pad"
                    maxLength={15}
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                  />
                  {phoneTouched && !phoneError && <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />}
                </View>
                {phoneTouched && phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: CARD_BG, 
                    borderColor: passwordTouched && passwordError ? ERROR : (passwordTouched && !passwordError ? PRIMARY : BORDER) 
                  }
                ]}>
                  <Ionicons name="lock-closed-outline" size={20} color={passwordTouched && passwordError ? ERROR : PRIMARY} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter Password"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                </View>
                {passwordTouched && passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              {/* Re-enter Password Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>RE-ENTER PASSWORD</Text>
                <View style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: CARD_BG, 
                    borderColor: confirmPasswordTouched && confirmPasswordError ? ERROR : (confirmPasswordTouched && !confirmPasswordError ? PRIMARY : BORDER) 
                  }
                ]}>
                  <Ionicons name="lock-closed-outline" size={20} color={confirmPasswordTouched && confirmPasswordError ? ERROR : PRIMARY} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    onBlur={handleConfirmPasswordBlur}
                  />
                  {confirmPasswordTouched && !confirmPasswordError && <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />}
                </View>
                {confirmPasswordTouched && confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
              </View>

              {/* Checkboxes */}
              <View style={styles.checkboxSection}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setAgreedTerms(!agreedTerms)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, { borderColor: SECONDARY, backgroundColor: agreedTerms ? SECONDARY : 'transparent' }]}>
                    {agreedTerms && <Ionicons name="checkmark" size={14} color={BACKGROUND} />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to the{" "}
                    <Text 
                      style={{ color: SECONDARY, fontWeight: '800' }} 
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push('/terms');
                      }}
                    >
                      Terms & Conditions
                    </Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setAgreedPrivacy(!agreedPrivacy)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, { borderColor: SECONDARY, backgroundColor: agreedPrivacy ? SECONDARY : 'transparent' }]}>
                    {agreedPrivacy && <Ionicons name="checkmark" size={14} color={BACKGROUND} />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to the{" "}
                    <Text 
                      style={{ color: SECONDARY, fontWeight: '800' }} 
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push('/privacy');
                      }}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                style={[styles.loginBtn, { backgroundColor: SECONDARY }]}
                onPress={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={BACKGROUND} />
                ) : (
                  <>
                    <Text style={[styles.loginBtnText, { color: BACKGROUND }]}>CREATE AN ACCOUNT</Text>
                    <Ionicons name="arrow-forward" size={20} color={BACKGROUND} />
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={[styles.signUpText, { color: PRIMARY }]}>Sign In</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Warning Modal (Figma Style) */}
      <Modal
        visible={showWarning}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn.duration(400)} style={styles.warningCard}>
            <View style={[styles.warningIconCircle, { backgroundColor: warningIconColor + '20' }]}>
              <Ionicons name={warningIcon as any} size={60} color={warningIconColor} />
            </View>
            <Text style={styles.warningTitle}>{warningTitle}</Text>
            <Text style={styles.warningDesc}>
              {warningDesc}
            </Text>
            
            <TouchableOpacity 
              style={[styles.tryAgainBtn, { backgroundColor: warningIconColor }]}
              onPress={onWarningAction}
            >
              <Text style={[styles.tryAgainText, { color: BACKGROUND }]}>{warningButtonText}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  decorationContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: width, overflow: 'hidden' },
  glowCircle: { position: 'absolute', width: 300, height: 300, borderRadius: 150 },
  glowCircleSmall: { position: 'absolute', width: 200, height: 200, borderRadius: 100 },
  scrollContent: { paddingHorizontal: 32, paddingTop: 60, paddingBottom: 40 },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoBadge: { width: 100, height: 100, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  brandName: { fontSize: 34, fontWeight: '900', color: WHITE, letterSpacing: -1 },
  brandTagline: { fontSize: 14, color: '#64748b', fontWeight: '700', marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' },
  formSection: { marginBottom: 32 },
  welcomeText: { fontSize: 28, fontWeight: '900', color: WHITE, marginBottom: 8, letterSpacing: -0.5 },
  subText: { fontSize: 15, color: '#94a3b8', fontWeight: '600', marginBottom: 28 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#64748b', marginBottom: 10, letterSpacing: 1 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 60, borderRadius: 18, borderWidth: 1, paddingHorizontal: 18 },
  inputIcon: { marginRight: 14 },
  input: { flex: 1, color: WHITE, fontSize: 15, fontWeight: '600' },
  errorText: {
    color: ERROR,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    marginLeft: 6,
  },
  phonePrefix: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  verticalDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)', marginLeft: 12 },
  checkboxSection: { marginVertical: 10, gap: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  loginBtn: { flexDirection: 'row', height: 62, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20, shadowColor: '#eab308', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8, gap: 10 },
  loginBtnText: { fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  signUpText: { fontSize: 14, fontWeight: '800' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  warningCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 35,
    padding: 35,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  warningIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: WHITE,
    marginBottom: 15,
  },
  warningDesc: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
  remainingText: {
    fontSize: 14,
    color: SECONDARY,
    fontWeight: '700',
    marginBottom: 30,
  },
  tryAgainBtn: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: SECONDARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  tryAgainText: {
    fontSize: 17,
    fontWeight: '900',
  },
});
