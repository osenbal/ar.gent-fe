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

const Education: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [educationList, setEducationList] = useState<IEducation[] | []>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [current, setCurrent] = useState<boolean>(false);

  const handleOnAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
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
            <TextField size="small" label="Degree" />
            <TextField size="small" label="School" />
            <TextField size="small" label="Location" />
            <FormControlLabel
              label="Iam currently studying in this institution"
              control={
                <Checkbox
                  value={current}
                  onChange={() => setCurrent(!current)}
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
                disabled={current}
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
