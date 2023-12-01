import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from '@react-navigation/core';
import { auth } from "../../firebase.js";


import {
    Colors,
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle, 
    SubTitle,
    StyledFormArea,
    LeftIcon,
    RightIcon,
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    ButtonText,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent
} from '../../components/styles';

const {brand, darkLight, primary} = Colors;

/*
      <View style={styles.inputContainer}>
        <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
        />
        <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
        />
      </View>
*/


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        // const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                navigation.replace("Home");
            }
        })

        return unsubscribe;

    }, [])


    const handleLogin = () => {
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with: ', user.email);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            })
    }


  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
    >
        <PageLogo resizeMode="cover" source={require('./../../assets/icon.png')} />
        <View style={{
            flexDirection: 'column'
        }}> 
            <MyTextInput 
                    label="Email Address"
                    icon="mail"
                    placeholder="hello-world@gmail.com"
                    placeholderTextColor={darkLight}
                    onChangeText={text => setEmail(text)}
                    onBlur={() => {}}
                    value={email}
                    keyboardType="email-address"
                    style={styles.input}
                />
                <MyTextInput 
                    label="Password"
                    icon="lock"
                    placeholder="* * * * * * * *"
                    placeholderTextColor={darkLight}
                    onChangeText={text => setPassword(text)}
                    onBlur={() => {}}
                    value={password}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                    style={styles.input}
                />
        </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button]}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <Line />

      <ExtraView>
        <ExtraText> Don't have an account? </ExtraText>
        <TextLink onPress={() => navigation.navigate("Signup")}> 
            <TextLinkContent> Signup </TextLinkContent>
        </TextLink>
    </ExtraView>
    </KeyboardAvoidingView>
  );
}

export default Login

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel> {label} </StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={()=> setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: brand,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',

    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
})











/* import React, {useState, StyleSheet}  from 'react';
import {StatusBar} from 'expo-status-bar';
import {View} from 'react-native';
import {Formik} from 'formik';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import {
    Colors,
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle, 
    SubTitle,
    StyledFormArea,
    LeftIcon,
    RightIcon,
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    ButtonText,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent
} from '../../components/styles';


const {brand, darkLight, primary} = Colors;

WebBrowser.maybeCompleteAuthSession();

const Login = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    // const [request, response, promptAsync] = Google.useAuthRequest({
    //   iosClientId: "171965448512-6ooeu2ap71ucs0q77gpp8ahljbt4gfav.apps.googleusercontent.com",
    // });


    initialValues = {
        email: '',
        password: ''
    }


    const handleLogIn = (values) => {
        const auth = getAuth();

        console.log("getting here")
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then(userCredentials => {
                    const user = userCredentials.user;
                    console.log(user.email)
                })
                .catch(error => alert(error.message))
    }



    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageLogo resizeMode="cover" source={require('./../../assets/icon.png')} />
                <SubTitle> Account Login </SubTitle>

                <Formik
                    initialValues={initialValues}
                    onSubmit={handleLogIn}
                >
                    {({handleChange, handleBlur, handleLogIn, values}) => (
                        <StyledFormArea>
                            <MyTextInput 
                                label="Email Address"
                                icon="mail"
                                placeholder="hello-world@gmail.com"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType="email-address"
                            />
                            <MyTextInput 
                                label="Password"
                                icon="lock"
                                placeholder="* * * * * * * *"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <MsgBox> . . . </MsgBox>
                            <StyledButton onPress={handleLogIn}>
                                <ButtonText> Login </ButtonText>
                            </StyledButton>
                            <Line />
                            <StyledButton google={true} onPress={() => {promptAsync();}}>
                                <Fontisto name="google" color={primary} size={25} />
                                <ButtonText google={true}> Sign in with Google</ButtonText>
                            </StyledButton>
                            <ExtraView>
                                <ExtraText> Don't have an account? </ExtraText>
                                <TextLink onPress={() => navigation.navigate("Signup")}> 
                                    <TextLinkContent> Signup </TextLinkContent>
                                </TextLink>
                            </ExtraView>
                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    );
};



const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel> {label} </StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={()=> setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    )
}

export default Login; */