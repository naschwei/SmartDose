// Same as card.js but with different styling

import React from 'react';
import {StyleSheet, View, Text, Dimensions, Button} from 'react-native';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

export default function AgendaCard(props) {
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
        </>
    )
}

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles=StyleSheet.create({
    cardContainer: {
        width: deviceWidth - 70,
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