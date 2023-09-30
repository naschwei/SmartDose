import * as React from 'react';
import { View, Text } from 'react-native';

// imports for navigation tab
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingsScreen from './screens/SettingsScreen';
import DetailsScreen from '../navigation/screens/DetailsScreen';
import HomeScreen from '../navigation/screens/HomeScreen';

// screen names
const settingsName = 'Settings';
const detailsName = 'Details';
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
                        } else if (rn === detailsName) {
                            iconName = focused ? 'list' : 'list-outline'
                        } else if (rn === settingsName) {
                            iconName = focused ? 'settings' : 'settings-outline'
                        }

                        return <Ionicons name={iconName} size={size} color={color}/>
                    }
                })}
                tabBarOptions={{
                    activeTintColor: 'purple',
                    inactiveTintColor: 'grey',
                    labelStyle: { paddingBottom: 0, fontSize: 10 },
                    style: { padding: 20, height: 70 }
                }}
            >

            <Tab.Screen name={homeName} component={HomeScreen}/>
            <Tab.Screen name={detailsName} component={DetailsScreen}/>
            <Tab.Screen name={settingsName} component={SettingsScreen}/>

            </Tab.Navigator>
        </NavigationContainer>
    )
}