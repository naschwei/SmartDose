//import * as React from 'react';
import React, {useState} from 'react';
import { TouchableOpacity, SafeAreaView, Button, View, TextInput, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
//import {CheckBox} from 'react-native-elements';

const Item = ({name, isSelected}) => {
    return(
        <View>
            <Text style={{color: 'black'}}>{name}</Text>
        </View>
    );
}

const DATA = [
    {
        id: 'Mon',
        title: 'Mo',
        isSeleted: false,
    },
    {
        id: 'Tue',
        title: 'Tu',
        isSeleted: false,
    },
    {
        id: 'Wed',
        title: 'We',
        isSeleted: false,
    },
    {
        id: 'Thu',
        title: 'Th',
        isSeleted: false,
    },
    {
        id: 'Fri',
        title: 'F',
        isSeleted: false,
    },
    {
        id: 'Sat',
        title: 'Sa',
        isSeleted: false,
    },
    {
        id: 'Sun',
        title: 'Su',
        isSeleted: false,
    }
]

const renderItem = ({item}) => (
    <Item name={item.title}/>
);

global.Monday = false;
const Tuesday = false;
const Wednesday = false;
const Thursday = false;
const Friday = false;
const Saturday = false;
const Sunday = false;


export default function ManageScreen({ navigation }) {
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const onPress = (day) => {
        // alert(day);
        //import global.Monday;
        
        //alert(day);
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Button style={styles.button} title="Click Here To Add New Medication" onPress={toggleModal}/>
            <Modal isVisible={isModalVisible}>
                <View style={styles.container}>
                    <View style={styles.container2}>
                        <Text style={styles.title}>Add New Medication</Text>
                        <View style={styles.items}>
                            <TextInput style={styles.input} placeholder="Medication Name" placeholderTextColor={'grey'} />
                            <TextInput style={styles.input} placeholder="Pill Quantity" placeholderTextColor={'grey'} />
                            <TextInput style={styles.input} placeholder="End Date" placeholderTextColor={'grey'} />
                            <TextInput style={styles.input} placeholder="Dispenser Number" placeholderTextColor={'grey'}/>
                            <Text style={styles.text}>Select Weekly Schedule</Text>
                            <SafeAreaView style={styles.days}>
                                <View style={[styles.day, {backgroundColor: Monday ? 'blue': '#f0ffff'}]}>
                                    <Text style={styles.dayText}>Mo</Text>   
                                </View>
                                <View style={styles.day}>
                                    <Text style={styles.dayText}>Tu</Text>
                                </View>
                                <View style={styles.day}>
                                    <Text style={styles.dayText}>We</Text>
                                </View>
                                <View style={styles.day}>
                                    <Text style={styles.dayText}>Th</Text>
                                </View>
                                <View style={styles.day}>
                                    <Text style={styles.dayText}>Fr</Text>
                                </View>
                                <View style={styles.day}>
                                    <Text style={styles.dayText}>Sa</Text>
                                </View>
                                <View style={styles.day}>
                                    <Text style={styles.dayText}>Su</Text>
                                </View>
                            </SafeAreaView>
                            <TextInput style={styles.input} placeholder="Dispense Times (Each Day)" placeholderTextColor={'grey'}/>
                        </View>
                        <Button title='Submit' onPress={toggleModal}/>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// name
// quantity
// days
// end
// feeder number

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E6E6FA',
        alignItems: 'center',
        //justifyContent: 'center',
        width: 375,
        height: 450,
        paddingBottom: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        margin: 5,
        marginLeft: 10,
        marginBottom: 10
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
        justifyContent: 'space-evenly'
    },
    input: {
        width: 300,
        height: 40,
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 15, 
        fontSize: 16,
        margin: 5
    },
    days: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        //paddingTop: 20,
        marginTop: 0,
        marginBottom: 0
    },
    day: {
        width: 40,
        height: 40,
        backgroundColor: '#f0ffff',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold'
    },
    dayText: {
        fontWeight: 'bold',
    }
});

/* <Text
    onPress={() => navigation.navigate('Home')}
    style={{ fontSize: 26, fontWeight: 'bold'}}>Manage Medication Screen
</Text> */

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