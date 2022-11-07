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
import { Edit } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import dayjs, { Dayjs } from 'dayjs';

const CardExperience: React.FC = () => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [current, setCurrent] = useState<boolean>(false);

  const handleOnEdit = async (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <Card sx={{ marginTop: 2, position: 'relative' }}>
        <Box>
          <IconButton
            onClick={() => setOpenEdit(true)}
            sx={{ position: 'absolute', top: 4, right: 48 }}
          >
            <Edit />
          </IconButton>
          <IconButton sx={{ position: 'absolute', top: 4, right: 8 }}>
            <DeleteForeverIcon />
          </IconButton>
        </Box>
        <CardContent>
          <Typography variant="body1" sx={{ fontWeight: '500' }}>
            Position
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: '500' }}>
            Company Name - Location
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: '200' }}>
            (12-01-2020 - present)
          </Typography>
        </CardContent>
      </Card>

      <>
        <CustomizeModal
          title="Edit Experience"
          open={openEdit}
          id="editExperience"
          handleClose={() => setOpenEdit(false)}
          onSave={handleOnEdit}
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

export default CardExperience;
