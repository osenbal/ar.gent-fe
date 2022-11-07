import React from 'react';
import { Typography, Card, CardContent, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const JobCard: React.FC = () => {
  return (
    <>
      <Card
        sx={{
          marginTop: 2,
          position: 'relative',
          padding: 1,
          cursor: 'pointer',
          transition: 'all 0.4s ease-in-out',
          border: `1px solid ${
            localStorage.getItem('theme') === 'dark' ? '#fff' : '#e0e0e0'
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

        <IconButton sx={{ position: 'absolute', top: 2, right: 2 }}>
          <DeleteForeverIcon />
        </IconButton>

        <IconButton sx={{ position: 'absolute', bottom: 2, right: 2 }}>
          <Edit />
        </IconButton>
      </Card>
    </>
  );
};

export default JobCard;
