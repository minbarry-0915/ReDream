import React from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";
import GlobalStyles from "../../styles/globalStyle";

function Error({style}){
    return(
        <View style={[GlobalStyles.content,{alignItems: 'center'}]}>
            <LottieView 
            style={style}
            source={require('../../assets/animations/error.json')}
            autoPlay
            loop
            />  
        </View>
    );
}
export default Error;