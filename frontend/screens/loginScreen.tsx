import React from "react";
import { KeyboardAvoidingView, Text, TextInput, View } from "react-native";
import loginStyles from "../styles/loginScreenStyle";
import GlobalStyles from "../styles/globalStyle";
function LoginScreen(){
    return(
        <KeyboardAvoidingView style={loginStyles.container}>
            <View style={loginStyles.logoContainer}>
                <Text style={GlobalStyles.logoText}>Re-DREAM</Text>
            </View>
            <View>
                <TextInput>
                    <Text>
                        
                    </Text>
                </TextInput>
            </View>
            
        </KeyboardAvoidingView>
    )
    
}

export default LoginScreen;