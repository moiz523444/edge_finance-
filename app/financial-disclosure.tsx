import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PRIMARY = '#10b981'; // Emerald
const SECONDARY = '#eab308'; // Amber
const BACKGROUND = '#0a0f1c';
const WHITE = '#FFFFFF';
const TEXT_SECONDARY = '#94a3b8';

export default function FinancialDisclosureScreen() {
  const router = useRouter();

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

          <Text style={styles.titleText}>Accurate Financial Disclosure</Text>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
            <Animated.View entering={FadeInDown.delay(200)}>
              <Text style={styles.bodyText}>
                {"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n\n"}
                {"It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\n"}
                {"By accepting this disclosure, you confirm that all financial data, incomes, expenses, obligations, and employment details provided in this application are true, accurate, and complete. Any misrepresentation or omission may result in immediate rejection of the finance facility, legal liabilities, or blacklisting by credit regulators in accordance with regulatory laws.\n\n"}
                {"Please ensure that you have declared all active loans, credit card balances, domestic worker wages, and family maintenance commitments. The institution reserves the right to verify the declared data with government agencies, SIMAH, and your employer directly before final disbursal of the microfinance capital."}
              </Text>
            </Animated.View>
          </ScrollView>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: SECONDARY }]} 
            onPress={() => router.push('/simah-consent')}
          >
            <Text style={[styles.actionBtnText, { color: BACKGROUND }]}>Accept And Continue</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 20 },
  logoSection: { alignItems: 'center', marginBottom: 30 },
  logoBadge: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  brandName: { fontSize: 28, fontWeight: '900', color: WHITE, letterSpacing: -0.5 },
  titleText: { fontSize: 24, fontWeight: '800', color: WHITE, textAlign: 'center', marginBottom: 25 },
  scrollView: { flex: 1, marginBottom: 20, paddingRight: 10 },
  bodyText: { fontSize: 14, color: TEXT_SECONDARY, lineHeight: 24, textAlign: 'justify' },
  actionBtn: { height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: SECONDARY, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8, marginBottom: 20 },
  actionBtnText: { fontSize: 17, fontWeight: '900', letterSpacing: 0.5 },
});
