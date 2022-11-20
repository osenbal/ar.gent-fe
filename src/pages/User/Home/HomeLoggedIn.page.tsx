import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import JobList from '../Jobs/JobList';
import JobDetails from '../Jobs/JobDetails';
import SearchApp from '@/components/Reusable/SearchApp';
import FilterSearch from '@/components/Reusable/FilterSearch';
import { useSearchParams } from 'react-router-dom';
import { IJobDetails } from '@/interfaces/job.interface';
import { BACKEND_URL } from '@/config/config';

const HomeLoggedIn: React.FC = () => {
  const [queryParams] = useSearchParams();
  const jobIdParam = queryParams.get('jobId');
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jobDetails, setJobDetails] = useState<IJobDetails | null>(null);

  useEffect(() => {
    if (jobIdParam) {
      setIsLoading(true);
      const controller = new AbortController();

      fetch(`${BACKEND_URL}/job/id/${jobIdParam}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setJobDetails(data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.log('abort');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });

      return () => {
        controller.abort();
      };
    }
  }, [jobIdParam]);

  return (
    <>
      <Helmet>
        <title>Dashboard | ar.gent</title>
      </Helmet>

      <SearchApp />
      <Box sx={{ mt: 2, display: 'flex', overflow: 'hidden', width: '100%' }}>
        <FilterSearch />
      </Box>

      {jobIdParam ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'start',
            flexDirection: 'row',
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
                pr: 2,
              }}
            >
              <JobList />
            </Box>
          )}

          <Box
            sx={
              upTabScreen
                ? {
                    width: '65%',
                    maxWidth: '65%',
                    minHeight: '100vh',
                    overflow: 'auto',
                  }
                : {
                    width: '100%',
                    minHeight: '100vh',
                    overflow: 'auto',
                  }
            }
          >
            {jobDetails && <JobDetails data={jobDetails} />}
          </Box>
        </Box>
      ) : (
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
      )}
    </>
  );
};

export default HomeLoggedIn;
