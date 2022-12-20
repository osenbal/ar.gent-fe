import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import JobCard from '../../Jobs/components/JobCard';
import JobDetails from '../../Jobs/components/JobDetails';
import Loader from '@/components/Reusable/Loader';
import NoData from '@/components/Reusable/NoData';
import { IReturn_JobDetails, IReturn_Jobs } from '@/interfaces/job.interface';
import { BACKEND_URL } from '@/config/config';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import FetchIntercept from '@/utils/api';

const JobListProfile: React.FC = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const jobIdParam = queryParams.get('jobId');
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));

  const [jobs, setJobs] = useState<IReturn_Jobs[] | []>([]);
  const [jobDetails, setJobDetails] = useState<IReturn_JobDetails | null>(null);

  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [isLoadingJobDetail, setIsLoadingJobDetail] = useState<boolean>(true);

  const handleDelete = async (jobId: string) => {
    try {
      const response = await FetchIntercept(`${BACKEND_URL}/job/${jobId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.code === 200) {
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
    const response = await FetchIntercept(`${BACKEND_URL}/job/user/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.code === 200) {
      setJobs(response.data);
      setIsLoadingJobs(false);
    } else {
      setIsLoadingJobs(false);
    }
  };

  const getJobDetail = async (jobId: string) => {
    setIsLoadingJobDetail(true);
    const response = await FetchIntercept(`${BACKEND_URL}/job/${jobId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.code === 200) {
      setJobDetails(response.data);
      setIsLoadingJobDetail(false);
    } else {
      setIsLoadingJobDetail(false);
    }
  };

  useEffect(() => {
    getJobsByUserId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (jobIdParam) {
      getJobDetail(jobIdParam);
    }
  }, [jobIdParam]);

  return (
    <>
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
                  <NoData upTabScreen message="No jobs found in this user" />
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
              {isLoadingJobDetail ? (
                <Loader />
              ) : jobDetails && !isLoadingJobDetail ? (
                <JobDetails data={jobDetails} />
              ) : (
                <NoData upTabScreen message="Job not found" />
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 5 }}>
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
            <NoData upTabScreen message="No jobs found in this user" />
          )}
        </Box>
      )}
    </>
  );
};

export default JobListProfile;
