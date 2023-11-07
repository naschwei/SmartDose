import * as React from 'react';
import { Button } from 'react-native';
import { IconButton } from 'react-native-paper';

// imports for navigation tab
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingsScreen from './screens/SettingsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ManageScreen from './screens/ManageScreen';
import HomeScreen from './screens/HomeScreen';
import Login from './screens/Login';
import Signup from './screens/Signup';

import {Colors} from '../components/styles';
const {primary, tertiary} = Colors;

// screen names
const settingsName = 'Settings';
const historyName = 'History';
const manageName = 'Manage Medication';
const homeName = 'Home';
const photoName = 'Photo Library';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainContainer() {
    return (
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

        <Tab.Screen name={homeName} component={HomeScreen} 
                    options=
                    {{ 
                        headerTitle:'SmartDose', 
                        headerStyle: {backgroundColor: "#6D28D9"}, 
                        headerTintColor: 'white', 
                        headerTitleStyle: {fontSize: 25}, 
                        headerRight: () => (
                            <IconButton
                                icon="refresh"
                                iconColor="#FFF"
                                size={40}
                                onPress={() => alert("This will REFRESH the screen. Are you sure you want to REFRESH?")}
                            />
                        )
                    }}
        />
        <Tab.Screen name={manageName} component={ManageScreen} options={{ headerTitle:'SmartDose', headerStyle: {backgroundColor: "#6D28D9"}, headerTintColor: 'white', headerTitleStyle: {fontSize: 25}}}/> 
        <Tab.Screen name={historyName} component={HistoryScreen} options={{ headerTitle:'SmartDose', headerStyle: {backgroundColor: "#6D28D9"}, headerTintColor: 'white', headerTitleStyle: {fontSize: 25}}}/>
        <Tab.Screen name={settingsName} component={SettingsScreen} options={{ headerTitle:'SmartDose', headerStyle: {backgroundColor: "#6D28D9"}, headerTintColor: 'white', headerTitleStyle: {fontSize: 25}}}/>

        </Tab.Navigator>
    )
}

function Authenticate() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false, 
                    headerLeft: null,
                }}
                initialRouteName="Login"
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Home" component={MainContainer} options={{headerShown:false}}/>
            </Stack.Navigator> 
        </NavigationContainer>
    )
}

export default Authenticate;