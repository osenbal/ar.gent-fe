import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Helmet } from 'react-helmet-async';
import useRefreshToken from '@/hooks/refreshToken.hook';
import { useAppDispatch } from '@/hooks/redux.hook';
import { asyncLogout } from '@/store/authSlice';
import JobCard from '@/pages/User/Jobs/components/JobCard';
import JobDetails from '@/pages/User/Jobs/components/JobDetails';
import SearchApp from '@/components/Reusable/SearchApp';
import Loader from '@/components/Reusable/Loader';
import { BACKEND_URL } from '@/config/config';
import {
  IReturn_JobDetails,
  IReturn_Jobs,
  EJobWorkPlace,
  EJobType,
  EJobLevel,
} from '@/interfaces/job.interface';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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
  FormControl,
  MenuItem,
  InputLabel,
} from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const JobSearchPage: React.FC = () => {
  const theme = useTheme();
  const refreshToken = useRefreshToken();
  const dispatch = useAppDispatch();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));
  const [queryParams, setQueryParams] = useSearchParams();
  let updatedSearchParams = new URLSearchParams(queryParams.toString());

  const jobIdParam = queryParams.get('jobId');
  const searchParam = queryParams.get('keyword');
  const levelParam = queryParams.get('level');
  const typeParam = queryParams.get('type');
  const workplaceParam = queryParams.get('workplace');
  const startParam = queryParams.get('start');

  const optionTypes = Object.values(EJobType).map((value: string) => value);
  const optionLevels = Object.values(EJobLevel).map((value: string) => value);
  const optionWorkPlace = Object.values(EJobWorkPlace).map(
    (value: string) => value
  );

  const jobsRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState<string>(searchParam || '');
  const [page, setPage] = useState<number>(
    startParam ? parseInt(startParam) : 0
  );
  const [limit, setLimit] = useState<number>(10);
  const [pages, setPages] = useState<number>(0);
  const [totalJobs, setTotalJobs] = useState<number>(0);

  const [jobs, setJobs] = useState<IReturn_Jobs[] | []>([]);
  const [jobDetails, setJobDetails] = useState<IReturn_JobDetails | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDetailJob, setIsLoadingDetailJob] = useState<boolean>(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);

  const [jobType, setJobType] = useState<string>(typeParam || '');
  const [jobLevel, setJobLevel] = useState<string>(levelParam || '');
  const [workplace, setWorkplace] = useState<string>(workplaceParam || '');

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  const keyPressHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updatedSearchParams.set('keyword', `${keyword}`);
      setQueryParams(updatedSearchParams.toString());
      if (page !== 0) {
        setPage(0);
      } else {
        const controller = new AbortController();
        loadJobs(controller);
      }
    }
  };

  const asyncLoadJobs = async () => {
    const response = await fetch(
      `${BACKEND_URL}/job?page=${page}&limit=${limit}&search=${keyword}&workplace=${workplace}&level=${jobLevel}&type=${jobType}&startIndex=${startParam}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((res) => res.json());

    return response;
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
        console.log('job not exist');
        updatedSearchParams.set('jobId', response?.data[0]?._id);
        setQueryParams(updatedSearchParams.toString());
      }
    } else {
      updatedSearchParams.set('jobId', `${response.data[0]._id}`);
      setQueryParams(updatedSearchParams.toString());
    }
  };

  const loadJobs = async (controller: any) => {
    await window.scrollTo(0, 0);
    await jobsRef.current?.scrollTo(0, 0);
    setIsLoadingJobs(true);
    if (optionWorkPlace.includes(workplace) === false) {
      setWorkplace('');
    }

    if (optionLevels.includes(jobLevel) === false) {
      setJobLevel('');
    }

    if (optionTypes.includes(jobType) === false) {
      setJobType('');
    }

    try {
      const response = await asyncLoadJobs();
      if (response.code === 200) {
        setDataState(response);
        if (response?.data?.length > 0) {
          handleParams(response);
        } else {
          updatedSearchParams.delete('jobId');
          setQueryParams(updatedSearchParams.toString());
          setIsLoadingDetailJob(false);
          setJobDetails(null);
        }
      } else if (response.status === 401) {
        await refreshToken();
        const response = await asyncLoadJobs();
        if (response.code === 200) {
          setDataState(response);
          if (response?.data?.length > 0) {
            handleParams(response);
          } else {
            updatedSearchParams.delete('jobId');
            setQueryParams(updatedSearchParams.toString());
            setIsLoadingDetailJob(false);
            setJobDetails(null);
          }
        } else if (response.status === 401) {
          dispatch(asyncLogout());
        } else {
          setIsLoadingDetailJob(false);
          setIsLoading(false);
          setIsLoadingJobs(false);
          setJobDetails(null);
        }
      }
    } catch (error) {
      setIsLoadingDetailJob(false);
      setIsLoading(false);
      setIsLoadingJobs(false);
    }

    fetch(
      `${BACKEND_URL}/job?page=${page}&limit=${limit}&search=${keyword}&workplace=${workplace}&level=${jobLevel}&type=${jobType}&startIndex=${startParam}`,
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
                console.log('job not exist');
                updatedSearchParams.set('jobId', data?.data[0]?._id);
                setQueryParams(updatedSearchParams.toString());
              }
            } else {
              updatedSearchParams.set('jobId', `${data.data[0]._id}`);
              setQueryParams(updatedSearchParams.toString());
            }
          } else {
            updatedSearchParams.delete('jobId');
            setQueryParams(updatedSearchParams.toString());
            setIsLoadingDetailJob(false);
            setJobDetails(null);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoadingDetailJob(false);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoadingJobs(false);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    loadJobs(controller);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const controller = new AbortController();
    loadJobs(controller);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workplace, jobLevel, jobType]);

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
            setIsLoadingDetailJob(false);
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
        <title>
          {keyword === '' ? 'search | jobs' : `search ${keyword} jobs`}
        </title>
      </Helmet>

      <SearchApp
        keyword={keyword}
        setKeyword={setKeyword}
        onKeyPress={keyPressHandler}
      />

      <Box
        sx={{
          mt: 3,
          py: 1,
          display: 'flex',
          overflow: 'auto',
          flexDirection: 'row',
          whiteSpace: 'nowrap',
          width: '100%',
          gap: 2,
        }}
      >
        {/* Job Type */}
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="filterJobType">Job Type</InputLabel>
          <Select
            labelId="filterJobType"
            id="filterJobType"
            label="Job Type"
            value={jobType}
            onChange={(e) => {
              let val: EJobType = e.target.value as EJobType;
              setJobType(val);
              setQueryParams({
                jobId: jobIdParam || '',
                level: jobLevel,
                type: val,
                workplace: workplace,
                keword: keyword,
              });
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {optionTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Job Level */}
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="filterLevel">Level</InputLabel>
          <Select
            labelId="filterLevel"
            id="filterLevel"
            value={jobLevel}
            label="Level"
            onChange={(event: SelectChangeEvent) => {
              let val: EJobLevel = event.target.value as EJobLevel;
              setJobLevel(val);
              setQueryParams({
                jobId: jobIdParam || '',
                level: val,
                type: jobType,
                workplace: workplace,
                keword: keyword,
              });
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {optionLevels.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Workplace Job */}
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="filterWorkPlace">Workplace</InputLabel>
          <Select
            labelId="filterWorkPlace"
            id="filterWorkPlace"
            value={workplace}
            label="Workplace"
            onChange={(event: SelectChangeEvent) => {
              let val: EJobWorkPlace = event.target.value as EJobWorkPlace;
              setWorkplace(val);
              setQueryParams({
                jobId: jobIdParam || '',
                level: jobLevel,
                type: jobType,
                workplace: val,
                keyword: keyword,
              });
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {optionWorkPlace.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
            mt: 5,
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
            ) : jobs.length > 0 ? (
              jobs.map((job, index) => (
                <JobCard
                  path="jobSearch"
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
            }
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
                  {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                      <Box key={index} onClick={handleClickOpen}>
                        <JobCard
                          path="jobSearch"
                          handleDelete={() => 0}
                          job={job}
                        />
                      </Box>
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
                  }
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

export default JobSearchPage;
