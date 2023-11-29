import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Button, TouchableOpacity } from 'react-native';
import {StatusBar} from 'expo-status-bar';
import moment from "moment";

import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';

import { Agenda } from "react-native-calendars";
import AgendaCard from './../../components/agendaCard';

import {
    Colors,
    InnerContainer,
    StyledButton,
    ButtonText,
    StyledButtonRefresh,
    StyledButtonTODAY
} from './../../components/styles';

const {primary, tertiary, brand, darkLight} = Colors;

import Card from './../../components/card';

import { auth, db } from "../../firebase.js"

import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs } from "firebase/firestore"; 

import { useNavigation } from '@react-navigation/native';


import * as Notifications from 'expo-notifications';
import { setNotifications, immediateNotification, cancelAllNotifications } from '../../notifs.js';

// NEW: This stuff is to add conditional rendering so that the cards only show up on the correct day (ie. TODAY)
function MedicationCard () { 
    return (
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
    );
}
class MedCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            pillQuantity: props.pillQuantity,
            dosgeTime: props.dosageTime,
            scheduledDay: props.dayOfWeek
        }
    }
    render() {
        const today_day_of_week = moment().format('dddd'); ;
        return this.state.dayOfWeek === today_day_of_week ? <MedicationCard/> : null;
    }
}

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
        <View style={{flex: 1, backgroundColor: "#FFF"}}>
            <>
            <StatusBar style="light" />
            <View style={{
                    backgroundColor: "#CBC3E3",
                    height:"25%",
                    borderBottomLeftRadius:20,
                    borderBottomRightRadius:20,
                    paddingHorizontal:20
            }}
            >
                <View style={{
                   alignItems:"center",
                   marginTop:25,
                   width:"100%", 
               }}>
                    <View style = {{alignItems: "center"}}>
                        <Text style={{
                            fontSize:20,
                            color: brand,
                            fontWeight:"bold",
                            textAlign: "center"
                        }}>Welcome { getAuth().currentUser?.displayName } !</Text>
                        <Text style={{
                            fontSize:14,
                            color:"#000",
                            fontWeight:"bold",
                            textAlign: "center"
                        }}>Email: { getAuth().currentUser?.email }</Text>
                    </View>
                </View>
                <View style={{alignItems:"center"}}>
                    <StyledButtonRefresh onPress={getDailyMedications}>
                            <ButtonText> Refresh Page </ButtonText>
                    </StyledButtonRefresh>
                </View>
            </View>
            
            <View>
                <StyledButtonTODAY onPress={() => alert('SimpleButtonPressed')}> 
                    <Text style={{fontSize:16,
                                color:"#FFF",
                                fontWeight:"bold",
                                textAlign: "center"
                    }}>
                        TODAY 
                    </Text>
                </StyledButtonTODAY>
                <MedCard/>
            </View>
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