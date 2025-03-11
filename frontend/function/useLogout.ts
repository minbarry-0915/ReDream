import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../redux/authSlice';

function useLogout() {
  const dispatch = useDispatch();

  const logoutUser = async () => {
    try {
      // JWT 토큰 삭제
      await AsyncStorage.removeItem('jwtToken');

      // Redux 상태 초기화 (로그아웃)
      dispatch(logout());

      // 추가로 로그아웃 후 처리할 작업이 있으면 여기에 작성
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return logoutUser;
}

export default useLogout;
