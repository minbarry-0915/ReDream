import React from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import GlobalStyles from '../styles/globalStyle';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import loginStyles from '../styles/loginScreenStyle';
import TopNavigator from './topNavigator';

interface ModalProp {
  navigation: NavigationProp<ParamListBase>;
  modalVisible: boolean;
}

function EndModal(props: ModalProp) {
  const {navigation, modalVisible} = props;

  const onConfirmButton = () => {
    navigation.navigate('BookMark');
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => null} //돌아가기 버튼 차단
    >
      <View
        style={[
          GlobalStyles.container,
          {alignItems: 'center', justifyContent: 'center'},
        ]}>
        <TopNavigator navigation={navigation} />
        <View
          style={[GlobalStyles.content, {alignItems: 'center', marginTop: 36}]}>
          <Text style={[GlobalStyles.semiBoldText, {fontSize: 24}]}>
            동화가 끝났어요
          </Text>
          <Text style={[GlobalStyles.semiBoldText, {fontSize: 24}]}>
            다른 동화도 구경해볼까요?
          </Text>
        </View>

        <View
          style={[
            loginStyles.inputContainer,
            {
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: 48,
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onConfirmButton}
            style={[loginStyles.loginButton]}>
            <Text style={[GlobalStyles.semiBoldText, {color: 'white'}]}>
              확인하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default EndModal;
