import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { useSignUp } from "../contexts/signUpContext";
import TopNavigator from "../components/topNavigator";

import SignUpStyles from "../styles/signUpScreenStyle";
import GlobalStyles from "../styles/globalStyle";
import loginStyles from "../styles/loginScreenStyle";

function SignUpScreen2({navigation}:{navigation: NavigationProp<ParamListBase>}){
    const {userData, setUserData} = useSignUp();
    const [idInput, setIdInput] = useState<string>(userData.id);

    const onNextButton = () =>{
        //console.log('SignUp2: ',userData);
        setUserData(prevData => ({...prevData, id: idInput}));
        navigation.navigate("SignUp3");
    };

    return(
        <KeyboardAvoidingView 
        style={[GlobalStyles.container]}>
            <ScrollView 
            contentContainerStyle={{ 
                flex: 1,
                paddingHorizontal: 0,
                }} 
            keyboardDismissMode='interactive'
            keyboardShouldPersistTaps="handled">
                <TopNavigator navigation={navigation} title="회원가입"/>


                <View style={GlobalStyles.content}>
                    <Text style={[GlobalStyles.semiBoldText, {fontSize: 22}]}>
                        아이디를 입력해주세요
                    </Text>
                </View>

                <View style={GlobalStyles.content}>
                    <TextInput
                    placeholderTextColor={"black"}
                    onChangeText={setIdInput}
                    value={idInput}
                    style={SignUpStyles.inputContainer}
                    defaultValue=""
                    />
                </View>

                <View style={
                    [loginStyles.inputContainer, 
                    {flex: 1,
                    justifyContent:'flex-end',
                    paddingBottom: 48,
                    }
                ]}>
                    <TouchableOpacity 
                    onPress={onNextButton}
                    activeOpacity={0.7}
                    style={[loginStyles.loginButton]}>
                        <Text style={[GlobalStyles.semiBoldText,{color: 'white'}]}>
                            다음
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>   
        </KeyboardAvoidingView>
    )
    
}

export default SignUpScreen2;