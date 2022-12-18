import React, { useEffect, useState } from 'react';
import { setIsAuth, setAdminId } from '@/store/authAdminSlice';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { HashLoader } from 'react-spinners';
import { BACKEND_URL } from '@/config/config';

const ProtectedAdmin: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.authAdmin);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check access token from cookie
  useEffect(() => {
    let isMounted = true;
    const verifyToken = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/refresh`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          dispatch(setIsAuth(true));
          dispatch(setAdminId(data.data._id));
        }
      } catch (error) {
        console.log(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    if (!isAuth) {
      verifyToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return isAuth ? (
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
  ) : isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" state={{ from: location }} />
  );
};

export default ProtectedAdmin;
