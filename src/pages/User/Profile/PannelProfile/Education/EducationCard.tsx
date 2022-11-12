import React, { useEffect, useState } from 'react';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import { useAppSelector } from '@/hooks/redux.hook';
import { useParams } from 'react-router-dom';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import { IEducation } from '@/interfaces/user.interface';
import { Edit } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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

type props = {
  item: IEducation;
  index: number;
  handleOnEdit: (index: number, item: IEducation) => void;
  handleOnDelete: (index: number) => void;
};

const EducationCard: React.FC<props> = ({
  item,
  index,
  handleOnEdit,
  handleOnDelete,
}) => {
  const { id } = useParams();
  const { userId } = useAppSelector((state) => state.auth);
  const [education, setEducation] = useState<IEducation>(item);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [educationTemp, setEducationTemp] = useState<IEducation>({
    school: item.school,
    degree: item.degree,
    location: item.location,
    startDate: item.startDate,
    endDate: item.endDate,
    currentEducation: item.currentEducation,
  });

  const onEditSave = (e: React.MouseEvent) => {
    e.preventDefault();

    if (
      educationTemp.school === '' ||
      educationTemp.degree === '' ||
      educationTemp.location === '' ||
      educationTemp.startDate === null
    ) {
      console.log('please fill the field required');
      return;
    }

    if (educationTemp.endDate === null && !educationTemp.currentEducation) {
      console.log('please fill the field required');
      return;
    }

    handleOnEdit(index, educationTemp);
    setOpenEdit(false);
  };

  useEffect(() => {
    setEducation(item);
  }, [item]);

  return (
    <>
      <Card sx={{ marginTop: 2, position: 'relative' }}>
        {userId === id && (
          <Box>
            <IconButton
              onClick={() => setOpenEdit(true)}
              sx={{
                position: 'absolute',
                top: { xs: 'unset', md: 4 },
                right: { xs: 4, md: 48 },
                bottom: { xs: 4, md: 'unset' },
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              sx={{ position: 'absolute', top: 4, right: 8 }}
              onClick={() => handleOnDelete(index)}
            >
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        )}

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
            {new Date(education.startDate).toLocaleDateString()} -{' '}
            {education.currentEducation && education.endDate === null
              ? 'Current'
              : education.endDate !== null
              ? new Date(education.endDate).toLocaleDateString()
              : 'Current'}
          </Typography>
        </CardContent>
      </Card>

      {userId === id && (
        <CustomizeModal
          title="Edit Education"
          open={openEdit}
          id={`edit-education-${index}`}
          handleClose={() => setOpenEdit(false)}
          onSave={onEditSave}
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
              value={educationTemp.degree}
              onChange={(e) =>
                setEducationTemp({ ...educationTemp, degree: e.target.value })
              }
              label="Degree"
            />
            <TextField
              size="small"
              value={educationTemp.school}
              onChange={(e) =>
                setEducationTemp({ ...educationTemp, school: e.target.value })
              }
              label="School"
            />
            <TextField
              size="small"
              value={educationTemp.location}
              onChange={(e) =>
                setEducationTemp({ ...educationTemp, location: e.target.value })
              }
              label="Location"
            />
            <FormControlLabel
              label="Iam currently studying in this institution"
              control={
                <Checkbox
                  checked={educationTemp.currentEducation}
                  onClick={() => {
                    setEducationTemp({
                      ...educationTemp,
                      endDate: null,
                      currentEducation: !educationTemp.currentEducation,
                    });
                  }}
                />
              }
            />

            <FormControl size="small" fullWidth>
              <DesktopDatePicker
                label="start date"
                value={educationTemp.startDate}
                inputFormat="DD/MM/YYYY"
                onChange={(newValue: Dayjs | null) => {
                  if (newValue) {
                    setEducationTemp({
                      ...educationTemp,
                      startDate: newValue.toDate(),
                    });
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>

            <FormControl size="small" fullWidth>
              <DesktopDatePicker
                disabled={educationTemp.currentEducation}
                label="end date"
                value={educationTemp.endDate}
                inputFormat="DD/MM/YYYY"
                onChange={(newValue: Dayjs | null) =>
                  setEducationTemp({
                    ...educationTemp,
                    endDate: newValue?.toDate() || null,
                  })
                }
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
          </Box>
        </CustomizeModal>
      )}
    </>
  );
};

export default EducationCard;
