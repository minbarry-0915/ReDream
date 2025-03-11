import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

import GlobalStyles from '../styles/globalStyle';
import MyPageStyles from '../styles/myPageScreenStyle';
import useLogout from '../function/useLogout';
import useDeleteUser from '../function/useDeleteUser';

function MyPageScreen({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) {
  const userId = useSelector((state: RootState) => state.auth.user?.id); // Redux state에서 user ID 가져오기
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);

  const logoutUser = useLogout();
  const deleteUser = useDeleteUser(); // 탈퇴 훅 사용

  const onWithdrawButton = () => {
    setWithdrawModalVisible(true);
  };

  const confirmWithdraw = async () => {
    if (userId) {
      try {
        await deleteUser(
          userId,
          () => {
            // 성공 시, 사용자 탈퇴 후 로그인 화면으로 이동
            Alert.alert('성공', '사용자가 성공적으로 삭제되었습니다.');
            navigation.navigate('Login');
          },
          error => {
            // 실패 시, 에러 메시지 표시
            Alert.alert('실패', error);
          },
        );
      } catch (error) {
        console.error('Error during withdrawal:', error);
        Alert.alert('오류', '사용자 탈퇴 중 오류가 발생했습니다.');
      }
    }
  };

  const cancelWithdraw = () => {
    setWithdrawModalVisible(false);
  };

  const onLogoutButton = async () => {
    try {
      await logoutUser();
      // 로그아웃 후 로그인 화면으로 이동
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('로그아웃 오류', '로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        GlobalStyles.container,
        {
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: '#F0F0F0',
        },
      ]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flexGrow: 1, width: '100%'}}
        scrollEnabled={false}>
        {/* 마이페이지 */}
        <View style={GlobalStyles.topNavigatorContainer}>
          <Text style={[GlobalStyles.BoldText, {fontSize: 32}]}>
            마이페이지
          </Text>
        </View>

        <View
          style={[
            GlobalStyles.content,
            {
              justifyContent: 'flex-start',
              alignItems: 'baseline',
              flexDirection: 'row',
            },
          ]}>
          <Text
            style={[
              GlobalStyles.semiBoldText,
              {fontSize: 26, color: '#3B73E8'},
            ]}>
            {userId}
          </Text>
          <Text style={GlobalStyles.semiBoldText}> 님 안녕하세요 !</Text>
        </View>
        <View style={GlobalStyles.content}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onWithdrawButton}
            style={MyPageStyles.container}>
            <Text style={GlobalStyles.mediumText}>탈퇴하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onLogoutButton}
            style={MyPageStyles.container}>
            <Text style={[GlobalStyles.mediumText, {color: '#E93B3B'}]}>
              로그아웃
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {withdrawModalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={withdrawModalVisible}
          onRequestClose={() => setWithdrawModalVisible(false)} // 모달 닫기
        >
          <View style={GlobalStyles.messegeModalContainer}>
            <View style={GlobalStyles.messegeModalContent}>
              <Text style={[GlobalStyles.semiBoldText, {fontSize: 16}]}>
                탈퇴하시겠습니까?
              </Text>
              <View style={GlobalStyles.messegeModalButtonsContainer}>
                <TouchableOpacity
                  style={GlobalStyles.deleteConfirmbutton}
                  activeOpacity={0.7}
                  onPress={confirmWithdraw}>
                  <Text
                    style={[
                      GlobalStyles.BoldText,
                      {
                        width: 41,
                        textAlign: 'center',
                        fontSize: 16,
                        color: 'white',
                      },
                    ]}>
                    네
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    GlobalStyles.deleteConfirmbutton,
                    {backgroundColor: 'white', borderWidth: 1},
                  ]}
                  activeOpacity={0.7}
                  onPress={cancelWithdraw} // 모달 닫기
                >
                  <Text
                    style={[
                      GlobalStyles.BoldText,
                      {
                        width: 41,
                        textAlign: 'center',
                        fontSize: 16,
                        color: 'black',
                      },
                    ]}>
                    아니오
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

export default MyPageScreen;
