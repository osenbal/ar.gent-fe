import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import JobCard from '@/pages/User/Jobs/components/JobCard';
import JobDetails from '@/pages/User/Jobs/components/JobDetails';
import Loader from '@/components/Reusable/Loader';
import SearchApp from '@/components/Reusable/SearchApp';
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
  const [pages, setPages] = useState<number>(0);
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

  const loadJobs = async (controller: any) => {
    await window.scrollTo(0, 0);
    await jobsRef.current?.scrollTo(0, 0);
    setIsLoadingJobs(true);
    fetch(
      `${BACKEND_URL}/job?page=${page}&limit=${limit}&startIndex=${startParam}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          setTotalJobs(data.totalRows);
          setPage(data.page);
          setLimit(data.limit);
          setPages(data.totalPage);
          setJobs(data.data);
          if (data.data.length > 0) {
            if (jobIdParam) {
              const jobExist = Boolean(
                data.data.find((job: any) => job._id === jobIdParam)
              );
              if (!jobExist) {
                updatedSearchParams.set('jobId', `${data.data[0]._id}`);
                setQueryParams(updatedSearchParams.toString());
              }
            } else {
              updatedSearchParams.set('jobId', `${data.data[0]._id}`);
              setQueryParams(updatedSearchParams.toString());
            }
          } else {
            setIsLoadingDetailJob(false);
            setJobDetails(null);
          }
        }
      })
      .catch((error) => {
        setIsLoadingDetailJob(false);
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoadingJobs(false);
      });
  };

  // ------------------ useEffects ------------------
  useEffect(() => {
    const controller = new AbortController();
    loadJobs(controller);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (jobIdParam) {
      setIsLoadingDetailJob(true);
      if (
        jobIdParam === 'null' ||
        jobIdParam === 'undefined' ||
        !jobIdParam ||
        jobIdParam === ''
      ) {
        setJobDetails(null);
        setIsLoading(false);
        setIsLoadingDetailJob(false);
        return;
      }
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
            setIsLoadingDetailJob(false);
          });
      }, 1000);
    }
  }, [jobIdParam]);

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

      {isLoading ? (
        <Loader />
      ) : upTabScreen ? (
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
              <Typography variant="h6" color="textSecondary">
                No jobs found
              </Typography>
            )}
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
          </Box>
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
              <Typography variant="h6" color="textSecondary">
                No job found
              </Typography>
            )}
          </Box>
        </Box>
      ) : (
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
                    <Typography variant="h6" color="textSecondary">
                      No jobs found
                    </Typography>
                  )}

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
