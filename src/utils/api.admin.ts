import { store } from '@/store';
import {
  setIsAuth,
  setAdminId,
  asyncLogoutAdmin,
} from '@/store/authAdminSlice';
import { BACKEND_URL } from '@/config/config';

const FetchAdminIntercept = async (url: string, options: RequestInit) => {
  const refreshToken = async () => {
    const response = await fetch(`${BACKEND_URL}/admin/refresh`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      store.dispatch(setIsAuth(true));
      store.dispatch(setAdminId(data.data._id));
    } else {
      store.dispatch(setIsAuth(false));
      store.dispatch(setAdminId(''));
      store.dispatch(asyncLogoutAdmin());
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

export default FetchAdminIntercept;
