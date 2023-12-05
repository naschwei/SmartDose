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

// NEW: This stuff is to add conditional rendering so that the cards only show up on the correct day (ie. TODAY)
// function MedicationCard () { 
//     return (
//     <InnerContainer>
//         {userMedications.map(med => 
//             <View style= {styles.cardContainer}>
//                 <View style={styles.cardContent}>
//                     <Text style={styles.titleStyle}> {med.medicationName} </Text>
//                     <Text> {med.pillQuantity} pills</Text>
//                     <Text> {med.dispenseTime} </Text>
//                     <Ionicons name="checkmark-circle-outline" size={50} iconColor="#5F8575" style={{ position: 'absolute', right: 0 }}/>
//                 </View>
//             </View>
//         )}
//     </InnerContainer>
//     );
// }

// class MedCard extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             name: props.name,
//             pillQuantity: props.pillQuantity,
//             dosgeTime: props.dosageTime,
//             scheduledDay: props.dayOfWeek
//         }
//     }
//     render() {
//         const today_day_of_week = moment().format('dddd'); ;
//         return this.state.dayOfWeek === today_day_of_week ? <MedicationCard/> : null;
//     }
// }

// class DisplayRevertDate extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             isCurrentDay: true
//         }
//     }

//     render() {
//         return this.state.isCurrentDay ? null : <Calendar onDayPress={this.setState({ isCurrentDay : false})}/>;
//     }
// }

export default function HomeScreen() {

    const [userMedications, setUserMedications] = useState([]);
    const navigation = useNavigation()

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

    // class DisplayRevertDate extends React.Component {
    //     constructor(props) {
    //         super(props);
    //         this.state = {
    //             isCurrentDay: true
    //         }
    //     }

    //     render() {
    //         return this.state.isCurrentDay ? null : <Calendar onDayPress={this.setState({ isCurrentDay : false})}/>;
    //     }
    // }



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


    
    

    // TODO: order based on start and end dates also, if within range then...
    const getDailyMedications = () => {
        // where 0 refers to sunday, 1 refers to monday, 2 to tuesday, ... etc.
        const d = new Date();
        const day = d.getDay();
        console.log(day);

        // to compare start and end dates with
        // const currentDate = new Date();

        const user = auth.currentUser;
        let medications = [];

        let startDate, endDate;

        let toAdd;

        db.collection("sched").where("user", "==", user.uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().dayOfWeek === day) {
                    // TODO :: test if this works

                    startDate = new Date(doc.data().startDate.toDate());
                    endDate = new Date(doc.data().endDate.toDate())

                    console.log(startDate);
                    console.log(endDate);

                    console.log("start date is ", doc.data().startDate.toDate());
                    console.log("selected date is ", date);
                    console.log("end date is ", doc.data().endDate.toDate());

                    if (doc.data().startDate.toDate() <= date && doc.data().endDate.toDate() >= date) {

                        console.log("getting here");
                        toAdd = {medicationName: doc.data().medicationName,
                            pillQuantity: doc.data().pillQuantity,
                            dispenseTimes: doc.data().dispenseTime.toDate()}
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


    // NEW: CALENDAR TOGGLE
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
                    <StyledButtonRefresh onPress={getDailyMedications}>
                            <ButtonText> Refresh Page </ButtonText>
                    </StyledButtonRefresh>
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