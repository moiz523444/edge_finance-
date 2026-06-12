import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { apiService } from '@/services/api';
import { saveIdNumber } from '@/services/secureStore';
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
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const PRIMARY = '#10b981'; // Emerald
const SECONDARY = '#eab308'; // Amber
const BACKGROUND = '#0a0f1c';
const CARD_BG = '#111827';
const WHITE = '#FFFFFF';
const TEXT_SECONDARY = '#94a3b8';
const BORDER = 'rgba(255, 255, 255, 0.08)';
const ERROR = '#ef4444';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricType, setBiometricType] = useState<null | 'fingerprint' | 'faceid'>(null);

  // Field validation and touched states
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Modal notification states
  const [showWarning, setShowWarning] = useState(false);
  const [warningTitle, setWarningTitle] = useState('Warning');
  const [warningDesc, setWarningDesc] = useState('');
  const [warningButtonText, setWarningButtonText] = useState('Try Again');
  const [warningIcon, setWarningIcon] = useState('warning-outline');
  const [warningIconColor, setWarningIconColor] = useState(SECONDARY);
  const [onWarningAction, setOnWarningAction] = useState<() => void>(() => () => setShowWarning(false));

  const validateEmail = (val: string) => {
    if (!val) return 'Username or email is required';
    if (val.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) return 'Please enter a valid email address';
    } else {
      if (val.length < 3) return 'Username must be at least 3 characters';
    }
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) return 'Password is required';
    if (val.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailTouched) {
      setEmailError(validateEmail(text));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordTouched) {
      setPasswordError(validatePassword(text));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(validatePassword(password));
  };

  const handleLogin = async () => {
    // Touch and validate all fields
    const emailValErr = validateEmail(email);
    const passValErr = validatePassword(password);

    setEmailTouched(true);
    setPasswordTouched(true);
    setEmailError(emailValErr);
    setPasswordError(passValErr);

    if (emailValErr || passValErr) {
      setWarningTitle('Validation Error');
      setWarningDesc('Please correct the highlighted errors before signing in.');
      setWarningButtonText('Ok');
      setWarningIcon('warning-outline');
      setWarningIconColor(ERROR);
      setOnWarningAction(() => () => setShowWarning(false));
      setShowWarning(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.auth.login(email, password);
      setIsLoading(false);

      const isLoginSuccess = response.SUCCEEDED && (response.RESPONSESTATUS === true || response.RESPONSECODE === 'NEW_DEVICE');

      if (isLoginSuccess) {
        await saveIdNumber(email);
        const title = (response.MESSAGETITLE && response.MESSAGETITLE !== 'Title Not Found') ? response.MESSAGETITLE : 'Welcome Back';
        const desc = (response.MESSAGETEXT && response.MESSAGETEXT !== 'Message Not Found') ? response.MESSAGETEXT : 'Sign In completed successfully.';
        setWarningTitle(title);
        setWarningDesc(desc);
        setWarningButtonText(response.BUTTONTEXT || 'Proceed');
        setWarningIcon('checkmark-circle-outline');
        setWarningIconColor(PRIMARY);

        setOnWarningAction(() => async () => {
          setShowWarning(false);
          setIsLoading(true);
          try {
            const tpuRecId = response.TPURECID ? response.TPURECID.toString() : '';
            const transactionId = response.TRANSACTIONID ? response.TRANSACTIONID.toString() : '';

            if (response.NEXTSTAGEDETAILS && response.NEXTSTAGEDETAILS.SCREENCODE === 'UISNAFATH') {
              router.replace({
                pathname: '/nafath',
                params: { tpuRecId, transactionId, idNumber: email }
              });
            } else {
              console.log('[Login] Generating OTP (EVENTID 36) before routing...');
              const otpRes = await apiService.auth.generateOtp(tpuRecId, transactionId, email, '36', 'login');
              
              if (otpRes.SUCCEEDED) {
                let otpUuid = '';
                const otpData = (otpRes.DATA && Array.isArray(otpRes.DATA)) ? otpRes.DATA[0] : (otpRes.DATA || null);
                if (otpData && otpData.OTPUUID) {
                  otpUuid = otpData.OTPUUID.toString();
                }
                router.replace({
                  pathname: '/otp',
                  params: {
                    tpuRecId,
                    transactionId,
                    from: 'login',
                    idNumber: email,
                    eventId: '36',
                    otpUuid: otpUuid
                  }
                });
              } else {
                setWarningTitle('OTP Generation Failed');
                setWarningDesc(otpRes.MESSAGETEXT || 'Failed to generate OTP. Please try again.');
                setWarningButtonText('Ok');
                setWarningIcon('alert-circle-outline');
                setWarningIconColor(ERROR);
                setOnWarningAction(() => () => setShowWarning(false));
                setShowWarning(true);
              }
            }
          } catch (err: any) {
            console.error('[Login OTP Generation Error]', err);
          } finally {
            setIsLoading(false);
          }
        });
        setShowWarning(true);
      } else {
        const title = (response.MESSAGETITLE && response.MESSAGETITLE !== 'Title Not Found') ? response.MESSAGETITLE : 'Sign In Failed';
        const desc = (response.MESSAGETEXT && response.MESSAGETEXT !== 'Message Not Found')
          ? response.MESSAGETEXT
          : (response.RESPONSEDESCRIPTION && response.RESPONSEDESCRIPTION !== 'Description Not Found' && response.RESPONSEDESCRIPTION !== '')
            ? response.RESPONSEDESCRIPTION
            : 'Invalid username or password.';

        setWarningTitle(title);
        setWarningDesc(desc);
        setWarningButtonText(response.BUTTONTEXT || 'Try Again');
        setWarningIcon('alert-circle-outline');
        setWarningIconColor(ERROR);
        setOnWarningAction(() => () => setShowWarning(false));
        setShowWarning(true);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('[Login API Error]', error);
      setWarningTitle('Network Error');
      setWarningDesc(error.message || 'Unable to connect to the server. Please check your network.');
      setWarningButtonText('Try Again');
      setWarningIcon('wifi-outline');
      setWarningIconColor(ERROR);
      setOnWarningAction(() => () => setShowWarning(false));
      setShowWarning(true);
    }
  };

  const handleBiometricAuth = (type: 'fingerprint' | 'faceid') => {
    setBiometricType(type);
    setTimeout(() => {
      setBiometricType(null);
      router.replace('/(tabs)/dashboard');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.logoSection}>
              <View style={[styles.logoBadge, { backgroundColor: PRIMARY + '15' }]}>
                <Ionicons name="flash" size={48} color={PRIMARY} />
              </View>
              <Text style={styles.brandName}>EDGE <Text style={{ color: PRIMARY }}>FINANCE</Text></Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.titleText}>Sign In To Account</Text>
              <Text style={styles.subText}>Sign with username or email and password to use your account.</Text>

              {/* Username/Email Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>USERNAME OR EMAIL</Text>
                <View style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: CARD_BG, 
                    borderColor: emailTouched && emailError ? ERROR : (emailTouched && !emailError ? PRIMARY : BORDER) 
                  }
                ]}>
                  <Ionicons 
                    name="person-outline" 
                    size={20} 
                    color={emailTouched && emailError ? ERROR : PRIMARY} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    placeholder="Enter username or email"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.input}
                    autoCapitalize="none"
                    value={email}
                    onChangeText={handleEmailChange}
                    onBlur={handleEmailBlur}
                  />
                  {emailTouched && !emailError && <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />}
                </View>
                {emailTouched && emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
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
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={20} 
                    color={passwordTouched && passwordError ? ERROR : PRIMARY} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={TEXT_SECONDARY} />
                  </TouchableOpacity>
                </View>
                {passwordTouched && passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              <TouchableOpacity 
                style={[styles.loginBtn, { backgroundColor: SECONDARY }]} 
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={BACKGROUND} />
                ) : (
                  <Text style={[styles.loginBtnText, { color: BACKGROUND }]}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or login with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Biometrics */}
              <View style={styles.biometricRow}>
                <TouchableOpacity style={styles.bioBtn} onPress={() => handleBiometricAuth('faceid')}>
                  <View style={[styles.bioIconBox, { borderColor: BORDER }]}>
                    <Ionicons name="scan-outline" size={28} color={WHITE} />
                  </View>
                  <Text style={styles.bioText}>Face ID</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bioBtn} onPress={() => handleBiometricAuth('fingerprint')}>
                  <View style={[styles.bioIconBox, { borderColor: BORDER }]}>
                    <Ionicons name="finger-print-outline" size={28} color={WHITE} />
                  </View>
                  <Text style={styles.bioText}>Fingerprint</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>{"Don't have an account?"} </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={[styles.signUpText, { color: PRIMARY }]}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Chat Icon */}
            <TouchableOpacity style={styles.chatContainer}>
              <View style={[styles.chatBadge, { borderColor: SECONDARY + '30' }]}>
                <Ionicons name="chatbubble-ellipses-outline" size={28} color={SECONDARY} />
              </View>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Warning/Success Modal */}
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

      {/* Biometric Modal */}
      <Modal visible={biometricType !== null} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn.duration(400)} style={styles.bioCard}>
            <View style={[styles.bioLargeIconCircle, { backgroundColor: SECONDARY + '10' }]}>
              <Ionicons 
                name={biometricType === 'faceid' ? "scan-outline" : "finger-print-outline"} 
                size={70} 
                color={SECONDARY} 
              />
            </View>
            <Text style={styles.bioCardTitle}>
              {biometricType === 'faceid' ? "Face ID" : "Fingerprint"}
            </Text>
            <Text style={styles.bioCardDesc}>
              Use {biometricType === 'faceid' ? "Face ID" : "Fingerprint"} to sign in
            </Text>
          </Animated.View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  scrollContent: { paddingHorizontal: 30, paddingTop: 60, paddingBottom: 30 },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoBadge: { width: 90, height: 90, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  brandName: { fontSize: 32, fontWeight: '900', color: WHITE, letterSpacing: -0.5 },
  formSection: { width: '100%' },
  titleText: { fontSize: 28, fontWeight: '900', color: WHITE, textAlign: 'center', marginBottom: 10 },
  subText: { fontSize: 15, color: TEXT_SECONDARY, textAlign: 'center', marginBottom: 35, lineHeight: 22 },
  inputContainer: { marginBottom: 18 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#64748b', marginBottom: 10, letterSpacing: 1 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 60, borderRadius: 18, borderWidth: 1, paddingHorizontal: 20 },
  inputIcon: { marginRight: 14 },
  input: { flex: 1, color: WHITE, fontSize: 16, fontWeight: '600' },
  errorText: {
    color: ERROR,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    marginLeft: 6,
  },
  loginBtn: { height: 62, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: SECONDARY, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  loginBtnText: { fontSize: 18, fontWeight: '900' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 35 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  dividerText: { color: TEXT_SECONDARY, paddingHorizontal: 15, fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  biometricRow: { flexDirection: 'row', justifyContent: 'center', gap: 40, marginBottom: 40 },
  bioBtn: { alignItems: 'center' },
  bioIconBox: { width: 60, height: 60, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: CARD_BG },
  bioText: { color: TEXT_SECONDARY, fontSize: 13, fontWeight: '700', marginTop: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  footerText: { color: TEXT_SECONDARY, fontSize: 15, fontWeight: '600' },
  signUpText: { fontSize: 15, fontWeight: '800' },
  chatContainer: { alignSelf: 'center', marginTop: 10 },
  chatBadge: { width: 60, height: 60, borderRadius: 30, backgroundColor: CARD_BG, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  bioCard: { width: '100%', backgroundColor: WHITE, borderRadius: 35, padding: 40, alignItems: 'center' },
  bioLargeIconCircle: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  bioCardTitle: { fontSize: 26, fontWeight: '900', color: BACKGROUND, marginBottom: 10 },
  bioCardDesc: { fontSize: 15, color: '#64748b', fontWeight: '600' },
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
    textAlign: 'center',
  },
  warningDesc: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
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
