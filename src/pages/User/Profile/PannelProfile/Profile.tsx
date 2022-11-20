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
import { Box, Skeleton } from '@mui/material';
import { BACKEND_URL } from '@/config/config';

const Profile: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);

  const getUser = async (controller: any) => {
    // fetch user from server
    fetch(`${BACKEND_URL}/user/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(setUser(data.data));
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('abort');
        }
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    getUser(controller);
    return () => {
      controller.abort();
    };
  }, [id]);

  return (
    <>
      <Box sx={{ mt: 4 }}>
        {/* {userId === user?._id ? (
          <Typography sx={{ fontSize: { xs: '18px', md: '24px' } }}>
            My Profile
          </Typography>
        ) : (
          <Typography sx={{ fontSize: { xs: '18px', md: '24px' } }}>
            Profile
          </Typography>
        )} */}

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
