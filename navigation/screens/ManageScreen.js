//import * as React from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { getAuth } from 'firebase/auth';
import { addDoc, doc, setDoc, collection } from 'firebase/firestore';
import React, {useState} from 'react';
import { ImageBackground, Switch, Pressable, TouchableOpacity, SafeAreaView, Button, View, TextInput, StyleSheet, Text, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';
import {Camera, CameraType} from 'expo-camera';
//import {CheckBox} from 'react-native-elements';

import * as MediaLibrary from 'expo-media-library';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { auth, db } from "../../firebase.js"

export default function ManageScreen({ navigation }) {
    const [medicationName, setMedicationName] = useState("")
    const [pillQuantity, setPillQuantity] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [dispenserNumber, setDispenserNumber] = useState("")
    const [weeklySchedule, setWeeklySchedule] = useState([])
    const [dispenseTimes, setDispenseTimes] = useState("")

    const [ isModalVisible, setIsModalVisible ] = useState(false);
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
        if (Dispenser1 && Dispenser2) {
            alert('PLEASE SELECT ONLY ONE DISPENSER');
        } else if (Dispenser1 == false && Dispenser2 == false) {
            alert('PLEASE SELECT A DISPENSER');
        } else {
            setIsModalVisible(!isModalVisible);

            // set the number of the dispenser selected.
            if (isModalVisible) {
                if (Dispenser1) {
                    setDispenserNumber('1');
                } else {
                    setDispenserNumber('2');
                }
            }
        }
    };

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
    const [permissionResponse, requestMediaPermission] = MediaLibrary.usePermissions();

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
 
    const addMedication = () => {

        const auth = getAuth();
        const user = auth.currentUser;

        if (Dispenser1) {
            setDispenserNumber("1");
        } else {
            setDispenserNumber("2");
        }

        const schedArray = [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday];
        setWeeklySchedule(schedArray);

        const docInfo = {
            user: user.uid,
            medicationName: medicationName,
            pillQuantity: pillQuantity,
            startDate: startDate,
            endDate: endDate,
            dispenserNumber: dispenserNumber,
            weeklySchedule: weeklySchedule,
            dispenseTimes: dispenseTimes
        };
        addDoc(collection(db, "meds"), docInfo)
        .then(() => {
            console.log("Successfully added medication.");
            toggleModal();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        })
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
            <Text style={{top: -110, fontWeight: 'bold', fontSize: 28}}>Select Dispenser</Text>
            <Text style={{width: 300, top:-90, fontSize: 14}}>(1) The grid below matches the containers on your SmartDose Dispenser</Text>
            <Text style={{width: 300, top: -80, fontSize: 14}}>(2) Select a container and hit the 'Add New Medication' button!</Text>
            <View style={{top: -50, height: 300, width: 375, backgroundColor: 'grey', borderWidth: 10, borderRadius: 25, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
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
            </View>
            <Pressable style={{width: 300, height: 50, backgroundColor: 'mediumpurple', borderWidth: 5, borderRadius: 20, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}} title="Add New Medication" onPress={toggleModal}>
                <Text style={{fontWeight: 'bold', fontSize: 25, color: '#f8ffff'}}>Add New Medication</Text>  
            </Pressable>
            <Modal isVisible={isModalVisible} id='??'>
                <KeyboardAvoidingView behavior="padding" style={styles.container}>
                    <View style={{flexDirection: 'row', margin: 7, marginTop: 10}}>
                        <Pressable style={{top: -0, left: -20, width: 30, height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black', borderRadius: 5}}
                            onPress={toggleModal}>
                            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>X</Text>
                        </Pressable>
                        <Text style={styles.title}>Add New Medication</Text>
                        <Pressable style={{top: 0, left: 20, width: 30, height: 30, borderWidth: 2, borderColor: 'black', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: 'mediumpurple'}}
                            onPress={__startCamera}>
                            <Ionicons name="camera" size={20} color={'white'}/>
                        </Pressable>
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
                            <TextInput style={[styles.input, {backgroundColor: 'lightgray'}]} value= {Dispenser1 ? "1" : "2"} editable={false} placeholder="Dispenser Number" placeholderTextColor={'grey'}
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
                        <Pressable style={{width: 200, height: 30, backgroundColor: 'mediumpurple', borderWidth: 2, borderRadius: 5, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginBottom: 10, padding: 2}} title="Add New Medication" onPress={addMedication}>
                            <Text style={{fontWeight: 'bold', fontSize: 15, color: 'white'}}>Submit</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
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
        height: 510,
        marginBottom: 0,
        borderWidth: 10,
        borderRadius: 20,
        borderColor: 'black'
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
        width: 300,
        height: 40,
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 5,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 15, 
        fontSize: 16,
        margin: 3,
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