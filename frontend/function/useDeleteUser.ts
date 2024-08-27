import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Redux store의 RootState 가져오기
import { REACT_NATIVE_BACKEND_IP } from '@env';

const useDeleteUser = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token); // Redux에서 토큰 가져오기

  const deleteUser = async (userId: string, onSuccess: () => void, onError: (error: string) => void) => {
    try {
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.delete(`http://${REACT_NATIVE_BACKEND_IP}:3000/api/user/delete/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200) {
        onSuccess(); // 성공 시 콜백 호출
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      onError(error.message); // 실패 시 콜백 호출
    }
  };

  return deleteUser;
};

export default useDeleteUser;
