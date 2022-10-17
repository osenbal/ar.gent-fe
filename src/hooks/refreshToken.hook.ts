import { useAppDispatch } from '@hooks/redux.hook';
import { setIsAuth } from '@/store/authSlice';
import { BACKEND_URL } from '@/config/config';

const useRefreshToken = () => {
  const dispatch = useAppDispatch();

  const refreshToken = async () => {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      dispatch(setIsAuth(true));
    }
    const data = await response.json();
    return data;
  };
  return refreshToken;
};

export default useRefreshToken;
