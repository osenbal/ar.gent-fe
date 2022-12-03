import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  TextField,
  Container,
  FormGroup,
  Button,
  Modal,
  Typography,
  Box,
} from '@mui/material';
import { BACKEND_URL } from '@/config/config';

const styleContainerModal = {
  borderRadius: '10px',
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid inherit',
  boxShadow: 24,
  p: 4,
};

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const handleSendRequestChangePassword = async () => {
    if (email === '') {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      setIsError(false);
    } else {
      setIsError(true);
    }

    setMsg(data.message);
    setOpen(true);
    setIsLoading(false);
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
            required
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

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleContainerModal}>
          {isError ? (
            <img
              style={{
                width: '100px',
                height: '100px',
                display: 'block',
                margin: '0 auto',
              }}
              alt="failed"
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
              alt="success"
              src={
                process.env.PUBLIC_URL +
                '/assets/img/icons/img_icon_checked.png'
              }
            />
          )}
          <Typography
            sx={{ textAlign: 'center', mt: 2 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {msg}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ForgotPassword;
