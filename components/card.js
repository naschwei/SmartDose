import React from 'react';
import {StyleSheet, View, Text, Dimensions, Button} from 'react-native';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

import { auth, db } from "../firebase.js"

import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from "firebase/firestore"; 

export default function Card(props) {


    
    const getMedications = () => {

        const user = auth.currentUser;
        const user_medications = [];

        db.collection("meds").where("user", "==", user.uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                user_medications.push(doc.data());
                console.log(user_medications);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        })


        // getDocs(collection(db, "meds"))
        // .then((query) => {
        //     query.forEach((doc) => {
        //         console.log(`${doc.id} => ${doc.data()}`);
        //     });
        // })
    }




    return (
        // how to do it with {props.children}
        <>
        <View style= {styles.cardContainer}>
            <View style={styles.cardContent}> 
                <Text style={styles.titleStyle}> Medication </Text>
                <Text> 2 pill(s) </Text>
                <Text> Scheduled for: 8:00am </Text>
                <Ionicons name="checkmark-circle-outline" size={50} iconColor="#5F8575" style={{ position: 'absolute', right: 0 }}/>
            </View>
        </View>
        <View style= {styles.cardContainer}>
            <View style={styles.cardContent}> 
                    <Text style={styles.titleStyle}> Medication </Text>
                    <Text> 1 pill(s) </Text>
                    <Text> Scheduled for: 11:00am </Text>
                    <Ionicons name="alert-circle-outline" size={50} iconColor="#5F8575" style={{ position: 'absolute', right: 0 }}/>
            </View>
        </View>
        <View style= {styles.cardContainer}>
            <View style={styles.cardContent}> 
                <Text style={styles.titleStyle}> Medication </Text>
                <Text> 3 pill(s) </Text>
                <Text> Scheduled for: 2:00pm </Text>
                <Ionicons name="alarm-outline" size={50} iconColor="#5F8575" style={{ position: 'absolute', right: 0 }}/>
            </View>
        </View>
        <View style= {styles.cardContainer}>
            <View style={styles.cardContent}> 
                <Text style={styles.titleStyle}> Medication </Text>
                <Text> 3 pill(s) </Text>
                <Text> Scheduled for: 9:00pm </Text>
                <Ionicons name="time-outline" size={50} iconColor="#5F8575" style={{ position: 'absolute', right: 0 }}/>
            </View>
        </View>
        </>
    )
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

// import AWS from 'aws-sdk/dist/aws-sdk-react-native';

// async function getAllUserMedications(userID) {

//     const dynamoDB = new AWS.DynamoDB();
    
//     const params = {
//         TableName: 'medications',
//         KeyConditionExpression: 'userID = :userID',
//         ExpressionAttributeValues: {
//             ':userID': { S: userID },
//         },
//     };

//     try {
//         const data = await dynamoDB.query(params).promise();
//         return data;
//     } catch (err) {
//         console.error('Error retrieving user medication data: ', err);
//         return null;
//     }
// }

// export default function Card(props) {
//     // Introduce state
//     const [medications, setMedications] = useState([]);

// // Call getAllUserMedications on component mount
// useEffect(() => {
//     // Replace 'userID' below with the actual user's ID
//     getAllUserMedications('userID', (err, data) => {
//         if (err) {
//           console.error('Error retrieving medical data: ', err);
//         } else {
//           setMedications(data.Items);
//         }
//     });
// }, []);

// // Update render to map medication to card display
// return (
//     medications.map((medication) => (
//         <View key={medication.medID.S} style= {styles.cardContainer}>
//             <View style={styles.cardContent}> 
//                 <Text style={styles.titleStyle}> {medication.name.S} </Text>
//                 <Text> {medication.doseQuantity.S} pill(s) </Text>
//                 <Text> Scheduled for: {medication.doseTimings.SS[1]}:{medication.doseTimings.SS[0]} </Text>
//                 {/* You might want to replace the icons based on some conditions */}
//                 <Ionicons name="checkmark-circle-outline" size={50} iconColor="#5F8575" style={{ position: 'absolute', right: 0 }}/>
//             </View>
//         </View>
//     ))
// );
// }