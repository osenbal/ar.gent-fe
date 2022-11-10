import React, { useEffect, useState } from 'react';
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
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import AddIcon from '@mui/icons-material/Add';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import { Dayjs } from 'dayjs';
import EducationCard from './EducationCard';
import { useAppSelector } from '@/hooks/redux.hook';
import { IEducation } from '@/interfaces/user.interface';
import { BACKEND_URL } from '@/config/config';

const Education: React.FC = () => {
  const { user, userId } = useAppSelector((state) => state.auth);

  const [educationList, setEducationList] = useState<IEducation[] | []>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const [school, setSchool] = useState<string>('');
  const [degree, setDegree] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [currentEducation, setCurrentEducation] = useState<boolean>(false);

  const handleOnAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      school === '' ||
      degree === '' ||
      location === '' ||
      startDate === null
    ) {
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

    const temp = [...educationList, newEducation];

    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ education: temp }),
    });

    if (response.ok) {
      setEducationList(temp);
      setOpenAdd(false);
      setDegree('');
      setSchool('');
      setLocation('');
      setStartDate(null);
      setEndDate(null);
      setCurrentEducation(false);
    }
  };

  const handleOnEdit = async (e: React.MouseEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (user?.education) {
      setEducationList(user.education);
    }
  }, [user?.education]);

  return (
    <>
      <Box sx={{ position: 'relative', marginTop: 2, width: '100%' }}>
        <Card>
          <CardContent>
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
            <Typography variant="h6" sx={{ fontWeight: '700' }}>
              Education
            </Typography>
            {educationList.map((item, index) => (
              <EducationCard
                handleOnEdit={handleOnEdit}
                item={item}
                key={index}
                index={index.toString()}
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
