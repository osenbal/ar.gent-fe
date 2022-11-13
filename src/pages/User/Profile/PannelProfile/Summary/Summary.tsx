import React, { useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import {
  asyncUserSummary,
  asyncUserAvatar,
  asyncUserCv,
} from '@/store/authSlice';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import { MuiTelInput } from 'mui-tel-input';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { EGender, IUserUpdate } from '@/interfaces/user.interface';
import dayjs, { Dayjs } from 'dayjs';
import { City, Country, State } from 'country-state-city';
import { parseDate } from '@/utils/utils';
import { PHONE_NUMBER_REGEX } from '@/constant/_regex';
import { styled } from '@mui/material/styles';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Edit, CameraAlt } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import FileUploadIcon from '@mui/icons-material/FileUpload';
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
  Button,
} from '@mui/material';

const Summary: React.FC<{ id: string | undefined }> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { userId, user, isLoading } = useAppSelector((state) => state.auth);
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
    birthday: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
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
    const data: IUserUpdate = {
      fullName: dataEdited.fullName.trim(),
      gender: dataEdited.gender,
      phoneNumber: dataEdited.phoneNumber,
      birthday: dataEdited.birthday,
      street: dataEdited.street.trim(),
      city: dataEdited.city,
      state: dataEdited.state,
      country: dataEdited.country,
      zipCode: dataEdited.zipCode,
    };
    dispatch(asyncUserSummary({ userId, payload: data }));
    setOpen(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    formData.append('image', file!);

    dispatch(asyncUserAvatar({ userId, payload: formData }));
  };

  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    formData.append('cv', file!);
    dispatch(asyncUserCv({ userId, payload: formData }));
  };

  const setDataSummary = useCallback(() => {
    if (user) {
      setFullName(user.fullName);
      setUsername(user.username);
      setEmail(user.email);
      setGender(user.gender);
      setCv(user.cv);
      setAvatar(user.avatar);
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
    setDataEdited((prev: any) => ({
      ...prev,
      avatar,
      fullName,
      gender,
      phoneNumber,
      cv,
      birthday,
      street,
      city,
      state,
      country,
      zipCode,
    }));
  }, [
    cv,
    birthday,
    city,
    country,
    fullName,
    gender,
    phoneNumber,
    state,
    street,
    zipCode,
    avatar,
  ]);

  useEffect(() => {
    setDataSummary();
  }, [setDataSummary]);

  useEffect(() => {
    handleEditChange();
  }, [handleEditChange, open]);

  useEffect(() => {
    setValidPhoneNumber(PHONE_NUMBER_REGEX.test(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    setValidPhoneNumber(PHONE_NUMBER_REGEX.test(dataEdited.phoneNumber));
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
          <Box sx={{ marginLeft: 2, marginRight: 2 }}>
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
                    disabled={isLoading}
                    onChange={handleAvatarChange}
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
                        minWidth: { xs: '100%', lg: '350px' },
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
                          value={dataEdited.birthday}
                          onChange={(newValue: Dayjs | null) =>
                            setDataEdited((prev: any) => ({
                              ...prev,
                              birthday: newValue,
                            }))
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
                        value={dataEdited.street}
                        onChange={(e) =>
                          setDataEdited((prev: any) => ({
                            ...prev,
                            street: e.target.value,
                          }))
                        }
                      />

                      {/* country */}
                      <FormControl sx={{ mt: 3 }} size="small" fullWidth>
                        <InputLabel id="countrySelect">Country</InputLabel>
                        <Select
                          labelId="countrySelect"
                          label="Country"
                          name="country"
                          value={dataEdited.country}
                          onChange={(e) => {
                            setDataEdited((prev: any) => ({
                              ...prev,
                              country: e.target.value,
                              state: '',
                              city: '',
                            }));
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
                          value={dataEdited.state}
                          onChange={(e) => {
                            setDataEdited((prev: any) => ({
                              ...prev,
                              state: e.target.value,
                              city: '',
                            }));
                          }}
                          required
                        >
                          {State.getStatesOfCountry(dataEdited.country).map(
                            (s) => (
                              <MenuItem key={s.isoCode} value={s.isoCode}>
                                {s.name}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>

                      {/* City */}
                      <FormControl sx={{ mt: 3 }} size="small" fullWidth>
                        <InputLabel id="citySelect">City</InputLabel>
                        <Select
                          labelId="citySelect"
                          label="City"
                          value={dataEdited.city}
                          onChange={(e) =>
                            setDataEdited((prev: any) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          required
                        >
                          {City.getCitiesOfState(
                            dataEdited.country,
                            dataEdited.state
                          ).map((city) => (
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
                        value={dataEdited.zipCode}
                        onChange={(e) =>
                          setDataEdited((prev: any) => ({
                            ...prev,
                            zipCode: e.target.value,
                          }))
                        }
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
                  {Country.getCountryByCode(country)?.name}
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
                          <Typography>
                            {State.getStateByCodeAndCountry(state, country)
                              ?.name || 'not set'}
                          </Typography>
                          <Typography sx={{ mt: 1, fontWeight: '500' }}>
                            Country :{' '}
                          </Typography>
                          <Typography>
                            {Country.getCountryByCode(country)?.name ||
                              'not set'}
                          </Typography>
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
              {cv ? (
                isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <Link
                      href={cv}
                      target="_blank"
                      color="neutral"
                      underline="hover"
                      variant="h6"
                      sx={{ fontWeight: '500', cursor: 'pointer' }}
                    >
                      Download CV
                    </Link>

                    {userId === id && (
                      <Button
                        sx={{
                          width: { sm: '100%', md: '25%', xl: '15%' },
                          height: 32,
                        }}
                        variant="contained"
                        component="label"
                        endIcon={<FileUploadIcon />}
                      >
                        Update Cv
                        <input
                          hidden
                          accept="application/pdf"
                          multiple
                          type="file"
                          onChange={handleCvChange}
                        />
                      </Button>
                    )}
                  </>
                )
              ) : userId === id ? (
                <>
                  <Button
                    sx={{
                      width: { sm: '100%', md: '25%', xl: '15%' },
                      height: 32,
                    }}
                    variant="contained"
                    component="label"
                    endIcon={<FileUploadIcon />}
                  >
                    Upload Cv
                    <input
                      disabled={isLoading}
                      hidden
                      accept="application/pdf"
                      multiple
                      type="file"
                      onChange={handleCvChange}
                    />
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Summary;
