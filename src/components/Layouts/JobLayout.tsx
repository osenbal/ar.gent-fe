import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import JobList from '@/pages/User/Jobs/JobList';
import SearchApp from '../Reusable/SearchApp';
import FilterSearch from '../Reusable/FilterSearch';

const JobLayout: React.FC = () => {
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));

  const ContainerDetailJob = styled(Box)<{
    uptab?: string;
  }>(({ theme, uptab }) => ({
    ...(uptab === 'true' && {
      width: '65%',
    }),
    minHeight: '100vh',
    overflow: 'auto',
  }));

  return (
    <>
      <SearchApp />
      <Box sx={{ mt: 2, display: 'flex', overflow: 'hidden', width: '100%' }}>
        <FilterSearch />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'start',
          gap: 2,
          mt: 5,
          positon: 'relative',
        }}
      >
        {upTabScreen && (
          <Box
            sx={{
              width: '33%',
              maxHeight: '100vh',
              overflow: 'auto',
            }}
          >
            <JobList />
          </Box>
        )}
        <ContainerDetailJob uptab={upTabScreen ? 'true' : 'false'}>
          <Outlet />
        </ContainerDetailJob>
      </Box>
    </>
  );
};

export default JobLayout;
