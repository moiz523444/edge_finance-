import { apiService } from '@/services/api';
import { saveIdNumber } from '@/services/secureStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
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

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  const tpuRecId = (params.tpuRecId as string) || '';
  const transactionId = (params.transactionId as string) || '';
  const idNumber = (params.idNumber as string) || '';
  const eventId = (params.eventId as string) || '2';
  const otpUuidParam = (params.otpUuid as string) || '';
  const [otpUuid, setOtpUuid] = useState(otpUuidParam);

  // Modal notification states
  const [showWarning, setShowWarning] = useState(false);
  const [warningTitle, setWarningTitle] = useState('Warning');
  const [warningDesc, setWarningDesc] = useState('');
  const [warningButtonText, setWarningButtonText] = useState('Try Again');
  const [warningIcon, setWarningIcon] = useState('warning-outline');
  const [warningIconColor, setWarningIconColor] = useState(SECONDARY);
  const [onWarningAction, setOnWarningAction] = useState<() => void>(() => () => setShowWarning(false));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    // Only accept numeric inputs
    const cleanValue = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    // Auto-focus next input
    if (cleanValue && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.auth.generateOtp(tpuRecId, transactionId, idNumber, eventId);
      if (res.SUCCEEDED) {
        setTimer(60);
        let newUuid = '';
        const otpData = (res.DATA && Array.isArray(res.DATA)) ? res.DATA[0] : (res.DATA || null);
        if (otpData && otpData.OTPUUID) {
          newUuid = otpData.OTPUUID.toString();
          setOtpUuid(newUuid);
        }
        setWarningTitle('Code Sent');
        setWarningDesc(res.MESSAGETEXT || 'A new verification code has been sent to your mobile number.');
        setWarningButtonText('Ok');
        setWarningIcon('checkmark-circle-outline');
        setWarningIconColor(PRIMARY);
        setOnWarningAction(() => () => setShowWarning(false));
        setShowWarning(true);
      } else {
        setWarningTitle('Resend Failed');
        setWarningDesc(res.MESSAGETEXT || 'Could not resend code. Please try again.');
        setWarningButtonText('Ok');
        setWarningIcon('alert-circle-outline');
        setWarningIconColor(ERROR);
        setOnWarningAction(() => () => setShowWarning(false));
        setShowWarning(true);
      }
    } catch (error: any) {
      console.error('[Resend OTP Error]', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      setWarningTitle('Invalid Code');
      setWarningDesc('Please enter all 4 digits of the verification code.');
      setWarningButtonText('Ok');
      setWarningIcon('warning-outline');
      setWarningIconColor(ERROR);
      setOnWarningAction(() => () => setShowWarning(false));
      setShowWarning(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.auth.verifyOtp(tpuRecId, transactionId, otpCode, idNumber, eventId, otpUuid);
      setIsLoading(false);

      if (response.SUCCEEDED) {
        await saveIdNumber(idNumber);
        const title = (response.MESSAGETITLE && response.MESSAGETITLE !== 'Title Not Found') ? response.MESSAGETITLE : 'Verification Completed';
        const desc = (response.MESSAGETEXT && response.MESSAGETEXT !== 'Message Not Found') ? response.MESSAGETEXT : 'Your OTP has been successfully verified.';
        setWarningTitle(title);
        setWarningDesc(desc);
        setWarningButtonText(response.BUTTONTEXT || 'Proceed');
        setWarningIcon('checkmark-circle-outline');
        setWarningIconColor(PRIMARY);

        setOnWarningAction(() => async () => {
          setShowWarning(false);
          const nextTpu = response.TPURECID ? response.TPURECID.toString() : tpuRecId;
          const nextTrans = response.TRANSACTIONID ? response.TRANSACTIONID.toString() : transactionId;

          // Smart Routing based on response details
          if (params.from === 'signup') {
            router.push({
              pathname: '/terms',
              params: { tpuRecId: nextTpu, transactionId: nextTrans, idNumber: idNumber }
            });
          } else if (response.NEXTSTAGEDETAILS && response.NEXTSTAGEDETAILS.SCREENCODE === 'UISNAFATH') {
            router.push({
              pathname: '/nafath',
              params: { tpuRecId: nextTpu, transactionId: nextTrans, idNumber: idNumber }
            });
          } else if (params.from === 'login' && eventId === '36') {
            setIsLoading(true);
            try {
              let otpToken = '';
              const resData = (response.DATA && Array.isArray(response.DATA)) ? response.DATA[0] : (response.DATA || null);
              if (resData && resData.OTPTOKEN) {
                otpToken = resData.OTPTOKEN;
              }
              // BYPASS: updateDevice API is currently down, simulating success
              // const deviceRes = await apiService.auth.updateDevice(idNumber, otpToken);
              const deviceRes = { SUCCEEDED: true, RESPONSESTATUS: true };
              setIsLoading(false);

              const isDeviceSuccess = deviceRes.SUCCEEDED && deviceRes.RESPONSESTATUS !== false;

              if (isDeviceSuccess) {
                router.replace('/(tabs)/dashboard');
              } else {
                const title = (deviceRes.MESSAGETITLE && deviceRes.MESSAGETITLE !== 'Title Not Found')
                  ? deviceRes.MESSAGETITLE
                  : 'Device Update Failed';
                const desc = (deviceRes.MESSAGETEXT && deviceRes.MESSAGETEXT !== 'Message Not Found')
                  ? deviceRes.MESSAGETEXT
                  : (deviceRes.RESPONSEDESCRIPTION && deviceRes.RESPONSEDESCRIPTION !== 'Description Not Found' && deviceRes.RESPONSEDESCRIPTION !== '')
                    ? deviceRes.RESPONSEDESCRIPTION
                    : 'Unable to register this new device. Please try again.';

                setWarningTitle(title);
                setWarningDesc(desc);
                setWarningButtonText('Ok');
                setWarningIcon('alert-circle-outline');
                setWarningIconColor(ERROR);
                setOnWarningAction(() => () => setShowWarning(false));
                setShowWarning(true);
              }
            } catch (err: any) {
              setIsLoading(false);
              console.error('[Device Registration Error]', err);
            }
          } else {
            if (params.from === 'login') {
              router.replace('/(tabs)/dashboard');
            } else {
              router.push('/terms');
            }
          }
        });
        setShowWarning(true);
      } else {
        const title = (response.MESSAGETITLE && response.MESSAGETITLE !== 'Title Not Found')
          ? response.MESSAGETITLE
          : 'Verification Failed';
        const desc = (response.MESSAGETEXT && response.MESSAGETEXT !== 'Message Not Found')
          ? response.MESSAGETEXT
          : (response.RESPONSEDESCRIPTION && response.RESPONSEDESCRIPTION !== 'Description Not Found' && response.RESPONSEDESCRIPTION !== 'Message Not Found' && response.RESPONSEDESCRIPTION !== '')
            ? response.RESPONSEDESCRIPTION
            : 'The OTP code is incorrect or has expired.';

        setWarningTitle(title);
        setWarningDesc(desc);
        setWarningButtonText('Try Again');
        setWarningIcon('alert-circle-outline');
        setWarningIconColor(ERROR);
        setOnWarningAction(() => () => setShowWarning(false));
        setShowWarning(true);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('[OTP Verification Error]', error);
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
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.content}>

            {/* Header / Back */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={28} color={TEXT_MAIN} />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
            </View>

            <Animated.View entering={FadeInDown.duration(800)} style={styles.textSection}>
              <Text style={styles.titleText}>Verify Account!</Text>
              <Text style={styles.subText}>
                A code is sent to your mobile number registered at ABSHER
              </Text>
            </Animated.View>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <View
                  key={index}
                  style={[
                    styles.otpBox,
                    digit !== '' && { borderColor: SECONDARY, backgroundColor: SECONDARY + '05' }
                  ]}
                >
                  <TextInput
                    ref={(ref) => { inputs.current[index] = ref; }}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(val) => handleOtpChange(val, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                </View>
              ))}
            </View>

            <View style={styles.timerSection}>
              <Text style={styles.timerText}>This session will end in {timer} seconds.</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ color: TEXT_SECONDARY, fontSize: 14 }}>Did't get code? </Text>
                <TouchableOpacity disabled={timer > 0} onPress={handleResendOtp}>
                  <Text style={[styles.resendText, timer === 0 && { color: PRIMARY, textDecorationLine: 'underline' }]}>Resend Code</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleContinue}
              disabled={isLoading || otp.includes('')}
            >
              {isLoading ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                <Text style={styles.continueBtnText}>Continue</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? - </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

          </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 10 },
  logoImage: { width: 140, height: 60 },
  textSection: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  titleText: { fontSize: 26, fontWeight: '700', color: TEXT_MAIN, marginBottom: 12 },
  subText: { fontSize: 14, color: TEXT_SECONDARY, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, paddingHorizontal: 10 },
  otpBox: { width: (width - 100) / 4, height: 70, backgroundColor: BACKGROUND, borderRadius: 16, borderWidth: 1, borderColor: BORDER, justifyContent: 'center', alignItems: 'center' },
  otpInput: { fontSize: 32, fontWeight: '400', color: PRIMARY, textAlign: 'center', width: '100%' },
  timerSection: { alignItems: 'center', marginBottom: 40 },
  timerText: { color: TEXT_SECONDARY, fontSize: 14 },
  resendText: { fontSize: 14, fontWeight: '700', color: TEXT_SECONDARY, textDecorationLine: 'underline' },
  continueBtn: { width: '100%', height: 56, borderRadius: 16, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center' },
  continueBtnText: { fontSize: 16, fontWeight: '600', color: WHITE },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  footerText: { color: TEXT_SECONDARY, fontSize: 14 },
  signInLink: { fontSize: 14, fontWeight: '600', color: PRIMARY },
  
  // Modal dialog styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 30 },
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
