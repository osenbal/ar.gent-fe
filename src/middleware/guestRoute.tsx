import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import { Outlet, Navigate } from 'react-router-dom';
import useRefreshToken from '@/hooks/refreshToken.hook';
import { Box } from '@mui/material';
import { HashLoader } from 'react-spinners';

const GuestRoute: React.FC = () => {
  const { isAuth, persist } = useAppSelector((state) => state.auth);
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

  return !isAuth ? (
    <Outlet />
  ) : isLoading ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <HashLoader color="#36d7b7" loading={isLoading} size={50} />
    </Box>
  ) : (
    <Navigate to="/jobs" />
  );
};

export default GuestRoute;
