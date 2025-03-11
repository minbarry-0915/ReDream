import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

import SignUpStyles from '../styles/signUpScreenStyle';
import GlobalStyles from '../styles/globalStyle';
import loginStyles from '../styles/loginScreenStyle';

import {useSignUp} from '../contexts/signUpContext';
import TopNavigator from '../components/topNavigator';

import EyeIcon from '../assets/icons/eye.svg';

function SignUpScreen3({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) {
  const {userData, setUserData} = useSignUp();
  const [pwInput, setPwInput] = useState<string>(userData.password);
  const [pwVisible, setPwVisible] = useState<boolean>(true);

  const onNextButton = () => {
    //console.log('SignUp: ',userData);
    setUserData(prevData => ({...prevData, password: pwInput}));
    navigation.navigate('SignUp4');
  };

  const togglePwVisible = () => {
    setPwVisible(!pwVisible);
  };

  useEffect(() => {
    console.log(userData);
  }, []);

  return (
    <KeyboardAvoidingView style={[GlobalStyles.container]}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          paddingHorizontal: 0,
        }}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled">
        <TopNavigator
          navigation={navigation}
          title="회원가입"
          showBackButton={true}
          showTitle={true}
        />

        <View style={GlobalStyles.content}>
          <Text style={[GlobalStyles.semiBoldText, {fontSize: 22}]}>
            비밀번호를 입력해주세요
          </Text>
        </View>

        <View style={[GlobalStyles.content, {flexDirection: 'row'}]}>
          <TextInput
            secureTextEntry={pwVisible} //입력한 문자를 가려줌
            placeholderTextColor={'black'}
            onChangeText={setPwInput}
            value={pwInput}
            style={SignUpStyles.inputContainer}
            defaultValue=""
          />
          <TouchableOpacity
            onPressIn={togglePwVisible}
            onPressOut={togglePwVisible}
            style={[GlobalStyles.iconContainer]}>
            <EyeIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        <View
          style={[
            loginStyles.inputContainer,
            {flex: 1, justifyContent: 'flex-end', paddingBottom: 48},
          ]}>
          <TouchableOpacity
            onPress={onNextButton}
            activeOpacity={0.7}
            style={[loginStyles.loginButton]}>
            <Text style={[GlobalStyles.semiBoldText, {color: 'white'}]}>
              다음
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SignUpScreen3;
