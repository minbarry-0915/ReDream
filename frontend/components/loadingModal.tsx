import React, {useEffect, useRef, useState} from 'react';
import {Animated, Modal, View} from 'react-native';
import Loading from './animations/loading';
import GlobalStyles from '../styles/globalStyle';
import AnimationStyles from '../styles/animationStyle';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import TopNavigator from './topNavigator';

interface ModalProp {
  version: string;
  navigation: NavigationProp<ParamListBase>;
  modalVisible: boolean;
  initialText: string;
}

function LoadingModal(props: ModalProp) {
  const {version, navigation, modalVisible, initialText} = props;

  const [text, setText] = useState(initialText);
  const fadeAnim = useRef(new Animated.Value(0)).current; // 초기 opacity 값 0

  useEffect(() => {
    if (version === 'createBook') {
      const interVal = setInterval(() => {
        // 텍스트를 먼저 변경하고 페이드 인 애니메이션 실행
        setText(prevText => {
          if (prevText === '그림을 만들고 있어요') {
            return '음성을 생성하고 있어요';
          } else if (prevText === '음성을 생성하고 있어요') {
            return '동화를 생성하고 있어요';
          } else {
            return '그림을 만들고 있어요';
          }
        });
      }, 3000); // 3초 간격으로 텍스트 변경
      return () => clearInterval(interVal);
    } else {
      const interVal = setInterval(() => {
        // 텍스트를 먼저 변경하고 페이드 인 애니메이션 실행
        setText(prevText => {
          if (prevText === '그림을 그리고 있어요') {
            return '음성을 가져오고 있어요';
          } else if (prevText === '음성을 가져오고 있어요') {
            return '동화를 불러오고 있어요';
          } else {
            return '그림을 그리고 있어요';
          }
        });
      }, 3000); // 3초 간격으로 텍스트 변경
      return () => clearInterval(interVal);
    }
  }, []);

  useEffect(() => {
    fadeIn(); // 텍스트가 변경될 때마다 페이드 인 애니메이션 실행
  }, [text]);

  // 페이드 인 애니메이션
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1, // opacity 1로
      duration: 500, // 애니메이션 지속 시간 0.5초
      useNativeDriver: true,
    }).start(() => fadeOut()); // 페이드 인 완료 후 페이드 아웃 시작
  };

  // 페이드 아웃 애니메이션
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0, // opacity 0으로
      duration: 500, // 애니메이션 지속 시간 0.5초
      useNativeDriver: true,
      delay: 2000, // 텍스트가 표시된 후 2초 후에 페이드 아웃
    }).start();
  };

  return (
    <Modal
      transparent={false}
      animationType="fade"
      visible={modalVisible}
      onRequestClose={
        version === 'createRequest' ? () => null : () => navigation.goBack()
      } //돌아가기 버튼 차단
    >
      <View
        style={[
          GlobalStyles.container,
          {alignItems: 'center', justifyContent: 'center'},
        ]}>
        <Loading style={AnimationStyles.loading} />
        <View
          style={[GlobalStyles.content, {alignItems: 'center', marginTop: 36}]}>
          <Animated.Text
            style={[
              GlobalStyles.semiBoldText,
              {fontSize: 24, opacity: fadeAnim},
            ]}>
            {text}
          </Animated.Text>
          <Animated.Text
            style={[
              GlobalStyles.semiBoldText,
              {fontSize: 24, opacity: fadeAnim},
            ]}>
            잠시만 기다려주세요
          </Animated.Text>
        </View>
      </View>
    </Modal>
  );
}

export default LoadingModal;
