import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import useLogin from "../function/useLogin";

import loginStyles from "../styles/loginScreenStyle";
import GlobalStyles from "../styles/globalStyle";
function LoginScreen({navigation}: {navigation: NavigationProp<ParamListBase>}){
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    const [isInvalid, setIsInvalid] = useState<boolean>(false);

    const loginUser = useLogin();
    const idInputRef = useRef<TextInput>(null);


    const handleLogin = async () => {
        const success = await loginUser(id, pw, () => {
            setIsInvalid(true);
            focusTextInput();
        });
    
        if (success) {
            console.log('welcome');
            navigation.navigate("Main");
        }
      };

    const focusTextInput = () => {
        setId("");
        setPw("");
        idInputRef.current?.focus();
    };

    const onSignUPButton = () => {
        navigation.navigate("SignUp");
    };

    const onFindIDButton = () => {

    };

    const onFindPWButton = () => {

    };

    useEffect(()=>{

    },[])

    return(
        <KeyboardAvoidingView style={[GlobalStyles.container,{justifyContent: 'center'}]}>
            
            {/* 로고 */}
            <View style={loginStyles.logoContainer}>
                <Text style={GlobalStyles.logoText}>Re-DREAM</Text>
            </View>

            {/* ID입력란 */}
            <View style={loginStyles.inputContainer}>
                <TextInput 
                ref={idInputRef}
                placeholder="ID"
                placeholderTextColor={'white'}
                onChangeText={setId}
                value={id}
                style={loginStyles.inputContent}/>
            </View>

            {/* PW입력란 */}
            <View style={loginStyles.inputContainer}>
                <TextInput 
                secureTextEntry={true}
                placeholder="PW"
                placeholderTextColor={'white'}
                onChangeText={setPw}
                value={pw}
                style={loginStyles.inputContent}/>
            </View>

            {/* 오류 메시지 */}
            {isInvalid && (
                <View style={loginStyles.loginErrorContainer}>
                    <Text style={[GlobalStyles.regularText,{color: '#E93B3B'}]}>잘못된 아이디이거나 비밀번호입니다.</Text>
                </View>
            )}

            {/* 로그인 버튼 */}
            <View style={loginStyles.inputContainer}>
                <TouchableOpacity 
                onPress={handleLogin}
                activeOpacity={0.7}
                style={loginStyles.loginButton}>
                    <Text style={[GlobalStyles.semiBoldText,{color: 'white'}]}>
                        LOGIN
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 회원가입/아이디찾기/비밀번호찾기 */}
            <View style={loginStyles.optionContainer}>
                <TouchableOpacity 
                onPress={onSignUPButton}
                style={loginStyles.optionContent}>
                    <Text style={[GlobalStyles.regularText,{color: '#696969'}]}>회원가입</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={onFindIDButton}
                style={loginStyles.optionContent}>
                    <Text style={[GlobalStyles.regularText,{color: '#696969'}]}>아이디찾기</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={onFindPWButton}
                style={loginStyles.optionContent}>
                    <Text style={[GlobalStyles.regularText,{color: '#696969'}]}>비밀번호찾기</Text>
                </TouchableOpacity>
            </View>
            
        </KeyboardAvoidingView>
    )
    
}

export default LoginScreen;