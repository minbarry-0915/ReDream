import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import loginStyles from "../styles/loginScreenStyle";
import GlobalStyles from "../styles/globalStyle";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import axios from 'axios';

function LoginScreen({navigation}: {navigation: NavigationProp<ParamListBase>}){
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    const onLoginButton = async () => {
        try {
            const response = await axios.post('http://192.168.0.2:3000/api/user/login', {
                id: id,
                password: pw
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) { // 성공적인 응답 코드 확인
                console.log(response.data);
                navigation.navigate("Home"); // 로그인 성공 시 홈 화면으로 네비게이션
            } else {
                console.error('Login failed: ', response.statusText);
                // 로그인 실패 처리 로직 (예: 사용자에게 실패 메시지 표시)
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const onSignUPButton = () => {
        navigation.navigate("SignUp");
    };

    const onFindIDButton = () => {

    };

    const onFindPWButton = () => {

    };

    useEffect(()=>{
        console.log(`id: ${id} pw: ${pw}`);
    },[id, pw]);

    return(
        <KeyboardAvoidingView style={loginStyles.container}>
            
            {/* 로고 */}
            <View style={loginStyles.logoContainer}>
                <Text style={GlobalStyles.logoText}>Re-DREAM</Text>
            </View>

            {/* ID입력란 */}
            <View style={loginStyles.inputContainer}>
                <TextInput 
                placeholder="ID"
                placeholderTextColor={'white'}
                onChangeText={setId}
                style={loginStyles.inputContent}/>
            </View>

            {/* PW입력란 */}
            <View style={loginStyles.inputContainer}>
                <TextInput 
                placeholder="PW"
                placeholderTextColor={'white'}
                onChangeText={setPw}
                style={loginStyles.inputContent}/>
            </View>
            
            {/* 로그인 버튼 */}
            <View style={loginStyles.inputContainer}>
                <TouchableOpacity 
                onPress={onLoginButton}
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