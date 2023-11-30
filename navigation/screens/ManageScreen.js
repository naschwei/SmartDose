import { getAuth } from 'firebase/auth';
import { addDoc, doc, setDoc, collection, getDocs } from 'firebase/firestore';
import React, {useState, useEffect, useRef} from 'react';
import { FlatList, Animated, Dimensions, ImageBackground, Switch, Pressable, TouchableOpacity, SafeAreaView, Button, View, TextInput, StyleSheet, Text, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';
import {Camera, CameraType} from 'expo-camera';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as MediaLibrary from 'expo-media-library';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db } from "../../firebase.js"
import { setNotifications, scheduleWeeklyNotification } from '../../notifs.js';
import { Timeline } from 'react-native-calendars';

import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';


export default function ManageScreen({ navigation }) {

    const [medicationName, setMedicationName] = useState("");
    const [pillQuantity, setPillQuantity] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [weeklySchedule, setWeeklySchedule] = useState([]);
    const [dispenseTimes, setDispenseTimes] = useState('');
    const [dispenseTimesList, setDispenseTimesList] = useState([]);

    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ isEditModal, setIsEditModal ] = useState(false);
    const [ isRefill, setIsRefill ] = useState(false);

    const [ Monday, changeMonday ] = useState(false);
    const [ Tuesday, changeTuesday ] = useState(false);
    const [ Wednesday, changeWednesday ] = useState(false);
    const [ Thursday, changeThursday ] = useState(false);
    const [ Friday, changeFriday ] = useState(false);
    const [ Saturday, changeSaturday ] = useState(false);
    const [ Sunday, changeSunday ] = useState(false);

    const [ Dispenser1, changeDispenserOne ] = useState(false);
    const [ Dispenser2, changeDispenserTwo ] = useState(false);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [time, setTime] = useState(new Date());
 
    const __takePicture = async () => {
        if (!camera) {
            return;
        } else {
            const photo = await camera.takePictureAsync()
            console.log(photo);
            setPreviewVisible(true);
            setCapturedImage(photo);
        }
    }

    const toggleModal = () => {

        const user = auth.currentUser;

        if (active != true && active != false) {
            alert('Dispenser not selected');
        } else {

            let dispenserOneTaken = false;
            let dispenserTwoTaken = false;

            db.collection("meds").where("user", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().dispenserNumber == '1') {
                        dispenserOneTaken = true;
                    } else if (doc.data().dispenserNumber == '2') {
                        dispenserTwoTaken = true;
                    }
                });
            })
            .then(() => {
                if (!active && dispenserOneTaken) {
                    alert('Dispenser 1 already has a medication assigned to it.');
                    return;
                } else if (active && dispenserTwoTaken) {
                    alert('Dispenser 2 already has a medication assigned to it.');
                    return;
                } else {
                    setIsModalVisible(!isModalVisible);
                    // set the number of the dispenser selected.
                    if (isModalVisible) {
                        if (!active) {
                            setDispenserNumber('1');
                        } else {
                            setDispenserNumber('2');
                        }
                    }
                    return;
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
            
        }
    };

    const toggleEditModal = () => {
        setIsEditModal(!isEditModal);
    }

    const toggleRefill = () => {
        setIsRefill(!isRefill);
    }

    const refillFunction = () => {
        alert("QUERY DATABASE TO MODIFY PILL COUNT");
        toggleRefill();
    }

    const changeInfo = () => {
        // Esha - this function would only need to change the weekly schedule and daily schedule in the database
        alert('update schedules, close the modal');
        toggleEditModal();
    }

    const changeMedication = () => {
        // Determine which medication needs to be changed

        const auth = getAuth();
        const user = auth.currentUser;

        const schedArray = [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday];
        setWeeklySchedule(schedArray);

        const timesList = dispenseTimes.split(',');
        setDispenseTimesList(timesList);

        if (medicationOne) {
            // UPDATE MEDICATION ONE!!!
            // User has the option to refill medication, change start date, change end date, 
            //      change weekly schedule, and change daily schedule
            // NOTE: Refill Medication should add the user inputted number to the existing number in the db

            // TODO: update notification times with this....lot of work lol (SECOND)
            // TODO: delete notifications from sched db with this also (FIRST)
            // TODO: add logic to keep track of if inputs are empty. if empty, do not update in db

            // get docid to reference specific doc in meds
            db.collection("meds").where("user", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().dispenserNumber == "1") {
                        setMedicationOneDocId(doc.id);
                        console.log("docid is ", doc.id);
                    }
                })
            })
            .then(() => {
                updateDoc(doc(db, "meds", medicationOneDocId), {
                    startDate: startDate,
                    endDate: endDate,
                    weeklySchedule: weeklySchedule,
                    dispenseTimes: dispenseTimesList,
                    pillsInDispenser: increment(pillsInDispenser)
                })
            })
            .then(() => {
                console.log("Medication updated successfully");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })

        } else {
            // UPDATE MEDICATION TWO!!!
            // get docid to reference specific doc in meds
            db.collection("meds").where("user", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().dispenserNumber == "2") {
                        setMedicationTwoDocId(doc.id);
                        console.log("docid is ", doc.id);
                    }
                })
            })
            .then(() => {
                updateDoc(doc(db, "meds", medicationTwoDocId), {
                    startDate: startDate,
                    endDate: endDate,
                    weeklySchedule: weeklySchedule,
                    dispenseTimes: dispenseTimes,
                    pillsInDispenser: increment(pillsInDispenser)
                })
            })
            .then(() => {
                console.log("Medication updated successfully");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        }
    }



    

    const handleMondayClick = () => {changeMonday(!Monday);};
    const handleTuesdayClick = () => {changeTuesday(!Tuesday);};
    const handleWednesdayClick = () => {changeWednesday(!Wednesday);};
    const handleThursdayClick = () => {changeThursday(!Thursday);};
    const handleFridayClick = () => {changeFriday(!Friday);};
    const handleSaturdayClick = () => {changeSaturday(!Saturday);};
    const handleSundayClick = () => {changeSunday(!Sunday);};

    const handleDispenserOne = () => {changeDispenserOne(!Dispenser1);};
    const handleDispenserTwo = () => {changeDispenserTwo(!Dispenser2);};

    const imageToTextApiKey = 'yqfk5vqF5e/nVAhECxZgRw==1JSnGDvmDsKjxB3t';

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [startCamera, setStartCamera] = useState(false);

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const __startCamera = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
            // start the camera
            setStartCamera(true);
        } else {
            alert('Access denied');
        }
    }

    //var dailyTimes = [];
    const [dailyTimes, setDailyTimes] = useState([]);

    const addNewTime = () => {
        const newTimes = dailyTimes; 
        newTimes.push(time);

        setDailyTimes(newTimes);
    }

    const resetStates = async () => {
        await setMedicationName("");
        await setPillQuantity(0);
        await setStartDate("");
        await setEndDate("");
        await setDispenserNumber("");
        await setWeeklySchedule([]);
        await setDispenseTimes("");
        await setDispenseTimesList([]);

        await setIsModalVisible(false);
        await changeMonday(false);
        await changeTuesday(false);
        await changeWednesday(false);
        await changeThursday(false);
        await changeFriday(false);
        await changeSaturday(false);
        await changeSunday(false);

        await changeDispenserOne(false);
        await changeDispenserTwo(false);
    }
 

    const addMedication = async () => {

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            const updateStateAndContinue = async () => {
                console.log("gets inside updatestatesnadcontinue")

                await setWeeklySchedule([Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]);
                console.log("weeklyschedule is ", weeklySchedule);

                console.log("setsweeklsyschedule")

                await setDispenseTimesList(dispenseTimes.split(','));
                console.log("timeslist is ", dispenseTimesList);

                console.log("stsdispensetimes")

                if (Dispenser1) {
                    await setDispenserNumber("1");
                } else {
                    await setDispenserNumber("2");
                }
                
                console.log("sets dispenser num")
            };

            await updateStateAndContinue();


            const tempWeeklySchedule = [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday];
            const tempDispenseTimesList = dispenseTimes.split(',');
            let tempDispenserNumber = "";

            if (!active) {
                tempDispenserNumber = "1";
            } else {
                tempDispenserNumber = "2";
            }

            console.log(tempWeeklySchedule);
            console.log(tempDispenseTimesList);
            console.log(tempDispenserNumber);

            const medsDocInfo = {
                user: user.uid,
                medicationName: medicationName,
                pillQuantity: pillQuantity,
                startDate: startDate,
                endDate: endDate,
                dispenserNumber: tempDispenserNumber,
                pillsInDispenser: 0,
                weeklySchedule: tempWeeklySchedule,
                dispenseTimes: tempDispenseTimesList
            };

            await addDoc(collection(db, "meds"), medsDocInfo);
            
            console.log("Successfully added medication.");

            for (let i = 0; i < tempWeeklySchedule.length; i++) {
                for (let j = 0; j < tempDispenseTimesList.length; j++) {
                    // console.log("dispense time j is ", dispenseTimesList[j]);

                    console.log("gets inside for loop for ", i, j);

                    scheduleWeeklyNotification(medicationName, i, tempDispenseTimesList[j], async (notifId) => {

                        if (tempWeeklySchedule[i] == true) {
                            let schedDocInfo = {
                                user: user.uid,
                                medicationName: medicationName,
                                dayOfWeek: i,
                                dispenseTime: tempDispenseTimesList[j],
                                status: 'Scheduled',
                                delayedTo: '',
                                startDate: startDate,
                                endDate: endDate,
                                pillQuantity: pillQuantity,
                                notificationId: notifId,
                                dispenserNumber: tempDispenserNumber,
                            }
                            await addDoc(collection(db, "sched"), schedDocInfo);
                            console.log("Successfully added schedule for medication.");
                            // console.log(schedDocInfo);
                            
                        }

                    })

                    
                }
            }
            await resetStates();
            setIsModalVisible(!isModalVisible);
            // toggleModal();
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }

    }


    const CameraPreview = ({photo}) => {
        // console.log('sdsfds', photo)
        return (
          <View
            style={{
              backgroundColor: 'transparent',
              flex: 1,
              width: '100%',
              height: '100%'
            }}
          >
            <ImageBackground
              source={{uri: photo && photo.uri}}
              style={{
                flex: 1
              }}
            >
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <Pressable style={{top: 20, left: -40, width: 120, height: 30, backgroundColor: '#f0ffff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderRadius: 3, borderColor: 'black'}}
                        onPress={__retakePicture}>
                        <Text style={{fontWeight: 'bold', color: 'black'}}>Re-Take Picture</Text>
                    </Pressable>
                    <Pressable style={{top: 20, left: 40, width: 120, height: 30, backgroundColor: '#f0ffff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderRadius: 3, borderColor: 'black'}}
                        onPress={__usePhoto}>
                        <Text style={{fontWeight: 'bold', color: 'black'}}>Use Photo</Text>
                    </Pressable>
                </View>
                
            </ImageBackground>
          </View>
        );
    }

    const closeCamera = () => {
        setStartCamera(false);
    }

    const changeTime = (event, selectedTime) => {
        setTime(selectedTime);
    }

    const __retakePicture = () => {
        setCapturedImage(null);
        setPreviewVisible(false);
        __startCamera();
    }

    const __usePhoto = async () => {
        // alert('functionality not yet buddy;');

        // set the name of the medication via photo extraction
        alert('photo extraction');
        console.log(capturedImage);

        extractMedicineName(capturedImage.uri, imageToTextApiKey).then(medicineNames => {
            if (medicineNames) {
                console.log('Matching Medicine Names:', medicineNames);
            } else {
                console.log('No matching medicine names found.');
            }
        }).catch(error => {
            console.error('Error:', error);
        });

        // close camera
        //closeCamera();
    }
    //onChangeText={text => setMedicationName(text)}

    // if active = true, dispenser B is showing. If active = false, dispenser A is showing.
    const [active, setActive] = useState(false)
    let transformX = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (active) {
        Animated.timing(transformX, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
        }).start()
        } else {
        Animated.timing(transformX, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
        }).start()
        }
    }, [active]);

    const rotationX = transformX.interpolate({
        inputRange: [0, 1],
        outputRange: [2, Dimensions.get('screen').width / 2]
    })

    
    return (startCamera ? ( previewVisible && capturedImage ? (
        <CameraPreview photo={capturedImage} retakePicture={__retakePicture} />
        ) : (
        <Camera
            style={{flex: 1, width: "100%", borderWidth: 4, borderRadius: 2, borderColor: 'mediumpurple'}}
            ref={(r) => {
                camera = r
            }}
            type={type}>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: '100%'}}>
                <Pressable style={{top: 10, left: -95, width: 40, height: 40, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                    onPress={closeCamera}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 25}}>X</Text>
                </Pressable>
                <Pressable style={{top: 10, right: -95, width: 40, height: 40, borderWidth: 2, borderColor: 'black', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: 'mediumpurple'}}
                    onPress={toggleCameraType}>
                    <Ionicons name="camera-reverse" size={27} color={'white'}/>
                </Pressable>
            </View>
            <View style={{alignSelf: 'center', flex: 1, alignItems: 'center'}}>
                <Pressable style={{bottom: -600, width:70, height:70, borderWidth: 4, borderRadius: 50, borderColor: 'mediumpurple', backgroundColor: 'white'}}
                    onPress={__takePicture}>
                </Pressable>
            </View>
        </Camera>
        )) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{margin: 10, fontWeight: 'bold', fontSize: 28}}>Select Dispenser</Text>
            <Text style={{margin: 5, marginBottom: 20, fontWeight: 'bold', fontSize: 20}}>Tap the dispenser you wish to manage!</Text>
            <SafeAreaView style={{
                flex: 1,
                alignItems: 'center'
            }}>
                <View style={{
                    flexDirection: 'row',
                    position: 'relative',
                    height: 100,
                    borderRadius: 10,
                    //backgroundColor: '#efebf0',
                    backgroundColor: 'lightgray',
                    marginHorizontal: 10,
                    borderColor: 'black',
                    borderWidth: 5
                }}>
                <Animated.View
                style={{
                    position: 'absolute',
                    height: 80,
                    top: 5,
                    bottom: 2,
                    borderRadius: 10,
                    borderColor: 'black',
                    borderWidth: 3,
                    width: Dimensions.get('screen').width / 2 - 2 - 15*2,
                    transform: [
                    {
                        translateX: rotationX
                    }
                    ],
                    backgroundColor: 'mediumpurple',
                }}
                >
                </Animated.View>
                <TouchableOpacity style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} onPress={() => setActive(false)}>
                    <Text style={{left: -10, fontWeight: 'bold', fontSize: 30}}>
                        A
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} onPress={() => setActive(true)}>
                    <Text style={{left: 10, fontWeight: 'bold', fontSize: 30}}>
                        B
                    </Text>
                </TouchableOpacity>
                </View>
            </SafeAreaView>
            <View style={{marginTop: 10, height: 300, width: 400, flex: 14, gap: 70, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                <View style={{left: 20, top: 0, height: 400, width: 300, justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{marginTop: 5, fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline', color: 'black'}}>Med Name</Text>
                    <KeyboardAwareScrollView contentContainerStyle={{top: 40, left: 30, width: 280}}>
                        <View style={{marginTop: 5, height: 200, width: 220, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{top: -10, left: -20, justifyContent: 'space-evenly', alignItems: 'left', gap: 27}}>
                                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>Start Date:</Text>
                                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>End Date:</Text>
                                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>Weekley Schedule:</Text>
                                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>Daily Schedule:</Text>
                                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>Pill Quantity:</Text>
                            </View>
                            <View style={{top: -10, justifyContent: 'space-evenly', alignItems: 'right', gap: 19}}>
                                <TextInput style={styles.input} editable={false}/>
                                <TextInput style={styles.input} editable={false}/>
                                <TextInput style={styles.input} editable={false}/>
                                <TextInput style={styles.input} editable={false}/>
                                <View style={{left: 40, borderColor: 'black', borderRadius: 15, borderWidth: 2, height: 30, width: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{color: 'black'}}>#</Text>
                                </View>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                    <Pressable style={{marginBottom: 10, height: 30, width: 220, borderWidth: 2, borderRadius: 20, borderColor: 'black', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} onPress={toggleRefill}>
                        <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>REFILL THIS MEDICATION</Text>
                    </Pressable>
                    <Pressable style={{marginBottom: 20, height: 30, width: 220, borderWidth: 2, borderRadius: 20, borderColor: 'black', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} onPress={toggleEditModal}>
                        <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>EDIT INFO</Text>
                    </Pressable>
                </View>
                <Pressable style={{top: 230, left: -30, width: 70, height: 70, backgroundColor: 'mediumpurple', borderWidth: 5, borderRadius: 35, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}} title="Add New Medication" onPress={toggleModal}>
                    <Text style={{left: 1, top: -3, fontWeight: 'bold', fontSize: 40, color: '#f8ffff'}}>+</Text>  
                </Pressable>
            </View>
            <Modal isVisible={isEditModal}>
                <View style={styles.editInfoContainer}>
                    <Pressable style={{top: 10, left: -150, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                        onPress={toggleEditModal}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                    </Pressable>
                    <Text style={{top: -15, marginTop: 0, fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline', color: 'black'}}>Med Name</Text>
                    <View style={{marginTop: 20, height: 200, width: 260, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{top: -10, left: -20, justifyContent: 'space-evenly', alignItems: 'left', gap: 20}}>
                            <View style={{height: 40, width: 290, margin: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={[{left: 0}, styles.text]}>Start Date</Text>
                                <RNDateTimePicker 
                                    mode="date"
                                    value={start}
                                    textColor='black'
                                    themeVariant='light'
                                />  
                            </View>
                            <View style={{height: 40, width: 290, margin: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={[{left: 0}, styles.text]}>End Date</Text>
                                <RNDateTimePicker 
                                    mode="date"
                                    value={start}
                                    textColor='black'
                                    themeVariant='light'
                                />  
                            </View>
                            <View style={{height: 40, width: 290, margin: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={[{left: -0}, styles.text]}>Dispense Times</Text>
                                <RNDateTimePicker 
                                    mode="time"
                                    value={time}
                                    textColor='black'
                                    themeVariant='light'
                                    style={{}}
                                    onChange={changeTime}
                                />  
                                <Pressable style={{height: 35, width: 50, backgroundColor: 'lightgrey', borderWidth: 2, borderColor: 'black', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}
                                    onPress={addNewTime}>
                                    <Text style={{fontWeight: 'bold', fontSize: 20}}>+</Text>
                                </Pressable>
                            </View>
                            <View style={{marginBottom: 5, margin: 0, height: 40, width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                {dailyTimes.map(t => 
                                    <View id="times" style={{borderRadius: 10, borderWidth: 1, borderColor: 'black', height: 20, width: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'lightblue'}}>
                                        <Text style={{fontSize: 10}}>{t.getHours()}:{t.getMinutes()}</Text>
                                        <Pressable style={{height: 20, width: 10, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: 10}}>X</Text>
                                        </Pressable>
                                    </View>  
                                )}
                            </View>
                            <Text style={styles.text}>Weekly Schedule:</Text>
                        </View>
                        <View style={{top: -33, justifyContent: 'space-evenly', alignItems: 'right', gap: 10}}>
                            <View style={{left: 40, borderColor: 'black', borderRadius: 15, borderWidth: 2, height: 30, width: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: 'black'}}>#</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.days}>
                        <Pressable style={[styles.day, {backgroundColor: Monday ? '#6D28D9': 'mediumpurple'}]} onPress={handleMondayClick}>
                            <Text style={styles.dayText}>Mo</Text>   
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Tuesday ? '#6D28D9': 'mediumpurple'}]} onPress={handleTuesdayClick}>
                            <Text style={styles.dayText}>Tu</Text>
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Wednesday ? '#6D28D9': 'mediumpurple'}]} onPress={handleWednesdayClick}>
                            <Text style={styles.dayText}>We</Text>
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Thursday ? '#6D28D9': 'mediumpurple'}]} onPress={handleThursdayClick}>
                            <Text style={styles.dayText}>Th</Text>
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Friday ? '#6D28D9': 'mediumpurple'}]} onPress={handleFridayClick}>
                            <Text style={styles.dayText}>Fr</Text>
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Saturday ? '#6D28D9': 'mediumpurple'}]} onPress={handleSaturdayClick}>
                            <Text style={styles.dayText}>Sa</Text>
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Sunday ? '#6D28D9': 'mediumpurple'}]} onPress={handleSundayClick}>
                            <Text style={styles.dayText}>Su</Text>
                        </Pressable>
                    </View>
                    <Pressable style={{marginBottom: 20, top: -0, left: 0, width: 200, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                        onPress={changeInfo}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>DONE</Text>
                    </Pressable>
                </View>
            </Modal>
            <Modal isVisible={isRefill}>
                <View style={styles.refillContainer}>
                    <Pressable style={{top: 10, left: -150, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                        onPress={toggleRefill}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                    </Pressable>
                    <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>Refill Quantity?</Text>
                    <TextInput style={[styles.input, {height: 40, marginTop: 20, width: 200}]} keyboardType='numeric'/>
                    <Pressable style={{marginTop: 20, top: -0, left: 0, width: 200, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                        onPress={refillFunction}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>SUBMIT</Text>
                    </Pressable>
                </View>
            </Modal>
            <Modal isVisible={isModalVisible} id='??'>
                <View style={styles.container}>
                    <KeyboardAwareScrollView contentContainerStyle={{width: 350}}>
                        <View style={{flexDirection: 'row', margin: 7, marginTop: 10}}>
                            <Pressable style={{top: -0, left: 0, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                                onPress={toggleModal}>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                            </Pressable>
                            <Text style={[styles.title, {left: 20}]}>Add New Medication</Text>
                            <Pressable style={{top: 0, left: 40, width: 30, height: 30, borderWidth: 2, borderColor: 'black', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: 'mediumpurple'}}
                                onPress={__startCamera}>
                                <Ionicons name="camera" size={20} color={'white'}/>
                            </Pressable>
                        </View>
                        <View style={styles.container2}>
                            <View style={styles.items}>
                                <TextInput style={styles.inputAdd} placeholder="Medication Name" placeholderTextColor={'grey'} 
                                    onChangeText={text => setMedicationName(text)}
                                    value={medicationName}
                                />
                                <TextInput style={styles.inputAdd} placeholder="Pill Quantity" placeholderTextColor={'grey'} 
                                    onChangeText={text => setPillQuantity(text)}
                                    keyboardType='numeric'
                                />
                                <View style={{height: 40, width: 290, margin: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Text style={[{left: -5}, styles.text]}>Start Date</Text>
                                    <RNDateTimePicker 
                                        mode="date"
                                        value={start}
                                        textColor='black'
                                        themeVariant='light'
                                    />  
                                </View>
                                <View style={{height: 40, width: 290, margin: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Text style={[{left: -5}, styles.text]}>End Date</Text>
                                    <RNDateTimePicker 
                                        mode="date"
                                        value={start}
                                        textColor='black'
                                        themeVariant='light'
                                    />  
                                </View>
                                <Text style={styles.text}>Medication Dispenser</Text>
                                <TextInput style={[styles.inputAdd, {backgroundColor: 'lightgray'}]} value= {active ? "B" : "A"} editable={false} placeholder="Dispenser (A or B)" placeholderTextColor={'grey'}
                                    onChangeText={text => setDispenserNumber(text)}
                                />
                                <Text style={styles.text}>Select Weekly Schedule</Text>
                                <View style={styles.days}>
                                    <Pressable style={[styles.day, {backgroundColor: Monday ? '#6D28D9': 'mediumpurple'}]} onPress={handleMondayClick}>
                                        <Text style={styles.dayText}>Mo</Text>   
                                    </Pressable>
                                    <Pressable style={[styles.day, {backgroundColor: Tuesday ? '#6D28D9': 'mediumpurple'}]} onPress={handleTuesdayClick}>
                                        <Text style={styles.dayText}>Tu</Text>
                                    </Pressable>
                                    <Pressable style={[styles.day, {backgroundColor: Wednesday ? '#6D28D9': 'mediumpurple'}]} onPress={handleWednesdayClick}>
                                        <Text style={styles.dayText}>We</Text>
                                    </Pressable>
                                    <Pressable style={[styles.day, {backgroundColor: Thursday ? '#6D28D9': 'mediumpurple'}]} onPress={handleThursdayClick}>
                                        <Text style={styles.dayText}>Th</Text>
                                    </Pressable>
                                    <Pressable style={[styles.day, {backgroundColor: Friday ? '#6D28D9': 'mediumpurple'}]} onPress={handleFridayClick}>
                                        <Text style={styles.dayText}>Fr</Text>
                                    </Pressable>
                                    <Pressable style={[styles.day, {backgroundColor: Saturday ? '#6D28D9': 'mediumpurple'}]} onPress={handleSaturdayClick}>
                                        <Text style={styles.dayText}>Sa</Text>
                                    </Pressable>
                                    <Pressable style={[styles.day, {backgroundColor: Sunday ? '#6D28D9': 'mediumpurple'}]} onPress={handleSundayClick}>
                                        <Text style={styles.dayText}>Su</Text>
                                    </Pressable>
                                </View>
                                <View style={{height: 40, width: 290, margin: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Text style={[{left: -10}, styles.text]}>Dispense Times</Text>
                                    <RNDateTimePicker 
                                        mode="time"
                                        value={time}
                                        textColor='black'
                                        themeVariant='light'
                                        style={{}}
                                        onChange={changeTime}
                                    />  
                                    <Pressable style={{height: 35, width: 50, backgroundColor: 'lightgrey', borderWidth: 2, borderColor: 'black', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}
                                        onPress={addNewTime}>
                                        <Text style={{fontWeight: 'bold', fontSize: 20}}>+</Text>
                                    </Pressable>
                                </View>
                                <View style={{marginBottom: 5, margin: 0, height: 40, width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    {dailyTimes.map(t => 
                                        <View id="times" style={{borderRadius: 10, borderWidth: 1, borderColor: 'black', height: 20, width: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'lightblue'}}>
                                            <Text style={{fontSize: 10}}>{t.getHours()}:{t.getMinutes()}</Text>
                                            <Pressable style={{height: 20, width: 10, justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{fontSize: 10}}>X</Text>
                                            </Pressable>
                                        </View>  
                                    )}
                                </View>
                            </View>
                            <Pressable style={{width: 200, height: 30, backgroundColor: 'mediumpurple', borderWidth: 2, borderRadius: 5, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginBottom: 10, padding: 2}} title="Add New Medication" onPress={addMedication}>
                                <Text style={{fontWeight: 'bold', fontSize: 15, color: 'white'}}>Submit</Text>
                            </Pressable>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </Modal>
        </View>
    ));
}


const styles = StyleSheet.create({
    grid: {
        height: 150, 
        width: 150, 
        backgroundColor: '#f0f8ff', 
        margin: 10,
        borderWidth: 10,
        borderRadius: 25,
        borderColor: 'black'
    }, 
    container: {
        backgroundColor: '#E6E6FA',
        alignItems: 'center',
        width: 375,
        height: 575,
        marginBottom: 0,
        borderWidth: 10,
        borderRadius: 20,
        borderColor: 'black',
        top: 0
    },
    refillContainer: {
        backgroundColor: 'lightgray',
        alignItems: 'center',
        width: 375,
        height: 200,
        marginBottom: 0,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: 'black',
    },
    editInfoContainer: {
        backgroundColor: 'lightgray',
        alignItems: 'center',
        width: 375,
        height: 400,
        marginBottom: 0,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: 'black',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textShadowColor: 'white',
        textShadowOffset: {width: 1, height: 2},
        textShadowRadius: 2,
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        margin: 3,
        marginLeft: 10,
        marginBottom: 5,
        textShadowColor: 'white',
        textShadowOffset: {width: 1, height: 2},
        textShadowRadius: 2
    },
    container2: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    items: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        margin: 2
    },
    input: {
        width: 100,
        height: 30,
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 15, 
        fontSize: 16,
        margin: 5,
        fontColor: '#000',
        fontWeight: 'bold'
    },
    inputAdd: {
        width: 300,
        height: 40,
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 15, 
        fontSize: 16,
        margin: 5,
        fontColor: '#000',
        fontWeight: 'bold'
    },
    input2: {
        width: 300,
        height: 40,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        paddingVertical: 20
    },
    days: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 4,
        gap: 2,
        marginTop: 2
    },
    day: {
        width: 40,
        height: 40,
        backgroundColor: '#f0ffff',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5
    },
    dayText: {
        fontWeight: 'bold',
        color: 'white' //  #6D28D9
    },
    buttons: {
        width: 200,
        height: 100,
        borderWidth: 10,
        borderRadius: 20,
        borderColor: 'black' 
    }
});

async function extractMedicineName(imageData, imageToTextApiKey) {
    //  Upload the image to Image to Text API
    const imageToTextUrl = 'https://api.api-ninjas.com/v1/imagetotext';
    const formData = new FormData();
    formData.append('image', imageData);
  
    const imageToTextConfig = {
      method: 'POST',
      headers: {
        'X-Api-Key': imageToTextApiKey,
      },
      body: formData,
    };
  
    const response = await fetch(imageToTextUrl, imageToTextConfig);
    const textData = await response.json();
    // Extract text
    const extractedText = textData
        .filter(item => item.text) // Filter out empty text
        .map(item_1 => item_1.text.trim()) // Trim whitespace
        .join(' ');
    // Search for extracted text in Medicine Name Search API
    const medicineNameSearchUrl = `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${encodeURIComponent(
        extractedText
    )}`;
    const response_1 = await fetch(medicineNameSearchUrl);
    const medicineData = await response_1.json();
    // Extract medicine names from Name Search API response ()
    if (medicineData.results && medicineData.results.length > 0) {
        const medicineNames = medicineData.results.map(result_1 => result_1.DISPLAY_NAME);
        return medicineNames;
    } else {
        return null; // No matching names found
    }
}
  
  // Example (need to add image upload functionality):
  // const imageFile = document.getElementById('yourImageInput').files[0];
  const imageToTextApiKey = 'yqfk5vqF5e/nVAhECxZgRw==1JSnGDvmDsKjxB3t';
  
//   extractMedicineName(imageFile, imageToTextApiKey)
//     .then(medicineNames => {
//       if (medicineNames) {
//         console.log('Matching Medicine Names:', medicineNames);
//       } else {
//         console.log('No matching medicine names found.');
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });