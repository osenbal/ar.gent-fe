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
import { IJobDetails } from '@/interfaces/job.interface';
import { useAppSelector } from '@/hooks/redux.hook';
import parse from 'html-react-parser';

type props = {
  data: IJobDetails;
};

const JobDetails: React.FC<props> = ({ data }) => {
  const { userId } = useAppSelector((state) => state.auth);
  console.log(data);
  return (
    <>
      <Card sx={{ minWidth: '100%', padding: 3 }}>
        <Typography variant="h5" fontWeight={'500'}>
          {data.title}
        </Typography>
        <Typography variant="body2" fontWeight={'400'}>
          {data.username} | {data.location} - 10 applicants
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <WorkTwoToneIcon sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight={'400'}>
            {data.type}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <ApartmentTwoToneIcon sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight={'400'}>
            {data.workPlace}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <DialpadIcon sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight={'400'}>
            {data.level}
          </Typography>
        </Box>

        {userId !== data.userId && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Button variant="contained" sx={{ mr: 1 }} endIcon={<LaunchIcon />}>
              Apply
            </Button>
          </Box>
        )}

        <Typography variant="body2" fontWeight={'500'} mt={3}>
          Post by{' '}
        </Typography>
        <Link to={'/profile/user:id'}>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Avatar src={data.avatarUser} alt="user" />
            <Typography variant="body2" fontWeight={'500'} ml={2}>
              {data.username}
            </Typography>
          </Box>
        </Link>

        <Typography variant="body2" fontWeight={'500'} mt={3}>
          Description
        </Typography>

        <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
        {/* {parse(data.description)} */}
      </Card>
    </>
  );
};

export default JobDetails;
