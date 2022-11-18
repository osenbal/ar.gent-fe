import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { setUser } from '@/store/authSlice';
import Summary from './Summary/Summary';
import Education from './Education/Education';
import Experience from './Experience/Experience';
import About from './About/About';
import Skills from './Skills/Skills';
import PortfolioUrl from './PortfolioUrl/PortfolioUrl';
import { Tabs, Tab, Box, Typography, Skeleton } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { BACKEND_URL } from '@/config/config';
import JobListProfile from '../PannelJob/JobListProfile';

const Profile: React.FC = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const { user, userId } = useAppSelector((state) => state.auth);

  const [jobQueryParams, setJobQueryParams] = useSearchParams();
  const jobQueryParamsTerms = jobQueryParams.get('jobId');

  const [isLoading, setIsLoading] = useState(true);
  const [tabs, setTabs] = useState<number>(0);

  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setTabs(newValue);
  };

  const getUser = async (controller: any) => {
    // fetch user from server
    fetch(`${BACKEND_URL}/user/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(setUser(data.data));
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('abort');
        }
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    getUser(controller);
    return () => {
      controller.abort();
    };
  }, [id]);

  return (
    <>
      {userId === user?._id ? (
        <Typography variant="h4">My Profile</Typography>
      ) : (
        <Typography variant="h4">Profile</Typography>
      )}

      {isLoading ? (
        <>
          <Box sx={{ position: 'relative' }}>
            <Skeleton variant="rectangular" height={300} />
            <Skeleton
              sx={{ ml: 2, mt: -8 }}
              variant="circular"
              height={98}
              width={98}
            />
            <Skeleton sx={{ mt: -4 }} variant="rectangular" height={100} />
          </Box>
          <Skeleton sx={{ mt: '16px' }} variant="rectangular" height={100} />
          <Skeleton sx={{ mt: '16px' }} variant="rectangular" height={100} />
          <Skeleton sx={{ mt: '16px' }} variant="rectangular" height={100} />
        </>
      ) : !user ? (
        <p>User Not Found</p>
      ) : (
        <>
          <Summary id={id} />
          <About />
          <Education />
          <Experience />
          <Skills />
          <PortfolioUrl />
        </>
      )}
    </>
  );
};

export default Profile;
