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

type props = {
  open: boolean;
  handleClose: () => void;
};

const EditSummary: React.FC<props> = ({ open, handleClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [fullName, setFullName] = useState<string>('');

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [validPhoneNumber, setValidPhoneNumber] = useState<boolean>(false);

  const genderValues = Object.values(EGender);
  const [gender, setGender] = useState<string>('');
  const [birthday, setBirthday] = useState<Dayjs | null>(null);

  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [zipCode, setZipCode] = useState<number>();
  const [state, setState] = useState<string>('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setUsername(user.username);
      setGender(user.gender);
      setBirthday(dayjs(user.birthday));
      setPhoneNumber(user.phoneNumber);
      setStreet(user.address?.street);
      setCountry(user.address?.country);
      setState(user.address?.state);
      setCity(user.address?.city);
      setZipCode(Number(user.address?.zipCode));
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
        open={open}
        title="Edit Summary"
        handleClose={handleClose}
        id="editSummary"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <TextField
            size="small"
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
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
          <FormControl size="small" fullWidth sx={{ mt: 3 }}>
            <DesktopDatePicker
              label="Birthday"
              inputFormat="DD/MM/YYYY"
              value={birthday}
              onChange={(newValue: Dayjs | null) => setBirthday(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
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

          <TextField
            sx={{ mt: 3 }}
            size="small"
            fullWidth
            id="zipCode"
            label="zip code"
            required
            type="number"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
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
