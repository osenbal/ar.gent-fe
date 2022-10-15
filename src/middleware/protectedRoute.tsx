import React, { useEffect } from 'react';
import { useAppSelector } from '@/hooks/redux.hooks';
import { Outlet, Navigate } from 'react-router-dom';
import { BACKEND_URL } from '@/config/config';
import { useAppDispatch } from '@/hooks/redux.hooks';
import { setUser } from '@/store/authSlice';

const ProtectedRoute: React.FC = () => {
  const { isAuth } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${BACKEND_URL}/auth/user/verify-token`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          dispatch(setUser(data.data));
        }
      })
      .catch((err) => {});

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
