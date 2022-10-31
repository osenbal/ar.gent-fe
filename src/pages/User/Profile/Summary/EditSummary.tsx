import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import dayjs, { Dayjs } from 'dayjs';
import { EGender } from '@/interfaces/user.interface';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MuiTelInput } from 'mui-tel-input';
import { City, Country, State } from 'country-state-city';
import { PHONE_NUMBER_REGEX } from '@/constant/_regex';
import { BACKEND_URL } from '@/config/config';

type props = {
  open: boolean;
  handleClose: () => void;
};

const EditSummary: React.FC<props> = ({ open, handleClose }) => {
  const { user, userId } = useAppSelector((state) => state.auth);
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [validPhoneNumber, setValidPhoneNumber] = useState<boolean>(false);

  const genderValues = Object.values(EGender);
  const [gender, setGender] = useState<string>('');
  const [birthday, setBirthday] = useState<Dayjs | null>(null);

  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [zipCode, setZipCode] = useState<number | string>('');
  const [state, setState] = useState<string>('');

  const handleSaveChanges = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('save changes');
    console.log(fullName);

    const data = {
      fullName,
    };

    const res = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log(res);
  };

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setGender(user.gender);
      setBirthday(dayjs(user.birthday));
      setPhoneNumber(user.phoneNumber);
      setStreet(user.address.street);
      setCountry(user.address.country);
      setState(user.address.state);
      setCity(user.address.city);
      setZipCode(Number(user.address.zipCode));
    }
  }, [user, open]);

  useEffect(() => {
    if (phoneNumber) {
      setValidPhoneNumber(PHONE_NUMBER_REGEX.test(phoneNumber));
    }
  }, [phoneNumber]);

  return (
    <>
      <CustomizeModal
        onSave={handleSaveChanges}
        open={open}
        title="Edit Summary"
        handleClose={() => handleClose()}
        id="editSummary"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {/* full name */}
          <TextField
            size="small"
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          {/* gender */}
          <FormControl size="small" fullWidth sx={{ mt: 3 }}>
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

          {/* birthday */}
          <FormControl size="small" fullWidth sx={{ mt: 3 }}>
            <DesktopDatePicker
              label="Birthday"
              inputFormat="DD/MM/YYYY"
              value={birthday}
              onChange={(newValue: Dayjs | null) => setBirthday(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>

          {/* phone number */}
          <MuiTelInput
            size="small"
            fullWidth
            sx={{ mt: 3 }}
            label="phone number"
            required
            value={phoneNumber}
            onChange={(newPhone: string) => setPhoneNumber(newPhone)}
            defaultCountry="ID"
            error={!validPhoneNumber}
            helperText={!validPhoneNumber ? 'phone number not valid !' : ''}
          />
          <Typography sx={{ mt: 3, fontWeight: '500' }} variant="body1">
            Address
          </Typography>

          {/* street */}
          <TextField
            sx={{ mt: 3 }}
            size="small"
            fullWidth
            id="street"
            label="Street"
            required
            type="text"
            variant="outlined"
            name="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />

          {/* country */}
          <FormControl sx={{ mt: 3 }} size="small" fullWidth>
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

          {/* state */}
          <FormControl sx={{ mt: 3 }} size="small" fullWidth>
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

          {/* City */}
          <FormControl sx={{ mt: 3 }} size="small" fullWidth>
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

          {/* Zip code */}
          <TextField
            sx={{ mt: 3 }}
            size="small"
            fullWidth
            id="zipCode"
            label="zip code"
            required
            type="number"
            variant="outlined"
            name="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(Number(e.target.value))}
          />
        </Box>
      </CustomizeModal>
    </>
  );
};

export default EditSummary;
