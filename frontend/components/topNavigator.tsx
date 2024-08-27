import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { NavigationProp, ParamListBase, useNavigationState } from "@react-navigation/native";

import BackIcon from "../assets/icons/back.svg";
import BackWhiteIcon from '../assets/icons/backWhite.svg';
import CloseIcon from "../assets/icons/close.svg";

import GlobalStyles from "../styles/globalStyle";

interface Prop {
    navigation: NavigationProp<ParamListBase>;
    title?: string;
    showBackButton?: boolean;
    showTitle?: boolean;
    showCloseButton?: boolean;
    onCloseButtonPress?: () => void; // onCloseButtonPress prop 추가
}

function TopNavigator({ navigation, title, showBackButton = false, showTitle = false, showCloseButton = false, onCloseButtonPress }: Prop) {
  
    const onBackButton = () => {
        navigation.goBack();
    };

    const onCloseButton = () => {
        if (onCloseButtonPress) {
            onCloseButtonPress();
        }
    }

    const state = useNavigationState(state => state);
    const currentRouteName = state.routes[state.index]?.name;

    const isViewBookScreen = currentRouteName === 'ViewBook';

    return (
        <View style={[GlobalStyles.topNavigatorContainer]}>
            <View style={{flexDirection: 'row'}}>
                {showBackButton && (
                    <TouchableOpacity 
                    onPress={onBackButton}
                    activeOpacity={0.7}
                    style={[GlobalStyles.iconContainer,{marginRight: 12}]}>
                        {isViewBookScreen ? 
                            (<BackWhiteIcon width={40} height={40} />)   : 
                            (<BackIcon width={40} height={40} />)
                        }
                    </TouchableOpacity>
                )}
                {showTitle && (
                <Text style={GlobalStyles.BoldText}>{title}</Text> 
                )}
            </View>
            
            {showCloseButton && (
                <TouchableOpacity 
                activeOpacity={0.7}
                onPress={onCloseButton}
                style={[GlobalStyles.iconContainer,{marginRight: 12}]}>
                    <CloseIcon width={40} height={40}/>
                </TouchableOpacity>
            )}
            
        </View>
    );
}

export default TopNavigator;
