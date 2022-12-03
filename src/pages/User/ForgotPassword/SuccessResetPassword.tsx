import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

const SuccessResetPassword: React.FC = () => {
  const { state } = useLocation();
  const [msg, setMsg] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (state?.data.status === 200) {
      setMsg(state.data.message);
      setIsError(false);
    } else {
      setIsError(true);
      setMsg('Something went wrong');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Card>
        <CardContent>
          {isError ? (
            <img
              style={{
                width: '100px',
                height: '100px',
                display: 'block',
                margin: '0 auto',
              }}
              alt="failed-icon"
              src={`${process.env.PUBLIC_URL}/assets/img/icons/img_icon_failed.png`}
            />
          ) : (
            <img
              style={{
                width: '100px',
                height: '100px',
                display: 'block',
                margin: '0 auto',
              }}
              alt="success-icon"
              src={`${process.env.PUBLIC_URL}/assets/img/icons/img_icon_checked.png`}
            />
          )}

          <Typography
            sx={{ textAlign: 'center', mt: 2 }}
            variant="h6"
            component="h2"
          >
            {msg}
          </Typography>
          <Button
            component="a"
            href="/"
            sx={{ display: 'block', m: '0 auto', textAlign: 'center' }}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SuccessResetPassword;
