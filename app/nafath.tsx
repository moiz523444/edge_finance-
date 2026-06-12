import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { apiService } from '../services/api';

const { width } = Dimensions.get('window');

const PRIMARY = '#10b981'; // Emerald
const SECONDARY = '#eab308'; // Amber
const BACKGROUND = '#0a0f1c';
const CARD_BG = '#111827';
const WHITE = '#FFFFFF';
const TEXT_SECONDARY = '#94a3b8';
const BORDER = 'rgba(255, 255, 255, 0.08)';
const ERROR = '#ef4444';

export default function NafathScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const params = useLocalSearchParams<{ tpuRecId?: string; transactionId?: string; idNumber?: string }>();
  const tpuRecId = params.tpuRecId || '';
  const transactionId = params.transactionId || '';
  const initialIdNumber = params.idNumber || '1001123530';

  const [idNumber, setIdNumber] = useState(initialIdNumber);
  const [transId, setTransId] = useState('');
  const [step, setStep] = useState(1); // 1: Redirection, 2: Resend
  const [timeLeft, setTimeLeft] = useState(180); // 180s Nafath standard session timer
  const [nafathNumber, setNafathNumber] = useState('77'); // default Nafath number
  const [isChecking, setIsChecking] = useState(false);

  const pollingIntervalRef = useRef<any>(null);

  // Custom warning/success dialog modal state
  const [showWarning, setShowWarning] = useState(false);
  const [warningTitle, setWarningTitle] = useState('');
  const [warningDesc, setWarningDesc] = useState('');
  const [warningButtonText, setWarningButtonText] = useState('Continue');
  const [warningIcon, setWarningIcon] = useState('checkmark-circle-outline');
  const [warningIconColor, setWarningIconColor] = useState(PRIMARY);
  const [onWarningAction, setOnWarningAction] = useState<() => void>(() => () => {});

  /*
  const routeToScreen = (screenCode: string | undefined, nextTpu: string, nextTrans: string) => {
    const code = screenCode?.toUpperCase() || '';
    if (code === 'UISNAFATH') {
      router.replace({ pathname: '/nafath', params: { tpuRecId: nextTpu, transactionId: nextTrans } });
    } else if (code === 'UIOTP') {
      router.replace({ pathname: '/otp', params: { tpuRecId: nextTpu, transactionId: nextTrans } });
    } else if (code === 'UITERMS' || code === 'UIPRIVACY') {
      router.replace({ pathname: '/terms', params: { tpuRecId: nextTpu, transactionId: nextTrans } });
    } else if (code === 'UIPEP') {
      router.replace({ pathname: '/pep', params: { tpuRecId: nextTpu, transactionId: nextTrans } });
    } else if (code === 'UIBASICINFO') {
      router.replace({ pathname: '/basic-info', params: { tpuRecId: nextTpu, transactionId: nextTrans } });
    } else if (code === 'UILIVINGEXPENSES') {
      router.replace({ pathname: '/living-expenses', params: { tpuRecId: nextTpu, transactionId: nextTrans } });
    } else if (code === 'UIEMPLOYMENTDATA') {
      router.replace({ pathname: '/employment-data', params: { tpuRecId: nextTpu, transactionId: nextTrans } });
    } else if (code === 'UIFINANCIALDISCLOSURE') {
      router.replace({ pathname: '/financial-disclosure', params: { tpuRecId: nextTpu, transactionId: nextTrans } });
    } else if (code === 'UISIMAHCONSENT') {
      router.replace({ pathname: '/simah-consent', params: { tpuRecId: nextTpu, transactionId: nextTrans } });
    } else {
      // Default fallback
      router.replace({ pathname: '/terms', params: { tpuRecId: nextTpu, transactionId: nextTrans } });
    }
  };
  */

  // Poll status when step 1 is active
  useEffect(() => {
    let active = isFocused;

    const startPolling = (currentTransId: string) => {
      if (pollingIntervalRef.current) {
        clearTimeout(pollingIntervalRef.current);
      }
      
      const poll = async () => {
        if (!active) return;
        try {
          const response = await apiService.auth.nafathCheckStatusNew(idNumber, currentTransId);
          console.log('[Nafath Polling Status Response]', response);
          
          if (response.SUCCEEDED && active) {
            const dataItem = (response.DATA && Array.isArray(response.DATA)) 
              ? response.DATA[0] 
              : (response.DATA || null);
            
            // Ultra-robust case-insensitive check of all keys at both dataItem and response root level
            const isCompletedStatus = (val: any) => {
              if (typeof val !== 'string') return false;
              const upper = val.toUpperCase();
              return upper === 'COMPLETED' || upper === 'APPROVED' || upper === 'SUCCESS' || upper === 'PASSED';
            };

            const isNafathVerifiedKey = (key: string) => {
              const lower = key.toLowerCase();
              return lower.includes('nafath') && (lower.includes('verify') || lower.includes('success') || lower.includes('pass'));
            };

            let isVerified = false;

            if (dataItem) {
              for (const k of Object.keys(dataItem)) {
                const val = dataItem[k];
                if (k.toLowerCase() === 'status' && isCompletedStatus(val)) {
                  isVerified = true;
                }
                if (isNafathVerifiedKey(k) && (val === true || val === 'true' || val === 1 || val === '1')) {
                  isVerified = true;
                }
              }
            }

            if (response) {
              for (const k of Object.keys(response)) {
                const val = (response as any)[k];
                if (k.toLowerCase() === 'status' && isCompletedStatus(val)) {
                  isVerified = true;
                }
                if (isNafathVerifiedKey(k) && (val === true || val === 'true' || val === 1 || val === '1')) {
                  isVerified = true;
                }
              }
            }

            const rawStatus = dataItem && typeof dataItem === 'object' 
              ? (Object.keys(dataItem).find(k => k.toLowerCase() === 'status') ? dataItem[Object.keys(dataItem).find(k => k.toLowerCase() === 'status')!] : '')
              : '';
            const status = typeof rawStatus === 'string' ? rawStatus.toUpperCase() : '';
            
            if (isVerified) {
              setStep(2); // Stop countdown/polling immediately
              setWarningTitle('Identity Verified');
              setWarningDesc('Your identity has been verified via Nafath. Proceeding to OTP verification.');
              setWarningButtonText('Proceed to OTP');
              setWarningIcon('checkmark-circle-outline');
              setWarningIconColor(PRIMARY);
              
              setOnWarningAction(() => async () => {
                setShowWarning(false);
                setIsChecking(true);
                try {
                  const nextTpu = response.TPURECID ? response.TPURECID.toString() : tpuRecId;
                  const nextTrans = response.TRANSACTIONID ? response.TRANSACTIONID.toString() : (transId || transactionId);
                  const res = await apiService.auth.generateOtp(nextTpu, nextTrans, idNumber, '2');
                  if (res.SUCCEEDED) {
                    let otpUuid = '';
                    const otpData = (res.DATA && Array.isArray(res.DATA)) ? res.DATA[0] : (res.DATA || null);
                    if (otpData && otpData.OTPUUID) {
                      otpUuid = otpData.OTPUUID.toString();
                    }
                    router.replace({
                      pathname: '/otp',
                      params: {
                        tpuRecId: nextTpu,
                        transactionId: nextTrans,
                        from: 'signup',
                        idNumber: idNumber,
                        eventId: '2',
                        otpUuid: otpUuid
                      }
                    });
                  } else {
                    setWarningTitle('OTP Generation Failed');
                    setWarningDesc(res.MESSAGETEXT || 'Failed to generate OTP. Please try again.');
                    setWarningButtonText('Ok');
                    setWarningIcon('alert-circle-outline');
                    setWarningIconColor(ERROR);
                    setOnWarningAction(() => () => setShowWarning(false));
                    setShowWarning(true);
                  }
                } catch (err: any) {
                  console.error('[Nafath OTP Generation Error]', err);
                } finally {
                  setIsChecking(false);
                }
              });
              setShowWarning(true);
              return; // Stop polling
            } else if (status === 'EXPIRED') {
              setStep(2); // Stop countdown/polling immediately
              setWarningTitle('Session Expired');
              setWarningDesc('The Nafath request session has expired. Please resend the request.');
              setWarningButtonText('Request New Code');
              setWarningIcon('time-outline');
              setWarningIconColor(ERROR);
              setOnWarningAction(() => () => {
                setShowWarning(false);
              });
              setShowWarning(true);
              return; // Stop polling
            } else if (status === 'REJECTED') {
              setStep(2); // Stop countdown/polling immediately
              setWarningTitle('Verification Rejected');
              setWarningDesc(response.MESSAGETEXT || 'Your identity verification was rejected.');
              setWarningButtonText('Back to Register');
              setWarningIcon('close-circle-outline');
              setWarningIconColor(ERROR);
              setOnWarningAction(() => () => {
                setShowWarning(false);
                router.replace('/signup');
              });
              setShowWarning(true);
              return; // Stop polling
            }
          }
        } catch (err) {
          console.error('[Nafath Polling Error]', err);
        }
        
        // Schedule next poll in 10s only if we are still active
        if (active) {
          pollingIntervalRef.current = setTimeout(poll, 10000);
        }
      };

      // Register the first poll to happen in 10 seconds
      pollingIntervalRef.current = setTimeout(poll, 10000);
    };
    
    const initiateNafathCheck = async () => {
      setIsChecking(true);
      try {
        const response = await apiService.auth.nafathRequest(idNumber);
        console.log('[Nafath Request Response]', response);
        if (response.SUCCEEDED && active) {
          const item = (response.DATA && Array.isArray(response.DATA)) 
            ? response.DATA[0] 
            : (response.DATA || null);
          
          if (item && item.RANDOM) {
            setNafathNumber(item.RANDOM.toString());
          }
          
          const finalTransId = (item && item.TRANSID) 
            ? item.TRANSID.toString() 
            : (response.TRANSACTIONID ? response.TRANSACTIONID.toString() : transactionId);
            
          if (finalTransId) {
            setTransId(finalTransId);
            startPolling(finalTransId);
          }
        } else if (!response.SUCCEEDED && active) {
          const title = (response.MESSAGETITLE && response.MESSAGETITLE !== 'Title Not Found') 
            ? response.MESSAGETITLE 
            : 'Request Failed';
            
          let desc = (response.MESSAGETEXT && response.MESSAGETEXT !== 'Message Not Found')
            ? response.MESSAGETEXT
            : (response.RESPONSEDESCRIPTION && response.RESPONSEDESCRIPTION !== 'Description Not Found' && response.RESPONSEDESCRIPTION !== 'Message Not Found' && response.RESPONSEDESCRIPTION !== '')
              ? response.RESPONSEDESCRIPTION
              : 'Failed to initiate Nafath request.';
              
          if (response.BROKENRULES && response.BROKENRULES.length > 0 && response.BROKENRULES[0].RULEMESSAGE) {
            desc += '\n' + response.BROKENRULES[0].RULEMESSAGE;
          }

          setWarningTitle(title);
          setWarningDesc(desc);
          setWarningButtonText('Go Back');
          setWarningIcon('alert-circle-outline');
          setWarningIconColor(ERROR);
          setOnWarningAction(() => () => {
            setShowWarning(false);
            router.back();
          });
          setShowWarning(true);
        }
      } catch (err: any) {
        console.error('[Nafath Initial Request Error]', err);
        if (active) {
          setWarningTitle('Network Error');
          setWarningDesc(err.message || 'Unable to connect to the server.');
          setWarningButtonText('Go Back');
          setWarningIcon('wifi-outline');
          setWarningIconColor(ERROR);
          setOnWarningAction(() => () => {
            setShowWarning(false);
            router.back();
          });
          setShowWarning(true);
        }
      } finally {
        if (active) {
          setIsChecking(false);
        }
      }
    };

    if (step === 1 && idNumber) {
      initiateNafathCheck();
    }

    return () => {
      active = false;
      if (pollingIntervalRef.current) {
        clearTimeout(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [step, idNumber, isFocused, transactionId, router]);

  // Session timer countdown
  useEffect(() => {
    if (step === 1 && transId && timeLeft > 0 && isFocused) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (step === 1 && transId && timeLeft === 0 && isFocused) {
      setStep(2); // Stop polling immediately and show resend step in background
      setWarningTitle('Session Expired');
      setWarningDesc('The Nafath verification session has timed out. Please request a new code.');
      setWarningButtonText('Request New Code');
      setWarningIcon('time-outline');
      setWarningIconColor(ERROR);
      setOnWarningAction(() => () => {
        setShowWarning(false);
      });
      setShowWarning(true);
    }
  }, [step, timeLeft, transId, isFocused]);

  const handleGoToNafath = async () => {
    try {
      const nafathUrl = 'https://www.iam.gov.sa';
      const supported = await Linking.canOpenURL(nafathUrl);
      if (supported) {
        await Linking.openURL(nafathUrl);
      }
    } catch (err) {
      console.error('[Nafath Link Open Error]', err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color={WHITE} />
          </TouchableOpacity>

          <View style={styles.logoSection}>
            <View style={[styles.logoBadge, { backgroundColor: PRIMARY + '15' }]}>
              <Ionicons name="flash" size={42} color={PRIMARY} />
            </View>
            <Text style={styles.brandName}>EDGE <Text style={{ color: PRIMARY }}>FINANCE</Text></Text>
          </View>

          <View style={styles.flexCenter}>
            {step === 1 ? (
              <Animated.View entering={FadeInDown.duration(600)} key="step1" style={styles.card}>
                <View style={styles.numberCircle}>
                  <Text style={[styles.numberText, { color: SECONDARY }]}>{nafathNumber}</Text>
                  <View style={[styles.pulseRing, { borderColor: SECONDARY + '40' }]} />
                </View>

                <Text style={styles.cardTitle}>Nafath Redirection</Text>
                <Text style={styles.cardDesc}>
                  Go to Nafath portal and match the code above to verify your registration.{"\n\n"}
                  <Text style={{ color: SECONDARY, fontWeight: '700' }}>Expires in {formatTime(timeLeft)}</Text>
                </Text>

                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: SECONDARY }]}
                  onPress={handleGoToNafath}
                >
                  <Text style={[styles.actionBtnText, { color: BACKGROUND }]}>Go to Nafath</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace('/(tabs)/dashboard')}>
                  <Text style={[styles.dashboardLink, { color: PRIMARY }]}>Go to Dashboard</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInUp.duration(600)} key="step2" style={styles.card}>
                <View style={[styles.iconCircle, { backgroundColor: SECONDARY + '15' }]}>
                  <Ionicons name="shield-checkmark-outline" size={60} color={SECONDARY} />
                </View>

                <Text style={styles.cardTitle}>Resend Code via Nafath</Text>
                <Text style={styles.cardDesc}>
                  Request a new Nafath authentication request to continue your registration verification process.
                </Text>

                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: SECONDARY }]}
                  onPress={() => router.replace({
                    pathname: '/resend-nafath',
                    params: { tpuRecId, transactionId, idNumber }
                  })}
                >
                  <Text style={[styles.actionBtnText, { color: BACKGROUND }]}>Resend Request</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace('/(tabs)/dashboard')}>
                  <Text style={[styles.dashboardLink, { color: PRIMARY }]}>Go to Dashboard</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

        </View>
      </SafeAreaView>

      {/* Warning/Success Modal Dialog */}
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
            <Text style={styles.warningDesc}>{warningDesc}</Text>
            
            <TouchableOpacity 
              style={[styles.tryAgainBtn, { backgroundColor: warningIconColor }]}
              onPress={onWarningAction}
            >
              <Text style={[styles.tryAgainText, { color: BACKGROUND }]}>{warningButtonText}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {(isChecking || (step === 1 && transId !== '')) && (
        <View style={styles.loadingOverlay}>
          <Animated.View entering={ZoomIn.duration(400)} style={styles.loaderCard}>
            <ActivityIndicator size="large" color={PRIMARY} style={{ marginBottom: 20 }} />
            
            {isChecking ? (
              <>
                <Text style={styles.loaderTitle}>Connecting...</Text>
                <Text style={styles.loaderDesc}>Initiating verification request with Nafath portal.</Text>
              </>
            ) : (
              <>
                <Text style={styles.loaderTitle}>Verifying Nafath</Text>
                <Text style={styles.loaderDesc}>
                  Please open the Nafath app, match the code below, and approve the request.
                </Text>
                
                <View style={styles.loaderNumberCircle}>
                  <Text style={[styles.loaderNumberText, { color: SECONDARY }]}>{nafathNumber}</Text>
                  <View style={[styles.loaderPulseRing, { borderColor: SECONDARY + '40' }]} />
                </View>

                <Text style={styles.loaderTimerText}>
                  Expires in <Text style={{ color: SECONDARY, fontWeight: '700' }}>{formatTime(timeLeft)}</Text>
                </Text>

                <TouchableOpacity 
                  style={[styles.loaderActionBtn, { backgroundColor: SECONDARY }]}
                  onPress={handleGoToNafath}
                >
                  <Text style={[styles.loaderActionBtnText, { color: BACKGROUND }]}>Go to Nafath</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 20 },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoBadge: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  brandName: { fontSize: 28, fontWeight: '900', color: WHITE, letterSpacing: -0.5 },
  flexCenter: { flex: 1, justifyContent: 'center' },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 35,
    padding: 35,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  numberCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 3,
    borderColor: BORDER,
  },
  numberText: { fontSize: 48, fontWeight: '900' },
  pulseRing: { position: 'absolute', width: 130, height: 130, borderRadius: 65, borderWidth: 2 },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  cardTitle: { fontSize: 24, fontWeight: '900', color: WHITE, marginBottom: 12, textAlign: 'center' },
  cardDesc: { fontSize: 15, color: TEXT_SECONDARY, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  actionBtn: { width: '100%', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: SECONDARY, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8, marginBottom: 20 },
  actionBtnText: { fontSize: 17, fontWeight: '900' },
  dashboardLink: { fontSize: 15, fontWeight: '800' },
  
  // Modal dialog styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  warningCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 35,
    padding: 35,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
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
    fontSize: 28,
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
  },
  tryAgainText: {
    fontSize: 18,
    fontWeight: '900',
  },
  
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 28, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: 30,
  },
  loaderCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 35,
    padding: 35,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  loaderTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: WHITE,
    marginBottom: 10,
    textAlign: 'center',
  },
  loaderDesc: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  loaderNumberCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: BORDER,
  },
  loaderNumberText: {
    fontSize: 44,
    fontWeight: '900',
  },
  loaderPulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  loaderTimerText: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginBottom: 25,
  },
  loaderActionBtn: {
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
  loaderActionBtnText: {
    fontSize: 17,
    fontWeight: '900',
  },
});
