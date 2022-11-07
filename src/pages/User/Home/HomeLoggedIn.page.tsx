import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';
import JobList from '../Jobs/JobList';
import SearchApp from '@/components/Reusable/SearchApp';
import FilterSearch from '@/components/Reusable/FilterSearch';

const HomeLoggedIn: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | ar.gent</title>
      </Helmet>

      <SearchApp />
      <Box sx={{ mt: 2, display: 'flex', overflow: 'hidden', width: '100%' }}>
        <FilterSearch />
      </Box>
      <Box
        sx={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ minWidth: '100%', mt: 3 }}>
          <JobList />
        </Box>
      </Box>
    </>
  );
};

export default HomeLoggedIn;
