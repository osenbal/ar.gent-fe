import React from 'react';
import { Helmet } from 'react-helmet-async';
import { TextField, Container, FormGroup, Button } from '@mui/material';

const ForgotPassword: React.FC = () => {
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
            id="standard-email-input"
            label="Email"
            type="email"
            variant="standard"
          />
          <Button variant="contained" sx={{ marginTop: '1rem' }}>
            Send Reset Link
          </Button>
        </FormGroup>
      </Container>
    </>
  );
};

export default ForgotPassword;
