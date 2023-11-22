import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import Constants from 'expo-constants';



export function setNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
  });
}

export default function Notification() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    null
  );
}

// Schedules notification for time (00:00) after current time
export async function scheduleTimedNotification(medName, time) {

  const timeSplit = time.split(':');
  const hours = Number(timeSplit[0])*60*60*1000;
  const minutes = Number(timeSplit[1])*60*1000;

  const notifTime = Date.now() + hours + minutes;

  console.log("Gets to timed notification function");

  Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to take your medicine!",
      body: medName,
      // sound: 'default',
    },
    trigger: {
      // hour: hours,
      // minute: minutes,
      date: notifTime,
      repeats: true,
    },
  })
  .then((id) => {
    console.log("notif id on scheduling: ", id)
  })
  .catch((error) => {
    console.log("Error getting schedule data: ", error);
  })
}

// Schedules weekly notification for weekday, time (00:00)(hour:minute)
export async function scheduleWeeklyNotification(medName, weekday, time, callback) {

  const timeSplit = time.split(':');
  const hours = Number(timeSplit[0]);
  const minutes = Number(timeSplit[1]);

  // WeeklyTriggerInput takes weekdays from 1-7 where 1 is Sunday
  const dayOfWeek = weekday + 1;

  console.log("Gets to weekly notification function");


  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to take your medicine!",
        body: "Medicine Name: ", medName,
        // sound: 'default',
      },
      trigger: {
        hour: hours,
        minute: minutes,
        weekday: dayOfWeek,
        repeats: true,
      },
    });
      console.log("notif id on scheduling: ", id)

      callback(id);
  } catch (error) {
    console.log("Error getting schedule data: ", error);
  }
}

// Immediate notification!!!
export function immediateNotification() {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "take your meds now lol",
      body: "take ur freaking medsss!!",
    },
    trigger: null,
  });
}


async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: true,
      lightColor: "#FF231F7C",
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }

  return token;
}

// Cancels notification given notification identifier
export async function cancelNotification(notifId){
  await Notifications.cancelScheduledNotificationAsync(notifId);
}

// Cancels all notifications
export async function cancelAllNotifications() {
  Notifications.getAllScheduledNotificationsAsync()
  .then((output) => {
    console.log(output);
  })
  await Notifications.cancelAllScheduledNotificationsAsync();
}










// export async function getExpoPushToken() {
//     const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
//     let finalStatus = existingStatus;

//     if (existingStatus !== 'granted') {
//         const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//         finalStatus = status;
//     }

//     if (finalStatus !== 'granted') {
//         alert('You need to enable notifications to receive alerts.');
//     } else {
//         // Get the expo projectId from your expo project configuration
//         const projectId = '6d0ea684-325e-4357-8d97-a81ef4dcff99'
//         console.log(projectId);

//         const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
//         console.log(token);
//         return token;
//     }
// }

// export async function sendExpoNotification(title, body) {

//     const pushToken = getExpoPushToken();
//     const notification = {
//         to: pushToken,
//         title: title,
//         body: body,
//     };

//     const response = await Notifications.sendPushNotificationsAsync(notification);

//     console.log("gets response")
//     if (response && response[0].status === 'ok') {
//         console.log('Notification sent successfully');
//     } else {
//         console.error('Failed to send notification');
//   }
// }


// export async function sendPushNotification(pushToken) {
//   const message = {
//     to: pushToken,
//     sound: 'default',
//     title: "default tieltel",
//     body: "bodydyd",
//     data: { someData: 'goes here' },
//   };

//   console.log("gets here")

//   await fetch('https://exp.host/--/api/v2/push/send', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Accept-encoding': 'gzip, deflate',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(message),
//   });
//   console.log("gets here tooo")
// }


// export function handleReceivedNotification(notification) {
//   console.log('Received notification:', notification);
//   // Your custom handling logic here
// }

// export function handleNotificationResponse(response) {
//   console.log('User responded to notification:', response);
//   // Your custom response handling logic here
// }

// export function setupNotificationListeners() {
//   Notifications.addNotificationReceivedListener(handleReceivedNotification);
//   Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
// }


// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });


// export { getExpoPushToken, sendExpoNotification, handleReceivedNotification, handleNotificationResponse, setupNotificationListeners };


// // Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
// async function sendPushNotification(expoPushToken) {
//   const message = {
//     to: expoPushToken,
//     sound: 'default',
//     title: 'Original Title',
//     body: 'And here is the body!',
//     data: { someData: 'goes here' },
//   };

//   await fetch('https://exp.host/--/api/v2/push/send', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Accept-encoding': 'gzip, deflate',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(message),
//   });
// }

// export async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     const projectId = '6d0ea684-325e-4357-8d97-a81ef4dcff99'
//     token = await Notifications.getExpoPushTokenAsync({
//       projectId: projectId,
//     });
//     console.log(token.data);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token.data;
// }

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log(response);
//     });

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener.current);
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Title: {notification && notification.request.content.title} </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//       </View>
//       <Button
//         title="Press to Send Notification"
//         onPress={async () => {
//           await sendPushNotification(expoPushToken);
//         }}
//       />
//     </View>
//   );
// }








// import * as Notifications from 'expo-notifications';
// import { sendPushNotification, registerForPushNotificationsAsync, handleReceivedNotification, handleNotificationResponse, setupNotificationListeners } from '../../notifs.js';



// export default function HomeScreen() {

//     const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: false,
//         shouldSetBadge: false,
//     }),
//     });

//     Notifications.scheduleNotificationAsync({
//         content: {
//             title: 'Look at that notification',
//             body: "I'm so proud of myself!",
//         },
//         trigger: null,
//         });



//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log(response);
//     });

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener.current);
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Title: {notification && notification.request.content.title} </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//       </View>
//       <Button
//         title="Press to Send Notification"
//         onPress={async () => {
//           await sendPushNotification(expoPushToken);
//         }}
//       />
//     </View>
//   );

// }
