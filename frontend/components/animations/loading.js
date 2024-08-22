import React from "react";
import LottieView from "lottie-react-native";

function Loading({style}){
    return(
        <LottieView 
        style={style}
        source={require('../../assets/animations/loading.json')}
        autoPlay
        loop
        />
    );
}
export default Loading;