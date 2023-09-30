import React from 'react';
import {StatusBar} from 'expo-status-bar';

import {
    InnerContainer,
    PageTitle, 
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    WelcomeImage,
    Avatar
} from './../components/styles';


const Welcome = () => {
    return (
        <>
        <StatusBar style="light" />
        <InnerContainer>
            <WelcomeImage resizeMode="cover" source={require('./../assets/adaptive-icon.png')} />
            <WelcomeContainer>
                <PageTitle welcome={true}> Welcome! </PageTitle>
                <SubTitle welcome={true}> Jane Doe </SubTitle>
                <SubTitle welcome={true}> hello-world@gmail.com </SubTitle>

                <StyledFormArea>
                    <Avatar resizeMode="cover" source={require('./../assets/icon.png')} />
                    <Line />
                    <StyledButton onPress={() => {}}>
                        <ButtonText> Logout </ButtonText>
                    </StyledButton>
                </StyledFormArea>
            </WelcomeContainer>
        </InnerContainer>
        </>
    );
};

export default Welcome;