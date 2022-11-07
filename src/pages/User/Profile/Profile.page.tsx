import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { setUser } from '@/store/authSlice';
import Summary from './PannelProfile/Summary/Summary';
import Education from './PannelProfile/Education/Education';
import Experience from './PannelProfile/Experience/Experience';
import About from './PannelProfile/About/About';
import Skills from './PannelProfile/Skills/Skills';
import PortfolioUrl from './PannelProfile/PortfolioUrl/PortfolioUrl';
import JobCard from './PannelJob/JobCard';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { BACKEND_URL } from '@/config/config';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
    </div>
  );
};

const Profile: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { user, userId } = useAppSelector((state) => state.auth);

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
      <Helmet>
        <title>Profile | ar.gent</title>
      </Helmet>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabs} onChange={handleChangeTabs} centered>
          <Tab label="Profile" value={0} />
          <Tab label="Job" value={1} />
        </Tabs>
      </Box>

      <TabPanel value={tabs} index={0}>
        <>
          {userId === user?._id ? (
            <Typography variant="h4">My Profile</Typography>
          ) : (
            <Typography variant="h4">Profile</Typography>
          )}

          {isLoading ? (
            <p>Loading...</p>
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
      </TabPanel>

      <TabPanel value={tabs} index={1}>
        <JobCard />
      </TabPanel>
    </>
  );
};

export default Profile;
