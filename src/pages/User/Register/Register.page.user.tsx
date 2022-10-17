import React, { useState, useEffect } from 'react';
import { EGender } from '@interfaces/user.interface';
import { isEmpty } from '@utils/utils';
import IUserRegister from '@interfaces/user.interface';
import PhoneInput from 'react-phone-number-input';
import { E164Number } from 'libphonenumber-js';
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

const Register: React.FC = () => {
  const dispatch = useAppDispatch();

  // global state
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const genderValues = Object.values(EGender);

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPrev, setAvatarPrev] = useState<string>(
    'https://fakeimg.pl/300x300/'
  );

  const [username, setUsername] = useState<string>('');
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);

  const [fullName, setFullName] = useState<string>('');
  const [gender, setGender] = useState<string>(EGender.MALE);

  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>();
  const [validPhoneNumber, setValidPhoneNumber] = useState<boolean>(false);

  const [birthday, setBirthday] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [zipCode, setZipCode] = useState<number | undefined>();

  const [email, setEmail] = useState<string>('');
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [emailFocus, setEmailFocus] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);

  const [matchPassword, setMatchPassword] = useState<string>('');
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

    if (isEmpty(gender)) {
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

    if (isEmpty(street)) {
      isValid = false;
      errors['street'] = 'Please input your street address.';
    }

    if (isEmpty(city)) {
      isValid = false;
      errors['city'] = 'Please input your city.';
    }

    if (isEmpty(country)) {
      isValid = false;
      errors['country'] = 'Please input your country.';
    }

    if (!zipCode || zipCode === null || zipCode === undefined) {
      isValid = false;
      errors['zipCode'] = 'Please input your zip code.';
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

    if (!isValid || !phoneNumber || !avatar || !zipCode) {
      return;
    }

    if (isValid) {
      setErrors(null);
    }

    const formData = new FormData();
    const newUser: IUserRegister = {
      avatar: avatar,
      username: username,
      fullName: fullName,
      gender: gender,
      phoneNumber: phoneNumber,
      birthday: birthday,
      street: street,
      city: city,
      country: country,
      zipCode: zipCode,
      email: email,
      password: password,
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
    street,
    city,
    country,
    zipCode,
  ]);

  // check username
  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(username));
  }, [username]);

  // check phone number
  useEffect(() => {
    if (phoneNumber) {
      setValidPhoneNumber(PHONE_NUMBER_REGEX.test(phoneNumber.toString()));
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

      <h1>Register</h1>

      <img src={avatarPrev} alt="avatar" />
      <form>
        <label htmlFor="avatar">Avatar</label>
        <input
          onChange={handleFileInput}
          multiple={false}
          type="file"
          id="avatar"
          placeholder="avatar"
          name="avatar"
          accept="image/*"
          required
        />
        <br />
        <label htmlFor="username">Username</label>
        <input
          onChange={(e) => setUsername(e.target.value.trim())}
          value={username}
          type="text"
          autoComplete="off"
          name="username"
          placeholder="username"
          required
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
        />
        {username && usernameFocus && !validUsername ? (
          <>
            <p>Useraname not valid</p>
          </>
        ) : (
          ''
        )}
        <br />
        <label htmlFor="fullName">Full Name</label>
        <input
          onChange={(e) => setFullName(e.target.value)}
          value={fullName}
          type="text"
          name="fullName"
          id="fullName"
          placeholder="Full Name"
          required
        />
        <br />
        <label htmlFor="gender">Gender</label>
        <select
          name="gender"
          id="gender"
          onChange={(e) => setGender(e.target.value)}
          required
          value={gender}
        >
          {genderValues.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="phoneNumber">Phone Number</label>
        <PhoneInput
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={setPhoneNumber}
          defaultCountry="ID"
        />
        <br />
        <label htmlFor="birthday">Birthday</label>
        <input
          onChange={(e) => setBirthday(e.target.value)}
          value={birthday}
          type="date"
          name="birthday"
          id="birthday"
          placeholder="Date of Birth"
          required
        />
        <br />
        <label htmlFor="street">Street</label>
        <input
          onChange={(e) => setStreet(e.target.value)}
          value={street}
          type="text"
          name="street"
          id="street"
          placeholder="street"
          required
        />
        <br />
        <label htmlFor="city">City</label>
        <input
          onChange={(e) => setCity(e.target.value)}
          value={city}
          type="text"
          name="city"
          id="city"
          placeholder="city"
          required
        />
        <br />
        <label htmlFor="country">Country</label>
        <input
          onChange={(e) => setCountry(e.target.value)}
          value={country}
          type="text"
          name="country"
          id="country"
          placeholder="country"
          required
        />
        <br />
        <label htmlFor="zipCode">Zip Code</label>
        <input
          onChange={(e) => setZipCode(Number(e.target.value))}
          value={zipCode?.toString() || ''}
          type="number"
          name="zipCode"
          id="zipCode"
          placeholder="zip code"
          required
        />
        <br />
        <label htmlFor="email">Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          name="email"
          placeholder="Email"
          required
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
        />
        {!validEmail && emailFocus ? <p>ex: example@gmail.com</p> : ''}
        <br />
        <label htmlFor="password">Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          name="password"
          placeholder="password"
          required
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
        {!validPassword && passwordFocus ? (
          <p id="pwdnote">
            8 to 24 characters.
            <br />
            Must include at leas 1 letters, 1 number
            <br />
          </p>
        ) : (
          <></>
        )}
        <br />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="confirm password"
          required
          onChange={(e) => setMatchPassword(e.target.value)}
          value={matchPassword}
        />
        {validMatch ? <p>Password Match</p> : <p>Password Not Match</p>}
        <br />
        <button disabled={isLoading} type="submit" onClick={handleSubmit}>
          Register
        </button>
      </form>
    </>
  );
};

export default Register;
