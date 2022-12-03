import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '@/store/authAdminSlice';
import {
  Container,
  Typography,
  Divider,
  Stack,
  Button,
  TextField,
} from '@mui/material';

const LoginAdmin: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isAuth } = useAppSelector((state) => state.authAdmin);
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (email === '' || password === '') {
      return;
    }
    dispatch(loginAdmin({ email, password }));
  };

  useEffect(() => {
    if (isLoading === false && isAuth) {
      navigate('/admin/dashboard', {
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return (
    <>
      <Helmet>
        <title> Login | Admin </title>
      </Helmet>

      <Container maxWidth="sm">
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100vh' }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <Divider sx={{ width: '100%' }} />
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            sx={{ width: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            autoComplete="off"
            variant="outlined"
            sx={{ width: '100%', mt: 3 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            disabled={isLoading}
            onClick={handleLogin}
            variant="contained"
            sx={{ width: '100%', mt: 3 }}
          >
            Login
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default LoginAdmin;
