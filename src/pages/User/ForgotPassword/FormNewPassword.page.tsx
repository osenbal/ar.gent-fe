import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '@/config/config';
import { useParams, useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  IconButton,
} from '@mui/material';
import NotFound from '@/pages/NotFound/NotFound.page';
import { PASSWORD_REGEX } from '@/constant/_regex';

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

const FormNewPassword = () => {
  const { uniqueString } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [focusPassword, setFocusPassword] = useState<boolean>(false);
  const [validUniqueString, setValidUniqueString] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleChangePassword = async (event: any) => {
    if (password) {
      const response = await fetch(
        `${BACKEND_URL}/auth/reset-password/${uniqueString}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        navigate('/success-reset-password', { replace: true, state: { data } });
      } else {
        setMsg(data.message);
        setOpen(true);
      }
      setPassword('');
    } else {
      setPassword('');
      console.log('password is empty');
    }
  };

  const checkUniqueString = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${BACKEND_URL}/auth/reset-password/check/${uniqueString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      setValidUniqueString(true);
      setIsLoading(false);
    } else {
      setValidUniqueString(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUniqueString();
  }, []);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
  }, [password]);

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
      ) : validUniqueString ? (
        <>
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
              maxWidth: '300px',
            }}
          >
            <Typography variant="h5" gutterBottom>
              ARGENT
            </Typography>

            <Typography sx={{ textAlign: 'center' }} variant="h5">
              Input New Password
            </Typography>

            <FormControl sx={{ mt: '16px', width: '100%' }} variant="outlined">
              <InputLabel htmlFor="password">Password *</InputLabel>
              <OutlinedInput
                required
                id="password"
                autoComplete="off"
                name="password"
                type={'password'}
                onFocus={() => setFocusPassword(true)}
                onBlur={() => setFocusPassword(false)}
                value={password}
                error={!validPassword && focusPassword}
                onChange={(e) => setPassword(e.target.value)}
                label="Password *"
              />
              {!validPassword && focusPassword && (
                <FormHelperText sx={{ mb: 1 }} error id="accountId-error">
                  Password must contain number and character (min 8 character)!
                </FormHelperText>
              )}
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              onClick={handleChangePassword}
              sx={{ mt: 3 }}
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </>
      ) : (
        <NotFound />
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleContainerModal}>
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

export default FormNewPassword;
