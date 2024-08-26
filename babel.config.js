module.exports = {
  presets: [
    'module:@react-native/babel-preset',
  ],
  plugins: [
    ['react-native-reanimated/plugin'],
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env', // 환경 변수 파일 경로
    }],
    
  ],
};
