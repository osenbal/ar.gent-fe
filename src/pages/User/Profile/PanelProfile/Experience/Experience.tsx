import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '@hooks/redux.hook';
import { setExperienceUser, setIsLoading } from '@/store/authSlice';
import ExperienceCard from './ExperienceCard';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import { BACKEND_URL } from '@/config/config';
import { IExperience_User } from '@/interfaces/user.interface';
import AddIcon from '@mui/icons-material/Add';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import FetchIntercept from '@/utils/api';

const Experience: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userId, user } = useAppSelector((state) => state.auth);
  const { id } = useParams<{ id: string }>();

  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [experienceList, setExperienceList] = useState<IExperience_User[] | []>(
    []
  );

  const [position, setPosition] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [isPresent, setIsPreset] = useState<boolean>(false);

  const emptyState = () => {
    setPosition('');
    setCompany('');
    setLocation('');
    setDescription('');
    setStartDate(null);
    setEndDate(null);
    setIsPreset(false);
  };

  const asyncUserExperience = async (
    userId: string,
    payload: IExperience_User[]
  ) => {
    dispatch(setIsLoading(true));
    const response = await FetchIntercept(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ experience: payload }),
    });

    if (response.code === 200) {
      dispatch(setExperienceUser(payload));
      toast.success(`${response.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      dispatch(setIsLoading(false));
    } else {
      toast.warn(`${response.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      dispatch(setIsLoading(false));
    }
  };

  const handleOnAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      position === '' ||
      company === '' ||
      location === '' ||
      startDate === null
    ) {
      toast.warn('please fill the field required');
      return;
    }

    if (endDate === null && !isPresent) {
      toast.warn('please fill the field required');
      return;
    }

    const newExperience: IExperience_User = {
      position: position.trim(),
      company: company.trim(),
      location: location.trim(),
      description: description.trim(),
      startDate: startDate?.toDate(),
      endDate: endDate?.toDate() || null,
      isPresent,
    };

    const experienceTemp = [...experienceList, newExperience];

    await asyncUserExperience(userId, experienceTemp);
    setOpenAdd(false);
  };

  const handleOnEdit = async (index: number, item: IExperience_User) => {
    const experienceTemp = [...experienceList];
    experienceTemp[index] = item;
    await asyncUserExperience(userId, experienceTemp);
  };

  const handleOnDelete = async (index: number) => {
    const experienceTemp = experienceList.filter((item, ind) => ind !== index);
    await asyncUserExperience(userId, experienceTemp);
  };

  useEffect(() => {
    if (user?.experience) {
      setExperienceList(user?.experience);
    }
  }, [user?.experience]);

  useEffect(() => {
    emptyState();
  }, [openAdd]);

  return (
    <>
      <Box sx={{ position: 'relative', marginTop: 2, width: '100%' }}>
        <Card>
          <CardContent>
            {userId === id && (
              <IconButton
                onClick={() => setOpenAdd(true)}
                sx={{
                  backgroundColor: 'inherit',
                  position: 'absolute',
                  top: 4,
                  right: 8,
                }}
              >
                <AddIcon />
              </IconButton>
            )}

            <Typography variant="h6" sx={{ fontWeight: '700' }}>
              Experience
            </Typography>
            {/* list experience */}
            {experienceList?.map((item: any, index: number) => (
              <ExperienceCard
                key={index}
                item={item}
                index={index}
                handleOnEdit={handleOnEdit}
                handleOnDelete={handleOnDelete}
              />
            ))}
          </CardContent>
        </Card>
      </Box>

      {userId === id && (
        <>
          <CustomizeModal
            title="Add Experience"
            open={openAdd}
            id="addExperience"
            handleClose={() => setOpenAdd(false)}
            onSave={handleOnAdd}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 3,
                minWidth: { xs: '100%', lg: '350px' },
              }}
            >
              <TextField
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                size="small"
                label="Position"
              />
              <TextField
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                size="small"
                label="Company"
              />
              <TextField
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                size="small"
                label="Location"
              />
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                label="description"
                sx={{
                  minWidth: { xs: 'auto', md: '300px', lg: '400px' },
                  minHeight: '100px',
                }}
                placeholder="Ex: Hi there, I'm a software engineer..."
                multiline
                minRows={4}
                maxRows={4}
              />
              <FormControlLabel
                label="Iam currently working in this role"
                control={
                  <Checkbox
                    value={isPresent}
                    onChange={() => {
                      setEndDate(null);
                      setIsPreset(!isPresent);
                    }}
                  />
                }
              />

              <FormControl size="small" fullWidth>
                <DesktopDatePicker
                  label="start date"
                  value={startDate}
                  inputFormat="DD/MM/YYYY"
                  onChange={(newValue: Dayjs | null) => {
                    if (newValue) {
                      setStartDate(newValue);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>

              <FormControl size="small" fullWidth>
                <DesktopDatePicker
                  disabled={isPresent}
                  label="end date"
                  value={endDate}
                  inputFormat="DD/MM/YYYY"
                  onChange={(newValue: Dayjs | null) => {
                    if (newValue) {
                      setEndDate(newValue);
                      setIsPreset(false);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>
            </Box>
          </CustomizeModal>
        </>
      )}
    </>
  );
};

export default Experience;
