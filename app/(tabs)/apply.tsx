import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";

const PRIMARY = "#10b981";
const SECONDARY = "#eab308";
const BACKGROUND = "#0a0f1c";
const CARD_BG = "#111827";
const WHITE = "#FFFFFF";
const TEXT_SECONDARY = "#94a3b8";

export default function ApplyScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Apply for Finance</Text>
          <View style={[styles.card, { borderColor: SECONDARY + '30' }]}>
            <Ionicons name="add-circle-outline" size={50} color={SECONDARY} />
            <Text style={styles.cardTitle}>New Application</Text>
            <Text style={styles.cardDesc}>Select the type of finance you need.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  content: { padding: 25, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: '900', color: WHITE, marginBottom: 20 },
  card: { backgroundColor: CARD_BG, borderRadius: 25, padding: 30, borderWidth: 1, alignItems: 'center' },
  cardTitle: { fontSize: 22, fontWeight: '800', color: WHITE, marginTop: 15 },
  cardDesc: { fontSize: 15, color: TEXT_SECONDARY, textAlign: 'center', marginTop: 10 },
});
