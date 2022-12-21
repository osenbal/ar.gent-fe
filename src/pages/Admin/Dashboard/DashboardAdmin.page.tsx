import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { setIsLoading } from '@/store/authAdminSlice';
import { useAppDispatch } from '@/hooks/redux.hook';
import FetchAdminIntercept from '@/utils/api.admin';
import { BACKEND_URL } from '@/config/config';
import { green, grey, blue } from '@mui/material/colors';
import AdbIcon from '@mui/icons-material/Adb';
import AppleIcon from '@mui/icons-material/Apple';
import WindowIcon from '@mui/icons-material/Window';
import {
  Avatar,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
} from '@mui/material';

const DashboardAdmin: React.FC = () => {
  const dispatch = useAppDispatch();
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [totalReports, setTotalReports] = useState<number>(0);

  const getStats = async () => {
    dispatch(setIsLoading(true));
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/user/total`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (response.code === 200) {
      setTotalUsers(response.data);
      dispatch(setIsLoading(false));
    } else {
      setTotalUsers(0);
      dispatch(setIsLoading(false));
    }

    const response2 = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/job/total`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (response2.code === 200) {
      setTotalJobs(response2.data);
      dispatch(setIsLoading(false));
    } else {
      setTotalJobs(0);
      dispatch(setIsLoading(false));
    }

    const response3 = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/user/report/total`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (response3.code === 200) {
      setTotalReports(response3.data);
      dispatch(setIsLoading(false));
    } else {
      setTotalReports(0);
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | admin</title>
      </Helmet>
      <Container maxWidth="lg">
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Hi, Welcome back
        </Typography>
        <Grid
          container
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ mt: 4 }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: green[500],
                    m: '0 auto',
                  }}
                >
                  <AdbIcon />
                </Avatar>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', textAlign: 'center', mt: 3 }}
                >
                  {totalUsers}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'semi-bold', textAlign: 'center' }}
                >
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: grey[300],
                    m: '0 auto',
                  }}
                >
                  <AppleIcon />
                </Avatar>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', textAlign: 'center', mt: 3 }}
                >
                  {totalJobs}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'semi-bold', textAlign: 'center' }}
                >
                  Total Jobs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: blue[500],
                    m: '0 auto',
                  }}
                >
                  <WindowIcon />
                </Avatar>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', textAlign: 'center', mt: 3 }}
                >
                  {totalReports}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'semi-bold', textAlign: 'center' }}
                >
                  Total Report
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default DashboardAdmin;
