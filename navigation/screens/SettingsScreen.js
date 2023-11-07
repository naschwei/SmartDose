import * as React from 'react';
import { StyleSheet, Pressable, TextInput, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useState} from 'react';

export default function SettingsScreen({ navigation }) {
    const [ isModalOneVisible, setIsModalOneVisible ] = useState(false);
    const [ isModalTwoVisible, setIsModalTwoVisible ] = useState(false);
    const [ isModalThreeVisible, setIsModalThreeVisible ] = useState(false);
    const [ Monday, changeMonday ] = useState(false);
    const [ Tuesday, changeTuesday ] = useState(false);
    const [ Wednesday, changeWednesday ] = useState(false);
    const [ Thursday, changeThursday ] = useState(false);
    const [ Friday, changeFriday ] = useState(false);
    const [ Saturday, changeSaturday ] = useState(false);
    const [ Sunday, changeSunday ] = useState(false);

    const [medicationName, setMedicationName] = useState("")
    const [pillQuantity, setPillQuantity] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [dispenserNumber, setDispenserNumber] = useState("")
    const [weeklySchedule, setWeeklySchedule] = useState([])
    const [dispenseTimes, setDispenseTimes] = useState("")


    const handleMondayClick = () => {changeMonday(!Monday);};
    const handleTuesdayClick = () => {changeTuesday(!Tuesday);};
    const handleWednesdayClick = () => {changeWednesday(!Wednesday);};
    const handleThursdayClick = () => {changeThursday(!Thursday);};
    const handleFridayClick = () => {changeFriday(!Friday);};
    const handleSaturdayClick = () => {changeSaturday(!Saturday);};
    const handleSundayClick = () => {changeSunday(!Sunday);};

    const toggleModalOne = () => {
        setIsModalOneVisible(!isModalOneVisible);
    };

    const toggleModalTwo = () => {
        setIsModalTwoVisible(!isModalTwoVisible);
    };

    const toggleModalThree = () => {
        setIsModalThreeVisible(!isModalThreeVisible);
    };

    return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.bigtitle}>SETTINGS</Text>
            <View style={{width: 400, height: 100, backgroundColor: 'grey', borderWidth: 5, borderRadius: 20, borderColor:'black', justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                <Pressable style={{width: 300, height: 50, backgroundColor: 'mediumpurple', borderWidth: 5, borderRadius: 20, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}} title="Change Credentials" onPress={toggleModalOne}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#f8ffff'}}>CHANGE MY CREDENTIALS</Text>  
                </Pressable>
            </View>
            <View style={{width: 400, height: 100, backgroundColor: 'grey', borderWidth: 5, borderRadius: 20, borderColor:'black', justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                <Pressable style={{width: 300, height: 50, backgroundColor: 'mediumpurple', borderWidth: 5, borderRadius: 20, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}} title="Change Credentials" onPress={toggleModalTwo}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#f8ffff'}}>MANAGE MEDICATION A</Text>  
                </Pressable>
            </View>
            <View style={{width: 400, height: 100, backgroundColor: 'grey', borderWidth: 5, borderRadius: 20, borderColor:'black', justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                <Pressable style={{width: 300, height: 50, backgroundColor: 'mediumpurple', borderWidth: 5, borderRadius: 20, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}} title="Change Credentials" onPress={toggleModalTwo}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#f8ffff'}}>MANAGE MEDICATION B</Text>  
                </Pressable>
            </View>
            <View style={{width: 400, height: 100, backgroundColor: 'grey', borderWidth: 5, borderRadius: 20, borderColor:'black', justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                <Pressable style={{width: 300, height: 50, backgroundColor: 'mediumpurple', borderWidth: 5, borderRadius: 20, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}} title="Change Credentials" onPress={toggleModalThree}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#f8ffff'}}>DELETE MEDICATION</Text>  
                </Pressable>
            </View>
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
                        <TextInput style={styles.input} placeholder="New Password" placeholderTextColor={'grey'}/>
                        <TextInput style={styles.input} placeholder="Confirm New Password" placeholderTextColor={'grey'}/>
                        <Pressable style={{width: 200, height: 30, backgroundColor: 'mediumpurple', borderWidth: 2, borderRadius: 5, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 10, padding: 2}} title="Change Credentials" onPress={toggleModalOne}>
                            <Text style={{fontWeight: 'bold', fontSize: 15, color: 'white'}}>Submit</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal isVisible={isModalTwoVisible}>
                <KeyboardAwareScrollView>
                    <View style={styles.container3}>
                        <View style={{flexDirection: 'row', margin: 7, marginTop: 10}}>
                            <Pressable style={{top: -0, left: -20, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                                onPress={toggleModalTwo}>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                            </Pressable>
                            <Text style={styles.title}>Manage Medication</Text>
                        </View>
                        <View style={styles.container2}>
                            <View style={styles.items}>
                                <TextInput style={styles.input} placeholder="Medication Name" placeholderTextColor={'grey'} 
                                    onChangeText={text => setMedicationName(text)}
                                />
                                <TextInput style={styles.input} placeholder="Pill Quantity" placeholderTextColor={'grey'} 
                                    onChangeText={text => setPillQuantity(text)}
                                />
                                <TextInput style={styles.input} placeholder="Start Date" placeholderTextColor={'grey'} 
                                    onChangeText={text => setStartDate(text)}
                                />
                                <TextInput style={styles.input} placeholder="End Date" placeholderTextColor={'grey'} 
                                    onChangeText={text => setEndDate(text)}
                                />
                                <Text style={styles.text}>Dispenser Number</Text>
                                <TextInput style={[styles.input, {backgroundColor: 'lightgray'}]} editable={false} placeholder="Dispenser Number" placeholderTextColor={'grey'}
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
                                <TextInput style={styles.input} placeholder="Dispense Times (Each Day)" placeholderTextColor={'grey'} onChangeText={text => setDispenseTimes(text)} />
                            </View>
                            <Pressable style={{width: 200, height: 30, backgroundColor: 'mediumpurple', borderWidth: 2, borderRadius: 5, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginBottom: 10, padding: 2}} title="Add New Medication">
                                <Text style={{fontWeight: 'bold', fontSize: 15, color: 'white'}}>Submit</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </Modal>
            <Modal visible={isModalThreeVisible}>
                <View style={styles.container4}>

                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
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
        height: 500,
        marginBottom: 0,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: 'black',
        top: 150
    },
    input: {
        width: 300,
        height: 40,
        backgroundColor: '#fff',
        paddingVertical: 20,
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
        margin: 2
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
        marginTop: 5
    }
});


// Edit Medication
// 1. Change Container
// 2. Change Mediction Name
// 3. Change Schedule
// 4. 