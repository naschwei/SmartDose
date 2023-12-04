import * as React from 'react';
import { ScrollView, StyleSheet, Pressable, TextInput, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useState} from 'react';

import { getAuth, updatePassword, deleteUser, EmailAuthProvider } from 'firebase/auth';
import { doc, setDoc, collection, increment, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from "../../firebase.js"

import { signOut } from 'firebase/auth';

import { setNotifications, scheduleWeeklyNotification, cancelNotification } from '../../notifs.js';

import {
    Colors,
    InnerContainer,
    StyledButton,
    ButtonText,
    StyledButtonRefresh,
    Avatar
} from './../../components/styles';

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

export default function SettingsScreen({ navigation }) {
    const [ isModalOneVisible, setIsModalOneVisible ] = useState(false);
    const [ isModalTwoVisible, setIsModalTwoVisible ] = useState(false);
    const [ isModalThreeVisible, setIsModalThreeVisible ] = useState(false);
    const [ confirmPasswordModal, setConfirmPasswordModal ] = useState(false); // modal for confirming password on delete account
    const [ Monday, changeMonday ] = useState(false);
    const [ Tuesday, changeTuesday ] = useState(false);
    const [ Wednesday, changeWednesday ] = useState(false);
    const [ Thursday, changeThursday ] = useState(false);
    const [ Friday, changeFriday ] = useState(false);
    const [ Saturday, changeSaturday ] = useState(false);
    const [ Sunday, changeSunday ] = useState(false);
    const [ Dispenser1, changeDispenserOne ] = useState(false);
    const [ Dispenser2, changeDispenserTwo ] = useState(false);

    const [medicationName, setMedicationName] = useState("");
    const [pillsInDispenser, setPillsInDispenser] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dispenserNumber, setDispenserNumber] = useState("");
    const [weeklySchedule, setWeeklySchedule] = useState([]);
    const [dispenseTimes, setDispenseTimes] = useState("");
    const [dispenseTimesList, setDispenseTimesList] = useState([]);

    const [ medicationOne, changeMedicationOne ] = useState(false);
    const [ medicationTwo, changeMedicationTwo ] = useState(false);

    const [ medicationOneDocId, setMedicationOneDocId ] = useState("");
    const [ medicationTwoDocId, setMedicationTwoDocId ] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [confirmDeleteAccountPass, setConfirmDeleteAccountPass] = useState("");

    const handleMondayClick = () => {changeMonday(!Monday);};
    const handleTuesdayClick = () => {changeTuesday(!Tuesday);};
    const handleWednesdayClick = () => {changeWednesday(!Wednesday);};
    const handleThursdayClick = () => {changeThursday(!Thursday);};
    const handleFridayClick = () => {changeFriday(!Friday);};
    const handleSaturdayClick = () => {changeSaturday(!Saturday);};
    const handleSundayClick = () => {changeSunday(!Sunday);};

    const handleDispenserOne = () => {changeDispenserOne(!Dispenser1);};
    const handleDispenserTwo = () => {changeDispenserTwo(!Dispenser2);};

    const toggleModalOne = () => {
        setIsModalOneVisible(!isModalOneVisible);
    };

    const toggleModalTwoA = () => {
        setIsModalTwoVisible(!isModalTwoVisible);
        
        changeMedicationOne(!medicationOne);
    };

    const toggleModalTwoB = () => {
        setIsModalTwoVisible(!isModalTwoVisible);

        changeMedicationTwo(!medicationTwo);
    }

    const toggleModalThree = () => {
        setIsModalThreeVisible(!isModalThreeVisible);

        changeDispenserOne(false);
        changeDispenserTwo(false);
    };

    const toggleModalTwo = () => {
        setIsModalTwoVisible(!isModalTwoVisible);

        changeMedicationOne(false);
        changeMedicationTwo(false);
    }

    const toggleDeleteAccountModal = () => {
        setConfirmPasswordModal(!confirmPasswordModal);
    }


    const __deleteMedication = () => {
        // Delete medication A or B or both!!

        const auth = getAuth();
        const user = auth.currentUser;

        // Helper function to delete medication from the 'sched' collection
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

        // Helper function to delete medication from the 'meds' collection
        const deleteMedicationFromMeds = async (dispenserNumber) => {
            try {
                const medsSnapshot = await db.collection("meds").where("user", "==", user.uid).get();

                await Promise.all(
                    medsSnapshot.docs.map(async (medToDelete) => {
                        if (medToDelete.data().dispenserNumber == dispenserNumber) {
                            console.log("Doc id for meds delete is ", medToDelete.id);
                            await deleteDoc(doc(db, "meds", medToDelete.id));
                            console.log("Deleted doc id ", medToDelete.id);
                        }
                    })
                );
                console.log("Deleted meds from meds");
            } catch (error) {
                console.error("Error deleting medication from 'meds' collection:", error);
                throw error; 
            }
        };


        if (Dispenser1 && !Dispenser2) {
            // DELETE ONLY DISPENSER ONE

            deleteMedicationFromSched("1")
            .then(() => {
                // Additional deletion logic specific to Dispenser1 if needed
                return deleteMedicationFromMeds("1")
            })
            .catch((error) => {
                // Handle errors from the deletion process
                console.error("Error deleting medication from Dispenser 1:", error);
                // Add any specific error handling for Dispenser1 here
            });


        } else if (!Dispenser1 && Dispenser2) {
            // DELETE ONLY DISPENSER TWO

            deleteMedicationFromSched("2")
            .then(() => {
                // Additional deletion logic specific to Dispenser1 if needed
                return deleteMedicationFromMeds("2")
            })
            .catch((error) => {
                // Handle errors from the deletion process
                console.error("Error deleting medication from Dispenser 2:", error);
            });

        } else if (Dispenser1 && Dispenser2) {
            // DELETE BOTH DISPENSERS

            deleteMedicationFromSched("1")
            .then(() => {
                deleteMedicationFromMeds("1");
            })
            .then(() => {
                deleteMedicationFromSched("2");
            })
            .then(() => {
                deleteMedicationFromMeds("2");
            })
            .catch((error) => {
                console.error("Error deleting medication from Dispenser 1 and 2:", error);
            });


        } else {
            alert('PLEASE CHOOSE A DISPENSER');
        }
    }

    const __changeCredentials = () => {
        const auth = getAuth();
        const user = auth.currentUser;

        // CONFIRM NEW PASSWORD AND CONFIRM NEW PASSWORD ARE THE SAME
        if (newPassword != confirmNewPassword) {
            alert('YOU FOOL');
            return;
        }

        updatePassword(user, newPassword).then(() => {
            console.log("Password update successful");
            alert("Password update successful!");
            // Update successful.
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });


    }

    const deleteAccount = async () => {

        // TODO: TESTTTT TEST TESTSTTSTSTS

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            const credentials = EmailAuthProvider.credential(user.email, confirmDeleteAccountPass);
            await user.reauthenticateWithCredential(user, credentials);

            changeDispenserOne(true);
            changeDispenserTwo(true);

            await __deleteMedication();
            console.log("Deleted medications from db");

            await deleteUser(user);
            console.log("User successfully deleted.");

            alert("Account has been deleted.");
            navigation.replace("Signup");

        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    }

    return (
        <View style={{marginTop: 60, height: '80%', alignItems: 'center', justifyContent: 'space-between'}}>
            <StyledButton onPress={toggleModalOne} style={{width: 300, justifyContent: 'center', alignItems: 'center'}}>
                <ButtonText> Change My Credentials </ButtonText>
            </StyledButton>
            <StyledButton onPress={toggleDeleteAccountModal} style={{width: 300, justifyContent: 'center', alignItems: 'center'}}>
                <ButtonText> Delete My Account </ButtonText>
            </StyledButton>
            <StyledButton onPress={toggleModalThree} style={{width: 300, justifyContent: 'center', alignItems: 'center'}}>
                <ButtonText> Delete Medication </ButtonText>
            </StyledButton>
            <StyledButton onPress={handleSignOut} style={{width: 300, justifyContent: 'center', alignItems: 'center'}}>
                <ButtonText> Logout </ButtonText>
            </StyledButton>
            <Modal isVisible={isModalOneVisible}>
                <View style={styles.container1}>
                    <View style={{marginTop: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', margin: 7, marginTop: 10}}>
                           <Pressable style={{top: -0, left: -20, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                                onPress={toggleModalOne}>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                            </Pressable>
                            <Text style={styles.title}>CHANGE CREDENTIALS</Text> 
                        </View>
                        <TextInput style={styles.input} placeholder="New Password" placeholderTextColor={'grey'} onChangeText={text => setNewPassword(text)}/>
                        <TextInput style={styles.input} placeholder="Confirm New Password" placeholderTextColor={'grey'} onChangeText={text => setConfirmNewPassword(text)}/>
                        <Pressable style={{width: 200, height: 30, backgroundColor: 'mediumpurple', borderWidth: 2, borderRadius: 5, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 10, padding: 2}} 
                            onPress={__changeCredentials}>
                            <Text style={{fontWeight: 'bold', fontSize: 15, color: 'white'}}>Change Credentials</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal isVisible={isModalTwoVisible}>
                <View style={styles.container3}>
                    <KeyboardAwareScrollView contentContainerStyle={{width: 375}}>
                        <View style={{flexDirection: 'row', margin: 0, marginTop: 10}}>
                            <Pressable style={{top: -0, left: 10, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                                onPress={toggleModalTwo}>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                            </Pressable>
                            <Text style={[styles.title, {left: 50}]}>Manage Medication</Text>
                        </View>
                        <View style={styles.container2}>
                            <View style={styles.items}>
                                <Text style={styles.text}>Medication Dispenser</Text>
                                <TextInput style={[styles.input, {backgroundColor: 'lightgray'}]} editable={false} value={medicationOne ? "A" : "B"}/>
                                <Text style={styles.text}>Refill Medication?</Text>
                                <TextInput style={styles.input} placeholder="Pill Quantity" placeholderTextColor={'grey'} 
                                    onChangeText={text => setPillsInDispenser(text)}
                                    keyboardType='numeric'
                                />
                                <Text style={styles.text}>Change Start Date?</Text>
                                <TextInput style={styles.input} placeholder="Change Start Date" placeholderTextColor={'grey'} 
                                    onChangeText={text => setStartDate(text)}
                                />
                                <Text style={styles.text}>Change End Date?</Text>
                                <TextInput style={styles.input} placeholder="Change End Date" placeholderTextColor={'grey'} 
                                    onChangeText={text => setEndDate(text)}
                                />
                                <Text style={styles.text}>Change Weekly Schedule?</Text>
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
                                <Text style={styles.text}>Change Daily Dispense Schedule?</Text>
                                <TextInput style={styles.input} placeholder="Change Dispense Times (Each Day)" placeholderTextColor={'grey'} onChangeText={text => setDispenseTimes(text)} />
                            </View>
                            <Pressable style={{width: 200, height: 30, backgroundColor: 'mediumpurple', borderWidth: 2, borderRadius: 5, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginTop: 3, marginBottom: 10, padding: 2}}
                                onPress={alert("hi")}>
                                <Text style={{fontWeight: 'bold', fontSize: 15, color: 'white'}}>Change Medication</Text>
                            </Pressable>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </Modal>
            <Modal isVisible={isModalThreeVisible}>
                <View style={{top: -50, height: 300, width: 375, backgroundColor: 'grey', borderWidth: 10, borderRadius: 25, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', margin: 7, marginTop: 10}}>
                        <Pressable style={{top: -0, left: -10, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                            onPress={toggleModalThree}>
                            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                        </Pressable>
                        <Text style={{fontWeight: 'bold', fontSize: 24, color: 'white'}}>CHOOSE MEDICATION(S)</Text> 
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: 350}}>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{width: 30, height: 25, borderWidth: 3, backgroundColor: '#f8ffff', justifyContent:'center', alignItems: 'center'}}>
                                <Text style={{color: 'black', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>A</Text>
                            </View>
                            <Pressable style={[styles.grid, {backgroundColor: Dispenser1 ? 'mediumpurple' : '#f8ffff'}]} onPress={handleDispenserOne}></Pressable>
                        </View>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{width: 30, height: 25, borderWidth: 3, backgroundColor: '#f8ffff', justifyContent:'center', alignItems: 'center'}}>
                                <Text style={{color: 'black', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>B</Text>
                            </View>
                            <Pressable style={[styles.grid, {backgroundColor: Dispenser2 ? 'mediumpurple' : '#f8ffff'}]} onPress={handleDispenserTwo}></Pressable>
                        </View>
                    </View>
                    <Pressable style={{width: 200, height: 30, backgroundColor: 'mediumpurple', borderWidth: 2, borderRadius: 5, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginBottom: 10, padding: 2}} 
                        onPress={__deleteMedication}>
                        <Text style={{fontWeight: 'bold', fontSize: 15, color: 'white'}}>DELETE MEDICATION(S)</Text>
                    </Pressable>
                </View>
            </Modal>
            <Modal isVisible={confirmPasswordModal}>
                <View style={[styles.container1, {height: 240}]}>
                    <Pressable style={{top: 10, left: -150, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                        onPress={toggleDeleteAccountModal}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                    </Pressable>
                    <Text style={[styles.text, {marginTop: 0, fontSize: 30}]}>Delete Account?</Text>
                    <Text style={[styles.text, {margin: 5, marginBottom: 10}]}>Please Confirm Your Password</Text>
                    <TextInput style={styles.input}
                        placeholder='My Password'
                        placeholderTextColor={'gray'}
                        secureTextEntry={true}
                        value={confirmDeleteAccountPass}
                        onChangeText={text => setConfirmDeleteAccountPass(text)}
                    />
                    <Pressable style={{margin: 15, width: 200, height: 30, backgroundColor: 'red', borderWidth: 2, borderRadius: 5, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginBottom: 10, padding: 2}}
                        onPress={deleteAccount}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>SUBMIT</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
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
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        margin: 3,
        marginLeft: 10,
        marginBottom: 3,
        textShadowColor: 'white',
        textShadowOffset: {width: 1, height: 2},
        textShadowRadius: 2
    },
    container1: {
        backgroundColor: '#E6E6FA',
        alignItems: 'center',
        width: 375,
        height: 220,
        marginBottom: 0,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: 'black'
    },
    container4: {
        backgroundColor: '#E6E6FA',
        alignItems: 'center',
        width: 375,
        height: 220,
        marginBottom: 0,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: 'black'
    },
    container3: {
        backgroundColor: '#E6E6FA',
        alignItems: 'center',
        width: 375,
        height: 545,
        marginBottom: 0,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: 'black',
        top: 0
    },
    input: {
        width: 300,
        height: 40,
        backgroundColor: '#fff',
        //paddingVertical: 20,
        paddingHorizontal: 5,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 15, 
        fontSize: 16,
        margin: 5,
        color: '#000',
        fontWeight: 'bold'
    },
    days: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        //margin: 3,
        marginTop: 3
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
        margin: 3
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textShadowColor: 'white',
        textShadowOffset: {width: 1, height: 2},
        textShadowRadius: 2,
    },
    bigtitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        textShadowColor: 'white',
        textShadowOffset: {width: 1, height: 2},
        textShadowRadius: 2,
        marginTop: 10,
    }
});


// Edit Medication
// 1. Change Container
// 2. Change Mediction Name
// 3. Change Schedule
// 4. 