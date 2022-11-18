import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.hook';
import { useParams } from 'react-router-dom';

const AuthPolicy: React.FC = () => {
  const { userId } = useAppSelector((state) => state.auth);
  const { id } = useParams();

  return <>{userId === id ? <Outlet /> : <h1>Not authorized</h1>}</>;
};

export default AuthPolicy;
