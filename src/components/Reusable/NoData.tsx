import React from 'react';
import { Box, Typography } from '@mui/material';

type props = {
  upTabScreen: boolean;
  message: string;
};

const NoData: React.FC<props> = ({ upTabScreen, message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <img
        style={upTabScreen ? { width: '200px' } : { width: '130px' }}
        alt="No Data"
        src={process.env.PUBLIC_URL + '/assets/img/svg/img_noData.svg'}
      />
      <Typography
        sx={{ textAlign: 'center' }}
        variant="h6"
        color="textSecondary"
      >
        No Data
      </Typography>
      <Typography
        sx={{ textAlign: 'center' }}
        variant="body1"
        color="textSecondary"
      >
        {message}
      </Typography>
    </Box>
  );
};

export default NoData;
