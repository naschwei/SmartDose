import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Button, TouchableOpacity } from 'react-native';
import {StatusBar} from 'expo-status-bar';
import moment from "moment";
import Modal from 'react-native-modal';

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
// import DatePicker from 'react-native-modern-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { auth, db } from "../../firebase.js"

import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs } from "firebase/firestore"; 

import { useNavigation } from '@react-navigation/native';

import * as Notifications from 'expo-notifications';
import { setNotifications, immediateNotification, cancelAllNotifications } from '../../notifs.js';

//import { format, isBefore, isAfter } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

const sendPillData = async (nearPillACount, farPillBCount) => {
    try {
        const response = await fetch(`http://10.0.0.219/?nearPillACount=${nearPillACount}&farPillBCount=${farPillBCount}`);
        const responseData = await response.text();
        console.log(responseData); // Log the response for debugging
    } catch (error) {
        console.error("Error sending pill data:", error);
    }
};

export default function HomeScreen() {

    const [userMedications, setUserMedications] = useState([]);
    const navigation = useNavigation()

    const handleRefresh = () => {
        // Example pill counts, replace with actual values as needed
        const nearPillACount = 1; // Replace with actual count
        const farPillBCount = 2; // Replace with actual count

        sendPillData(nearPillACount, farPillBCount);
    };

    // TODO: order based on start and end dates also, if within range then...
    const getDailyMedications = () => {
        // where 0 refers to sunday, 1 refers to monday, 2 to tuesday, ... etc.
        const day = date.getDay();
        console.log(day);

        // to compare start and end dates with
        // const currentDate = new Date();

        const user = auth.currentUser;
        let medications = [];

        let startDate, endDate;

        let toAdd;
        let dispenseTimeTemp;

        db.collection("sched").where("user", "==", user.uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().dayOfWeek === day) {
                    // TODO :: test if this works

                    const estTimeZone = 'America/New_York';

                    const startDateEST = utcToZonedTime(doc.data().startDate.toDate(), estTimeZone);
                    const endDateEST = utcToZonedTime(doc.data().endDate.toDate(), estTimeZone);
                    const currentDateUTC = zonedTimeToUtc(date, "UTC");
                    const currentDateEST = utcToZonedTime(currentDateUTC, estTimeZone);

                    const starttemp = new Date(startDateEST).setHours(0, 0, 0, 0);
                    const endtemp = new Date(endDateEST).setHours(0, 0, 0, 0);
                    const currenttemp = new Date(currentDateEST).setHours(0, 0, 0, 0);

                    console.log(startDateEST);
                    console.log(endDateEST);
                    console.log(starttemp);
                    console.log(endtemp);
                    console.log(currenttemp);


                    if (starttemp <= currenttemp && endtemp >= currenttemp) {


                        const dispenseTimeEST = utcToZonedTime(doc.data().dispenseTime.toDate(), estTimeZone);

                        dispenseTimeTemp = new Date(dispenseTimeEST).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })

                        console.log("getting here");
                        toAdd = {medicationName: doc.data().medicationName,
                            pillQuantity: doc.data().pillQuantity,
                            dispenseTime: dispenseTimeTemp}
                        medications.push(toAdd);
                        console.log(toAdd);
                        
                    }
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
    }, [date]);


    // MEDCARDS - CALENDAR TOGGLE
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [text, setText] = useState("TODAY");
    const [showRevert, setShowRevert] = useState(false);

    function handleShow() {
        setShow(true);
    }

    function handleChange(e, selectedDate) {
        setDate(selectedDate);
        setShow(false);

        var today_date = new Date().getDate();
        var today_month = new Date().getMonth() + 1;
        var today_year = new Date().getFullYear();

        if (selectedDate.getDate() === today_date && (selectedDate.getMonth() + 1) === today_month && selectedDate.getFullYear() === today_year) {
            setText("TODAY");
            setShowRevert(false);
        }
        else {
            setShowRevert(true);
            let fDate = (selectedDate.getMonth() + 1) + '/' +  selectedDate.getDate() + '/' + selectedDate.getFullYear();
            setText(fDate);
        }
    }

    function handleRevert() {
        setDate(new Date());
        setText("TODAY");
        setShowRevert(false); 
    }

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
                    <StyledButtonRefresh onPress={handleRefresh}>
                            <ButtonText> Refresh Page </ButtonText>
                    </StyledButtonRefresh>
                    <Text style={{margin: 5, marginBottom: 20, fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>Refresh page to update!</Text>
                </View>
            </View>
            
            <View style = {{
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                <View style = {{
                    alignItems: 'center',
                    flexDirection: 'row'
                }}> 
                    <StyledButtonTODAY onPress={handleShow}> 
                        <Text style={{fontSize:16,
                                    color:"#FFF",
                                    fontWeight:"bold",
                                    textAlign: "center"
                        }}>
                            {text} 
                        </Text>
                    </StyledButtonTODAY>
                    
                    {
                        showRevert &&  (          
                            <Button
                                onPress={handleRevert}
                                title="Back to Today"
                                color={brand}
                                accessibilityLabel="Learn more about this purple button"
                            /> 
                        )
                    }
                </View>

                {
                    show && (
                        <DateTimePicker 
                            ref={(ref) => (this.datePicker = ref)}
                            mode='date'
                            value={date}
                            onChange={handleChange} 
                            />
                    )
                }

                <InnerContainer>
                    {userMedications.map(med => 
                        <View style= {styles.cardContainer}>
                            <View style={styles.cardContent}>
                                <Text style={styles.titleStyle}> {med.medicationName} </Text>
                                <View style={styles.infoContainer}> 
                                <Text style={{fontSize: 20}}> {med.pillQuantity} pill(s) at</Text>
                                <Text style={{textAlign: 'right', fontSize: 20}}> {med.dispenseTime} </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </InnerContainer>
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
        justifyContent: 'center',
        alignItmes:'center',
        flexDirection: 'row',
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
        fontSize: 25,
        fontWeight: 'bold',
    },
    cardContent: {
        marginHorizontal: 18,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row'
    }
})


//export default Welcome;