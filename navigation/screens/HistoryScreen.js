import React, {useState} from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { Agenda } from "react-native-calendars";
//import {Card, Avatar} from 'react-native-paper';
import {Card} from 'react-native-paper';

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

export default function HistoryScreen({ navigation }) { 
    /*const data = [
        { date: "2021-01-02", count: 7 },
        { date: "2021-01-03", count: 2 },
        { date: "2021-01-04", count: 3 },
        { date: "2021-01-05", count: 4 },
        { date: "2021-01-06", count: 5 },
        { date: "2021-01-30", count: 2 },
        { date: "2021-01-31", count: 3 },
        { date: "2021-12-25", count: 6 },
        { date: "2021-02-02", count: 4 },
        { date: "2021-12-05", count: 2 },
        { date: "2020-12-15", count: 5 }
    ];

    const _goBack = () => console.log('Went back');
    const _handleSearch = () => console.log('Searching');
    const _handleMore = () => console.log('Shown more');*/

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
                <Card>
                    <Card.Content>
                        <View style = {{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Text>{item.name}</Text>
                        </View>
                    </Card.Content>
                </Card>
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
    }
  });