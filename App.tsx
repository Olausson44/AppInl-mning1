import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics'

export default function App() {
  return (
    <View style={[styles.container, {backgroundColor: 'blue'}]}>
      <Text>Hello, World!</Text>
      <Pressable style={styles.button} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}>
        <Text>Klicka mig!</Text></Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button:{
    backgroundColor: '#46e91e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9,
    marginTop: 20,
  }
});
