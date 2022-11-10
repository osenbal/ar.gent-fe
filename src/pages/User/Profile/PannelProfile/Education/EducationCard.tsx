import React, { useState } from 'react';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import { IEducation } from '@/interfaces/user.interface';
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  Typography,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

type props = {
  item: IEducation;
  index: string;
  handleOnEdit: (e: React.MouseEvent) => Promise<void>;
};

const EducationCard: React.FC<props> = ({ item, index, handleOnEdit }) => {
  const [education, setEducation] = useState<IEducation>(item);
  const [openEdit, setOpenEdit] = useState<boolean>(false);

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
            {education.school}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: '500' }}>
            {education.degree}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: '500' }}>
            {education.location}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: '200' }}>
            (12-01-2020 - 01-09-2021)
          </Typography>
        </CardContent>
      </Card>

      <CustomizeModal
        title="Edit Education"
        open={openEdit}
        id={`edit-education-${index}`}
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
          <TextField
            size="small"
            value={education.degree}
            onChange={(e) =>
              setEducation({ ...education, degree: e.target.value })
            }
            label="Degree"
          />
          <TextField
            size="small"
            value={education.school}
            onChange={(e) =>
              setEducation({ ...education, school: e.target.value })
            }
            label="School"
          />
          <TextField
            size="small"
            value={education.location}
            onChange={(e) =>
              setEducation({ ...education, location: e.target.value })
            }
            label="Location"
          />
          <FormControlLabel
            label="Iam currently studying in this institution"
            control={
              <Checkbox
                checked={education.currentEducation}
                onClick={() => {
                  setEducation({
                    ...education,
                    endDate: null,
                    currentEducation: !education.currentEducation,
                  });
                }}
              />
            }
          />

          <FormControl size="small" fullWidth>
            <DesktopDatePicker
              label="start date"
              value={education.startDate}
              inputFormat="DD/MM/YYYY"
              onChange={(newValue: Dayjs | null) => {
                if (newValue) {
                  setEducation({
                    ...education,
                    startDate: newValue.toDate(),
                  });
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>

          <FormControl size="small" fullWidth>
            <DesktopDatePicker
              disabled={education.currentEducation}
              label="end date"
              value={education.endDate}
              inputFormat="DD/MM/YYYY"
              onChange={(newValue: Dayjs | null) =>
                setEducation({
                  ...education,
                  endDate: newValue?.toDate() || null,
                })
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
        </Box>
      </CustomizeModal>
    </>
  );
};

export default EducationCard;
