import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/config/config';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { HashLoader } from 'react-spinners';

const VerifyEmailPage = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const verifyUserEmail = async () => {
    const url = `${BACKEND_URL}/user/verify/${userId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      setIsVerified(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyUserEmail();
  }, []);

  return (
    <>
      {isLoading ? (
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
        <Box
          sx={{
            m: '0 auto',
            p: '0 1rem',
            minHeight: '100vh',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: '400px',
          }}
        >
          {isVerified ? (
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              Congrats user verificaion successfully
            </Typography>
          ) : (
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              User verification failed
            </Typography>
          )}
        </Box>
      )}
    </>
  );
};

export default VerifyEmailPage;
