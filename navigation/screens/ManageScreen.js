import { getAuth } from 'firebase/auth';
import { addDoc, doc, setDoc, collection, getDocs, updateDoc, increment, deleteDoc, Timestamp } from 'firebase/firestore';
import React, {useState, useEffect, useRef} from 'react';
import { FlatList, Animated, Dimensions, ImageBackground, Switch, Pressable, TouchableOpacity, SafeAreaView, Button, View, TextInput, StyleSheet, Text, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';
import {Camera, CameraType} from 'expo-camera';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as MediaLibrary from 'expo-media-library';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db } from "../../firebase.js"
import { setNotifications, scheduleWeeklyNotification, cancelNotification } from '../../notifs.js';
import { Timeline } from 'react-native-calendars';

import { format, zonedTimeToUtc } from 'date-fns-tz';

import DateTimePicker from '@react-native-community/datetimepicker';
import { StyledButtonRefresh, StyledButtonTODAY, ButtonText } from './../../components/styles';


export default function ManageScreen({ navigation }) {

    const [medicationName, setMedicationName] = useState("");
    const [pillQuantity, setPillQuantity] = useState(0);
    // const [startDate, setStartDate] = useState("");
    // const [endDate, setEndDate] = useState("");
    const [weeklySchedule, setWeeklySchedule] = useState([]);
    const [dispenseTimes, setDispenseTimes] = useState('');
    const [dispenseTimesList, setDispenseTimesList] = useState([]);

    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ isEditModal, setIsEditModal ] = useState(false);
    const [ isRefill, setIsRefill ] = useState(false);
    const [refillValue, setRefillValue] = useState(0);

    const [ Monday, changeMonday ] = useState(false);
    const [ Tuesday, changeTuesday ] = useState(false);
    const [ Wednesday, changeWednesday ] = useState(false);
    const [ Thursday, changeThursday ] = useState(false);
    const [ Friday, changeFriday ] = useState(false);
    const [ Saturday, changeSaturday ] = useState(false);
    const [ Sunday, changeSunday ] = useState(false);

    const [ medicationOneDocId, setMedicationOneDocId ] = useState("");
    const [ medicationTwoDocId, setMedicationTwoDocId ] = useState("");

    const [dispenserInfo, setDispenserInfo] = useState([]);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [time, setTime] = useState(new Date());

    const [editStart, setEditStart] = useState(new Date());
    const [editEnd, setEditEnd] = useState(new Date());
    const [editTime, setEditTime] = useState(new Date());

    const [checkChangeStartDate, setCheckChangeStartDate] = useState(false);
    const [checkChangeEndDate, setCheckChangeEndDate] = useState(false);
    const [checkChangeDispenseTimes, setCheckChangeDispenseTimes] = useState(false);
    const [checkChangeWeeklySched, setCheckChangeWeeklySched] = useState(false);

    const [aTaken, setATaken] = useState(false);
    const [bTaken, setBTaken] = useState(false);


    const handleMondayClick = () => {changeMonday(!Monday);};
    const handleTuesdayClick = () => {changeTuesday(!Tuesday);};
    const handleWednesdayClick = () => {changeWednesday(!Wednesday);};
    const handleThursdayClick = () => {changeThursday(!Thursday);};
    const handleFridayClick = () => {changeFriday(!Friday);};
    const handleSaturdayClick = () => {changeSaturday(!Saturday);};
    const handleSundayClick = () => {changeSunday(!Sunday);};

    const imageToTextApiKey = 'yqfk5vqF5e/nVAhECxZgRw==1JSnGDvmDsKjxB3t';

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [startCamera, setStartCamera] = useState(false);
 
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

        setDailyTimes([]);
        
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
                    resetStates();
                    getDispenserData();
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
        resetStates();
        getDispenserData();
    }

    const dispenserTaken = async () => {

        const user = auth.currentUser;

        try {

            const querySnapshot = await db.collection("meds").where("user", "==", user.uid).get();
            querySnapshot.forEach((doc) => {
                if (doc.data().dispenserNumber == '1') {
                    setATaken(true);
                } else if (doc.data().dispenserNumber == '2') {
                    setBTaken(true);
                }
            });
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);

        }
        
    }

    function firestoreTimeToJS(timestampObject) {
        if (!timestampObject || !timestampObject.seconds) {
            // Handle invalid or missing timestamp
            return null;
        }

        const milliseconds = timestampObject.seconds * 1000 + (timestampObject.nanoseconds || 0) / 1e6;
        return new Date(milliseconds);
    }

    // convert start and end dates into human readable objects HOW TO USE ABOVE FUNCTION
    // let timestampObject = firestoreTimeToJS(dispenserOneInfo.startDate);
    // let startDate = (new Date(timestampObject.seconds * 1000 + timestampObject.nanoseconds / 1e6)).toDateString();
    // console.log(timestampObject.toDateString());'

    const getDayName = (index) => {
        const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        return daysOfWeek[index];
    };

    const getDispenserData = async () => {
        const user = auth.currentUser;

        let dispenserOneTaken = false;
        let dispenserTwoTaken = false;

        let dispenserOneInfo = {};
        let dispenserTwoInfo = {};

        try {

            const querySnapshot = await db.collection("meds").where("user", "==", user.uid).get();
            querySnapshot.forEach((doc) => {
                if (doc.data().dispenserNumber == '1') {
                    dispenserOneTaken = true;
                    console.log("data 1 is ", doc.data());
                    dispenserOneInfo = doc.data();
                } else if (doc.data().dispenserNumber == '2') {
                    dispenserTwoTaken = true;
                    console.log("data 2 is ", doc.data());
                    dispenserTwoInfo = doc.data();
                }
            });

            console.log("dispenseroneinfo is ", dispenserOneInfo);
            console.log("dispensertwoinfo is ", dispenserTwoInfo);

            console.log("dispenser1taken is ", dispenserOneTaken);
            console.log("dispenser2taken is ", dispenserTwoTaken);

            console.log(active);


            if (!active && dispenserOneTaken) {
                await setDispenserInfo(dispenserOneInfo);
            } else if (!active && !dispenserOneTaken) {
                await setDispenserInfo({});
            } else if (active && dispenserTwoTaken) {
                await setDispenserInfo(dispenserTwoInfo);
            } else if (active & !dispenserTwoTaken) {
                await setDispenserInfo({});
            }

            console.log("dispenser info is ", dispenserInfo);

        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);

        }
    }

    
    const toggleRefill = () => {
        setIsRefill(!isRefill);
        resetStates();
        getDispenserData();
    }

    const refillFunction = () => {

        const auth = getAuth();
        const user = auth.currentUser;

        if (!active) {

            db.collection("meds")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "1")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id)

                    const medicationOneRef = doc.ref;
                    updateDoc(medicationOneRef, {
                        pillsInDispenser: increment(refillValue),
                    })
                    
                    .then(() => {
                        console.log("Dispenser 1 refilled successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })

            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        } else {

            db.collection("meds")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "2")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id)

                    const medicationTwoRef = doc.ref;
                    updateDoc(medicationTwoRef, {
                        pillsInDispenser: increment(refillValue),
                    })
                    .then(() => {
                        console.log("Dispenser 1 refilled successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })

            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        }

        toggleRefill();
    }

    const changeInfo = () => {
        // Esha - this function would only need to change the weekly schedule and daily schedule in the database

        if (checkChangeStartDate) {
            console.log("value of start date to change to is ", editStart);
            changeStartDate();
        }
        if (checkChangeEndDate) {
            console.log("value of end date to change to is ", editEnd);
            changeEndDate();
        }

        if (checkChangeDispenseTimes && !checkChangeWeeklySched) {
            alert("Changing dispense times will also affect the weekly schedule. Please also choose days on the weekly schedule that correspond.");
            return;
        }

        if (!checkChangeDispenseTimes && checkChangeWeeklySched) {
            alert("Changing weekly schedule will also affect dispense times. Please also choose dispense times that correspond.");
            return;
        }

        if (checkChangeDispenseTimes && checkChangeWeeklySched) {
            editAndDelete();
        }

        toggleEditModal();

    }

    const changeStartDate = () => {

        const auth = getAuth();
        const user = auth.currentUser;

        tempStartDateEditFunc();

        if (!active) {
            db.collection("meds")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "1")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationOneRef = doc.ref;
                    updateDoc(medicationOneRef, {
                        startDate: editStart,
                    })
                    .then(() => {
                        console.log("Dispenser 1 Start Date updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        } else {
            db.collection("meds")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "2")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationTwoRef = doc.ref;
                    updateDoc(medicationTwoRef, {
                        startDate: editStart,
                    })
                    .then(() => {
                        console.log("Dispenser 2 Start Date updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        }
    }

    const tempStartDateEditFunc = () => {

        const auth = getAuth();
        const user = auth.currentUser;

        if (!active) {
            db.collection("sched")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "1")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationOneRef = doc.ref;
                    updateDoc(medicationOneRef, {
                        startDate: editStart,
                    })
                    .then(() => {
                        console.log("Dispenser 1 start in sched updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        } else {
            db.collection("sched")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "2")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationTwoRef = doc.ref;
                    updateDoc(medicationTwoRef, {
                        startDate: editStart,
                    })
                    .then(() => {
                        console.log("Dispenser 2 start date in sched updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        }
        
    }

    const editStartDateInput = (event, selectedDate) => {
        setEditStart(selectedDate);
        console.log("selected date is ",selectedDate);
        setCheckChangeStartDate(true);
    }

    const changeEndDate = () => {

        const auth = getAuth();
        const user = auth.currentUser;

        tempEndDateEditFunc();

        if (!active) {
            db.collection("meds")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "1")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationOneRef = doc.ref;
                    updateDoc(medicationOneRef, {
                        endDate: editEnd,
                    })
                    .then(() => {
                        console.log("Dispenser 1 End Date updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        } else {
            db.collection("meds")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "2")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationTwoRef = doc.ref;
                    updateDoc(medicationTwoRef, {
                        endDate: editEnd,
                    })
                    .then(() => {
                        console.log("Dispenser 2 End Date updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        }
    }

    const tempEndDateEditFunc = () => {

        const auth = getAuth();
        const user = auth.currentUser;

        if (!active) {
            db.collection("sched")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "1")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationOneRef = doc.ref;
                    updateDoc(medicationOneRef, {
                        endDate: editEnd, 
                    })
                    .then(() => {
                        console.log("Dispenser 1 end in sched updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        } else {
            db.collection("sched")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "2")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationTwoRef = doc.ref;
                    updateDoc(medicationTwoRef, {
                        endDate: editEnd,
                    })
                    .then(() => {
                        console.log("Dispenser 2 end date in sched updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        }
        
    }

    const editEndDateInput = (event, selectedDate) => {
        setEditEnd(selectedDate);
        console.log("selected end date is ",selectedDate);
        setCheckChangeEndDate(true);
    }



    const editAndDelete = async () => {

        const auth = getAuth();
        const user = auth.currentUser;

        const deleteMedicationFromSched = async (dispenserNumber) => {
            try {
                const schedSnapshot = await db.collection("sched").where("user", "==", user.uid).get();

                await Promise.all(
                    schedSnapshot.docs.map(async (medToDelete) => {
                        if (medToDelete.data().dispenserNumber == dispenserNumber) {
                            console.log("Doc id for sched delete is ", medToDelete.id);
                            // delete notifications here
                            await cancelNotification(medToDelete.data().notificationId);
                            await deleteDoc(doc(db, "sched", medToDelete.id));
                            console.log("Deleted doc id ", medToDelete.id);
                        }
                    })
                );

                console.log("Deleted meds from sched");
            } catch (error) {
                console.error("Error deleting medication from 'sched' collection:", error);
                throw error; // Propagate the error up to the outer catch block
            }
        };


        try {

            const tempWeeklySchedule = [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday];

            let dbMedName = "";
            let dbStartDate = new Date();
            let dbEndDate = new Date();
            let dbPillQuantity = "";

            if (!active) {
                
                
                // edit meds db
                await changeDispenseTimesInput();
                await changeWeeklySchedInput();

                console.log("gets here");

                // query meds db for info
                const querySnapshot = await db.collection("sched").where("user", "==", user.uid).get();
                querySnapshot.forEach((doc) => {
                    if (doc.data().dispenserNumber == "1") {
                        dbMedName = doc.data().medicationName;
                        dbStartDate = checkChangeStartDate ? editStart : doc.data().startDate;
                        dbEndDate = checkChangeEndDate ? editEnd : doc.data().endDate;
                        dbPillQuantity = doc.data().pillQuantity;
                    }
                });
                // console.log(medications);
                // setUserMedications(medications);

                // delete old notifications and delete entries from sched db
                await deleteMedicationFromSched("1");


                for (let i = 0; i < tempWeeklySchedule.length; i++) {
                    for (let j = 0; j < dailyTimes.length; j++) {
                        console.log("gets inside for loop for ", i, j);

                        let newDate = new Date(dailyTimes[j]);
                        let convertedTime = newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        scheduleWeeklyNotification(medicationName, i, convertedTime, async (notifId) => {

                            if (tempWeeklySchedule[i] == true) {
                                let schedDocInfo = {
                                    user: user.uid,
                                    medicationName: dbMedName,
                                    dayOfWeek: i,
                                    dispenseTime: dailyTimes[j],
                                    status: 'Scheduled',
                                    delayedTo: '',
                                    startDate: dbStartDate,
                                    endDate: dbEndDate,
                                    pillQuantity: dbPillQuantity,
                                    notificationId: notifId,
                                    dispenserNumber: "1",
                                }
                                await addDoc(collection(db, "sched"), schedDocInfo);
                                console.log("Successfully added schedule for medication.");
                                // console.log(schedDocInfo);
                                
                            }

                        })

                    }
                }

                



            } else {

                await changeDispenseTimesInput();
                await changeWeeklySchedInput();

                // query meds db for info
                const querySnapshot = await db.collection("sched").where("user", "==", user.uid).get();
                querySnapshot.forEach((doc) => {
                    if (doc.data().dispenserNumber == "2") {
                        dbMedName = doc.data().medicationName;
                        dbStartDate = doc.data().startDate;
                        dbEndDate = doc.data().endDate;
                        dbPillQuantity = doc.data().pillQuantity;
                    }
                });
                // console.log(medications);
                // setUserMedications(medications);

                // delete old notifications and delete entries from sched db
                await deleteMedicationFromSched("2");


                for (let i = 0; i < tempWeeklySchedule.length; i++) {
                    for (let j = 0; j < dailyTimes.length; j++) {
                        console.log("gets inside for loop for ", i, j);

                        scheduleWeeklyNotification(medicationName, i, dailyTimes[j], async (notifId) => {

                            if (tempWeeklySchedule[i] == true) {
                                let schedDocInfo = {
                                    user: user.uid,
                                    medicationName: dbMedName,
                                    dayOfWeek: i,
                                    dispenseTime: dailyTimes[j],
                                    status: 'Scheduled',
                                    delayedTo: '',
                                    startDate: dbStartDate,
                                    endDate: dbEndDate,
                                    pillQuantity: dbPillQuantity,
                                    notificationId: notifId,
                                    dispenserNumber: "2",
                                }
                                await addDoc(collection(db, "sched"), schedDocInfo);
                                console.log("Successfully added schedule for medication.");
                                // console.log(schedDocInfo);
                                
                            }

                        })

                    }
                }

            }

            await resetStates();

        } catch (error) {

            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }

    }


    const changeDispenseTimesInput = () => {

        const auth = getAuth();
        const user = auth.currentUser;

        if (!active) {
            db.collection("meds")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "1")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationOneRef = doc.ref;
                    updateDoc(medicationOneRef, {
                        dispenseTimes: dailyTimes
                    })
                    .then(() => {
                        console.log("Dispenser 1 Dispense Times updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        } else {
            db.collection("meds")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "2")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationTwoRef = doc.ref;
                    updateDoc(medicationTwoRef, {
                        dispenseTimes: dailyTimes
                    })
                    .then(() => {
                        console.log("Dispenser 2 Dispense Times updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        }
    }

    const editTimeInput = (event, selectedTime) => {
        setEditTime(selectedTime);
        console.log("selected dispense times are ",selectedTime);
    }

    const changeWeeklySchedInput = () => {

        const auth = getAuth();
        const user = auth.currentUser;

        const tempWeeklySchedule = [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday];

        if (!active) {
            db.collection("meds")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "1")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationOneRef = doc.ref;
                    updateDoc(medicationOneRef, {
                        weeklySchedule: tempWeeklySchedule,
                    })
                    .then(() => {
                        console.log("Dispenser 1 Weekly Schedule updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        } else {
            db.collection("meds")
            .where("user", "==", user.uid)
            .where("dispenserNumber", "==", "2")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("docid is ", doc.id);

                    const medicationTwoRef = doc.ref;
                    updateDoc(medicationTwoRef, {
                        weeklySchedule: tempWeeklySchedule,
                    })
                    .then(() => {
                        console.log("Dispenser 2 Weekly Sched updated successfully");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
        }
    }

    const editWeeklySched = () => {
        setCheckChangeWeeklySched(true);
    }

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
    const [dailyTimesIndex, incDailyTimesIndex] = useState(0);

    const addNewTime = () => {
        if (dailyTimes.includes(editTime) === false) {
            console.log(dailyTimes);
            // var newTimes = dailyTimes;
            // newTimes.push(editTime);


            const newTimes = [...dailyTimes, editTime];
            setDailyTimes(newTimes);
            setCheckChangeDispenseTimes(true);
            console.log(dailyTimes);
        } else {
            alert('Scheduled Time Already Exists');
        }
    }

    const removeDailyTime = (timeToDelete) => {
        const newTimes = dailyTimes.filter(time => time !== timeToDelete);
        setDailyTimes(newTimes);
    }

    const resetStates = async () => {
        await setMedicationName("");
        await setPillQuantity(0);
        // await setStartDate("");
        // await setEndDate("");
        // await setDispenserNumber("");
        await setWeeklySchedule([]);
        await setDispenseTimes("");
        await setDispenseTimesList([]);

        // await setIsModalVisible(false);
        await changeMonday(false);
        await changeTuesday(false);
        await changeWednesday(false);
        await changeThursday(false);
        await changeFriday(false);
        await changeSaturday(false);
        await changeSunday(false);

        await setStart(new Date());
        await setEnd(new Date());
        await setTime(new Date());

        await setEditStart(new Date());
        await setEditEnd(new Date());
        await setEditTime(new Date());

        await setDailyTimes([]);

        await setCheckChangeStartDate(false);
        await setCheckChangeEndDate(false);
        await setCheckChangeDispenseTimes(false);
        await setCheckChangeWeeklySched(false);

        await setATaken(false);
        await setBTaken(false);

        // await setDispenserInfo([]);

    }
 

    const addMedication = async () => {

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            const tempWeeklySchedule = [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday];
            let tempDispenserNumber = "";

            if (!active) {
                tempDispenserNumber = "1";
            } else {
                tempDispenserNumber = "2";
            }

            console.log(tempWeeklySchedule);
            console.log(tempDispenserNumber);

            // const startUTC = format(new Date(start), "yyyy-MM-dd'T'HH:mm:ss.SSSX", { timeZone: 'UTC' });
            // const endUTC = format(new Date(end), "yyyy-MM-dd'T'HH:mm:ss.SSSX", { timeZone: 'UTC' });

            const startUTC = zonedTimeToUtc(start, 'UTC');
            const endUTC = zonedTimeToUtc(end, 'UTC');

            const medsDocInfo = {
                user: user.uid,
                medicationName: medicationName,
                pillQuantity: pillQuantity,
                startDate: startUTC,
                endDate: endUTC,
                dispenserNumber: tempDispenserNumber,
                pillsInDispenser: 0,
                weeklySchedule: tempWeeklySchedule,
                dispenseTimes: dailyTimes
            };

            console.log("daily times is ", dailyTimes);

            console.log("meddocinfo is ",medsDocInfo);

            await addDoc(collection(db, "meds"), medsDocInfo);
            
            console.log("Successfully added medication.");

            for (let i = 0; i < tempWeeklySchedule.length; i++) {
                for (let j = 0; j < dailyTimes.length; j++) {
                    // console.log("dispense time j is ", dispenseTimesList[j]);

                    console.log("gets inside for loop for ", i, j);

                    let newDate = new Date(dailyTimes[j]);
                    let convertedTime = newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    console.log("converted time is ", convertedTime);

                    scheduleWeeklyNotification(medicationName, i, convertedTime, async (notifId) => {

                        console.log("scheduled weekly notification")

                        if (tempWeeklySchedule[i] == true) {
                            let schedDocInfo = {
                                user: user.uid,
                                medicationName: medicationName,
                                dayOfWeek: i,
                                dispenseTime: dailyTimes[j],
                                status: 'Scheduled',
                                delayedTo: '',
                                startDate: startUTC,
                                endDate: endUTC,
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
                    <TouchableOpacity style={{top: 20, left: -40, width: 120, height: 30, backgroundColor: '#f0ffff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderRadius: 3, borderColor: 'black'}}
                        onPress={__retakePicture}>
                        <Text style={{fontWeight: 'bold', color: 'black'}}>Re-Take Picture</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{top: 20, left: 40, width: 120, height: 30, backgroundColor: '#f0ffff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderRadius: 3, borderColor: 'black'}}
                        onPress={__usePhoto}>
                        <Text style={{fontWeight: 'bold', color: 'black'}}>Use Photo</Text>
                    </TouchableOpacity>
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
    
    const changeStart = (event, selectedStart) => {
        setStart(selectedStart);
    }

    const changeEnd = (event, selectedEnd) => {
        setEnd(selectedEnd);
    }

    const __retakePicture = () => {
        setCapturedImage(null);
        setPreviewVisible(false);
        __startCamera();
    }

    const __usePhoto = async () => {
        // alert('functionality not yet buddy;');

        // set the name of the medication via photo extraction
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
        resetStates();
        getDispenserData();
        dispenserTaken();

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


    const showMode = (currentMode) => {
        setShowEndDate(!showEndDate);
    }

    const alertFunction = () => {
        alert('No Medication in Dispenser');
    }
    
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
                <TouchableOpacity style={{top: 10, left: -95, width: 40, height: 40, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                    onPress={closeCamera}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 25}}>X</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{top: 10, right: -95, width: 40, height: 40, borderWidth: 2, borderColor: 'black', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: 'mediumpurple'}}
                    onPress={toggleCameraType}>
                    <Ionicons name="camera-reverse" size={27} color={'white'}/>
                </TouchableOpacity>
            </View>
            <View style={{alignSelf: 'center', flex: 1, alignItems: 'center'}}>
                <TouchableOpacity style={{bottom: -600, width:70, height:70, borderWidth: 4, borderRadius: 50, borderColor: 'mediumpurple', backgroundColor: 'white'}}
                    onPress={__takePicture}>
                </TouchableOpacity>
            </View>
        </Camera>
        )) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{margin: 10, fontWeight: 'bold', fontSize: 24}}>Select Dispenser</Text>
            <Text style={{margin: 5, marginTop: -10, marginBottom: 20, fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>Tap the dispenser to manage!</Text>
            <Text style={{margin: 5, marginTop: -15, marginBottom: 20, fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>Refresh page to update!</Text>
            <View style={{alignItems:"center", marginTop: -20}}>
                <StyledButtonRefresh onPress={getDispenserData}>
                    <ButtonText> Refresh Page </ButtonText>
                </StyledButtonRefresh>
            </View>
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
                    <Text style={{marginTop: 5, fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline', color: 'black'}}>Med Name: {dispenserInfo.medicationName ? dispenserInfo.medicationName : 'No Info'}</Text>
                        <View style={{marginTop: 5, height: 200, width: 220, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{top: -10, left: -20, justifyContent: 'space-evenly', alignItems: 'left', gap: 27}}>
                                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>Start Date: </Text>
                                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>End Date:</Text>
                                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>Weekly Schedule:</Text>
                                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>Daily Schedule:</Text>
                                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>Pill Quantity Per Dispense:</Text>
                                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>Pills In Dispenser:</Text>
                            </View>
                            <View style={{width: 150, left: -10, top: -5, justifyContent: 'space-evenly', alignItems: 'center', gap: 20}}>
                                <Text style={styles.text}>{dispenserInfo.startDate ? firestoreTimeToJS(dispenserInfo.startDate).toDateString() : 'No Info'}</Text>
                                <Text style={styles.text}>{dispenserInfo.endDate ? firestoreTimeToJS(dispenserInfo.endDate).toDateString() : 'No Info'}</Text>
                                <Text style={styles.text}>{dispenserInfo.weeklySchedule
                                    ? dispenserInfo.weeklySchedule.map((isScheduled, index) =>
                                        isScheduled ? getDayName(index) : null
                                    ).filter(day => day !== null).join(', ')
                                    : 'No Info'}
                                </Text>
                                <Text style={styles.text}>{dispenserInfo.dispenseTimes
                                    ? dispenserInfo.dispenseTimes.map(timestamp =>
                                        firestoreTimeToJS(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })
                                    ).join(', ')
                                    : 'No Info'}
                                </Text>
                                <View style={{left: 0, borderColor: 'black', borderRadius: 15, borderWidth: 2, height: 30, width: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={[styles.text, {fontSize: 10, left: -3}]}>{dispenserInfo.pillQuantity ? dispenserInfo.pillQuantity : '0'}</Text>
                                </View>
                                <View style={{left: 0, borderColor: 'black', borderRadius: 15, borderWidth: 2, height: 30, width: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={[styles.text, {left: -3, fontSize: 10, color: 'black'}]}>{dispenserInfo.pillsInDispenser ? dispenserInfo.pillsInDispenser : '0'}</Text>
                                </View>
                            </View>
                        </View>
                    <TouchableOpacity style={{marginBottom: 0, height: 30, width: 220, borderWidth: 2, borderRadius: 20, borderColor: 'black', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} 
                        onPress={active && bTaken ? toggleRefill : !active && aTaken ? toggleRefill : alertFunction}>
                        <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>REFILL THIS MEDICATION</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{marginBottom: 30, height: 30, width: 220, borderWidth: 2, borderRadius: 20, borderColor: 'black', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} 
                        onPress={active && bTaken ? toggleEditModal : !active && aTaken ? toggleEditModal : alertFunction}
                    >
                        <Text style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>EDIT INFO</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{top: 200, left: -40, width: 70, height: 70, backgroundColor: 'mediumpurple', borderWidth: 5, borderRadius: 35, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}} title="Add New Medication" onPress={toggleModal}>
                    <Text style={{left: 1, top: -3, fontWeight: 'bold', fontSize: 40, color: '#f8ffff'}}>+</Text>  
                </TouchableOpacity>
            </View>
            <Modal isVisible={isEditModal}>
                <View style={styles.editInfoContainer}>
                    <TouchableOpacity style={{top: 10, left: -150, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                        onPress={toggleEditModal}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                    </TouchableOpacity>
                    <Text style={{top: -15, marginTop: 0, fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline', color: 'black'}}>Edit Info</Text>
                    <View style={{marginTop: 20, height: 200, width: 260, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{top: -10, left: -20, justifyContent: 'space-evenly', alignItems: 'left', gap: 20}}>
                            <View style={{height: 40, width: 290, margin: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={[{left: 0}, styles.text]}>Start Date</Text>
                                <DateTimePicker 
                                    mode="date"
                                    value={editStart}
                                    onChange={editStartDateInput}
                                />  
                            </View>
                            <View style={{height: 40, width: 290, margin: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={[{left: 0}, styles.text]}>End Date</Text>
                                <DateTimePicker 
                                    mode="date"
                                    value={editEnd}
                                    onChange={editEndDateInput}
                                />  
                            </View>
                            <View style={{height: 40, width: 290, margin: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={[{left: -0}, styles.text]}>Dispense Times</Text>
                                <DateTimePicker 
                                    mode="time"
                                    value={editTime}
                                    onChange={editTimeInput}
                                />  
                                <TouchableOpacity style={{height: 35, width: 50, backgroundColor: 'lightgrey', borderWidth: 2, borderColor: 'black', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}
                                    onPress={addNewTime}>
                                    <Text style={{top: -2, fontWeight: 'bold', fontSize: 20}}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginBottom: 5, margin: 0, height: 40, width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                {dailyTimes.map(t => 
                                    <View id="times" style={{margin: 2, borderRadius: 10, borderWidth: 1, borderColor: 'black', height: 30, width: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'lightgray'}}>
                                        <Text style={{marginLeft: 2, fontWeight: 'bold', fontSize: 15}}>{t.getHours().toString().padStart(2, '0')}:{t.getMinutes().toString().padStart(2, '0')}</Text>
                                        <TouchableOpacity style={{right: 0, height: 30, width: 30, justifyContent: 'center', alignItems: 'center'}}
                                            onPress={() => removeDailyTime(t)}>
                                            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>X</Text>
                                        </TouchableOpacity>
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
                        <Pressable style={[styles.day, {backgroundColor: Monday ? '#6D28D9': 'mediumpurple'}]} onPress={() => { handleMondayClick(); editWeeklySched(); }}>
                            <Text style={styles.dayText}>Mo</Text>   
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Tuesday ? '#6D28D9': 'mediumpurple'}]} onPress={() => { handleTuesdayClick(); editWeeklySched(); }}>
                            <Text style={styles.dayText}>Tu</Text>
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Wednesday ? '#6D28D9': 'mediumpurple'}]} onPress={() => { handleWednesdayClick(); editWeeklySched(); }}>
                            <Text style={styles.dayText}>We</Text>
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Thursday ? '#6D28D9': 'mediumpurple'}]} onPress={() => { handleThursdayClick(); editWeeklySched(); }}>
                            <Text style={styles.dayText}>Th</Text>
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Friday ? '#6D28D9': 'mediumpurple'}]} onPress={() => { handleFridayClick(); editWeeklySched(); }}>
                            <Text style={styles.dayText}>Fr</Text>
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Saturday ? '#6D28D9': 'mediumpurple'}]} onPress={() => { handleSaturdayClick(); editWeeklySched(); }}>
                            <Text style={styles.dayText}>Sa</Text>
                        </Pressable>
                        <Pressable style={[styles.day, {backgroundColor: Sunday ? '#6D28D9': 'mediumpurple'}]} onPress={() => { handleSundayClick(); editWeeklySched(); }}>
                            <Text style={styles.dayText}>Su</Text>
                        </Pressable>
                    </View>
                    <TouchableOpacity style={{marginBottom: 20, top: -0, left: 0, width: 200, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                        onPress={changeInfo}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>DONE</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal isVisible={isRefill}>
                <View style={styles.refillContainer}>
                    <TouchableOpacity style={{top: 10, left: -150, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                        onPress={toggleRefill}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                    </TouchableOpacity>
                    <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>Refill Quantity?</Text>
                    <TextInput style={[styles.input, {height: 40, marginTop: 20, width: 200}]} keyboardType='numeric' onChangeText={num => setRefillValue(num)}/>
                    <TouchableOpacity style={{marginTop: 20, top: -0, left: 0, width: 200, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                        onPress={refillFunction}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal isVisible={isModalVisible} id='??'>
                <View style={styles.container}>
                    <KeyboardAwareScrollView contentContainerStyle={{width: 350}}>
                        <View style={{flexDirection: 'row', margin: 7, marginTop: 10}}>
                            <TouchableOpacity style={{top: -0, left: 0, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                                onPress={toggleModal}>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                            </TouchableOpacity>
                            <Text style={[styles.title, {left: 20}]}>Add New Medication</Text>
                            <TouchableOpacity style={{top: 0, left: 40, width: 30, height: 30, borderWidth: 2, borderColor: 'black', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: 'mediumpurple'}}
                                onPress={__startCamera}>
                                <Ionicons name="camera" size={20} color={'white'}/>
                            </TouchableOpacity>
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
                                    <DateTimePicker 
                                        mode="date"
                                        value={start}
                                        onChange={changeStart}
                                    />
                                </View>
                                <View style={{height: 40, width: 290, margin: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Text style={[{left: -5}, styles.text]}>End Date</Text>
                                    <DateTimePicker 
                                        mode="date"
                                        value={end}
                                        onChange={changeEnd}
                                    />
                                </View>
                                <Text style={styles.text}>Medication Dispenser</Text>
                                <TextInput style={[styles.inputAdd, {backgroundColor: 'lightgray'}]} value= {active ? "B" : "A"} editable={false} placeholder="Dispenser (A or B)" placeholderTextColor={'grey'}
                                    // onChangeText={text => setDispenserNumber(text)}
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
                                    <DateTimePicker 
                                        mode="time"
                                        value={editTime}
                                        onChange={editTimeInput}
                                    />  
                                    <TouchableOpacity style={{height: 35, width: 50, backgroundColor: 'lightgrey', borderWidth: 2, borderColor: 'black', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}
                                        onPress={addNewTime}>
                                        <Text style={{top: -2, fontWeight: 'bold', fontSize: 20}}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginBottom: 5, margin: 0, height: 40, width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    {dailyTimes.map(t => 
                                        <View id="times" style={{margin: 2, borderRadius: 10, borderWidth: 1, borderColor: 'black', height: 30, width: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'lightgray'}}>
                                            <Text style={{marginLeft: 2, fontWeight: 'bold', fontSize: 15}}>{t.getHours().toString().padStart(2, '0')}:{t.getMinutes().toString().padStart(2, '0')}</Text>
                                            <TouchableOpacity style={{right: 0, height: 30, width: 30, justifyContent: 'center', alignItems: 'center'}}
                                                onPress={() => removeDailyTime(t)}>
                                                <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>X</Text>
                                            </TouchableOpacity>
                                        </View>  
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity style={{width: 200, height: 30, backgroundColor: 'mediumpurple', borderWidth: 2, borderRadius: 5, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginBottom: 10, padding: 2}} title="Add New Medication" onPress={addMedication}>
                                <Text style={{fontWeight: 'bold', fontSize: 15, color: 'white'}}>Submit</Text>
                            </TouchableOpacity>
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
        backgroundColor: '#E6E6FA',
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