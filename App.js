import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './navigation/screens/Login';
import Signup from './navigation/screens/Signup';
import * as React from 'react';
import Authenticate from './navigation/Authenticate';

// TODO: (keyboard avoiding wrapper) https://youtu.be/tZVKk-V0Xko?si=EnhApZOt76oShmwN

export default function App() {
  return (
    <Authenticate/>
  );
}

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/


