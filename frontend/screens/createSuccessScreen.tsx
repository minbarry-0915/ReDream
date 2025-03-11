import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

import GlobalStyles from '../styles/globalStyle';
import loginStyles from '../styles/loginScreenStyle';
import CreateBookStyles from '../styles/createBookScreenStyle';
import TopNavigator from '../components/topNavigator';
import Book from '../components/animations/book';
import AnimationStyles from '../styles/animationStyle';

function CreateSuccessScreen({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) {
  const onNextButton = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Main'}],
    });
  };

  return (
    <KeyboardAvoidingView style={[GlobalStyles.container]}>
      <TopNavigator navigation={navigation} />
      <Book style={AnimationStyles.book} />

      <View style={[GlobalStyles.content, {alignItems: 'center'}]}>

                <Text style={[GlobalStyles.semiBoldText, { fontSize: 24 }]}>
          동화가 다 만들어졌어요!
        </Text>
        <Text style={[GlobalStyles.semiBoldText, {fontSize: 24}]}>
          확인하러 가볼까요?
        </Text>
      </View>


        style={[
          loginStyles.inputContainer,
          {
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: 48,
          },
        ]}>
        <TouchableOpacity
          onPress={onNextButton}
          activeOpacity={0.7}
          style={[loginStyles.loginButton]}>
          <Text style={[GlobalStyles.semiBoldText, {color: 'white'}]}>
            확인하기
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default CreateSuccessScreen;
