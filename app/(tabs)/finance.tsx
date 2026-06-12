import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const PRIMARY = "#10b981";
const SECONDARY = "#eab308";
const BACKGROUND = "#0a0f1c";
const CARD_BG = "#111827";
const WHITE = "#FFFFFF";
const TEXT_SECONDARY = "#94a3b8";

export default function FinanceScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Finance</Text>
          <Animated.View entering={FadeInDown.duration(600)} style={[styles.card, { borderColor: PRIMARY + '30' }]}>
            <Ionicons name="wallet-outline" size={40} color={PRIMARY} />
            <Text style={styles.cardTitle}>Your Financial Summary</Text>
            <Text style={styles.cardDesc}>Track your loans and installments here.</Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  content: { padding: 25, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: '900', color: WHITE, marginBottom: 20 },
  card: { backgroundColor: CARD_BG, borderRadius: 25, padding: 25, borderWidth: 1, alignItems: 'center' },
  cardTitle: { fontSize: 20, fontWeight: '800', color: WHITE, marginTop: 15 },
  cardDesc: { fontSize: 14, color: TEXT_SECONDARY, textAlign: 'center', marginTop: 10 },
});
