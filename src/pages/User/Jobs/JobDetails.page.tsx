import { BACKEND_URL } from '@/config/config';
import { IReturn_JobDetails } from '@/interfaces/job.interface';
import FetchIntercept from '@/utils/api';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import JobDetails from './components/JobDetails';

const JobDetailsPage: React.FC = () => {
  const params = useParams();
  const [jobData, setJobData] = useState<IReturn_JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getJobDetails = async () => {
    setIsLoading(true);
    const response = await FetchIntercept(
      `${BACKEND_URL}/job/${params.jobId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const resData = await response.json();

    if (response.ok) {
      setJobData(resData.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJobDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading ...</p>
      ) : jobData ? (
        <Box sx={{ mt: { xs: 5, md: 2 } }}>
          <JobDetails data={jobData} />
        </Box>
      ) : (
        <p>Not Found</p>
      )}
    </>
  );
};

export default JobDetailsPage;
