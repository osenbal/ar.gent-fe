import React from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const { isAuth } = useAppSelector((state) => state.auth);
  const location = useLocation();

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default ProtectedRoute;
