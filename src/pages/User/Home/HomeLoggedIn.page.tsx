import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const LinkDetailJob = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
}));

const HomeLoggedIn: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | ar.gent</title>
      </Helmet>

      <Box
        sx={{
          maxWidth: '500px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Good Morning User
        </Typography>
        <Card sx={{ minWidth: '100%' }}>
          <CardContent>
            <LinkDetailJob to="/job/:id">
              <Card
                sx={{
                  marginTop: 2,
                  position: 'relative',
                  padding: 1,
                  cursor: 'pointer',
                  transition: 'all 0.4s ease-in-out',
                  ':hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <CardContent>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: '16px',
                        sm: '18px',
                        md: '24px',
                        lg: '28px',
                      },
                      fontWeight: '700',
                    }}
                  >
                    Job Title
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: '14px',
                        sm: '16px',
                      },
                      fontWeight: '400',
                    }}
                  >
                    Company Name
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: '14px',
                        sm: '16px',
                      },
                      fontWeight: '300',
                    }}
                  >
                    Salary
                  </Typography>
                </CardContent>
              </Card>
            </LinkDetailJob>

            <LinkDetailJob to="/job/:id">
              <Card
                sx={{
                  marginTop: 2,
                  position: 'relative',
                  padding: 1,
                  cursor: 'pointer',
                  transition: 'all 0.4s ease-in-out',
                  ':hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <CardContent>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: '16px',
                        sm: '18px',
                        md: '24px',
                        lg: '28px',
                      },
                      fontWeight: '700',
                    }}
                  >
                    Job Title
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: '14px',
                        sm: '16px',
                      },
                      fontWeight: '400',
                    }}
                  >
                    Company Name
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: '14px',
                        sm: '16px',
                      },
                      fontWeight: '300',
                    }}
                  >
                    Salary
                  </Typography>
                </CardContent>
              </Card>
            </LinkDetailJob>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default HomeLoggedIn;
