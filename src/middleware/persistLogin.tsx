import React, { useState, useEffect, CSSProperties } from 'react';
import useRefreshToken from '@/hooks/refreshToken.hook';
import { HashLoader } from 'react-spinners';
import { useAppSelector } from '@/hooks/redux.hook';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
};

const PersistLogin: React.FC = () => {
  const { persist, isAuth } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    <>
      {!persist ? (
        <Outlet />
      ) : isAuth ? (
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
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
