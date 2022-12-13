import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import ReactPaginate from 'react-paginate';
import { Helmet } from 'react-helmet-async';
import JobCard from '@/pages/User/Jobs/JobCard';
import JobDetails from '@/pages/User/Jobs/JobDetails';
import SearchApp from '@/components/Reusable/SearchApp';
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
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));
  const [queryParams, setQueryParams] = useSearchParams();

  const jobIdParam = queryParams.get('jobId');
  const searchParam = queryParams.get('keyword');
  const levelParam = queryParams.get('level');
  const typeParam = queryParams.get('type');
  const workplaceParam = queryParams.get('workplace');

  const optionTypes = Object.values(EJobType).map((value: string) => value);
  const optionLevels = Object.values(EJobLevel).map((value: string) => value);
  const optionWorkPlace = Object.values(EJobWorkPlace).map(
    (value: string) => value
  );

  const [keyword, setKeyword] = useState<string>(searchParam || '');
  const [page, setPage] = useState<number>(0);
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
    setPage(selected);
  };

  const keyPressHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setQueryParams({ keyword: keyword });
      if (page !== 0) {
        setPage(0);
      } else {
        const controller = new AbortController();
        loadJobs(controller);
      }
    }
  };

  const loadJobs = async (controller: any) => {
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

    fetch(
      `${BACKEND_URL}/job?page=${page}&limit=${limit}&search=${keyword}&workplace=${workplace}&level=${jobLevel}&type=${jobType}`,
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
          setQueryParams({
            jobId: data?.data[0]?._id,
            level: jobLevel,
            type: jobType,
            workplace: workplace,
            keyword: keyword,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoadingJobs(false);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    loadJobs(controller);
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const controller = new AbortController();
    loadJobs(controller);
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workplace, jobLevel, jobType]);

  useEffect(() => {
    if (jobIdParam) {
      setIsLoadingDetailJob(true);
      if (jobIdParam === 'null' || jobIdParam === 'undefined') {
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
          <Box>
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
