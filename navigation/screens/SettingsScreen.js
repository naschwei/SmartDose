import * as React from 'react';
import { StyleSheet, Pressable, TextInput, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import {useState} from 'react';

export default function SettingsScreen({ navigation }) {
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.bigtitle}>SETTINGS PAGE</Text>
            <View style={{width: 400, height: 100, backgroundColor: 'grey', borderWidth: 5, borderRadius: 20, borderColor:'black', justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                <Pressable style={{width: 300, height: 50, backgroundColor: 'mediumpurple', borderWidth: 5, borderRadius: 20, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}} title="Change Credentials" onPress={toggleModal}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#f8ffff'}}>CHANGE MY CREDENTIALS</Text>  
                </Pressable>
            </View>
            <Modal isVisible={isModalVisible}>
                <View style={styles.container}>
                    <View style={{marginTop: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.title}>CHANGE CREDENTIALS</Text>
                        <TextInput style={styles.input} placeholder="New Password" placeholderTextColor={'grey'}/>
                        <TextInput style={styles.input} placeholder="Confirm New Password" placeholderTextColor={'grey'}/>
                        <Pressable style={{width: 200, height: 30, backgroundColor: 'mediumpurple', borderWidth: 2, borderRadius: 5, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 10, padding: 2}} title="Change Credentials" onPress={toggleModal}>
                            <Text style={{fontWeight: 'bold', fontSize: 15, color: 'white'}}>Submit</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E6E6FA',
        alignItems: 'center',
        width: 375,
        height: 200,
        marginBottom: 0,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: 'black'
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