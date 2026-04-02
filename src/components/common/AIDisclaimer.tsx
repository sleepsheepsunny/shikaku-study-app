import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function AIDisclaimer() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🤖</Text>
      <Text style={styles.text}>この問題はAIが生成したものです</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F3FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  icon: { fontSize: 12 },
  text: { fontSize: 11, color: '#7F8C8D', fontWeight: '500' },
});
