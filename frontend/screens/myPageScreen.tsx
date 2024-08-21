import React from "react";
import { KeyboardAvoidingView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import GlobalStyles from "../styles/globalStyle";

function MyPageScreen({navigation}: {navigation: NavigationProp<ParamListBase>}){
    const userId = useSelector((state: RootState) => state.auth.user?.id); // Redux state에서 user ID 가져오기
    
    return(
        <KeyboardAvoidingView style={[GlobalStyles.container, { justifyContent: "flex-start", alignItems: 'center', backgroundColor: '#F0F0F0' }]}>
            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flexGrow: 1, width: "100%"}}
            >
                {/* 마이페이지 */}
                <View style={GlobalStyles.topNavigatorContainer}>
                    <Text style={[GlobalStyles.BoldText, { fontSize: 32 }]}>마이페이지</Text>
                </View>
 
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
export default MyPageScreen;