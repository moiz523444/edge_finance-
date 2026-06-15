import React from 'react';
import {
  SafeAreaView,
  ScrollView,
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
import Animated, { FadeInDown } from 'react-native-reanimated';

const PRIMARY = '#2E8B57'; // Edge Finance Green
const WHITE = '#ffffff';
const TEXT_MAIN = '#1f2937';
const TEXT_SECONDARY = '#64748b';

export default function SimahConsentScreen() {
  const router = useRouter();

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

        <View style={styles.content}>
          <Text style={styles.titleText}>SIMAH Consent</Text>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.delay(200)}>
              <Text style={styles.bodyText}>
                {"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n\n"}
                {"It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\n"}
                {"By accepting this consent form, you authorize the institution to access, inquire, and review your credit history records maintained by SIMAH (Saudi Credit Information Company) or any other relevant credit bureaus in the Kingdom.\n\n"}
                {"This authorization permits the compilation, review, and exchange of your financial records to assess your creditworthiness, verify active obligations, and maintain general credit history records. Your consent will remain valid throughout the duration of the finance application review and subsequent microfinance capital lifecycle."}
              </Text>
            </Animated.View>
          </ScrollView>

          {/* Footer Action */}
          <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.footer}>
            <TouchableOpacity 
              style={styles.actionBtn} 
              activeOpacity={0.8}
              onPress={() => router.push('/confirmation')}
            >
              <Text style={styles.actionBtnText}>Accept And Continue</Text>
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

  content: { flex: 1, paddingTop: 10 },
  titleText: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: TEXT_MAIN, 
    textAlign: 'center', 
    marginBottom: 25,
    paddingHorizontal: 20,
    textTransform: 'uppercase', // To give it that formal heading look
  },
  
  scrollView: { 
    flex: 1, 
    marginBottom: 20, 
    paddingHorizontal: 30,
  },
  bodyText: { 
    fontSize: 13, 
    color: TEXT_SECONDARY, 
    lineHeight: 22, 
    textAlign: 'justify',
    paddingBottom: 100, // Extra padding for footer space
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 34,
    backgroundColor: WHITE,
    // Add gradient/shadow to fade text below footer
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  actionBtn: { 
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: { 
    color: WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
});
