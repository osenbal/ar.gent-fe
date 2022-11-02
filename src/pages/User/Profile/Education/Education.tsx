import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
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
import { Edit } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import AddEducation from './AddEducation';
import dayjs, { Dayjs } from 'dayjs';

const Education: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [current, setCurrent] = useState<boolean>(false);

  const handleOnAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleOnEdit = async (e: React.MouseEvent) => {
    e.preventDefault();
  };

  useEffect(() => {}, []);

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
                  Instance Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: '500' }}>
                  Degree
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: '500' }}>
                  Location
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: '200' }}>
                  (12-01-2020 - 01-09-2021)
                </Typography>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Box>

      <AddEducation
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
        onSave={handleOnAdd}
      />

      <>
        <CustomizeModal
          title="Edit Education"
          open={openEdit}
          id="addEducation"
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
