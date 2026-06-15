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
  Image,
} from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

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
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.titleText}>Sign In{'\n'}To Account</Text>
              <Text style={styles.subText}>Sign with username or email and{'\n'}password to use your account.</Text>

              {/* Username/Email Field */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: CARD_BG, 
                    borderColor: emailTouched && emailError ? ERROR : (emailTouched && !emailError ? PRIMARY : BORDER) 
                  }
                ]}>
                  <TextInput
                    placeholder="Username or email"
                    placeholderTextColor={TEXT_SECONDARY}
                    style={styles.input}
                    autoCapitalize="none"
                    value={email}
                    onChangeText={handleEmailChange}
                    onBlur={handleEmailBlur}
                  />
                </View>
                {emailTouched && emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: CARD_BG, 
                    borderColor: passwordTouched && passwordError ? ERROR : (passwordTouched && !passwordError ? PRIMARY : BORDER) 
                  }
                ]}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={TEXT_SECONDARY}
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
                style={styles.loginBtn} 
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={WHITE} />
                ) : (
                  <Text style={styles.loginBtnText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <Text style={styles.dividerText}>or login with</Text>
              </View>

              {/* Biometrics */}
              <View style={styles.biometricRow}>
                <TouchableOpacity style={styles.bioBtn} onPress={() => handleBiometricAuth('faceid')}>
                  <View style={styles.bioIconBox}>
                    <Ionicons name="scan-outline" size={28} color={PRIMARY} />
                  </View>
                  <Text style={styles.bioText}>Face ID</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bioBtn} onPress={() => handleBiometricAuth('fingerprint')}>
                  <View style={styles.bioIconBox}>
                    <Ionicons name="finger-print-outline" size={28} color={PRIMARY} />
                  </View>
                  <Text style={styles.bioText}>Fingerprint</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? - </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Chat Icon */}
            <TouchableOpacity style={styles.chatContainer}>
              <View style={styles.chatBadge}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={PRIMARY} />
                <Text style={styles.chatText}>Chat</Text>
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

      {/* Biometric Modal */}
      <Modal visible={biometricType !== null} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn.duration(400)} style={styles.bioCard}>
            <View style={styles.bioLargeIconCircle}>
              <Ionicons 
                name={biometricType === 'faceid' ? "scan-outline" : "finger-print-outline"} 
                size={80} 
                color={PRIMARY} 
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
  scrollContent: { paddingHorizontal: 30, paddingTop: 40, paddingBottom: 30 },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logoImage: { width: 140, height: 60 },
  formSection: { width: '100%', marginTop: 10 },
  titleText: { fontSize: 32, fontWeight: '800', color: '#1E293B', textAlign: 'center', marginBottom: 12 },
  subText: { fontSize: 14, color: TEXT_SECONDARY, textAlign: 'center', marginBottom: 40, lineHeight: 22, paddingHorizontal: 10 },
  inputContainer: { marginBottom: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, backgroundColor: CARD_BG },
  input: { flex: 1, color: TEXT_MAIN, fontSize: 16 },
  errorText: { color: ERROR, fontSize: 12, marginTop: 4, marginLeft: 4 },
  loginBtn: { width: '100%', height: 56, borderRadius: 16, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginBtnText: { fontSize: 16, fontWeight: '600', color: WHITE },
  dividerContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 30 },
  dividerText: { color: TEXT_SECONDARY, fontSize: 12 },
  biometricRow: { flexDirection: 'row', justifyContent: 'center', gap: 30, marginBottom: 40 },
  bioBtn: { alignItems: 'center' },
  bioIconBox: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  bioText: { color: TEXT_SECONDARY, fontSize: 12, marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  footerText: { color: TEXT_SECONDARY, fontSize: 14 },
  signUpText: { fontSize: 14, fontWeight: '600', color: PRIMARY },
  chatContainer: { alignSelf: 'center', marginTop: 10 },
  chatBadge: { width: 64, height: 64, borderRadius: 12, backgroundColor: CARD_BG, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: PRIMARY },
  chatText: { fontSize: 10, color: PRIMARY, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  bioCard: { width: '100%', backgroundColor: CARD_BG, borderRadius: 24, padding: 30, alignItems: 'center' },
  bioLargeIconCircle: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  bioCardTitle: { fontSize: 24, fontWeight: '700', color: TEXT_MAIN, marginBottom: 10 },
  bioCardDesc: { fontSize: 15, color: TEXT_SECONDARY, textAlign: 'center' },
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
  warningIconCircle: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  warningTitle: { fontSize: 24, fontWeight: '700', marginBottom: 15, textAlign: 'center' },
  warningDesc: { fontSize: 15, color: TEXT_SECONDARY, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  tryAgainBtn: { width: '100%', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  tryAgainText: { fontSize: 16, fontWeight: '600' },
});
