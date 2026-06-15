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
  Image,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
  ZoomIn
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const PRIMARY = '#2E8B57'; // Green
const SECONDARY = '#2E8B57'; // Green
const BACKGROUND = '#ffffff';
const CARD_BG = '#ffffff';
const WHITE = '#ffffff';
const TEXT_MAIN = '#111827';
const TEXT_SECONDARY = '#6B7280';
const BORDER = '#D1D5DB';
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
      <StatusBar style="dark" />

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
              <Image 
                source={require('../assets/images/logo.png')} 
                style={{ width: 180, height: 70, resizeMode: 'contain', marginBottom: 20 }} 
              />
            </Animated.View>

            <Animated.View
              layout={Layout.springify()}
              entering={FadeInDown.duration(800).delay(300)}
              style={styles.formSection}
            >
              <Text style={styles.welcomeText}>Create an account</Text>
              <Text style={styles.subText}>Enter the Information below to get started</Text>

              {/* ID Number Field */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  { borderColor: idTouched && idError ? ERROR : (idNumber ? PRIMARY : BORDER) }
                ]}>
                  <TextInput
                    placeholder="ID Number"
                    placeholderTextColor={TEXT_SECONDARY}
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={10}
                    value={idNumber}
                    onChangeText={handleIdChange}
                    onBlur={handleIdBlur}
                  />
                </View>
                {idTouched && idError ? <Text style={styles.errorText}>{idError}</Text> : null}
              </View>

              {/* Phone Number Field */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  { borderColor: phoneTouched && phoneError ? ERROR : (phoneNumber ? PRIMARY : BORDER) }
                ]}>
                  <View style={styles.phonePrefix}>
                    <Text style={{ color: TEXT_MAIN, fontWeight: '500', fontSize: 15 }}>+966</Text>
                    <View style={styles.verticalDivider} />
                  </View>
                  <TextInput
                    placeholder="Mobile Number"
                    placeholderTextColor={TEXT_SECONDARY}
                    style={styles.input}
                    keyboardType="phone-pad"
                    maxLength={15}
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                  />
                </View>
                {phoneTouched && phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  { borderColor: passwordTouched && passwordError ? ERROR : (password ? PRIMARY : BORDER) }
                ]}>
                  <TextInput
                    placeholder="Enter your Password"
                    placeholderTextColor={TEXT_SECONDARY}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                  />
                </View>
                {passwordTouched && passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              {/* Re-enter Password Field */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  { borderColor: confirmPasswordTouched && confirmPasswordError ? ERROR : (confirmPassword ? PRIMARY : BORDER) }
                ]}>
                  <TextInput
                    placeholder="Re-enter your Password"
                    placeholderTextColor={TEXT_SECONDARY}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    onBlur={handleConfirmPasswordBlur}
                  />
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
                  <View style={[styles.checkbox, { borderColor: PRIMARY, backgroundColor: agreedTerms ? PRIMARY : 'transparent' }]}>
                    {agreedTerms && <Ionicons name="checkmark" size={14} color={WHITE} />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree <Text style={{ color: PRIMARY, textDecorationLine: 'underline' }} onPress={() => router.push('/terms')}>terms and conditions</Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setAgreedPrivacy(!agreedPrivacy)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, { borderColor: PRIMARY, backgroundColor: agreedPrivacy ? PRIMARY : 'transparent' }]}>
                    {agreedPrivacy && <Ionicons name="checkmark" size={14} color={WHITE} />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree <Text style={{ color: PRIMARY, textDecorationLine: 'underline' }} onPress={() => router.push('/privacy')}>privacy policy</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={WHITE} />
                ) : (
                  <Text style={styles.loginBtnText}>Create an account</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? - </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.signUpText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Chat Icon */}
            <View style={styles.chatIconContainer}>
              <TouchableOpacity style={styles.chatIconBtn}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={PRIMARY} />
                <Text style={styles.chatIconText}>Chat</Text>
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
            <View style={styles.warningIconCircle}>
              <Ionicons name={warningIcon as any} size={80} color={warningIconColor} />
            </View>
            <Text style={[styles.warningTitle, { color: warningIconColor }]}>{warningTitle}</Text>
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
  welcomeText: { fontSize: 24, fontWeight: '700', color: TEXT_MAIN, marginBottom: 12, textAlign: 'center' },
  subText: { fontSize: 14, color: TEXT_SECONDARY, fontWeight: '400', marginBottom: 30, textAlign: 'center', paddingHorizontal: 20 },
  inputContainer: { marginBottom: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, backgroundColor: '#ffffff' },
  input: { flex: 1, color: TEXT_MAIN, fontSize: 15 },
  errorText: { color: ERROR, fontSize: 12, fontWeight: '500', marginTop: 4, marginLeft: 4 },
  phonePrefix: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  verticalDivider: { width: 1, height: 24, backgroundColor: BORDER, marginLeft: 12 },
  checkboxSection: { marginVertical: 10, gap: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxText: { color: TEXT_SECONDARY, fontSize: 14 },
  loginBtn: { height: 56, borderRadius: 12, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  loginBtnText: { fontSize: 16, fontWeight: '600', color: WHITE },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  footerText: { color: TEXT_SECONDARY, fontSize: 14 },
  signUpText: { fontSize: 14, fontWeight: '600', color: PRIMARY },
  chatIconContainer: { alignItems: 'center', marginTop: 40, paddingBottom: 20 },
  chatIconBtn: { width: 60, height: 60, borderRadius: 12, borderWidth: 1, borderColor: PRIMARY, justifyContent: 'center', alignItems: 'center' },
  chatIconText: { fontSize: 10, color: PRIMARY, marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  warningCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  warningIconCircle: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  warningDesc: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  remainingText: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '600',
    marginBottom: 30,
  },
  tryAgainBtn: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tryAgainText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
