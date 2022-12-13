import React from 'react';
import { SyncLoader } from 'react-spinners';
import { Box } from '@mui/material';

const Loader: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <SyncLoader color="#3f51b5" />
    </Box>
  );
};

export default Loader;
