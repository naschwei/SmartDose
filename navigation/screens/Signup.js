import React, {useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {Formik} from 'formik';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";


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
} from './../../components/styles';

import { useNavigation } from '@react-navigation/core';


const {brand, darkLight, primary} = Colors;


const Signup = () => {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [hidePassword, setHidePassword] = useState(true);

    const navigation = useNavigation();

    const handleSignUp = () => {
        const auth = getAuth()
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log("Registered with ", user.email)

            updateProfile(getAuth().currentUser, {
                displayName: fullName
            }).then(() => {
                console.log("full name updated")
            }).catch(error => alert(error.message));
            
            navigation.replace("Login")

        })
        .catch(error => alert(error.message))
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ alignItems: 'center'}}> 
                <Text style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: brand
                }}> Let's Get Started! </Text>
                <Text style={{
                    marginTop: 10,
                    fontSize: 14,
                    marginBottom: 30,
                    color: brand
                }}
                > Sign up with a free account! </Text>
            </View>

            <View style={styles.inputContainer}>
                <MyTextInput 
                    label="Full Name"
                    icon="person"
                    placeholder="Jane Doe"
                    placeholderTextColor={darkLight}
                    onChangeText={text => setFullName(text)}
                    onBlur={ () => {} }
                    value={fullName}
                />
                <MyTextInput 
                    label="Email Address"
                    icon="mail"
                    placeholder="my_email@gmail.com"
                    placeholderTextColor={darkLight}
                    onChangeText={text => setEmail(text)}
                    onBlur={ () => {} }
                    value={email}
                    keyboardType="email-address"
                />
                <MyTextInput 
                    label="Password"
                    icon="lock"
                    placeholder="* * * * * * * *"
                    placeholderTextColor={darkLight}
                    onChangeText={text => setPassword(text)}
                    onBlur={ () => {} }
                    value={password}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                />
                <MyTextInput 
                    label="Confirm Password"
                    icon="lock"
                    placeholder="* * * * * * * *"
                    placeholderTextColor={darkLight}
                    onChangeText={text => setConfirmPassword(text)}
                    onBlur={() => {} }
                    value={confirmPassword}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>

            <Line />

            <ExtraView>
                <ExtraText> Already have an account? </ExtraText>
                <TextLink onPress={() => navigation.replace("Login")}> 
                    <TextLinkContent> Login </TextLinkContent>
                </TextLink>
            </ExtraView>

            <View>
                
            </View>
        </ScrollView>

    )

}


    





    /* return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle> SmartDose </PageTitle>
                <SubTitle> Account Signup </SubTitle>

                
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSignUp}
                >
                    {({handleChange, handleBlur, handleSubmit, values}) => (
                        <StyledFormArea>
                            <MyTextInput 
                                label="Full Name"
                                icon="person"
                                placeholder="Jane Doe"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('fullName')}
                                onBlur={handleBlur('fullName')}
                                value={values.fullName}
                            />
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
                            <MyTextInput 
                                label="Confirm Password"
                                icon="lock"
                                placeholder="* * * * * * * *"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.confirmPassword}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <MsgBox> . . . </MsgBox>
                            <StyledButton onPress={handleSignUp}>
                                <ButtonText> Signup </ButtonText>
                            </StyledButton>
                            <Line />
                            <ExtraView>
                                <ExtraText> Already have an account? </ExtraText>
                                <TextLink onPress={() => navigation.navigate('Login')}> 
                                    <TextLinkContent> Login </TextLinkContent>
                                </TextLink>
                            </ExtraView>
                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    ); */
// };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
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
        marginTop: 15,
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
        borderColor: brand,
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: brand,
        fontWeight: '700',
        fontSize: 16,
    },
})

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel> {label} </StyledInputLabel>
            {<StyledTextInput {...props} />}
            {isPassword && (
                <RightIcon onPress={()=> setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    )
}

export default Signup;