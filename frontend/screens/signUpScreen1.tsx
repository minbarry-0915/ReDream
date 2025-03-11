import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SignUpStyles from '../styles/signUpScreenStyle';
import GlobalStyles from '../styles/globalStyle';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import loginStyles from '../styles/loginScreenStyle';
import {useSignUp} from '../contexts/signUpContext';
import TopNavigator from '../components/topNavigator';

function SignUpScreen1({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) {
  const {userData, setUserData} = useSignUp();
  const [nameInput, setNameInput] = useState<string>(userData.name);

  const onNextButton = () => {
    //console.log('signup1: ', nameInput);
    setUserData(prevData => ({...prevData, name: nameInput}));
    navigation.navigate('SignUp2');
  };

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
            이름을 입력해주세요
          </Text>
        </View>

        <View style={GlobalStyles.content}>
          <TextInput
            placeholderTextColor={'black'}
            onChangeText={setNameInput}
            value={nameInput}
            style={SignUpStyles.inputContainer}
            defaultValue=""
          />
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

export default SignUpScreen1;
