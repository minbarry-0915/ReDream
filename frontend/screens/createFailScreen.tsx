import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import GlobalStyles from "../styles/globalStyle";
import loginStyles from "../styles/loginScreenStyle";
import CreateBookStyles from "../styles/createBookScreenStyle";
import TopNavigator from "../components/topNavigator";
import AnimationStyles from "../styles/animationStyle";
import Error from "../components/animations/error";

function CreateFailScreen({navigation}: {navigation: NavigationProp<ParamListBase>}) {

    const onGoBackButton = () => {
        navigation.navigate('CreateBook1');
    };

    return (
        <KeyboardAvoidingView style={[GlobalStyles.container]}>
            <TopNavigator 
            navigation={navigation}
            />
            <Error style={AnimationStyles.error}/>
            
            <View style={[GlobalStyles.content,{alignItems: 'center'}]}>
                
                <Text style={[GlobalStyles.semiBoldText, { fontSize: 24 }]}>
                    오류가 발생했어요!
                </Text>
                <Text style={[GlobalStyles.semiBoldText, { fontSize: 24 }]}>
                </Text>
            </View>
            
            
            <View style={[
                loginStyles.inputContainer,
                {
                    flex: 1,
                    justifyContent: 'flex-end',
                    paddingBottom: 48,
                }
            ]}>
                <TouchableOpacity 
                    onPress={onGoBackButton}
                    activeOpacity={0.7}
                    style={[loginStyles.loginButton,{backgroundColor: '#E93B3B'}]}
                >
                    <Text style={[GlobalStyles.semiBoldText, { color: 'white' }]}>
                        처음으로 돌아가기
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

export default CreateFailScreen;
