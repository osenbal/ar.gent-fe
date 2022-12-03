import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@hooks/redux.hook';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import { IExperience_User } from '@/interfaces/user.interface';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Edit } from '@mui/icons-material';
import { Dayjs } from 'dayjs';
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

type props = {
  item: IExperience_User;
  index: number;
  handleOnEdit: (index: number, item: IExperience_User) => void;
  handleOnDelete: (index: number) => void;
};

const ExperienceCard: React.FC<props> = ({
  item,
  index,
  handleOnEdit,
  handleOnDelete,
}) => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useAppSelector((state) => state.auth);

  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [experience, setExperience] = useState<IExperience_User>(item);
  const [experienceTemp, setExperienceTemp] = useState<IExperience_User>({
    position: item.position,
    company: item.company,
    location: item.location,
    startDate: item.startDate,
    endDate: item.endDate,
    isPresent: item.isPresent,
    description: item.description,
  });

  const handleOnEditSave = (e: React.MouseEvent) => {
    e.preventDefault();

    if (
      experienceTemp.position === '' ||
      experienceTemp.company === '' ||
      experienceTemp.location === '' ||
      experienceTemp.startDate === null
    ) {
      console.log('please fill the field required');
      return;
    }

    if (experienceTemp.endDate === null && !experienceTemp.isPresent) {
      console.log('please fill the field required');
      return;
    }

    setExperienceTemp((prev) => ({
      ...prev,
      position: prev.position.trim(),
      company: prev.company.trim(),
      location: prev.location.trim(),
      description: prev.description.trim(),
    }));

    handleOnEdit(index, experienceTemp);
    setOpenEdit(false);
  };

  useEffect(() => {
    setExperience(item);
  }, [item]);

  useEffect(() => {
    setExperienceTemp(experience);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openEdit]);

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
            {experience.position}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: '500' }}>
            {experience.company} - {experience.location}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: '200' }}>
            {new Date(experience.startDate).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}{' '}
            -{' '}
            {experience.isPresent && experience.endDate === null
              ? 'Current'
              : experience.endDate !== null
              ? new Date(experience.endDate).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Current'}
          </Typography>
        </CardContent>
      </Card>

      {userId === id && (
        <>
          <CustomizeModal
            title="Edit Experience"
            open={openEdit}
            id="editExperience"
            handleClose={() => setOpenEdit(false)}
            onSave={handleOnEditSave}
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
                value={experienceTemp.position}
                onChange={(e) =>
                  setExperienceTemp({
                    ...experienceTemp,
                    position: e.target.value,
                  })
                }
                size="small"
                label="Position"
              />
              <TextField
                value={experienceTemp.company}
                onChange={(e) =>
                  setExperienceTemp({
                    ...experienceTemp,
                    company: e.target.value,
                  })
                }
                size="small"
                label="Company"
              />
              <TextField
                value={experienceTemp.location}
                onChange={(e) =>
                  setExperienceTemp({
                    ...experienceTemp,
                    location: e.target.value,
                  })
                }
                size="small"
                label="Location"
              />
              <TextField
                value={experienceTemp.description}
                onChange={(e) =>
                  setExperienceTemp({
                    ...experienceTemp,
                    description: e.target.value,
                  })
                }
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
                    checked={experienceTemp.isPresent}
                    onChange={() =>
                      setExperienceTemp({
                        ...experienceTemp,
                        isPresent: !experienceTemp.isPresent,
                        endDate: null,
                      })
                    }
                  />
                }
              />

              <FormControl size="small" fullWidth>
                <DesktopDatePicker
                  label="start date"
                  value={experienceTemp.startDate}
                  inputFormat="DD/MM/YYYY"
                  onChange={(newValue: Dayjs | null) => {
                    if (newValue) {
                      setExperienceTemp({
                        ...experienceTemp,
                        startDate: newValue.toDate(),
                      });
                    }
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>

              <FormControl size="small" fullWidth>
                <DesktopDatePicker
                  disabled={experienceTemp.isPresent}
                  label="end date"
                  value={experienceTemp.endDate}
                  inputFormat="DD/MM/YYYY"
                  onChange={(newValue: Dayjs | null) => {
                    if (newValue) {
                      setExperienceTemp({
                        ...experienceTemp,
                        endDate: newValue.toDate(),
                        isPresent: false,
                      });
                    }
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>
            </Box>
          </CustomizeModal>
        </>
      )}
    </>
  );
};

export default ExperienceCard;
