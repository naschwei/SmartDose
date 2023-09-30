import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';

// TODO: https://youtu.be/tZVKk-V0Xko?si=EnhApZOt76oShmwN
// TODO: https://youtu.be/OGRR79IIW7g?si=hn-zqxY99oVgl8BD 

export default function App() {
  return (
    <Login />
    //<Signup />
    //<Welcome />
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


