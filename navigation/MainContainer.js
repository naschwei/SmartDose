import * as React from 'react';
import { View, Text } from 'react-native';

// imports for navigation tab
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingsScreen from './screens/SettingsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ManageScreen from './screens/ManageScreen';
import HomeScreen from '../navigation/screens/HomeScreen';

// screen names
const settingsName = 'Settings';
const historyName = 'History';
const manageName = 'Manage Medication';
const homeName = 'Home';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;
                        let rn = route.name;

                        if (rn === homeName) {
                            iconName = focused ? 'home' : 'home-outline'
                        } else if (rn === historyName) {
                            iconName = focused ? 'bar-chart' : 'bar-chart-outline'
                        } else if (rn === settingsName) {
                            iconName = focused ? 'settings' : 'settings-outline'
                        } else if (rn === manageName) {
                            iconName = focused ? 'add-circle' : 'add-circle-outline' 
                        }

                        return <Ionicons name={iconName} size={size} color={color}/>
                    }
                })}
                tabBarOptions={{
                    activeTintColor: "#6D28D9", 
                    inactiveTintColor: 'grey',
                    labelStyle: { paddingBottom: 0, fontSize: 10 },
                    style: { padding: 20, height: 100 },
                    title: 'ugh'
                }}
                headerStyle= {{
                    backgroundColor: "#6D28D9",
                    fontWeight: 'bold',
                    fontSize: 100
                }}
            >

            <Tab.Screen name={homeName} component={HomeScreen} options={{ headerTitle:'SmartDose', headerStyle: {backgroundColor: "#6D28D9"}, headerTintColor: 'white', headerTitleStyle: {fontSize: 25}}}/>
            <Tab.Screen name={manageName} component={ManageScreen} options={{ headerTitle:'SmartDose', headerStyle: {backgroundColor: "#6D28D9"}, headerTintColor: 'white', headerTitleStyle: {fontSize: 25}}}/> 
            <Tab.Screen name={historyName} component={HistoryScreen} options={{ headerTitle:'SmartDose', headerStyle: {backgroundColor: "#6D28D9"}, headerTintColor: 'white', headerTitleStyle: {fontSize: 25}}}/>
            <Tab.Screen name={settingsName} component={SettingsScreen} options={{ headerTitle:'SmartDose', headerStyle: {backgroundColor: "#6D28D9"}, headerTintColor: 'white', headerTitleStyle: {fontSize: 25}}}/>

            </Tab.Navigator>
        </NavigationContainer>
    )
}