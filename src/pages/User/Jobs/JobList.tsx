import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';
import IJob from '@/interfaces/job.interface';
import { BACKEND_URL } from '@/config/config';
import JobCard from './JobCard';

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

  // window.onscroll = () => {
  //   console.log(
  //     Math.round(window.innerHeight + document.documentElement.scrollTop)
  //   );
  //   console.log(Math.round(document.documentElement.offsetHeight - 25));
  //   if (
  //     Math.round(window.innerHeight + document.documentElement.scrollTop) >=
  //     Math.round(document.documentElement.offsetHeight - 25)
  //   ) {
  //     if (!noData) {
  //       console.log("You're at the bottom of the page");

  //       console.log(window.innerHeight + document.documentElement.scrollTop);
  //       console.log(document.documentElement.offsetHeight);
  //       loadJobs(page);
  //     }
  //   }
  // };

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
          if (data.data.length === 0) setNoData(true);
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
          <div className="text-center">loading data ...</div>
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
        {noData ? <div className="text-center">no data anymore ...</div> : ''}
      </Box>
    </>
  );
};

export default JobList;
