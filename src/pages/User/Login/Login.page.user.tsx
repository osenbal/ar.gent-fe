import React, { useEffect, useState } from 'react';
import { EMAIL_REGEX } from '@/constant/_regex';
import { isEmpty } from '@utils/utils';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { loginUser } from '@store/authSlice';
import { setPersist } from '@store/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  Grid,
  TextField,
  Container,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Link,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  IconButton,
} from '@mui/material';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { persist, isLoading, isAuth } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>('');
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleCheckPersist = () => {
    dispatch(setPersist(!persist));
  };

  const handleLogin = (e: any) => {
    e.preventDefault();

    if (!validEmail || isEmpty(password)) {
      toast.error(`invalid email or password`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return;
    }

    dispatch(loginUser({ email, password }));

    if (isLoading === false && isAuth) {
      navigate(location.state?.from?.pathname || '/home', { replace: true });
    }
  };

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    localStorage.setItem('persist', persist.toString());
  }, [persist]);

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <ToastContainer />

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: '100vh' }}
      >
        <Grid
          sx={{
            display: { xs: 'none', md: 'grid' },
            background: '#96C7D1',
            minHeight: '100vh',
          }}
          item
          md={6}
        ></Grid>
        <Grid item xs={12} md={6}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{ textAlign: { xs: 'center', md: 'left' } }}
            >
              Sign in to AR.GENT
            </Typography>

            <FormGroup sx={{ marginTop: '3rem' }}>
              <TextField
                required
                sx={{ width: '100%' }}
                id="outlined-email-input"
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <br />

              {/* <TextField
                required
                sx={{ width: '100%' }}
                type="password"
                name="password"
                id="outlined-password-input"
                label="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /> */}
              <FormControl sx={{ width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  autoComplete="current-password"
                  id="outlined-adornment-password"
                  required
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={(e) => setShowPassword(!showPassword)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <Link
                href="/forgot-password"
                sx={{ marginTop: '1rem', display: 'block', width: 'auto' }}
              >
                Forgot Password?
              </Link>
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    aria-label="Save login ?"
                    id="persist"
                    name="persist"
                    checked={persist}
                    onChange={handleCheckPersist}
                  />
                }
                label="Save Login ?"
              />

              <br />

              <Button
                disabled={isLoading}
                variant="contained"
                onClick={handleLogin}
              >
                Login
              </Button>
            </FormGroup>
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
