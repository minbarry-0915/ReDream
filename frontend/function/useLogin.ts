import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { REACT_NATIVE_BACKEND_IP} from '@env';

const useLogin = () => {
  const dispatch = useDispatch();

  const loginUser = async (id: string, password: string, onError: () => void) => {
    try {
      const response = await axios.post(`http://${REACT_NATIVE_BACKEND_IP}:3000/api/user/login`, {
        id: id,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200) {
        const { user, token } = response.data;
        dispatch(login({ user, token }));
        return true;
      } else if (response.status === 401) {
        onError(); // 실패 시 콜백 호출
        return false;
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Login failed:', error);
      onError();
      return false;
    }
  };

  return loginUser;
};

export default useLogin;
