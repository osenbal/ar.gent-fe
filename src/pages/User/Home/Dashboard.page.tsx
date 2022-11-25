import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';
import JobCard from '@/pages/User/Jobs/JobCard';
import JobDetails from '@/pages/User/Jobs/JobDetails';
import SearchApp from '@/components/Reusable/SearchApp';
import FilterSearch from '@/components/Reusable/FilterSearch';
import { BACKEND_URL } from '@/config/config';
import IJob, { IJobDetails } from '@/interfaces/job.interface';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

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

const Dashboard: React.FC = () => {
  const [queryParams] = useSearchParams();
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));

  const [page, setPage] = useState<number>(1);
  const [limitPerPage] = useState<number>(4);
  const [noData, setNoData] = useState<boolean>(false);
  const [jobs, setJobs] = useState<IJob[] | []>([]);
  const [jobDetails, setJobDetails] = useState<IJobDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [totalJobs, setTotalJobs] = useState<number>(0);

  const jobIdParam = queryParams.get('jobId');

  const loadJobs = (page: number) => {
    fetch(`${BACKEND_URL}/job?page=${page}&limit=${limitPerPage}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          setTotalJobs(data.total);
          const newPage = page + 1;
          const newList = jobs.concat(data.data);
          setJobs(newList);
          setPage(newPage);
          if (data.data.length === 0) setNoData(true);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoadingJobs(false);
      });
  };

  useEffect(() => {
    loadJobs(page);
  }, []);

  useEffect(() => {
    if (jobIdParam) {
      setIsLoading(true);
      setTimeout(() => {
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
          })
          .catch((error) => {
            console.log('abort');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, 1000);
    }
  }, [jobIdParam]);

  useEffect(() => {
    setJobDetails(null);
    setIsLoading(true);
  }, [jobIdParam]);

  return (
    <>
      <Helmet>
        <title>Dashboard | ar.gent</title>
      </Helmet>

      <ToastContainer />

      <SearchApp />
      <Box sx={{ mt: 2, display: 'flex', overflow: 'hidden', width: '100%' }}>
        <FilterSearch />
      </Box>

      {jobIdParam ? (
        <>
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
              <>
                <Box
                  sx={{
                    width: '33%',
                    maxHeight: '100vh',
                    overflow: 'auto',
                    pr: 2,
                  }}
                >
                  {isLoadingJobs ? (
                    <Loader />
                  ) : jobs.length > 0 ? (
                    jobs.map((job) => (
                      <JobCard
                        path="jobs"
                        handleDelete={() => 0}
                        key={job._id}
                        job={job}
                      />
                    ))
                  ) : (
                    <Typography variant="h6" color="textSecondary">
                      No jobs found
                    </Typography>
                  )}

                  {!noData && totalJobs !== jobs.length && (
                    <Button
                      sx={{ display: 'block', m: '0 auto', mt: 3 }}
                      onClick={() => loadJobs(page)}
                    >
                      Load More
                    </Button>
                  )}
                  {isLoadingJobs && <Loader />}
                </Box>
              </>
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
              {isLoading ? (
                <Loader />
              ) : jobDetails ? (
                <JobDetails data={jobDetails} />
              ) : (
                <Typography variant="h6" color="textSecondary">
                  No job found
                </Typography>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Box>
          <>
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
                {isLoadingJobs ? (
                  <Loader />
                ) : jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobCard
                      path="jobs"
                      handleDelete={() => 0}
                      key={job._id}
                      job={job}
                    />
                  ))
                ) : (
                  <Typography variant="h6" color="textSecondary">
                    No jobs found
                  </Typography>
                )}
              </Box>
              {!noData && totalJobs !== jobs.length && (
                <Button sx={{ mt: 3 }} onClick={() => loadJobs(page)}>
                  Load More
                </Button>
              )}

              {isLoadingJobs && <Loader />}
            </Box>
          </>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
