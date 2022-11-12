import React, { useEffect, useState } from 'react';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import EducationCard from './EducationCard';
import { useParams } from 'react-router-dom';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { asyncUserEducation } from '@/store/authSlice';
import { IEducation } from '@/interfaces/user.interface';
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

const Education: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { user, userId } = useAppSelector((state) => state.auth);

  const [educationList, setEducationList] = useState<IEducation[] | []>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [school, setSchool] = useState<string>('');
  const [degree, setDegree] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [currentEducation, setCurrentEducation] = useState<boolean>(false);

  const emptyState = () => {
    setSchool('');
    setDegree('');
    setLocation('');
    setStartDate(null);
    setEndDate(null);
    setCurrentEducation(false);
  };

  const handleOnAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      school === '' ||
      degree === '' ||
      location === '' ||
      startDate === null
    ) {
      console.log('please fill the field required');
      return;
    }

    if (endDate === null && !currentEducation) {
      console.log('please fill the field required');
      return;
    }

    const newEducation: IEducation = {
      school,
      degree,
      location,
      startDate: startDate.toDate(),
      endDate: endDate?.toDate() || null,
      currentEducation,
    };

    const educationTemp = [...educationList, newEducation];

    dispatch(asyncUserEducation({ userId, payload: educationTemp }));
    emptyState();
    setOpenAdd(false);
  };

  const handleOnEdit = (index: number, item: IEducation) => {
    const educationTemp = [...educationList];

    educationTemp[index] = item;

    dispatch(asyncUserEducation({ userId, payload: educationTemp }));
  };

  const handleOnDelete = (index: number) => {
    const educationTemp = educationList.filter((item, ind) => ind !== index);
    dispatch(asyncUserEducation({ userId, payload: educationTemp }));
  };

  useEffect(() => {
    if (user?.education) {
      setEducationList(user.education);
    }
  }, [user?.education]);

  useEffect(() => {
    setDegree('');
    setSchool('');
    setLocation('');
    setStartDate(null);
    setEndDate(null);
    setCurrentEducation(false);
  }, [openAdd]);

  return (
    <>
      <Box sx={{ position: 'relative', marginTop: 2, width: '100%' }}>
        <Card>
          <CardContent>
            {userId === id && (
              <IconButton
                sx={{
                  backgroundColor: 'inherit',
                  position: 'absolute',
                  top: 4,
                  right: 8,
                }}
                onClick={() => setOpenAdd(true)}
              >
                <AddIcon />
              </IconButton>
            )}

            <Typography variant="h6" sx={{ fontWeight: '700' }}>
              Education
            </Typography>
            {educationList.map((item, index) => (
              <EducationCard
                handleOnEdit={handleOnEdit}
                handleOnDelete={handleOnDelete}
                item={item}
                key={index}
                index={index}
              />
            ))}
          </CardContent>
        </Card>
      </Box>

      {/* modal add education */}
      <>
        <CustomizeModal
          title="Add Education"
          open={openAdd}
          id="addEducation"
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
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              size="small"
              label="Degree"
            />
            <TextField
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              size="small"
              label="School"
            />
            <TextField
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              size="small"
              label="Location"
            />
            <FormControlLabel
              label="Iam currently studying in this institution"
              control={
                <Checkbox
                  value={currentEducation}
                  onChange={() => setCurrentEducation(!currentEducation)}
                />
              }
            />

            <FormControl size="small" fullWidth>
              <DesktopDatePicker
                label="start date"
                value={startDate}
                inputFormat="DD/MM/YYYY"
                onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>

            <FormControl size="small" fullWidth>
              <DesktopDatePicker
                disabled={currentEducation}
                label="end date"
                value={endDate}
                inputFormat="DD/MM/YYYY"
                onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
          </Box>
        </CustomizeModal>
      </>
    </>
  );
};

export default Education;
