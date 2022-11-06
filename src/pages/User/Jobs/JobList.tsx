import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const LinkDetailJob = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
}));

const JobList: React.FC = () => {
  return (
    <>
      <Box>
        <Card>
          <CardContent>
            <LinkDetailJob to="/job/search/?id=jobId1">
              <Card
                sx={{
                  marginTop: 2,
                  position: 'relative',
                  padding: 1,
                  cursor: 'pointer',
                  transition: 'all 0.4s ease-in-out',
                  border: `1px solid ${
                    localStorage.getItem('theme') === 'dark'
                      ? '#fff'
                      : '#e0e0e0'
                  }`,
                  ':hover': {
                    backgroundColor: 'inherit',
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

            <LinkDetailJob to="/job/search/?id=jobId2">
              <Card
                sx={{
                  marginTop: 2,
                  position: 'relative',
                  padding: 1,
                  cursor: 'pointer',
                  transition: 'all 0.4s ease-in-out',
                  border: `1px solid ${
                    localStorage.getItem('theme') === 'dark'
                      ? '#fff'
                      : '#e0e0e0'
                  }`,
                  ':hover': {
                    backgroundColor: 'inherit',
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

            <LinkDetailJob to="/job/search/?id=jobId2">
              <Card
                sx={{
                  marginTop: 2,
                  position: 'relative',
                  padding: 1,
                  cursor: 'pointer',
                  transition: 'all 0.4s ease-in-out',
                  border: `1px solid ${
                    localStorage.getItem('theme') === 'dark'
                      ? '#fff'
                      : '#e0e0e0'
                  }`,
                  ':hover': {
                    backgroundColor: 'inherit',
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
            <LinkDetailJob to="/job/search/?id=jobId2">
              <Card
                sx={{
                  marginTop: 2,
                  position: 'relative',
                  padding: 1,
                  cursor: 'pointer',
                  transition: 'all 0.4s ease-in-out',
                  border: `1px solid ${
                    localStorage.getItem('theme') === 'dark'
                      ? '#fff'
                      : '#e0e0e0'
                  }`,
                  ':hover': {
                    backgroundColor: 'inherit',
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
            <LinkDetailJob to="/job/search/?id=jobId2">
              <Card
                sx={{
                  marginTop: 2,
                  position: 'relative',
                  padding: 1,
                  cursor: 'pointer',
                  transition: 'all 0.4s ease-in-out',
                  border: `1px solid ${
                    localStorage.getItem('theme') === 'dark'
                      ? '#fff'
                      : '#e0e0e0'
                  }`,
                  ':hover': {
                    backgroundColor: 'inherit',
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

export default JobList;
