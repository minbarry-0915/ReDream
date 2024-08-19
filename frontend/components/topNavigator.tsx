import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import GlobalStyles from "../styles/globalStyle";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import BackIcon from "../assets/icons/back.svg";

interface Prop {
    navigation: NavigationProp<ParamListBase>;
    title: string;
}

function TopNavigator({ navigation, title }: Prop) {
    const onBackButton = () => {
        navigation.goBack();
    };

    return (
        <View style={GlobalStyles.topNavigatorContainer}>
            <TouchableOpacity 
                onPress={onBackButton}
                style={[GlobalStyles.iconContainer,{marginRight: 12}]}>
                <BackIcon width={40} height={40} />
            </TouchableOpacity>
            <Text style={GlobalStyles.BoldText}>{title}</Text>
        </View>
    );
}

export default TopNavigator;
