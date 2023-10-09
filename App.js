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

// // import { StatusBar } from 'expo-status-bar';
// // import { StyleSheet, Text, View } from 'react-native';
// // import Login from './navigation/screens/Login';
// // import Signup from './navigation/screens/Signup';
// // import { useEffect, useState } from "react";
// // import * as React from 'react';
// // import Authenticate from './navigation/Authenticate';
// // import * as WebBrowser from "expo-web-browser";
// // import * as Google from 'expo-auth-session/providers/google'
// // import AsyncStorage from "@react-native-async-storage/async-storage"
// // import { Button } from 'react-native-elements';



// // web 171965448512-00ha3plt9uofv92ctl9ao98jpr69cfc5.apps.googleusercontent.com
// // ios 171965448512-6ooeu2ap71ucs0q77gpp8ahljbt4gfav.apps.googleusercontent.com
// // TODO: (keyboard avoiding wrapper) https://youtu.be/tZVKk-V0Xko?si=EnhApZOt76oShmwN


// export default function WelcomeScreen() {
//   return (
//     <ScreenWrapper>
//       <View className="h-full flex justify-around">
//         <View className="flex-row justify-center mt-10">
//             <Image source={require('./assets/icon.png')} className="h-96 w-96 shadow" />
//         </View>
//         <View className="mx-5 mb-20">
//             <Text className={`text-center font-bold text-4xl ${colors.heading} mb-10`}>Expensify</Text>
            
//             <TouchableOpacity onPress={()=> navigation.navigate('SignIn')} className="shadow p-3 rounded-full mb-5" style={{backgroundColor: colors.button}}>
//                 <Text className="text-center text-white text-lg font-bold">Sign In</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={()=> navigation.navigate('SignUp')} className="shadow p-3 rounded-full mb-5" style={{backgroundColor: colors.button}}>
//                 <Text className="text-center text-white text-lg font-bold">Sign Up</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={()=> signIn()} className="shadow p-3 rounded-full bg-white" >
//               <View className="flex-row justify-center items-center space-x-3">
//                 <Image source={require('./assets/googleIcon.png')} className="h-8 w-8" />
//                 <Text className="text-center text-gray-600 text-lg font-bold">Sign In with Google</Text>
//               </View>
                
//             </TouchableOpacity>
//         </View>
//       </View>
//     </ScreenWrapper>
//   )
// }

// export const colors = {
//   heading: 'text-gray-700',
//   button: '#50C878'
// }
// export const categoryBG = {
//   food: '#E1D3EE',
//   commute: '#B0E3D3',
//   shopping: '#EcFAD7',
//   entertainment: '#ffdfdd',
//   other: '#CAD309'
// }

