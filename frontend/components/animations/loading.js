import React from 'react';
import LottieView from 'lottie-react-native';
import GlobalStyles from '../../styles/globalStyle';
import {View} from 'react-native';

function Loading({style}) {
  return (
    <View
      style={[GlobalStyles.content, {alignItems: 'center', marginBottom: 0}]}>
      <LottieView
        style={style}
        source={require('../../assets/animations/loading.json')}
        autoPlay
        loop
      />
    </View>
  );
}
export default Loading;
