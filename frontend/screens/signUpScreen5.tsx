import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import GlobalStyles from "../styles/globalStyle";
import loginStyles from "../styles/loginScreenStyle";


function SignUpScreen5({navigation}:{navigation: NavigationProp<ParamListBase>}){

    const onNextButton = () =>{
        navigation.navigate("Login");
    };

    return(
        <KeyboardAvoidingView 
        style={[GlobalStyles.container,{justifyContent: 'center', alignItems: 'center'}]}>
            <View style={[GlobalStyles.content, 
                {
                flex: 1,
                alignItems: 'center', 
                marginBottom: 0
                }]}>
                <Text style={[GlobalStyles.BoldText,{fontSize: 32}]}>회원가입이</Text>
                <Text style={[GlobalStyles.BoldText, {fontSize: 32}]}>완료되었습니다</Text>
            </View>

            <View style={
                [loginStyles.inputContainer, 
                {
                justifyContent:'flex-end',
                paddingBottom: 48,
                }
            ]}>
                <TouchableOpacity 
                onPress={onNextButton}
                activeOpacity={0.7}
                style={[loginStyles.loginButton]}>
                    <Text style={[GlobalStyles.semiBoldText,{color: 'white'}]}>
                        로그인하기
                    </Text>
                </TouchableOpacity>
            </View>   
        </KeyboardAvoidingView>
    )
    
}

export default SignUpScreen5;