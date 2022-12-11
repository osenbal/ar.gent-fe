import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { setUser } from '@/store/authSlice';
import Summary from './Summary/Summary';
import Education from './Education/Education';
import Experience from './Experience/Experience';
import About from './About/About';
import Skills from './Skills/Skills';
import PortfolioUrl from './PortfolioUrl/PortfolioUrl';
import { BACKEND_URL } from '@/config/config';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Skeleton } from '@mui/material';

const Profile: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { user, userId } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVerifycation, setIsLoadingVerifycation] = useState(false);

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

  const handleVerifyEmail = async () => {
    // verify email
    setIsLoadingVerifycation(true);
    const response = await fetch(`${BACKEND_URL}/user/send-verify/${userId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await response.json();
    if (response.ok) {
      toast.success(`${resData.message}`);
      setIsLoadingVerifycation(false);
    } else {
      toast.warning(`${resData.message}`);
      setIsLoadingVerifycation(false);
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <ToastContainer />
      <Box sx={{ mt: 5, mb: 5 }}>
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
            <Skeleton sx={{ mt: '16px' }} variant="rectangular" height={100} />
            <Skeleton sx={{ mt: '16px' }} variant="rectangular" height={100} />
            <Skeleton sx={{ mt: '16px' }} variant="rectangular" height={100} />
          </>
        ) : !user ? (
          <p>User Not Found</p>
        ) : (
          <>
            <div>
              {user._id === userId ? (
                user.verified ? (
                  ''
                ) : isLoadingVerifycation ? (
                  <LoadingButton
                    size="small"
                    sx={{ width: '100%', color: '#FED049' }}
                    endIcon={<SendIcon />}
                    loading={isLoadingVerifycation}
                    loadingPosition="center"
                    variant="contained"
                  >
                    Send
                  </LoadingButton>
                ) : (
                  <Button
                    disabled={isLoadingVerifycation}
                    sx={{ width: '100%', color: '#FED049' }}
                    onClick={handleVerifyEmail}
                  >
                    Please verify your email
                  </Button>
                )
              ) : (
                ''
              )}
            </div>
            <Summary id={id} />
            <About />
            <Education />
            <Experience />
            <Skills />
            <PortfolioUrl />
          </>
        )}
      </Box>
    </>
  );
};

export default Profile;
