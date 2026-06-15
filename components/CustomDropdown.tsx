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

const PRIMARY = "#2E8B57";
const WHITE = "#ffffff";
const TEXT_MAIN = "#1f2937";
const TEXT_SECONDARY = "#64748b";
const BORDER_COLOR = "#cbd5e1";

interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  label?: string; // made optional
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
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TouchableOpacity
        style={styles.dropdownContainer}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownText, !selectedOption && { color: "#94a3b8" }]}>
          {selectedOption ? selectedOption.label : placeholder}
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
                <View style={styles.modalContent}>
                  <View style={styles.dragPill} />
                  
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{label || "Select Option"}</Text>
                    <TouchableOpacity 
                      onPress={() => setModalVisible(false)}
                      style={styles.closeBtn}
                    >
                      <Ionicons name="close" size={20} color={TEXT_MAIN} />
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
                          <Ionicons name="checkmark" size={20} color={PRIMARY} />
                        )}
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
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
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "600",
  },
  dropdownContainer: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "400",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContentWrapper: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    maxHeight: "80%",
    backgroundColor: WHITE,
  },
  modalContent: {
    padding: 24,
    paddingTop: 12,
    backgroundColor: WHITE,
  },
  dragPill: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#e2e8f0",
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
    color: TEXT_MAIN,
    fontSize: 18,
    fontWeight: "700",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  optionItemSelected: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    marginVertical: 4,
  },
  optionText: {
    color: TEXT_SECONDARY,
    fontSize: 15,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: PRIMARY,
    fontWeight: "700",
  },
});
