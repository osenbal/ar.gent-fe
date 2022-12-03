import React, { useState, useEffect } from 'react';
import { EGender } from '@interfaces/user.interface';
import { isEmpty } from '@utils/utils';
import { IRegister_User } from '@interfaces/user.interface';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { registerUser } from '@store/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { MuiTelInput } from 'mui-tel-input';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { LoadingButton } from '@mui/lab';
import {
  USERNAME_REGEX,
  PASSWORD_REGEX,
  EMAIL_REGEX,
  PHONE_NUMBER_REGEX,
} from '@/constant/_regex';
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Typography,
  Grid,
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import 'react-phone-number-input/style.css';

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const genderValues = Object.values(EGender);

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPrev, setAvatarPrev] = useState<string>(
    'https://fakeimg.pl/300x300/'
  );

  const [username, setUsername] = useState<string>('');
  const [validUsername, setValidUsername] = useState<boolean>(false);

  const [fullName, setFullName] = useState<string>('');
  const [gender, setGender] = useState<string | undefined>('');

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [focusPhoneNumber, setFocusPhoneNumber] = useState<boolean>(false);
  const [validPhoneNumber, setValidPhoneNumber] = useState<boolean>(false);

  const [birthday, setBirthday] = useState<Dayjs | null>(null);

  const [email, setEmail] = useState<string>('');
  const [focusEmail, setFocusEmail] = useState<boolean>(false);
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [focusPassword, setFocusPassword] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [matchPassword, setMatchPassword] = useState<string>('');
  const [showMatchPassword, setShowMatchPassword] = useState<boolean>(false);
  const [validMatch, setValidMatch] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errors, setErrors] = useState<object | null>();

  const validate = () => {
    let isValid = true;
    let errors: any = {};

    // check if avatar empty
    if (avatar === null) {
      isValid = false;
      errors['avatar'] = 'Please input your picture.';
    }

    if (isEmpty(username) || !validUsername) {
      isValid = false;
      errors['username'] = 'Please input your username.';
    }

    if (isEmpty(fullName)) {
      isValid = false;
      errors['fullName'] = 'Please input your name.';
    }

    if (!gender || gender === undefined || gender === '') {
      isValid = false;
      errors['gender'] = 'Please input your gender.';
    }

    if (isEmpty(phoneNumber) || !validPhoneNumber) {
      isValid = false;
      errors['phoneNumber'] = 'Please input your phone number';
    }

    if (birthday === null || birthday === undefined) {
      isValid = false;
      errors['birthday'] = 'Please input your date birthday';
    }

    if (isEmpty(email) || !validEmail) {
      isValid = false;
      errors['email'] = 'Please input your email.';
    }

    if (isEmpty(password) || !validPassword) {
      isValid = false;
      errors['password'] = 'Please input your password.';
    }

    if (isEmpty(matchPassword) || !validMatch) {
      isValid = false;
      errors['confirmPassword'] = 'Pleases input password confirmation.';
    }

    setErrors(errors);
    return isValid;
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.name === 'avatar') {
      setAvatar(e.target.files[0]);
      setAvatarPrev(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const isValid: boolean = validate();
    if (!isValid || !phoneNumber || !avatar || !gender || !birthday) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isValid) {
      setErrors(null);
    }

    const formData = new FormData();
    const newUser: IRegister_User = {
      avatar: avatar,
      username: username.trim(),
      fullName: fullName.trim(),
      gender: gender,
      phoneNumber: phoneNumber.replaceAll(/\s/g, '').trim(),
      birthday: birthday.toISOString(),
      email: email.trim(),
      password: password.trim(),
    };

    let key: keyof typeof newUser;
    for (key in newUser) {
      if (key === 'avatar') {
        formData.append(key, newUser[key]);
        continue;
      }
      formData.append(key, newUser[key].toString());
    }

    if (
      localStorage.getItem('persist') === null ||
      localStorage.getItem('persist') === 'false' ||
      localStorage.getItem('persist')
    ) {
      localStorage.setItem('persist', 'true');
    }

    dispatch(registerUser(formData));
  };

  // validate
  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    avatar,
    username,
    fullName,
    phoneNumber,
    birthday,
    gender,
    email,
    password,
    matchPassword,
  ]);

  // check username
  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(username));
  }, [username]);

  // check phone number
  useEffect(() => {
    if (phoneNumber) {
      setValidPhoneNumber(PHONE_NUMBER_REGEX.test(phoneNumber));
    }
  }, [phoneNumber]);

  // check email
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  // check password
  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
  }, [password]);

  // Check validation password and confirm password
  useEffect(() => {
    const match: boolean = password === matchPassword;
    setValidMatch(match);
  }, [matchPassword, password]);

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>

      <ToastContainer />

      <main>
        <Box sx={{ padding: 4 }}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={4}>
              <Container maxWidth="lg">
                <Typography variant="h4">Register</Typography>
                <Box sx={{ mt: '42px' }}>
                  {/* avatar */}
                  <Box sx={{ margin: { xs: '0 auto' } }}>
                    <label
                      style={{
                        cursor: 'pointer',
                        position: 'relative',
                        width: 125,
                        height: 125,
                        display: 'block',
                        margin: '0 auto',
                      }}
                      htmlFor="avatar_pic"
                    >
                      <Box
                        sx={{
                          position: 'relative',
                        }}
                      >
                        <Avatar
                          src={avatarPrev}
                          sx={{
                            height: 125,
                            width: 125,
                            border: '1px solid #333333',
                          }}
                        />

                        <Avatar
                          sx={{ position: 'absolute', right: 5, bottom: 2 }}
                        >
                          <CameraAltIcon />
                        </Avatar>
                      </Box>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        id="avatar_pic"
                        placeholder="avatar"
                        name="avatar"
                        required
                        hidden
                      />
                    </label>
                  </Box>
                  <br />

                  {/* username, fullname */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '32px',
                      flexDirection: { xs: 'column', md: 'row' },
                      justifyContent: { xs: 'center', md: 'space-between' },
                    }}
                  >
                    <TextField
                      sx={{ width: { xs: '100%', md: '45%' } }}
                      id="username"
                      label="Username"
                      variant="outlined"
                      autoCorrect="off"
                      autoComplete="off"
                      required
                      value={username.replace(/\s/g, '').trim()}
                      onChange={(e) => setUsername(e.target.value.trim())}
                    />

                    <TextField
                      sx={{ width: { xs: '100%', md: '45%' } }}
                      id="fullName"
                      label="Full Name"
                      variant="outlined"
                      autoComplete="off"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Box>
                  <br />
                  {/* gender,  bithday */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '32px',
                      flexDirection: { xs: 'column', md: 'row' },
                      justifyContent: { xs: 'center', md: 'space-between' },
                    }}
                  >
                    <FormControl sx={{ width: { xs: '100%', md: '45%' } }}>
                      <InputLabel id="genderSelect">Gender *</InputLabel>
                      <Select
                        labelId="genderSelect"
                        value={gender}
                        label="gender*"
                        onChange={(e) => setGender(e.target.value)}
                        required
                      >
                        {genderValues.map((gender) => (
                          <MenuItem key={gender} value={gender}>
                            {gender}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '45%' } }}>
                      <DesktopDatePicker
                        label="Birthday *"
                        inputFormat="DD/MM/YYYY"
                        value={birthday}
                        onChange={(newValue: Dayjs | null) =>
                          setBirthday(newValue)
                        }
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </FormControl>
                  </Box>
                  <br />

                  <MuiTelInput
                    label="phone number"
                    required
                    autoComplete="off"
                    fullWidth
                    value={phoneNumber}
                    onChange={(newPhone: string) => setPhoneNumber(newPhone)}
                    defaultCountry="ID"
                    error={!validPhoneNumber && focusPhoneNumber}
                    onFocus={() => setFocusPhoneNumber(true)}
                    onBlur={() => setFocusPhoneNumber(false)}
                    helperText={
                      !validPhoneNumber && focusPhoneNumber
                        ? 'phone number not valid !'
                        : ''
                    }
                  />
                  <br />

                  {/* email */}
                  <TextField
                    required
                    fullWidth
                    id="email"
                    type="email"
                    variant="outlined"
                    autoComplete="off"
                    label="Email"
                    value={email}
                    onFocus={() => setFocusEmail(true)}
                    onBlur={() => setFocusEmail(false)}
                    onChange={(e) => setEmail(e.target.value)}
                    helperText={
                      !validEmail && focusEmail ? 'email not valid' : ''
                    }
                    error={!validEmail && focusEmail}
                    sx={{ mt: 2 }}
                  />
                  {/* pasword */}
                  <FormControl
                    sx={{ mt: '16px', width: '100%' }}
                    variant="outlined"
                  >
                    <InputLabel htmlFor="password">Password *</InputLabel>
                    <OutlinedInput
                      required
                      id="password"
                      autoComplete="off"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      onFocus={() => setFocusPassword(true)}
                      onBlur={() => setFocusPassword(false)}
                      value={password}
                      error={!validPassword && focusPassword}
                      onChange={(e) => setPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={(e) => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password *"
                    />
                    {!validPassword && focusPassword && (
                      <FormHelperText error id="accountId-error">
                        Password must contain number and character (min 8
                        character)!
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl
                    sx={{ mt: '16px', width: '100%' }}
                    variant="outlined"
                  >
                    <InputLabel htmlFor="confirmPassword">
                      Confirm Password *
                    </InputLabel>
                    <OutlinedInput
                      id="confirmPassword"
                      required={true}
                      autoComplete="off"
                      fullWidth
                      name="confirmPassword"
                      type={showMatchPassword ? 'text' : 'password'}
                      value={matchPassword}
                      onChange={(e) => setMatchPassword(e.target.value)}
                      error={!validMatch}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={(e) =>
                              setShowMatchPassword(!showMatchPassword)
                            }
                            edge="end"
                          >
                            {showMatchPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password *"
                    />
                    {!validMatch && (
                      <FormHelperText error id="accountId-error">
                        Password not match!
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {isLoading ? (
                  <LoadingButton
                    loading
                    variant="outlined"
                    sx={{ width: '100%', mt: '24px' }}
                  >
                    Register
                  </LoadingButton>
                ) : (
                  <Button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    type="submit"
                    variant="contained"
                    sx={{ width: '100%', mt: '24px' }}
                  >
                    Register
                  </Button>
                )}
              </Container>
            </Grid>
          </Grid>
        </Box>
      </main>
    </>
  );
};

export default Register;
