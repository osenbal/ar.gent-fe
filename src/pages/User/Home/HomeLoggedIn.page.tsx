import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppSelector } from '@/hooks/redux.hook';

const HomeLoggedIn: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <Helmet>
        <title>Dashboard | ar.gent</title>
      </Helmet>

      <h1>Home Logged In</h1>
      <img src={user?.avatar} alt="profile" />
      <p>{user?.username}</p>
    </>
  );
};

export default HomeLoggedIn;
