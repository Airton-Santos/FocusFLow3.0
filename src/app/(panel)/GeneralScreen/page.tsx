import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import BottomTabs from '@/src/app/BottomTabs';




export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BottomTabs />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D29',
    padding: 20,
  },
});