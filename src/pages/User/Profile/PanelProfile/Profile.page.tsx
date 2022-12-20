import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
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
import {
  Box,
  Button,
  Skeleton,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import FetchIntercept from '@/utils/api';

const Profile: React.FC = () => {
  const { id } = useParams();
  const theme = useTheme();
  const upTabScreen = useMediaQuery(theme.breakpoints.up('md'));
  const dispatch = useAppDispatch();
  const { user, userId } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVerifycation, setIsLoadingVerifycation] = useState(false);

  const getUser = async () => {
    // fetch user from server
    const response = await FetchIntercept(`${BACKEND_URL}/user/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.code === 200) {
      dispatch(setUser(response.data));
      setIsLoading(false);
    } else {
      dispatch(setUser(null));
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    // verify email
    setIsLoadingVerifycation(true);
    const response = await FetchIntercept(
      `${BACKEND_URL}/user/send-verify/${userId}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.code === 201) {
      toast.success(`${response.message}`);
      setIsLoadingVerifycation(false);
    } else {
      toast.warning(`${response.message}`);
      setIsLoadingVerifycation(false);
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Box sx={{ mt: 4, mb: 5 }}>
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
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                gap: '16px',
              }}
            >
              <img
                style={upTabScreen ? { width: '200px' } : { width: '130px' }}
                alt="not-found-img"
                src={
                  process.env.PUBLIC_URL +
                  '/assets/img/svg/img_userNotFound.svg'
                }
              />
              <Typography variant="h6" color="textSecondary">
                User not found
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <div>
              {user.status === false ? (
                <>
                  <Typography
                    sx={{ width: '100%', backgroundColor: '#DC3535' }}
                  >
                    This User has been banned
                  </Typography>
                </>
              ) : (
                ''
              )}
            </div>
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
