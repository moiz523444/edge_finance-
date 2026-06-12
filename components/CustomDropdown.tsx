import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const PRIMARY = "#10b981"; // Emerald
const SECONDARY = "#eab308"; // Gold/Orange Theme
const BACKGROUND = "#0a0a0f";
const CARD_BG = "#111827";
const GLASS = "rgba(255,255,255,0.07)";
const BORDER_COLOR = "rgba(255,255,255,0.1)";

interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onSelect: (val: string) => void;
  placeholder?: string;
}

export default function CustomDropdown({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
}: CustomDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((o) => o.value === selectedValue);

  const handleSelect = (val: string) => {
    onSelect(val);
    setModalVisible(false);
  };

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownContainer}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownText, !selectedOption && { color: "#64748b" }]}>
          {selectedOption ? selectedOption.label : selectedValue || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#94a3b8" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContentWrapper}>
                <LinearGradient
                  colors={[CARD_BG, "#0f172a"]}
                  style={styles.modalContent}
                >
                  <View style={styles.dragPill} />
                  
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{label}</Text>
                    <TouchableOpacity 
                      onPress={() => setModalVisible(false)}
                      style={styles.closeBtn}
                    >
                      <Ionicons name="close" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>

                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.optionItem,
                        selectedValue === item.value && styles.optionItemSelected,
                      ]}
                      onPress={() => handleSelect(item.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedValue === item.value && styles.optionTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {selectedValue === item.value && (
                        <Ionicons name="checkmark" size={20} color={SECONDARY} />
                      )}
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  showsVerticalScrollIndicator={false}
                />
                </LinearGradient>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "700",
  },
  dropdownContainer: {
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    borderWidth: 1.5,
    borderColor: GLASS,
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: "#fff",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContentWrapper: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    maxHeight: "80%",
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    borderLeftWidth: 1,
    borderLeftColor: BORDER_COLOR,
    borderRightWidth: 1,
    borderRightColor: BORDER_COLOR,
  },
  modalContent: {
    padding: 24,
    paddingTop: 12,
  },
  dragPill: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: GLASS,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: GLASS,
  },
  optionItemSelected: {
    backgroundColor: "rgba(234, 179, 8, 0.08)",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: SECONDARY,
    marginVertical: 4,
  },
  optionText: {
    color: "#cbd5e1",
    fontSize: 16,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: SECONDARY,
    fontWeight: "800",
  },
});
