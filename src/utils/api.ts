import useRefreshToken from '@/hooks/refreshToken.hook';
import { store } from '@/store';
import { setIsAuth, setUserId, asyncLogout } from '@/store/authSlice';
import { BACKEND_URL } from '@/config/config';

const FetchIntercept = async (url: string, options: RequestInit) => {
  const refreshToken = async () => {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      store.dispatch(setIsAuth(true));
      store.dispatch(setUserId(data.data._id));
    } else {
      store.dispatch(setIsAuth(false));
      store.dispatch(setUserId(''));
      store.dispatch(asyncLogout());
    }
  };

  const response = await fetch(url, options).then((res) => res.json());

  if (response.status === 401) {
    await refreshToken();
    return await fetch(url, options).then((res) => res.json());
  } else {
    return response;
  }
};

export default FetchIntercept;
