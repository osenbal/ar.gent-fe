import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { green, grey, blue } from '@mui/material/colors';
import AdbIcon from '@mui/icons-material/Adb';
import AppleIcon from '@mui/icons-material/Apple';
import WindowIcon from '@mui/icons-material/Window';
import { BACKEND_URL } from '@/config/config';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
} from '@mui/material';

const DashboardAdmin: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [totalReports, setTotalReports] = useState<number>(0);

  const getTotalUsers = async () => {
    const response = await fetch(`${BACKEND_URL}/admin/get/users/total`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setTotalUsers(data.data);
    } else {
      console.log('Error');
      setTotalUsers(0);
    }
  };

  useEffect(() => {
    getTotalUsers();
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
                  100
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
                  100
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