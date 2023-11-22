import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Button } from 'react-native';
import {StatusBar} from 'expo-status-bar';

import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';


import {
    Colors,
    InnerContainer,
    StyledButton,
    ButtonText,
    StyledButtonRefresh,
    Avatar
} from './../../components/styles';

const {primary, tertiary, brand, darkLight} = Colors;

import Card from './../../components/card';

import { auth, db } from "../../firebase.js"

import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs } from "firebase/firestore"; 

import { useNavigation } from '@react-navigation/native';


import * as Notifications from 'expo-notifications';
import { setNotifications, immediateNotification, cancelAllNotifications } from '../../notifs.js';



export default function HomeScreen() {

    const [userMedications, setUserMedications] = useState([]);

    const navigation = useNavigation()

    const handleSignOut = () => {
        signOut(getAuth(),)
        .then(() => {
            navigation.replace("Login");
            console.log('Logged out');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    }

    // for possible refresh button?
    const getDailyMedications = () => {
        // where 0 refers to sunday, 1 refers to monday, 2 to tuesday, ... etc.
        const d = new Date();
        const day = d.getDay();
        console.log(day);

        const user = auth.currentUser;
        const medications = [];

        db.collection("sched").where("user", "==", user.uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().dayOfWeek === day) {
                    medications.push(doc.data());
                }
            });
            console.log(medications);
            setUserMedications(medications);
        })
        .catch((error) => {
            console.log("Error getting schedule data: ", error);
        })
    }

    useEffect(() => {

        getDailyMedications();

    }, []);



    return (
        // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{flex: 1, backgroundColor: "#FFF"}}>
            <>
            <StatusBar style="light" />
            <View style={{
                    backgroundColor: "#CBC3E3",
                    height:"35%",
                    borderBottomLeftRadius:20,
                    borderBottomRightRadius:20,
                    paddingHorizontal:20
            }}
            >
                <View style={{
                   flexDirection:"row",
                   alignItems:"center",
                   marginTop:25,
                   width:"100%"
               }}>
                    <View style={{width:"50%"}}>
                        <Text style={{
                            fontSize:28,
                            color:"#FFF",
                            fontWeight:"bold",
                        }}>Welcome { getAuth().currentUser?.displayName }</Text>
                        <Text style={{
                            fontSize:14,
                            color:"#FFF",
                            fontWeight:"bold",
                        }}>Email: { getAuth().currentUser?.email }</Text>
                    </View>
                    <View style={{width:"45%",alignItems:"flex-end"}}>
                        <Avatar resizeMode="cover" source={require('./../../assets/smart_dose_logo.png')} />
                    </View>
                </View>
                <View style={{ flexDirection:"row",
                                justifyContent: "space-between",  
                                alignItems: "center" }}>
                    <StyledButton onPress={handleSignOut}>
                            <ButtonText> Logout </ButtonText>
                    </StyledButton>
                    <StyledButtonRefresh onPress={getDailyMedications}>
                            <ButtonText> Refresh </ButtonText>
                    </StyledButtonRefresh>
                </View>
            </View>
            
            <InnerContainer>
                {userMedications.map(med => 
                    <View style= {styles.cardContainer}>
                        <View style={styles.cardContent}> 
                            <Text style={styles.titleStyle}> {med.medicationName} </Text>
                            <Text> {med.pillQuantity} pills</Text>
                            <Text> {med.dispenseTime} </Text>
                            <Ionicons name="checkmark-circle-outline" size={50} iconColor="#5F8575" style={{ position: 'absolute', right: 0 }}/>
                        </View>
                    </View>
                )}
            </InnerContainer>
            </>
        </View>
    );
}


const deviceWidth = Math.round(Dimensions.get('window').width);

const styles=StyleSheet.create({
    cardContainer: {
        width: deviceWidth - 20,
        height: 100,
        backgroundColor: "#fff",
        elevation: 3, 
        borderRadius: 20,
        shadowColor: '#333',
        shadowOffset: { width: 2, height: 2, }, 
        shadowOpacity: 0.3,
        shadowRadius: 3,
        marginHorizontal: 4,
        marginVertical: 6
    },
    titleStyle: {
        fontSize: 20,
        fontWeight: '800',
    },
    cardContent: {
        marginHorizontal: 18,
        marginVertical: 10
    }
})


//export default Welcome;