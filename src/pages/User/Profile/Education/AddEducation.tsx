import React, { useState, useEffect } from 'react';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  formLabelClasses,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';

type props = {
  open: boolean;
  handleClose: () => void;
  onSave: (e: React.MouseEvent) => Promise<void>;
};

const AddEducation: React.FC<props> = ({ open, handleClose, onSave }) => {
  const [degree, setDegree] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  const [currentEducation, setCurrentEducation] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    setDegree('');
    setSchool('');
    setLocation('');
    setCurrentEducation(false);
    setStartDate(null);
    setEndDate(null);
  }, [open]);

  return (
    <>
      <CustomizeModal
        title="Add Education"
        open={open}
        id="addEducation"
        handleClose={handleClose}
        onSave={onSave}
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
            size="small"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            label="Degree"
          />
          <TextField
            size="small"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            label="School"
          />
          <TextField
            size="small"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            label="Location"
          />
          <FormControlLabel
            label="Iam currently studying in this institution"
            control={
              <Checkbox
                checked={currentEducation}
                onClick={() => setCurrentEducation(!currentEducation)}
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
  );
};

export default AddEducation;
