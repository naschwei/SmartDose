// FIRST ATTEMPT: DISCARDED
// const Welcome = () => {
//     return (
//         <>
//         <StatusBar style="light" />
//         <InnerContainer>
//             <WelcomeImage resizeMode="cover" source={require('./../../assets/adaptive-icon.png')} />
//             <WelcomeContainer>
//                 <PageTitle welcome={true}> Welcome! </PageTitle>
//                 <SubTitle welcome={true}> Jane Doe </SubTitle>
//                 <SubTitle welcome={true}> hello-world@gmail.com </SubTitle>

//                 <StyledFormArea>
//                     <Avatar resizeMode="cover" source={require('./../../assets/icon.png')} />
//                     <Line />
//                     <StyledButton onPress={() => {}}>
//                         <ButtonText> Logout </ButtonText>
//                     </StyledButton>
//                 </StyledFormArea>
//             </WelcomeContainer>
//         </InnerContainer>
//         </>
//     );
// };

import * as React from 'react';
import { View, Text, Image } from 'react-native';
import {StatusBar} from 'expo-status-bar';

import {
    Colors,
    InnerContainer,
    StyledButton,
    ButtonText,
    WelcomeImage,
    Avatar
} from './../../components/styles';
const {primary, tertiary, brand, darkLight} = Colors;

import Card from './../../components/card';

export default function HomeScreen({ navigation }) {
    return (
        // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{flex: 1, backgroundColor: "#FFF"}}>
            <>
            <StatusBar style="light" />
            <View style={{
                    backgroundColor: "#CBC3E3",
                    height:"35%",
                    borderBottomLeftRadius:20,
                    borderBottomRightRadius:20,
                    paddingHorizontal:20
            }}
            >
                <View style={{
                   flexDirection:"row",
                   alignItems:"center",
                   marginTop:25,
                   width:"100%"
               }}>
                    <View style={{width:"50%"}}>
                        <Text style={{
                            fontSize:28,
                            color:"#FFF",
                            fontWeight:"bold"
                        }}>Welcome Jane Doe</Text>
                    </View>
                    <View style={{width:"45%",alignItems:"flex-end"}}>
                        <Avatar resizeMode="cover" source={require('./../../assets/icon.png')} />
                    </View>
                </View>
                <StyledButton onPress={() => {navigation.navigate("Login")}}>
                            <ButtonText> Logout </ButtonText>
                </StyledButton>
            </View>
            
            <InnerContainer>
                <Card>
                    <Text> Medication </Text>
                </Card>
            </InnerContainer>
            </>
        </View>
    );
}

//export default Welcome;