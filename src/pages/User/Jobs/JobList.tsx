import React, { useEffect, useState } from 'react';
import IJob from '@/interfaces/job.interface';
import JobCard from './JobCard';
import { SyncLoader } from 'react-spinners';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { BACKEND_URL } from '@/config/config';

const JobList: React.FC = () => {
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));
  const [queryParams] = useSearchParams();
  const jobIdParam = queryParams.get('jobId');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limitPerPage] = useState<number>(4);
  const [noData, setNoData] = useState<boolean>(false);
  const [jobs, setJobs] = useState<IJob[] | []>([]);

  const loadJobs = (page: number) => {
    setIsLoading(true);
    setTimeout(() => {
      fetch(`${BACKEND_URL}/job?page=${page}&limit=${limitPerPage}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const newPage = page + 1;
          const newList = jobs.concat(data.data);
          setJobs(newList);
          setPage(newPage);
          console.log(data);
          if (data.data.length === 0 || jobs.length === data.total)
            setNoData(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 1500);
  };

  useEffect(() => {
    loadJobs(page);
  }, []);

  return (
    <>
      <Box sx={{ mb: 4 }}>
        {jobs.map((job, index) => (
          <JobCard
            key={index}
            path="home"
            job={job}
            handleDelete={(index) => console.log(index)}
          />
        ))}
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '80vh',
            }}
          >
            <SyncLoader color="#3f51b5" loading={isLoading} size={15} />
          </Box>
        ) : !noData ? (
          <Button
            onClick={() => loadJobs(page)}
            disabled={isLoading}
            sx={{ display: 'block', m: '0 auto', mt: 3 }}
          >
            Load More
          </Button>
        ) : (
          ''
        )}
        {noData ? (
          <Box sx={{ textAlign: 'center', mt: 3 }}>no data anymore ...</Box>
        ) : (
          ''
        )}
      </Box>
    </>
  );
};

export default JobList;
