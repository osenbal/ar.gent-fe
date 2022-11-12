import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@hooks/redux.hook';
import { asyncUserExperience } from '@/store/authSlice';
import ExperienceCard from './ExperienceCard';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import { IExperience } from '@/interfaces/user.interface';
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

const Experience: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userId, user } = useAppSelector((state) => state.auth);
  const { id } = useParams<{ id: string }>();

  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [experienceList, setExperienceList] = useState<IExperience[] | []>([]);

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

  const handleOnAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      position === '' ||
      company === '' ||
      location === '' ||
      startDate === null
    ) {
      console.log('please fill the field required');
      return;
    }

    if (endDate === null && !isPresent) {
      console.log('please fill the field required');
      return;
    }

    const newExperience: IExperience = {
      position,
      company,
      location,
      description,
      startDate: startDate?.toDate(),
      endDate: endDate?.toDate() || null,
      isPresent,
    };

    const experienceTemp = [...experienceList, newExperience];

    dispatch(asyncUserExperience({ userId, payload: experienceTemp }));

    setOpenAdd(false);
  };

  const handleOnEdit = (index: number, item: IExperience) => {
    const experienceTemp = [...experienceList];
    experienceTemp[index] = item;

    dispatch(asyncUserExperience({ userId, payload: experienceTemp }));
  };

  const handleOnDelete = (index: number) => {
    const experienceTemp = experienceList.filter((item, ind) => ind !== index);
    dispatch(asyncUserExperience({ userId, payload: experienceTemp }));
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
    </>
  );
};

export default Experience;
