import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import loginStyles from "../styles/loginScreenStyle";
import GlobalStyles from "../styles/globalStyle";

interface NextButtonProps {
    navigation: NavigationProp<ParamListBase>
    destination: string
}


function NextButton({props}:{props: NextButtonProps}){
    const {navigation, destination} = props;

    const onNextButton = () =>{
        //console.log('signup1: ', nameInput);
        //setUserData(prevData => ({...prevData, name: nameInput}))
        navigation.navigate("SignUp2");
    };
    
    return(
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
    );
}
export default NextButton;