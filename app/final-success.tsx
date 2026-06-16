import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const PRIMARY = '#2E8B57'; // Edge Finance Green
const WHITE = '#ffffff';
const TEXT_MAIN = '#1f2937';
const TEXT_SECONDARY = '#64748b';

export default function FinalSuccessScreen() {
  const router = useRouter();

  const handleOk = () => {
    // Navigate to promissory note
    router.replace('/promissory-note');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* Header - Just Logo */}
        <View style={styles.header}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={{ width: 140, height: 40, resizeMode: 'contain' }} 
          />
        </View>

        <View style={styles.content}>
          
          <Animated.View entering={ZoomIn.duration(600).delay(100)} style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={60} color={WHITE} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.textContainer}>
            <Text style={styles.title}>Success</Text>
            <Text style={styles.subtitle}>
              Your application has been initiated and your application ID is: 10264
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.okBtn} 
              activeOpacity={0.8}
              onPress={handleOk}
            >
              <Text style={styles.okBtnText}>OK</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100, // Shift content slightly up
  },
  
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  buttonContainer: {
    width: '100%',
  },
  okBtn: { 
    width: '100%',
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  okBtnText: { 
    color: WHITE,
    fontSize: 16,
    fontWeight: "700",
  },
});
