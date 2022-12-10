import { BACKEND_URL } from '@/config/config';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import JobCard from './JobCard';
import JobDetails from './JobDetails';
import IJob, {
  IReturn_JobDetails,
  IReturn_Jobs,
} from '@/interfaces/job.interface';
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

const JobNearlyPage: React.FC = () => {
  const [queryParams] = useSearchParams();
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));

  const [jobs, setJobs] = useState<IReturn_Jobs[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [isLoadingNewPage, setIsLoadingNewPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [jobDetails, setJobDetails] = useState<IReturn_JobDetails | null>(null);
  const [pages, setPages] = useState<number>(0);
  const [totalJobs, setTotalJobs] = useState<number>(0);

  const jobIdParam = queryParams.get('jobId');

  const getJobsNearly = async () => {
    if (page > 0) {
      setIsLoadingNewPage(true);
    }
    const response = await fetch(
      `${BACKEND_URL}/job/nearly?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (response.ok) {
      const data = await response.json();
      setPage(data.page);
      setLimit(data.limit);
      setPages(data.totalPage);
      setTotalJobs(data.totalRows);
      const newList = jobs.concat(data.data);
      setJobs(newList);
      setIsLoadingJobs(false);
      setIsLoadingNewPage(false);
    } else {
      setIsLoadingJobs(false);
      setIsLoadingNewPage(false);
    }
  };

  useEffect(() => {
    getJobsNearly();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (jobIdParam) {
      setIsLoading(true);
      setTimeout(() => {
        fetch(`${BACKEND_URL}/job/${jobIdParam}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
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

  return (
    <>
      <Helmet>Nearly Jobs</Helmet>

      <Typography
        variant="h4"
        color="textSecondary"
        sx={{ mt: 5, textAlign: 'center' }}
      >
        Jobs near you
      </Typography>
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
                    jobs.map((job, index) => (
                      <JobCard
                        path="jobs"
                        handleDelete={() => 0}
                        key={index}
                        job={job}
                      />
                    ))
                  ) : (
                    <Typography variant="h6" color="textSecondary">
                      No jobs found
                    </Typography>
                  )}
                  {totalJobs > jobs.length && (
                    <Button
                      disabled={isLoadingNewPage}
                      sx={{ display: 'block', m: '0 auto', mt: 3 }}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      Load More
                    </Button>
                  )}

                  {isLoadingNewPage && <Loader />}
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
                  jobs.map((job, index) => (
                    <JobCard
                      path="jobs"
                      handleDelete={() => 0}
                      key={index}
                      job={job}
                    />
                  ))
                ) : (
                  <Typography variant="h6" color="textSecondary">
                    No jobs found
                  </Typography>
                )}
              </Box>
              {totalJobs > jobs.length && (
                <Button
                  disabled={isLoadingNewPage}
                  sx={{ display: 'block', m: '0 auto', mt: 3 }}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Load More
                </Button>
              )}

              {isLoadingNewPage && <Loader />}
            </Box>
          </>
        </Box>
      )}
    </>
  );
};

export default JobNearlyPage;
