import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';
import JobCard from '@/pages/User/Jobs/JobCard';
import JobDetails from '@/pages/User/Jobs/JobDetails';
import SearchApp from '@/components/Reusable/SearchApp';
import { BACKEND_URL } from '@/config/config';
import { IReturn_JobDetails, IReturn_Jobs } from '@/interfaces/job.interface';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import ReactPaginate from 'react-paginate';

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
  const [queryParams, setQueryParams] = useSearchParams();
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));

  const [keyword, setKeyword] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pages, setPages] = useState<number>(0);
  const [jobs, setJobs] = useState<IReturn_Jobs[] | []>([]);
  const [jobDetails, setJobDetails] = useState<IReturn_JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [totalJobs, setTotalJobs] = useState<number>(0);

  const jobIdParam = queryParams.get('jobId');

  const keyPressHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setPage(0);
      setSearch(keyword);
    }
  };

  const handleChangePage = ({ selected }: { selected: any }) => {
    setPage(selected);
  };

  const loadJobs = () => {
    setIsLoadingJobs(true);
    fetch(`${BACKEND_URL}/job?page=${page}&limit=${limit}&search=${search}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          console.log(data);
          setTotalJobs(data.totalRows);
          setPage(data.page);
          setLimit(data.limit);
          setPages(data.totalPage);
          setJobs(data.data);
          console.log(data.data[0]._id);
          if (jobIdParam) {
            setQueryParams({ jobId: `${data.data[0]._id}` });
          }
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
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

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

  useEffect(() => {
    setJobDetails(null);
    setIsLoading(true);
  }, [jobIdParam]);

  console.log(keyword);

  return (
    <>
      <Helmet>
        <title>Dashboard | ar.gent</title>
      </Helmet>

      <ToastContainer />

      <SearchApp
        keyword={keyword}
        setKeyword={setKeyword}
        onKeyPress={keyPressHandler}
      />
      {/* <Box sx={{ mt: 2, display: 'flex', overflow: 'hidden', width: '100%' }}>
        <FilterSearch />
      </Box> */}

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
              height: '100%',
              positon: 'relative',
            }}
          >
            {upTabScreen && (
              <>
                <Box
                  sx={{
                    width: '33%',
                    height: '100vh',
                    pb: '120px',
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

                  {
                    // paggination
                    <nav key={totalJobs}>
                      <ReactPaginate
                        previousLabel={'< '}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        containerClassName={'pagination-list'}
                        pageLinkClassName={'pagination-link'}
                        previousLinkClassName={'pagination-previous'}
                        nextLinkClassName={'pagination-next'}
                        activeLinkClassName={'pagination-link is-current'}
                        disabledLinkClassName={'pagination-link is-disabled'}
                        pageCount={Math.min(5, pages)}
                        onPageChange={handleChangePage}
                      />
                    </nav>
                  }

                  {/* {totalJobs > jobs.length && (
                    <Button
                      disabled={isLoadingNewPage}
                      sx={{ display: 'block', m: '0 auto', mt: 3, mb: 5 }}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      Load More
                    </Button>
                  )} */}
                </Box>
              </>
            )}

            <Box
              sx={
                upTabScreen
                  ? {
                      width: '65%',
                      maxWidth: '65%',
                      height: '100vh',
                      pb: '120px',
                      overflow: 'auto',
                    }
                  : {
                      width: '100%',
                      height: '100vh',
                      pb: '120px',
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

            {
              // paggination
              <nav key={totalJobs}>
                <ReactPaginate
                  previousLabel={'< '}
                  nextLabel={'>'}
                  breakLabel={'...'}
                  containerClassName={'pagination-list'}
                  pageLinkClassName={'pagination-link'}
                  previousLinkClassName={'pagination-previous'}
                  nextLinkClassName={'pagination-next'}
                  activeLinkClassName={'pagination-link is-current'}
                  disabledLinkClassName={'pagination-link is-disabled'}
                  pageCount={Math.min(5, pages)}
                  onPageChange={handleChangePage}
                />
              </nav>
            }
            {/* {totalJobs > jobs.length && (
              <Button
                disabled={isLoadingNewPage}
                sx={{ mt: 3, mb: 5 }}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Load More
              </Button>
            )} */}
          </Box>
        </>
      )}
    </>
  );
};

export default Dashboard;
