import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  View,
  TextInput,
  Alert,
} from 'react-native';
import { reportQuestion } from '@/services/questionService';
import { useAuthStore } from '@/stores/authStore';

interface Props {
  questionId: string;
}

export function ReportButton({ questionId }: Props) {
  const [visible, setVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const userId = useAuthStore((s) => s.user?.id);

  const handleSubmit = async () => {
    if (!userId) return;
    setSubmitting(true);
    try {
      await reportQuestion(questionId, userId, reason);
      setVisible(false);
      setReason('');
      Alert.alert('報告を受け付けました', 'ご協力ありがとうございます。');
    } catch {
      Alert.alert('エラー', '報告に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>問題を報告</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>問題の報告</Text>
            <Text style={styles.subtitle}>問題に誤りや不適切な内容があればお知らせください</Text>
            <TextInput
              style={styles.input}
              placeholder="理由（任意）"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
            />
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setVisible(false)}>
                <Text style={styles.cancelText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, submitting && styles.disabled]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                <Text style={styles.submitText}>報告する</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: { padding: 6 },
  buttonText: { fontSize: 12, color: '#BDC3C7' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    width: '100%',
    gap: 12,
  },
  title: { fontSize: 17, fontWeight: '700', color: '#2C3E50' },
  subtitle: { fontSize: 13, color: '#7F8C8D' },
  input: {
    borderWidth: 1,
    borderColor: '#DDE3EE',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#2C3E50',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  cancelBtn: { padding: 10 },
  cancelText: { color: '#7F8C8D', fontSize: 14 },
  submitBtn: { backgroundColor: '#E74C3C', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  disabled: { opacity: 0.5 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
