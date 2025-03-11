import React from 'react';
import LottieView from 'lottie-react-native';
import {View} from 'react-native';
import GlobalStyles from '../../styles/globalStyle';

function Book({style}) {
  return (
    <View style={[GlobalStyles.content, {alignItems: 'center'}]}>
      <LottieView
        style={style}
        source={require('../../assets/animations/book.json')}
        autoPlay
        loop
      />
    </View>
  );
}
export default Book;
