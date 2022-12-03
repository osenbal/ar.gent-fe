import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { setUser } from '@/store/authSlice';
import Summary from './Summary/Summary';
import Education from './Education/Education';
import Experience from './Experience/Experience';
import About from './About/About';
import Skills from './Skills/Skills';
import PortfolioUrl from './PortfolioUrl/PortfolioUrl';
import { BACKEND_URL } from '@/config/config';
import { Box, Skeleton } from '@mui/material';

const Profile: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    // fetch user from server
    const response = await fetch(`${BACKEND_URL}/user/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      dispatch(setUser(userData.data));
      setIsLoading(false);
    } else {
      dispatch(setUser(null));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Box sx={{ mt: 4 }}>
        <Box sx={{ mt: 3 }}>
          {isLoading ? (
            <>
              <Box sx={{ position: 'relative' }}>
                <Skeleton variant="rectangular" height={300} />
                <Skeleton
                  sx={{ ml: 2, mt: -8 }}
                  variant="circular"
                  height={98}
                  width={98}
                />
                <Skeleton sx={{ mt: -4 }} variant="rectangular" height={100} />
              </Box>
              <Skeleton
                sx={{ mt: '16px' }}
                variant="rectangular"
                height={100}
              />
              <Skeleton
                sx={{ mt: '16px' }}
                variant="rectangular"
                height={100}
              />
              <Skeleton
                sx={{ mt: '16px' }}
                variant="rectangular"
                height={100}
              />
            </>
          ) : !user ? (
            <p>User Not Found</p>
          ) : (
            <>
              <Summary id={id} />
              <About />
              <Education />
              <Experience />
              <Skills />
              <PortfolioUrl />
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Profile;
