import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { TextField, Container, FormGroup, Button } from '@mui/material';
import { BACKEND_URL } from '@/config/config';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendRequestChangePassword = async () => {
    setIsLoading(true);
    const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    setIsLoading(false);
    const data = await response.json();
    console.log(data);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>

      <Container
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FormGroup sx={{ width: '100%' }}>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="standard-email-input"
            label="Email"
            type="email"
            variant="standard"
          />
          <Button
            onClick={handleSendRequestChangePassword}
            variant="contained"
            sx={{ marginTop: '1rem' }}
            disabled={isLoading}
          >
            Send Reset Link
          </Button>
        </FormGroup>
      </Container>
    </>
  );
};

export default ForgotPassword;
