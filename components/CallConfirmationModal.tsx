import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

const PRIMARY = '#2E8B57'; // Edge Finance Green
const WHITE = '#ffffff';
const TEXT_MAIN = '#1f2937';
const TEXT_SECONDARY = '#64748b';

interface CallConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onCallNow: () => void;
}

export default function CallConfirmationModal({ visible, onClose, onCallNow }: CallConfirmationModalProps) {
  const router = useRouter();

  const handleGoToDashboard = () => {
    onClose();
    router.replace('/(tabs)/dashboard');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={48} color={PRIMARY} />
          </View>

          <Text style={styles.title}>Call Confirmation</Text>
          <Text style={styles.description}>
            By clicking on "call now" button you will receive a call to confirm the loan application.
          </Text>

          <TouchableOpacity 
            style={styles.callBtn} 
            activeOpacity={0.8}
            onPress={onCallNow}
          >
            <Text style={styles.callBtnText}>Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dashboardLink} 
            activeOpacity={0.8}
            onPress={handleGoToDashboard}
          >
            <Text style={styles.dashboardLinkText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: WHITE,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: PRIMARY,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  callBtn: { 
    width: '100%',
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  callBtnText: { 
    color: WHITE,
    fontSize: 16,
    fontWeight: "700",
  },
  dashboardLink: {
    paddingVertical: 10,
  },
  dashboardLinkText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  },
});
