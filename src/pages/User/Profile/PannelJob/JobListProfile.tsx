import React, { useState, useEffect } from 'react';
import JobCard from '../../Jobs/JobCard';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import IJob, { IJobDetails } from '@/interfaces/job.interface';
import { BACKEND_URL } from '@/config/config';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.hook';
import JobDetails from '../../Jobs/JobDetails';
import { ToastContainer, toast } from 'react-toastify';

const JobListProfile: React.FC = () => {
  const { id } = useParams();
  const [queryParams] = useSearchParams();
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));

  const [jobs, setJobs] = useState<IJob[] | []>([]);
  const [jobDetails, setJobDetails] = useState<IJobDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const jobIdParam = queryParams.get('jobId');

  const handleDelete = async (jobId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/job/${jobId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const updatedJobs = jobs.filter((job) => job._id !== jobId);
        setJobs(updatedJobs);
        toast.success('Job deleted successfully');
      } else {
        toast.error('Error deleting job');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${BACKEND_URL}/job/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('abort');
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

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
        signal: controller.signal,
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
          setIsLoading(false);
        });
      return () => {
        controller.abort();
      };
    }
  }, [jobIdParam]);

  return (
    <>
      <ToastContainer />
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
              <Box
                sx={{
                  width: '33%',
                  maxHeight: '100vh',
                  overflow: 'auto',
                  pr: 2,
                }}
              >
                {jobs ? (
                  jobs.length > 0 ? (
                    jobs.map((job) => (
                      <JobCard
                        path="profile"
                        handleDelete={handleDelete}
                        key={job._id}
                        job={job}
                      />
                    ))
                  ) : (
                    <Typography variant="h6">Empty Job</Typography>
                  )
                ) : (
                  <Typography variant="h6">No jobs found</Typography>
                )}
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
              {isLoading ? (
                <p>loading</p>
              ) : (
                jobDetails && <JobDetails data={jobDetails} />
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Box>
          {jobs ? (
            jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard
                  path="profile"
                  handleDelete={handleDelete}
                  key={job._id}
                  job={job}
                />
              ))
            ) : (
              <Typography variant="h6">Empty Job</Typography>
            )
          ) : (
            <Typography variant="h6">No jobs found</Typography>
          )}
        </Box>
      )}
    </>
  );
};

export default JobListProfile;
