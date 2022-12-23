import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import FetchIntercept from '@/utils/api';
import JobCard from '@/pages/User/Jobs/components/JobCard';
import JobDetails from '@/pages/User/Jobs/components/JobDetails';
import Loader from '@/components/Reusable/Loader';
import SearchApp from '@/components/Reusable/SearchApp';
import NoData from '@/components/Reusable/NoData';
import { BACKEND_URL } from '@/config/config';
import { IReturn_JobDetails, IReturn_Jobs } from '@/interfaces/job.interface';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import {
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  Dialog,
  Toolbar,
  AppBar,
  IconButton,
  Slide,
} from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));
  const [queryParams, setQueryParams] = useSearchParams();
  let updatedSearchParams = new URLSearchParams(queryParams.toString());

  const jobIdParam = queryParams.get('jobId');
  const startParam = queryParams.get('start');

  const jobsRef = useRef<HTMLDivElement>(null);

  // ------------------ States ------------------
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(
    startParam ? parseInt(startParam) : 0
  );
  const [limit, setLimit] = useState<number>(10);
  const [pages, setPages] = useState<number>(1);
  const [jobs, setJobs] = useState<IReturn_Jobs[] | []>([]);
  const [jobDetails, setJobDetails] = useState<IReturn_JobDetails | null>(null);
  const [totalJobs, setTotalJobs] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [isLoadingDetailJob, setIsLoadingDetailJob] = useState<boolean>(true);

  const [open, setOpen] = useState(false);

  // ------------------ Functions ------------------
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const keyPressHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigate(`/jobs/search?keyword=${keyword}`, {
        replace: true,
      });
    }
  };

  const handleChangePage = ({ selected }: { selected: any }) => {
    if (selected !== 0) {
      updatedSearchParams.set('start', `${selected}`);
      setQueryParams(updatedSearchParams.toString());
    } else {
      updatedSearchParams.delete('start');
      setQueryParams(updatedSearchParams.toString());
    }
    setPage(selected);
  };

  const setDataState = (response: any) => {
    setTotalJobs(response.totalRows);
    setPage(response.page);
    setLimit(response.limit);
    setPages(response.totalPage);
    setJobs(response.data);
  };

  const handleParams = (response: any) => {
    if (jobIdParam) {
      const jobExist = Boolean(
        response.data.find((job: any) => job._id === jobIdParam)
      );
      if (!jobExist) {
        updatedSearchParams.set('jobId', `${response.data[0]._id}`);
        setQueryParams(updatedSearchParams.toString());
      }
    } else {
      updatedSearchParams.set('jobId', `${response.data[0]._id}`);
      setQueryParams(updatedSearchParams.toString());
    }
  };

  const setAllLoadingFalse = () => {
    setIsLoadingDetailJob(false);
    setIsLoadingJobs(false);
    setIsLoading(false);
  };

  const loadJobs = async () => {
    await window.scrollTo(0, 0);
    await jobsRef.current?.scrollTo(0, 0);
    setIsLoadingJobs(true);
    try {
      console.log(
        `${BACKEND_URL}/job?page=${page}&limit=${limit}&startIndex=${startParam}`
      );
      const response = await FetchIntercept(
        `${BACKEND_URL}/job?page=${page}&limit=${limit}&startIndex=${startParam}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.code === 200) {
        console.log(response.data);
        setDataState(response);
        if (response.data.length > 0) {
          handleParams(response);
        }
        if (response.data.length === 0) {
          setIsLoadingDetailJob(false);
        }
      } else {
        setAllLoadingFalse();
      }
    } catch (error) {
      setAllLoadingFalse();
      console.log(error);
    }

    setIsLoading(false);
    setIsLoadingJobs(false);
  };

  const loadJobDetails = async () => {
    setIsLoadingDetailJob(true);
    if (jobIdParam !== null) {
      const response = await FetchIntercept(
        `${BACKEND_URL}/job/${jobIdParam}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.code === 200) {
        setJobDetails(response.data);
        setIsLoadingDetailJob(false);
      } else {
        setJobDetails(null);
        setIsLoadingDetailJob(false);
      }
    }
  };

  // ------------------ useEffects ------------------
  useEffect(() => {
    loadJobs();
    console.log('load jobs', jobs);
    console.log('load jobs in page, ', page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (jobIdParam !== null) {
      loadJobDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobIdParam]);

  // ------------------ JSX ------------------
  return (
    <>
      <Helmet>
        <title>Dashboard | ar.gent</title>
      </Helmet>

      <SearchApp
        keyword={keyword}
        setKeyword={setKeyword}
        onKeyPress={keyPressHandler}
      />

      {isLoading ? (
        <Loader />
      ) : upTabScreen ? (
        // desktop
        <>
          {!isLoading && !isLoadingJobs && jobs?.length === 0 ? (
            <NoData
              upTabScreen={upTabScreen}
              message="Please check your connection or refresh this page"
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'start',
                flexDirection: 'row',
                gap: 2,
                mt: 3,
                height: '100%',
                positon: 'relative',
              }}
            >
              <Box
                ref={jobsRef}
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
                ) : jobs?.length > 0 ? (
                  jobs.map((job, index) => (
                    <JobCard
                      path="jobs"
                      handleDelete={() => 0}
                      key={index}
                      job={job}
                    />
                  ))
                ) : (
                  ''
                )}

                {jobs?.length > 0 && (
                  <nav key={totalJobs}>
                    <ReactPaginate
                      forcePage={page}
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
                )}
              </Box>

              {/* detail job */}
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
                {isLoadingDetailJob ? (
                  <Loader />
                ) : jobDetails ? (
                  <JobDetails data={jobDetails} />
                ) : (
                  ''
                )}
              </Box>
            </Box>
          )}
        </>
      ) : (
        // mobile
        <>
          <Box ref={jobsRef}>
            {isLoadingJobs ? (
              <Loader />
            ) : (
              <>
                <Box sx={{ mt: 5 }}>
                  {jobs?.length > 0 ? (
                    jobs.map((job, index) => (
                      <Box key={index} onClick={handleClickOpen}>
                        <JobCard path="jobs" handleDelete={() => 0} job={job} />
                      </Box>
                    ))
                  ) : (
                    <NoData
                      upTabScreen={upTabScreen}
                      message="Please check your connection or refresh this page"
                    />
                  )}

                  {jobs?.length > 0 && (
                    <nav key={totalJobs}>
                      <ReactPaginate
                        forcePage={page}
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
                  )}
                </Box>

                <Dialog
                  fullScreen
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Transition}
                >
                  <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Toolbar>
                  </AppBar>

                  <Box>
                    {isLoadingDetailJob ? (
                      <Loader />
                    ) : (
                      jobDetails && <JobDetails data={jobDetails} />
                    )}
                  </Box>
                </Dialog>
              </>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default Dashboard;
