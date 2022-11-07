import React, { useState } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import { Dayjs } from 'dayjs';
import CardExperience from './CardExperience';

const Experience: React.FC = () => {
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [current, setCurrent] = useState<boolean>(false);

  const handleOnAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
  };

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
            <>
              <CardExperience />
            </>
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
            <TextField size="small" label="Position" />
            <TextField size="small" label="Company" />
            <TextField size="small" label="Location" />
            <TextField
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

export default Experience;
