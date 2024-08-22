import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import SignUpStyles from "../styles/signUpScreenStyle";
import GlobalStyles from "../styles/globalStyle";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import loginStyles from "../styles/loginScreenStyle";
import TopNavigator from "../components/topNavigator";
import { useCreateBook } from "../contexts/createBookContext";

import Loading from "../components/animations/loading";

function CreateBookScreen4({navigation}:{navigation: NavigationProp<ParamListBase>}){
    const { bookData, setBookData } = useCreateBook();
    const [errorMessege, setErrorMessege] = useState(false);
    const [ titleInput, setTitleInput] = useState('');

    const onNextButton = () => {
        setBookData(prevData => ({
            ...prevData,
            title: titleInput,
        }));
        console.log(bookData);
        //navigation.navigate("CreateBook4");
    };

    useEffect(() => {
        if (titleInput === "") {
            setErrorMessege(true);
        } else {
            setErrorMessege(false);
        }
    }, [titleInput]);

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
                        동화의 제목을 입력해주세요
                    </Text>
                </View>

                <View style={GlobalStyles.content}>
                    <TextInput
                    placeholderTextColor={"black"}
                    onChangeText={setTitleInput}
                    value={titleInput}
                    style={SignUpStyles.inputContainer}
                    />
                </View>

                {errorMessege? (
                    <View style={GlobalStyles.content}>
                        <Text style={GlobalStyles.lightText}>
                            제목을 입력해주세요
                        </Text>
                    </View>
                ): null}

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
                            생성
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>   
        </KeyboardAvoidingView>
    )
    
}

export default CreateBookScreen4;