import {StyleSheet} from 'react-native';

const SignUpStyles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    borderBottomWidth: 1,
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: 'black',
    letterSpacing: -0.8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },
  dropDownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropDownText: {
    borderBottomWidth: 1,
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: 'black',
    letterSpacing: -0.8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropDownMenuContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomStartRadius: 12,
    borderBottomEndRadius: 12,
    paddingVertical: 12,
  },
});

export default SignUpStyles;
