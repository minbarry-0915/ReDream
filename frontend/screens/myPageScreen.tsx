import React from "react";
import { KeyboardAvoidingView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import GlobalStyles from "../styles/globalStyle";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import BottomNaviatorContainer from "../components/bottomNavigator";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import HomeScreenStyles from "../styles/homeScreenStyle";
import useFetchBookList from "../function/useFetchBookList";
import BookListContent from "../components/bookListContent";

import EditIcon from '../assets/icons/edit.svg';

function MyPageScreen({navigation}: {navigation: NavigationProp<ParamListBase>}){
    const booklist = useFetchBookList(); // Custom hook 사용

    const userId = useSelector((state: RootState) => state.auth.user?.id); // Redux state에서 user ID 가져오기
    
    const onBookListEdit = () =>{

    };
    return(
        <KeyboardAvoidingView style={[GlobalStyles.container, { justifyContent: "flex-start", alignItems: 'center', backgroundColor: '#F0F0F0' }]}>
            <ScrollView
            showsVerticalScrollIndicator={false}
            >
                {/* 마이페이지 */}
                <View style={GlobalStyles.topNavigatorContainer}>
                    <Text style={[GlobalStyles.BoldText, { fontSize: 32 }]}>마이페이지</Text>
                </View>
 
            </ScrollView>
            {/* <BottomNaviatorContainer navigation={navigation}/> */}
        </KeyboardAvoidingView>
    );
}
export default MyPageScreen;