import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import axios from "axios";
import SelectDropdown from "react-native-select-dropdown";

import GlobalStyles from "../styles/globalStyle";
import loginStyles from "../styles/loginScreenStyle";
import SignUpStyles from "../styles/signUpScreenStyle";
import CreateBookStyles from "../styles/createBookScreenStyle";

import TopNavigator from "../components/topNavigator";
import DropIcon from "../assets/icons/drop.svg";
import { useCreateBook } from "../contexts/createBookContext";

interface Keyword {
    keyword_id: number;
    keyword_name: string;
}

interface MyParams { 
    genreId: number,
}

function CreateBookScreen2({navigation, route}: {navigation: NavigationProp<ParamListBase>, route: RouteProp<ParamListBase>}) {
    const {genreId} = route.params as MyParams;
 
    const [keyWordsInput, setKeyWordsInput] = useState<Keyword[]>([]);
    const { bookData, setBookData } = useCreateBook();

    const onNextButton = () => {


        console.log(bookData);
        navigation.navigate("CreateBook3");
    };

    const getGenre = async () => {
        try {
            const response = await axios.get("http://192.168.0.2:3000/api/keywordList",{
                params:{
                    genre_id: genreId,
                }
            });
            //console.log(response.data.keywords);
            setKeyWordsInput(response.data.keywords);
        } catch (error) {
            console.log("Fail to fetch Genres", error);
        }
    };

    useEffect(() => {
        //console.log(genreId);
        getGenre();
        console.log(keyWordsInput);
    }, []);

    return (
        <KeyboardAvoidingView style={[GlobalStyles.container]}>
            <ScrollView
                contentContainerStyle={{ 
                    flex: 1,
                    paddingHorizontal: 0,
                }} 
                keyboardDismissMode='interactive'
                keyboardShouldPersistTaps="handled"
            >
                <TopNavigator navigation={navigation} title="동화생성" />

                <View style={GlobalStyles.content}>
                    <Text style={[GlobalStyles.semiBoldText, { fontSize: 22 }]}>
                        동화의 키워드를 선택해주세요
                    </Text>
                </View>
                
                <View style={GlobalStyles.content}>
                    
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
                        onPress={onNextButton}
                        activeOpacity={0.7}
                        style={[loginStyles.loginButton]}
                    >
                        <Text style={[GlobalStyles.semiBoldText, { color: 'white' }]}>
                            다음
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default CreateBookScreen2;
