import React from 'react';
import {
  Typography,
  Box,
  Card,
  Avatar,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
import ApartmentTwoToneIcon from '@mui/icons-material/ApartmentTwoTone';
import DialpadIcon from '@mui/icons-material/Dialpad';
import { Link } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';

const JobDetails: React.FC = () => {
  return (
    <>
      <Card sx={{ minWidth: '100%', padding: 3 }}>
        <Typography variant="h5" fontWeight={'500'}>
          JOB TITLE
        </Typography>
        <Typography variant="body2" fontWeight={'400'}>
          Company Name | Location - 10 applicants
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <WorkTwoToneIcon sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight={'400'}>
            Full Time | project | internship
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <ApartmentTwoToneIcon sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight={'400'}>
            Remote | Onsite
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <DialpadIcon sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight={'400'}>
            Beginner | mid senior | senior
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Button variant="contained" sx={{ mr: 1 }} endIcon={<LaunchIcon />}>
            Apply
          </Button>
        </Box>

        <Typography variant="body2" fontWeight={'500'} mt={3}>
          Post by{' '}
        </Typography>
        <Link to={'/profile/user:id'}>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Avatar>
              <img src="https://picsum.photos/200" alt="user" />
            </Avatar>
            <Typography variant="body2" fontWeight={'500'} ml={2}>
              Jhon Doe
            </Typography>
          </Box>
        </Link>

        <Typography variant="body2" fontWeight={'500'} mt={3}>
          Description
        </Typography>

        <Typography variant="body2" fontWeight={'400'} mt={1}>
          Requirements: 3-5+ years developing production JavaScript code and
          strong knowledge of Vue/React. Understanding of state-management
          patterns such as Redux, Flux or similar. Proven track record of
          delivering projects with high quality UI. Bachelor’s/Master’s degree
          in computer science, engineering or equivalent industry experience.
          Experience in developing responsive web sites for diverse clients from
          high powered desktop computers to small footprint mobile devices.
          Experience with modern front end technologies (styled system, webpack,
          etc).
        </Typography>
      </Card>
    </>
  );
};

export default JobDetails;
