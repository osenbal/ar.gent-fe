import React, { useEffect, useState, useCallback } from 'react';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import { MuiTelInput } from 'mui-tel-input';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useAppSelector } from '@/hooks/redux.hook';
import { EGender } from '@/interfaces/user.interface';
import dayjs, { Dayjs } from 'dayjs';
import { City, Country, State } from 'country-state-city';
import { parseDate } from '@/utils/utils';
import { BACKEND_URL } from '@/config/config';
import { PHONE_NUMBER_REGEX } from '@/constant/_regex';
import { styled } from '@mui/material/styles';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Edit, CameraAlt } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import {
  Avatar,
  Box,
  Typography,
  Link,
  IconButton,
  Fade,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogTitle,
  Dialog,
  Input,
} from '@mui/material';

const Summary: React.FC<{ id: string | undefined }> = ({ id }) => {
  const { userId, user } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [cv, setCv] = useState<string>('');

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [validPhoneNumber, setValidPhoneNumber] = useState<boolean>(false);

  const genderValues = Object.values(EGender);
  const [gender, setGender] = useState<string>('');
  const [birthday, setBirthday] = useState<Dayjs | null>(null);

  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [banner, setBanner] = useState<string | undefined>(user?.banner);

  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [zipCode, setZipCode] = useState<number>();
  const [state, setState] = useState<string>('');

  const [dataEdited, setDataEdited] = useState<any>({
    fullName: '',
    gender: '',
    phoneNumber: '',
  });

  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  const Banner = styled('img')({
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  });

  const style = {
    width: 400,
    p: 4,
  };

  const handleOpenEditSummary = () => setOpen(true);
  const handleCloseEditSummary = () => setOpen(false);

  const handleSaveChanges = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!validPhoneNumber) {
      toast.error('Phone number is not valid');
      return;
    }

    const data = {
      fullName: dataEdited.fullName,
      gender: dataEdited.gender,
      phoneNumber: dataEdited.phoneNumber,
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

    if (res.ok) {
      setOpen(false);
      setFullName(dataEdited.fullName);
      setGender(dataEdited.gender);
      setPhoneNumber(dataEdited.phoneNumber);
      console.log(dataEdited);
    }
  };

  const setDataSummary = useCallback(() => {
    if (user) {
      setFullName(user.fullName);
      setUsername(user.username);
      setEmail(user.email);
      setGender(user.gender);
      setCv(user.cv);
      setBirthday(dayjs(user.birthday));
      setPhoneNumber(user.phoneNumber);
      setStreet(user.address.street);
      setCountry(user.address.country);
      setState(user.address.state);
      setCity(user.address.city);
      setZipCode(Number(user.address.zipCode));
    }
  }, [user]);

  const handleEditChange = useCallback(() => {
    setDataEdited((prev: any) => ({ ...prev, fullName, gender, phoneNumber }));
    console.log('set default');
  }, [fullName, gender, phoneNumber]);

  useEffect(() => {
    setDataSummary();
    console.log('useEffect');
  }, [setDataSummary]);

  useEffect(() => {
    setValidPhoneNumber(PHONE_NUMBER_REGEX.test(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    handleEditChange();
    console.log('useEffect set edit');
  }, [handleEditChange, open]);

  useEffect(() => {
    setValidPhoneNumber(PHONE_NUMBER_REGEX.test(dataEdited.phoneNumber));
    console.log('useEffect set phone');
  }, [dataEdited.phoneNumber]);

  return (
    <>
      <ToastContainer />
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Banner src={banner} alt="banner" />
        <IconButton sx={{ position: 'absolute', top: '0', right: '0' }}>
          <CameraAlt />
        </IconButton>

        <Box
          sx={{
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;',
            paddingBottom: 2,
          }}
        >
          <Box sx={{ marginLeft: 2 }}>
            <Box>
              {userId === id ? (
                <label
                  style={{
                    cursor: 'pointer',
                  }}
                  htmlFor="avatar_pic"
                >
                  <Box
                    sx={{
                      position: 'relative',
                    }}
                  >
                    <Avatar
                      src={avatar}
                      sx={{
                        width: 98,
                        height: 98,
                        marginTop: -8,
                        border: '1px solid #333333',
                      }}
                      // style={{ marginBottom: '1.25rem' }}
                    />

                    <Avatar
                      sx={{
                        position: 'absolute',
                        right: 5,
                        bottom: 2,
                        width: '24px',
                        height: '24px',
                      }}
                    >
                      <CameraAltIcon sx={{ width: '16px', height: '16px' }} />
                    </Avatar>
                  </Box>
                  <Input
                    // onChange={handleFileInput}
                    type="file"
                    id="avatar_pic"
                    placeholder="avatar"
                    name="avatar"
                    required
                    hidden
                  />
                </label>
              ) : (
                <Avatar
                  sx={{
                    width: 98,
                    height: 98,
                    marginTop: -8,
                    border: '1px solid #333333',
                  }}
                  src={avatar}
                  alt="avatar"
                />
              )}

              {/* Edit Summary */}
              {userId === id && (
                <>
                  <IconButton
                    onClick={handleOpenEditSummary}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 280,
                      background: 'inherit',
                    }}
                  >
                    <Edit color="action" />
                  </IconButton>
                  <CustomizeModal
                    onSave={handleSaveChanges}
                    open={open}
                    title="Edit Summary"
                    handleClose={handleCloseEditSummary}
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
                        value={dataEdited.fullName}
                        onChange={(e) =>
                          setDataEdited((prev: any) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                      />

                      {/* gender */}
                      <FormControl size="small" fullWidth sx={{ mt: 3 }}>
                        <InputLabel id="genderSelect">Gender</InputLabel>
                        <Select
                          labelId="genderSelect"
                          value={dataEdited.gender}
                          label="gender"
                          onChange={(e) =>
                            setDataEdited((prev: any) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
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
                          onChange={(newValue: Dayjs | null) =>
                            setBirthday(newValue)
                          }
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
                        value={dataEdited.phoneNumber}
                        onChange={(newPhone: string) =>
                          setDataEdited((prev: any) => ({
                            ...prev,
                            phoneNumber: newPhone,
                          }))
                        }
                        defaultCountry="ID"
                        error={!validPhoneNumber}
                        helperText={
                          !validPhoneNumber ? 'phone number not valid !' : ''
                        }
                      />
                      <Typography
                        sx={{ mt: 3, fontWeight: '500' }}
                        variant="body1"
                      >
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
                  </CustomizeModal>{' '}
                </>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: '700', marginTop: 2 }}>
                {fullName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: '500' }}>
                  {country}
                </Typography>
                <>
                  <Link
                    onClick={() => setOpenInfo(true)}
                    sx={{ cursor: 'pointer' }}
                  >
                    Contact Info
                  </Link>

                  <Dialog
                    maxWidth="lg"
                    open={openInfo}
                    onClose={() => setOpenInfo(false)}
                    aria-labelledby="contact info"
                  >
                    <DialogTitle id="contact info">Contact Info</DialogTitle>

                    <Fade in={openInfo}>
                      <Box sx={style}>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ mt: 2, fontWeight: '500' }}
                          >
                            Username :
                          </Typography>
                          <Typography>{username}</Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ mt: 2, fontWeight: '500' }}
                          >
                            Email :
                          </Typography>
                          <Typography>{email}</Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ mt: 2, fontWeight: '500' }}
                          >
                            Full Name :
                          </Typography>
                          <Typography>{fullName}</Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ mt: 2, fontWeight: '500' }}
                          >
                            Gender :
                          </Typography>
                          <Typography>{gender}</Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ mt: 2, fontWeight: '500' }}
                          >
                            Phone number :
                          </Typography>
                          <Typography>{phoneNumber || 'Not set'}</Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ mt: 2, fontWeight: '500' }}
                          >
                            Address :
                          </Typography>
                          <Typography>{street || 'not set'}</Typography>
                          <Typography sx={{ mt: 1, fontWeight: '500' }}>
                            City :{' '}
                          </Typography>
                          <Typography>{city || 'not set'}</Typography>
                          <Typography sx={{ mt: 1, fontWeight: '500' }}>
                            State
                          </Typography>
                          <Typography>{state || 'not set'}</Typography>
                          <Typography sx={{ mt: 1, fontWeight: '500' }}>
                            Country :{' '}
                          </Typography>
                          <Typography>{country || 'not set'}</Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ mt: 2, fontWeight: '500' }}
                          >
                            Zip Code :
                          </Typography>
                          <Typography>
                            {zipCode ? zipCode : 'Not set'}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body1"
                          sx={{ mt: 2, fontWeight: '500' }}
                        >
                          Birthday :
                        </Typography>
                        <Typography>
                          {parseDate(birthday?.toISOString())}
                        </Typography>
                      </Box>
                    </Fade>
                  </Dialog>
                </>
              </Box>
              {cv && (
                <Link
                  color="neutral"
                  underline="hover"
                  variant="h6"
                  sx={{ fontWeight: '500', cursor: 'pointer' }}
                >
                  Download CV
                </Link>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Summary;
