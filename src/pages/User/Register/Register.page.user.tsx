import React, { useState, useEffect } from 'react';
import { EGender } from '@interfaces/user.interface';
import { isEmpty } from '@utils/utils';
import {
  USERNAME_REGEX,
  PASSWORD_REGEX,
  EMAIL_REGEX,
  PHONE_NUMBER_REGEX,
} from '@/constant/_regex';

const Register: React.FC = () => {
  const genderValues = Object.values(EGender);

  const [avatar, setAvatar] = useState<string>('');

  const [username, setUsername] = useState<string>('');
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);

  const [fullName, setFullName] = useState<string>('');
  const [gender, setGender] = useState<string>(EGender.MALE);

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [validPhoneNumber, setValidPhoneNumber] = useState<boolean>(false);
  const [phoneFocus, setPhoneFocus] = useState<boolean>(false);

  const [dateOfBirthDay, setDateOfBirthday] = useState<Date>();
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [zipCode, setZipCode] = useState<number>();

  const [email, setEmail] = useState<string>('');
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [emailFocus, setEmailFocus] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);

  const [matchPassword, setMatchPassword] = useState<string>('');
  const [validMatch, setValidMatch] = useState<boolean>(false);

  const [errors, setErrors] = useState<object>({});

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.name === 'avatar') {
      setAvatar(e.target.files[0].name);
    }
  };

  const validate = () => {
    let isValid = true;
    let errors: any = {};

    // check if avatar empty
    if (isEmpty(avatar)) {
      isValid = false;
      errors['avatar'] = 'Please input your picture.';
    }

    if (isEmpty(username)) {
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

    if (isEmpty(phoneNumber) && !validPhoneNumber) {
      isValid = false;
      errors['phoneNumber'] = 'Please input your phone number';
    }

    if (dateOfBirthDay === null || dateOfBirthDay === undefined) {
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

    if (isEmpty(zipCode)) {
      isValid = false;
      errors['zipCode'] = 'Please input your zip code.';
    }

    if (isEmpty(email) && !validEmail) {
      isValid = false;
      errors['email'] = 'Please input your email.';
    }

    if (isEmpty(password) && !validPassword) {
      isValid = false;
      errors['password'] = 'Please input your password.';
    }

    if (isEmpty(matchPassword) && !validMatch) {
      isValid = false;
      errors['confirmPassword'] = 'Pleases input password confirmation.';
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {};

  // check username
  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(username));
  }, [username]);

  // check phone number
  useEffect(() => {
    setValidPhoneNumber(PHONE_NUMBER_REGEX.test(phoneNumber));
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
      <h1>Register</h1>
      <form action="POST">
        <label htmlFor="avatar">Avatar</label>
        <input
          onChange={handleFileInput}
          value={avatar}
          multiple={false}
          type="file"
          id="avatar"
          placeholder="avatar"
          name="avatar"
          required
        />
        <br />

        <label htmlFor="username">Username</label>
        <input
          onChange={(e) => setUsername(e.target.value)}
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
        <input
          onChange={(e) => {
            if (!Number(e.target.value)) {
              return;
            }
            setPhoneNumber(e.target.value);
          }}
          value={phoneNumber}
          autoComplete="off"
          type="text"
          pattern="\d{1,5}"
          id="phoneNumber"
          name="phoneNumber"
          placeholder="phone number"
          required
          onFocus={() => setPhoneFocus(true)}
          onBlur={() => setPhoneFocus(false)}
        />
        {!validPhoneNumber && phoneFocus ? (
          <p>example format : 081234567890</p>
        ) : (
          <></>
        )}
        <br />

        <label htmlFor="birthday">Birthday</label>
        <input
          onChange={(e) => setDateOfBirthday(new Date(e.target.value))}
          value={dateOfBirthDay?.toString()}
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
          value={zipCode}
          type="text"
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
        <br />

        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;
