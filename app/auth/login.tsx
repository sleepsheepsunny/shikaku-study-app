import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/services/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setErrorMsg('メールアドレスとパスワードを入力してください。');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('パスワードは6文字以上で入力してください。');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // autoconfirm enabled → session immediately available
        if (data.session) {
          router.replace('/');
        } else {
          setSuccessMsg('登録完了！ログインしてください。');
          setIsRegister(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace('/');
      }
    } catch (e: any) {
      console.error('[Auth] error:', e);
      // Show readable Japanese error messages
      const msg: string = e.message ?? '';
      if (msg.includes('Invalid login credentials')) {
        setErrorMsg('メールアドレスまたはパスワードが間違っています。');
      } else if (msg.includes('Email not confirmed')) {
        setErrorMsg('メールアドレスの確認が完了していません。');
      } else if (msg.includes('User already registered')) {
        setErrorMsg('このメールアドレスは既に登録されています。ログインしてください。');
        setIsRegister(false);
      } else if (msg.includes('Password should be')) {
        setErrorMsg('パスワードは6文字以上で入力してください。');
      } else {
        setErrorMsg(msg || '不明なエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>資格マスター</Text>
        <Text style={styles.subtitle}>{isRegister ? '新規登録' : 'ログイン'}</Text>

        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          value={email}
          onChangeText={(v) => { setEmail(v); setErrorMsg(null); }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="パスワード（6文字以上）"
          value={password}
          onChangeText={(v) => { setPassword(v); setErrorMsg(null); }}
          secureTextEntry
        />

        {errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
        {successMsg && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>{isRegister ? '登録する' : 'ログイン'}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setIsRegister(!isRegister); setErrorMsg(null); setSuccessMsg(null); }}>
          <Text style={styles.switchText}>
            {isRegister ? '既にアカウントをお持ちの方はこちら' : '新規登録はこちら'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.guestText}>ゲストとして続ける（問題生成は使えません）</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' },
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 14 },
  title: { fontSize: 32, fontWeight: '900', color: '#4A90D9', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 18, fontWeight: '700', color: '#2C3E50', textAlign: 'center', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
    color: '#2C3E50',
  },
  errorBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  errorText: { color: '#C0392B', fontSize: 14 },
  successBox: {
    backgroundColor: '#EAFAF1',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  successText: { color: '#1E8449', fontSize: 14 },
  button: {
    backgroundColor: '#4A90D9',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  switchText: { textAlign: 'center', color: '#4A90D9', fontSize: 14, marginTop: 4 },
  guestText: { textAlign: 'center', color: '#BDC3C7', fontSize: 13, marginTop: 4 },
});
