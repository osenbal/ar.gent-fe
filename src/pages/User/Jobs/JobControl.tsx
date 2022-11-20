import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Avatar,
  Button,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextEditor from '@/components/Reusable/TextEditor';
import { NumericFormat } from 'react-number-format';
import { useAppSelector } from '@/hooks/redux.hook';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '@/config/config';
import IJob, { IJobDetails } from '@/interfaces/job.interface';
import { EJobLevel, EJobType, EJobWorkPlace } from '@/interfaces/job.interface';
import {
  EditorState,
  CompositeDecorator,
  convertFromHTML,
  ContentState,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import LoadingButton from '@mui/lab/LoadingButton';
import { ICreateJob } from '@/interfaces/job.interface';
import { ToastContainer, toast } from 'react-toastify';

const TEXT_EDITOR_ITEM = 'draft-js-example-item';

export const Link = (props: any) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a rel="noopener noreferrer" target="_blank" href={url}>
      {props.children}
    </a>
  );
};

const linkDecorator = new CompositeDecorator([
  {
    strategy: (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      }, callback);
    },
    component: Link,
  },
]);

const JobControl: React.FC = () => {
  const { userId } = useAppSelector((state) => state.auth);
  const { jobId } = useParams();

  const [job, setJob] = useState<IJobDetails>({
    _id: '',
    userId: '',
    username: '',
    title: '',
    description: '',
    location: '',
    salary: 0,
    type: '',
    level: '',
    workPlace: '',
    avatarUser: '',
    totalApplicants: 0,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });
  const [jobTemp, setJobTemp] = useState<IJobDetails>({
    _id: '',
    userId: '',
    username: '',
    title: '',
    description: '',
    location: '',
    salary: 0,
    type: '',
    level: '',
    workPlace: '',
    avatarUser: '',
    totalApplicants: 0,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });

  const [editorState, setEditorState] = useState<EditorState | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const optionTypes = Object.values(EJobType).map((value: string) => value);
  const optionLevels = Object.values(EJobLevel).map((value: string) => value);
  const optionWorkPlace = Object.values(EJobWorkPlace).map(
    (value: string) => value
  );

  const handleEditJob = async () => {
    if (
      jobTemp.title === job.title &&
      jobTemp.description === job.description &&
      jobTemp.location === job.location &&
      jobTemp.salary === job.salary &&
      jobTemp.type === job.type &&
      jobTemp.level === job.level &&
      jobTemp.workPlace === job.workPlace
    ) {
      return;
    }

    if (
      !editorState ||
      !job.title ||
      !job.location ||
      !job.type ||
      !job.level ||
      !job.workPlace ||
      !job.salary
    ) {
      return;
    }

    const editedData: ICreateJob = {
      title: job.title,
      description: stateToHTML(editorState.getCurrentContent()),
      location: job.location,
      salary: job.salary,
      type: job.type,
      level: job.level,
      workPlace: job.workPlace,
    };

    const response = await fetch(`${BACKEND_URL}/job/${jobId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedData),
    });

    if (response.ok) {
      const data = await response.json();
      setJobTemp(job);
      toast.success(data.data, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } else {
      const data = await response.json();
      toast.error(data.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    if (jobId) {
      // fetch job data
      fetch(`${BACKEND_URL}/job/id/${jobId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setJob(data.data);
          setJobTemp(data.data);
          const blocksHtmlDescription = convertFromHTML(data.data.description);
          const initialState = data.data.description
            ? EditorState.createWithContent(
                ContentState.createFromBlockArray(
                  blocksHtmlDescription.contentBlocks,
                  blocksHtmlDescription.entityMap
                ),
                linkDecorator
              )
            : EditorState.createEmpty(linkDecorator);
          setEditorState(initialState);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.log('abort');
          }
          setIsLoading(false);
        });
    }

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (editorState) {
      const htmlDescription = stateToHTML(editorState.getCurrentContent());
      setJob({ ...job, description: htmlDescription });
    }
  }, [editorState]);

  return (
    <>
      <ToastContainer />
      {isLoading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : userId === job?.userId ? (
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h5">Job Edit</Typography>
              <TextField
                value={job?.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
                label="Job Title"
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                value={job?.location}
                onChange={(e) => setJob({ ...job, location: e.target.value })}
                label="Location"
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{ mt: 2 }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  mt: 2,
                  flexDirection: { xs: 'column', md: 'row' },
                }}
              >
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="filterJobType">Job Type</InputLabel>
                  <Select
                    labelId="filterJobType"
                    id="filterJobType"
                    value={job?.type}
                    onChange={(e) => {
                      let val: EJobType = e.target.value as EJobType;
                      setJob((prev) => ({ ...prev, type: val }));
                    }}
                    label="Job Type"
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

                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="filterLevel">Level</InputLabel>
                  <Select
                    labelId="filterLevel"
                    id="filterLevel"
                    value={job?.level}
                    label="Level"
                    onChange={(e) => {
                      let val: EJobLevel = e.target.value as EJobLevel;
                      setJob((prev) => ({ ...prev, level: val }));
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
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="filterWorkPlace">Workplace</InputLabel>
                  <Select
                    labelId="filterWorkPlace"
                    id="filterWorkPlace"
                    value={job?.workPlace}
                    label="Workplace"
                    onChange={(e) => {
                      let val: EJobWorkPlace = e.target.value as EJobWorkPlace;
                      setJob((prev) => ({ ...prev, workPlace: val }));
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

              <NumericFormat
                fullWidth
                sx={{ display: 'block', width: '100%', mt: 3 }}
                value={job?.salary}
                customInput={TextField}
                decimalSeparator=","
                thousandSeparator="."
                allowNegative={false}
                label="Salary"
                prefix="Rp. "
                type="text"
                onChange={(e) => {
                  setJob((prev) => ({
                    ...prev,
                    salary: Number(e.target.value.replace(/[A-Za-z\.\s]/g, '')),
                  }));
                }}
              />
            </CardContent>
          </Card>

          <Card sx={{ mt: 4 }}>
            <CardContent>
              {/* Job Description */}
              {editorState && (
                <TextEditor
                  editorState={editorState}
                  setEditorState={setEditorState}
                />
              )}
            </CardContent>
          </Card>
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              alignItems: 'end',
            }}
          >
            {isLoading ? (
              <LoadingButton
                sx={{ mr: 0, width: { xs: '100%', md: '150px' } }}
                loading
                loadingIndicator="Loading…"
                variant="outlined"
              >
                loading...
              </LoadingButton>
            ) : (
              <Button
                disabled={isLoading}
                sx={{ mr: 0, width: { xs: '100%', md: '150px' } }}
                variant="contained"
                color="success"
                onClick={handleEditJob}
              >
                Save
              </Button>
            )}
          </Box>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Appliciants
              </Typography>
              <Card>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDir: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDir: 'row',
                      columnGap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={'https://dummyimage.com/400x400/000/eebbbb'}
                    />
                    <Typography variant="body1">user appliciant</Typography>
                  </Box>

                  <div>
                    <Button variant="contained" color="success" sx={{ ml: 2 }}>
                      Accept
                    </Button>
                    <Button variant="contained" color="error" sx={{ ml: 2 }}>
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDir: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDir: 'row',
                      columnGap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={'https://dummyimage.com/400x400/000/eebbbb'}
                    />
                    <Typography variant="body1">user appliciant</Typography>
                  </Box>

                  <div>
                    <Button variant="contained" color="success" sx={{ ml: 2 }}>
                      Accept
                    </Button>
                    <Button variant="contained" color="error" sx={{ ml: 2 }}>
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDir: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDir: 'row',
                      columnGap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={'https://dummyimage.com/400x400/000/eebbbb'}
                    />
                    <Typography variant="body1">user appliciant</Typography>
                  </Box>

                  <div>
                    <Button variant="contained" color="success" sx={{ ml: 2 }}>
                      Accept
                    </Button>
                    <Button variant="contained" color="error" sx={{ ml: 2 }}>
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <p>404 - Not found</p>
      )}
    </>
  );
};

export default JobControl;
