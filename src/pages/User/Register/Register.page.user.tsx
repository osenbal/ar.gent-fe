import React, { useState, useEffect } from 'react';
import { EGender } from '@interfaces/user.interface';
import { isEmpty } from '@utils/utils';
import IUserRegister from '@interfaces/user.interface';
import 'react-phone-number-input/style.css';
import {
  USERNAME_REGEX,
  PASSWORD_REGEX,
  EMAIL_REGEX,
  PHONE_NUMBER_REGEX,
} from '@/constant/_regex';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { registerUser } from '@store/authSlice';
import { ToastContainer } from 'react-toastify';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  Container,
  TextField,
  Select,
  MenuItem,
  FormGroup,
  Typography,
  Grid,
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  Input,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);

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
  const [validPhoneNumber, setValidPhoneNumber] = useState<boolean>(false);

  const [birthday, setBirthday] = useState<Dayjs | null>(null);

  const [email, setEmail] = useState<string>('');
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [matchPassword, setMatchPassword] = useState<string>('');
  const [showMatchPassword, setShowMatchPassword] = useState<boolean>(false);
  const [validMatch, setValidMatch] = useState<boolean>(false);

  const [errors, setErrors] = useState<object | null>();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.name === 'avatar') {
      setAvatar(e.target.files[0]);
      setAvatarPrev(URL.createObjectURL(e.target.files[0]));
    }
  };

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid || !phoneNumber || !avatar || !gender || !birthday) {
      return;
    }

    if (isValid) {
      setErrors(null);
    }

    const formData = new FormData();
    const newUser: IUserRegister = {
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
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ background: '#96C7D1' }}
        >
          <Grid
            sx={{
              display: {
                xs: 'none',
                md: 'grid',
              },
            }}
            item
            md={6}
          ></Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              background: '#ffffff',
              paddingTop: '40px !important',
              paddingBottom: '40px !important',
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="h4">Register</Typography>
              <FormGroup sx={{ mt: '42px' }}>
                <FormGroup sx={{ margin: { xs: '0 auto', md: '0' } }}>
                  <label
                    style={{
                      cursor: 'pointer',
                      position: 'relative',
                      width: 125,
                      height: 125,
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
                        // style={{ marginBottom: '1.25rem' }}
                      />

                      <Avatar
                        sx={{ position: 'absolute', right: 5, bottom: 2 }}
                      >
                        <CameraAltIcon />
                      </Avatar>
                    </Box>
                    <Input
                      onChange={handleFileInput}
                      type="file"
                      id="avatar_pic"
                      placeholder="avatar"
                      name="avatar"
                      required
                      hidden
                    />
                  </label>
                </FormGroup>
                <br />
                <FormGroup
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
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </FormGroup>
                <br />
                <FormGroup
                  sx={{
                    display: 'flex',
                    gap: '32px',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: { xs: 'center', md: 'space-between' },
                  }}
                >
                  <FormControl sx={{ width: { xs: '100%', md: '45%' } }}>
                    <InputLabel id="genderSelect">Gender</InputLabel>
                    <Select
                      labelId="genderSelect"
                      value={gender}
                      label="gender"
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
                      label="Birthday"
                      inputFormat="DD/MM/YYYY"
                      value={birthday}
                      onChange={(newValue: Dayjs | null) =>
                        setBirthday(newValue)
                      }
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </FormControl>
                </FormGroup>
                <br />
                <MuiTelInput
                  label="phone number"
                  required
                  value={phoneNumber}
                  onChange={(newPhone: string) => setPhoneNumber(newPhone)}
                  defaultCountry="ID"
                  error={!validPhoneNumber}
                  helperText={
                    !validPhoneNumber ? 'phone number not valid !' : ''
                  }
                />
                <br />
                <TextField
                  id="email"
                  label="Email"
                  required
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!validEmail}
                  helperText={!validEmail ? 'email not valid' : ''}
                />
                <FormControl sx={{ mt: '16px' }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password *
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    required
                    autoComplete="off"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    error={!validPassword}
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
                  {!validPassword && (
                    <FormHelperText error id="accountId-error">
                      Password must contain number and string (min 8 character)!
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl sx={{ mt: '16px' }} variant="outlined">
                  <InputLabel htmlFor="confirmPassword">
                    Confirm Password *
                  </InputLabel>
                  <OutlinedInput
                    id="confirmPassword"
                    required={true}
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
              </FormGroup>
              {/* <FormGroup sx={{ marginTop: 3 }}>
                <Typography variant="h5">Address</Typography>
                <TextField
                  sx={{ mt: '16px' }}
                  id="street"
                  label="Street"
                  required
                  type="text"
                  variant="outlined"
                  name="street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />

                <FormControl sx={{ mt: '16px' }}>
                  <InputLabel id="countrySelect">Country</InputLabel>
                  <Select
                    labelId="countrySelect"
                    label="Country"
                    name="country"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setState('');
                      setCity('');
                    }}
                    required
                  >
                    {Country.getAllCountries().map((c) => (
                      <MenuItem key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ mt: '16px' }}>
                  <InputLabel id="stateSelect">State</InputLabel>
                  <Select
                    labelId="stateSelect"
                    label="State"
                    name="state"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setCity('');
                    }}
                    required
                  >
                    {State.getStatesOfCountry(country).map((s) => (
                      <MenuItem key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ mt: '16px' }}>
                  <InputLabel id="citySelect">City</InputLabel>
                  <Select
                    labelId="citySelect"
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  >
                    {City.getCitiesOfState(country, state).map((city) => (
                      <MenuItem key={city.name} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  sx={{ mt: '16px' }}
                  id="zipCode"
                  label="zip code"
                  required
                  type="number"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  variant="outlined"
                  name="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </FormGroup> */}
              <Button
                type="submit"
                onClick={handleSubmit}
                sx={{ width: '100%', mt: '24px' }}
                variant="contained"
              >
                Register
              </Button>
            </Container>
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default Register;
