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
    <Text>Push Notifications Test App</Text>
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
        body: ("Medicine Name: ", medName),
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

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

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
    console.log('token', token);
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
  
  // if (Platform.OS === 'ios') {
  //   const { status } = await Notifications.requestPermissionsAsync();
  //   if (status !== 'granted') {
  //     alert('Permission not granted');
  //     return;
  //   }
  // }


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
  .then(() => {
    Notifications.cancelAllScheduledNotificationsAsync();
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  })
}

//export default Notification;
