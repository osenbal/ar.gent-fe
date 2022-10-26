import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import useRefreshToken from '@/hooks/refreshToken.hook';
import { Outlet } from 'react-router-dom';

const PersistLogin: React.FC = () => {
  const { persist, isAuth } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();

  // Check access token from cookie
  useEffect(() => {
    let isMounted = true;
    const verifyToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    if (!isAuth && persist) {
      verifyToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading..</p> : <Outlet />}</>
  );
};

export default PersistLogin;
