import React, { useState, useEffect } from 'react';
import JobCard from '../../Jobs/JobCard';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import IJob, { IJobDetails } from '@/interfaces/job.interface';
import { BACKEND_URL } from '@/config/config';
import { useParams, useSearchParams } from 'react-router-dom';
import JobDetails from '../../Jobs/JobDetails';
import { ToastContainer, toast } from 'react-toastify';
import { SyncLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const Loader = () => {
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

const JobListProfile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [queryParams] = useSearchParams();
  const jobIdParam = queryParams.get('jobId');
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));

  const [jobs, setJobs] = useState<IJob[] | []>([]);
  const [jobDetails, setJobDetails] = useState<IJobDetails | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        navigate(`/user/${id}/job`);
      } else {
        toast.error('Error deleting job');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getJobsByUserId = async () => {
    const response = await fetch(`${BACKEND_URL}/job/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const jobData = await response.json();
      setJobs(jobData.data);
      setIsLoadingJobs(false);
    } else {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    getJobsByUserId();
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
            console.log(error);
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
                {isLoadingJobs ? (
                  <>
                    <Loader />
                  </>
                ) : jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobCard
                      path={`profile`}
                      key={job._id}
                      job={job}
                      handleDelete={handleDelete}
                    />
                  ))
                ) : (
                  <Typography variant="h6" color="textSecondary">
                    No jobs found
                  </Typography>
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
                <Loader />
              ) : jobDetails ? (
                <JobDetails data={jobDetails} />
              ) : (
                <Typography variant="h6" color="textSecondary">
                  Not Found
                </Typography>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Box>
          {isLoadingJobs ? (
            <Loader />
          ) : jobs.length > 0 && !isLoadingJobs ? (
            jobs.map((job) => (
              <JobCard
                path="profile"
                handleDelete={handleDelete}
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
      )}
    </>
  );
};

export default JobListProfile;
