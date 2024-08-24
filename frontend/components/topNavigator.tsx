import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import BackIcon from "../assets/icons/back.svg";
import GlobalStyles from "../styles/globalStyle";
interface Prop {
    navigation: NavigationProp<ParamListBase>;
    title?: string;
    showBackButton?: boolean;
    showTitle?: boolean;
    showCloseButton?: boolean;
}

function TopNavigator({ navigation, title,  showBackButton = false, showTitle = false, showCloseButton = false}: Prop) {
  
    const onBackButton = () => {
        navigation.goBack();
    };

    return (
        <View style={GlobalStyles.topNavigatorContainer}>
            {showBackButton && (
                <TouchableOpacity 
                onPress={onBackButton}
                style={[GlobalStyles.iconContainer,{marginRight: 12}]}>
                    <BackIcon width={40} height={40} />
                </TouchableOpacity>
            )}
            {showTitle && (
               <Text style={GlobalStyles.BoldText}>{title}</Text> 
            )}
            
        </View>
    );
}

export default TopNavigator;
