import React, {useState} from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Pressable, Box} from 'react-native';
import { Agenda } from "react-native-calendars";
//import {Card} from 'react-native-paper';
import AgendaCard from './../../components/agendaCard';

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

const BoxSimple = ({ children }) => (
    <View style={boxStyles.boxSimple}>
        {children}
    </View>
)
const boxStyles = StyleSheet.create({
    boxSimple: {
        height: 150, 
        width: 150, 
        backgroundColor: '#f0f8ff', 
        margin: 10,
        borderWidth: 10,
        borderRadius: 25,
        borderColor: 'black'
    },
})

const DispenserPillStatus = () => {
    const [ Dispenser1, changeDispenserOne ] = useState(false);
    const [ Dispenser2, changeDispenserTwo ] = useState(false);
    const handleDispenserOne = () => {changeDispenserOne(!Dispenser1);};
    const handleDispenserTwo = () => {changeDispenserTwo(!Dispenser2);};

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{fontWeight: 'bold', fontSize: 20, justifyContent: 'center', alignItems: 'center'}}> Medication Tracker </Text>
            <View style={{top: Dimensions.get('screen').height / 50, height: Dimensions.get('screen').height / 3.5, width: Dimensions.get('screen').width - 20, backgroundColor: 'grey', borderWidth: 10, borderRadius: 25, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: 350}}>
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 30, height: 25, borderWidth: 3, backgroundColor: '#f8ffff', justifyContent:'center', alignItems: 'center'}}>
                            <Text style={{color: 'black', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>A</Text>
                        </View>
                        <View>
                            <BoxSimple style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
                                <Text style={{fontWeight: 'bold', fontSize: 48, justifyContent: 'center', alignItems: 'center'}}> 4 </Text>
                            </BoxSimple>
                        </View>
                        
                    </View>
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 30, height: 25, borderWidth: 3, backgroundColor: '#f8ffff', justifyContent:'center', alignItems: 'center'}}>
                            <Text style={{color: 'black', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>B</Text>
                        </View>
                        <BoxSimple > 
                            <Text style={{fontWeight: 'bold', fontSize: 48, justifyContent: 'center', alignItems: 'center'}}> 4 </Text>
                        </BoxSimple>
                    </View>
                </View>
            </View>
        </View>
    );
}

const PillTracker = () => {
    const [items, setItmes] = useState({});

    const loadItems = (day) => {
        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);
        
                if (!items[strTime]) {
                items[strTime] = [];
                
                const numItems = Math.floor(Math.random() * 3 + 1);
                for (let j = 0; j < numItems; j++) {
                    items[strTime].push({
                    name: 'Item for ' + strTime + ' #' + j,
                    height: Math.max(50, Math.floor(Math.random() * 150)),
                    day: strTime
                    });
                }
                }
            }
          
            const newItems = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
                });
                setItmes(newItems);
            }, 1000);
        };
    
    const renderItem = (item) => {
        return (
            <TouchableOpacity style= {{marginRight: 10, marginTop: 17}}>
                <AgendaCard>
                    <Text> Medication </Text>
                </AgendaCard>
            </TouchableOpacity>
        )
    }
    return (
        <View style={{flex: 1}}>
            <Agenda
                items={items}
                loadItemsForMonth={loadItems}
                selected={'2023-11-01'}
                renderItem={renderItem}
            />
        </View>
    );
}

export default function HistoryScreen({ navigation }) { 
    return (
        <View style={{flex: 1}}>
            <DispenserPillStatus></DispenserPillStatus>
            <PillTracker></PillTracker>
        </View>
    );
}


const styles = StyleSheet.create({
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17
    },
    emptyDate: {
      height: 15,
      flex: 1,
      paddingTop: 30
    },
    customDay: {
      margin: 10,
      fontSize: 24,
      color: 'green'
    },
    dayItem: {
      marginLeft: 34
    },
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
        width: Dimensions.get('screen').width - 10,
        height: Dimensions.get('screen').height / 5,
        paddingBottom: 20,
        paddingTop: 20,
        borderWidth: 10,
        borderRadius: 20,
        borderColor: 'black'
    },

  });

// Styles from History Screen
  const styles1 = StyleSheet.create({
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
        height: 470,
        paddingBottom: 20,
        paddingTop: 20,
        borderWidth: 10,
        borderRadius: 20,
        borderColor: 'black'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'black',
        textShadowColor: 'white',
        textShadowOffset: {width: 1, height: 2},
        textShadowRadius: 2,
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        margin: 5,
        marginLeft: 10,
        marginBottom: 10,
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
        margin: 1
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
        margin: 4,
        color: '#000',
    },
    days: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 0,
        marginBottom: 0
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