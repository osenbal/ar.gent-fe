import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useParams, NavLink, useSearchParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { stateToHTML } from 'draft-js-export-html';
import { toast } from 'react-toastify';
import {
  City,
  Country,
  ICity,
  ICountry,
  IState,
  State,
} from 'country-state-city';
import TextEditor from '@/components/Reusable/TextEditor';
import { useAppSelector } from '@/hooks/redux.hook';
import { BACKEND_URL } from '@/config/config';
import {
  INew_ObjectJob,
  IReturn_GET_JobById,
  EJobLevel,
  EJobType,
  EJobWorkPlace,
} from '@/interfaces/job.interface';
import LoadingButton from '@mui/lab/LoadingButton';
import Select from '@mui/material/Select';
import {
  EditorState,
  CompositeDecorator,
  convertFromHTML,
  ContentState,
} from 'draft-js';
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
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextareaAutosize,
} from '@mui/material';
import FetchIntercept from '@/utils/api';

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

const DialogApproveAppliciant = ({
  open,
  handleApprove,
  handleClose,
  message,
  setMessage,
  isLoading,
}: {
  open: boolean;
  handleApprove: any;
  handleClose: any;
  message: string;
  setMessage: any;
  isLoading: boolean;
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title-approve-appliciant"
      aria-describedby="dialog-title-approve-appliciant"
    >
      <DialogTitle id="dialog-title-approve-appliciant">
        Are You Sure Approve This User for this Job ?
      </DialogTitle>
      <DialogContent>
        <Typography>Message for this appliciants</Typography>

        <TextareaAutosize
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="message for this appliciants"
          minRows={3}
          placeholder="location interview / link zoom interview or etc..."
          style={{
            width: '100%',
            padding: 3,
            borderRadius: '8px',
            marginTop: 2,
          }}
        />
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <LoadingButton
            size="small"
            loading={isLoading}
            variant="outlined"
            disabled
          >
            Loading
          </LoadingButton>
        ) : (
          <Button disabled={isLoading} onClick={handleApprove}>
            Yes
          </Button>
        )}

        <Button disabled={isLoading} onClick={handleClose}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DialogRejectAppliciant = ({
  open,
  handleReject,
  handleClose,
  message,
  setMessage,
  isLoading,
}: {
  open: boolean;
  handleReject: any;
  handleClose: any;
  message: string;
  setMessage: any;
  isLoading: boolean;
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-content-reject-appliciant"
      aria-describedby="dialog-content-reject-appliciant"
    >
      <DialogTitle id="dialog-content-reject-appliciant">
        Are You Sure Reject This User for this Job ?
      </DialogTitle>
      <DialogContent>
        <Typography>Message for this appliciants (optional)</Typography>

        <TextareaAutosize
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="message for this appliciants"
          minRows={3}
          placeholder="optional message for this appliciants"
          style={{
            width: '100%',
            padding: 3,
            borderRadius: '8px',
            marginTop: 2,
          }}
        />
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <LoadingButton
            size="small"
            loading={isLoading}
            variant="outlined"
            disabled
          >
            Loading
          </LoadingButton>
        ) : (
          <Button disabled={isLoading} onClick={handleReject}>
            Yes
          </Button>
        )}
        <Button disabled={isLoading} onClick={handleClose}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const JobControlPage: React.FC = () => {
  const { userId } = useAppSelector((state) => state.auth);
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();

  const paneParams = searchParams.get('pane');

  const optionTypes = Object.values(EJobType).map((value: string) => value);
  const optionLevels = Object.values(EJobLevel).map((value: string) => value);
  const optionWorkPlace = Object.values(EJobWorkPlace).map(
    (value: string) => value
  );

  // ------------------ states ------------------
  const [job, setJob] = useState<IReturn_GET_JobById>({
    _id: '',
    userId: '',
    username: '',
    title: '',
    description: '',
    salary: 0,
    city: '',
    state: '',
    country: '',
    type: '',
    level: '',
    workPlace: '',
    avatarUser: '',
    totalAppliciants: 0,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });

  const [jobTemp, setJobTemp] = useState<IReturn_GET_JobById>({
    _id: '',
    userId: '',
    username: '',
    title: '',
    description: '',
    city: '',
    state: '',
    country: '',
    salary: 0,
    type: '',
    level: '',
    workPlace: '',
    avatarUser: '',
    totalAppliciants: 0,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });

  const [editorState, setEditorState] = useState<EditorState | null>(null);

  const [appliciants, setAppliciants] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingAppliciant, setIsLoadingAppliciant] = useState<boolean>(true);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalReject, setOpenModalReject] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserReject, setSelectedUserReject] = useState<string | null>(
    null
  );

  const [message, setMessage] = useState<string>('');
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false);
  const [messageReject, setMessageReject] = useState<string>('');
  const [isLoadingReject, setIsLoadingReject] = useState<boolean>(false);

  // ------------------ Functions ------------------
  const getJobDetail = async () => {
    if (jobId) {
      const response = await FetchIntercept(`${BACKEND_URL}/job/${jobId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.code === 200) {
        const city = response.data.location.city.name;
        const country = response.data.location.country.isoCode;
        const state = response.data.location.state.isoCode;
        const jobData = Object.entries(response.data).filter(
          ([key, value]) => key !== 'location'
        );
        const jobDataWithLocation = Object.fromEntries([
          ...jobData,
          ['city', city],
          ['country', country],
          ['state', state],
        ]);
        setJob(jobDataWithLocation);
        setJobTemp(jobDataWithLocation);
        const blocksHtmlDescription = convertFromHTML(
          response.data.description
        );
        const initialState = response.data.description
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
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleEditJob = async () => {
    if (
      jobTemp.title === job.title &&
      jobTemp.description === job.description &&
      jobTemp.city === job.city &&
      jobTemp.state === job.state &&
      jobTemp.country === job.country &&
      jobTemp.salary === job.salary &&
      jobTemp.type === job.type &&
      jobTemp.level === job.level &&
      jobTemp.workPlace === job.workPlace
    ) {
      toast.warn('No changes detected');
      return;
    }

    if (
      !editorState ||
      !job.title ||
      !job.city ||
      !job.state ||
      !job.country ||
      !job.type ||
      !job.level ||
      !job.workPlace ||
      !job.salary
    ) {
      toast.warn('Please fill all fields');
      return;
    }

    const country: ICountry | null =
      Country.getCountryByCode(job.country) || null;
    const state: IState | null =
      State.getStateByCodeAndCountry(job.state, job.country) || null;
    const city: ICity = City.getCitiesOfState(job.country, job.state).filter(
      (city) => city.name === job.city
    )[0];

    if (!country || !state || !city) {
      // console.log('please select a valid country, state and city');
      toast.warn('Please select a valid country, state and city');
      return;
    }

    const editedData: INew_ObjectJob = {
      title: job.title,
      description: stateToHTML(editorState.getCurrentContent()),
      country: country,
      state: state,
      city: city,
      salary: job.salary,
      type: job.type,
      level: job.level,
      workPlace: job.workPlace,
    };

    const response = await FetchIntercept(`${BACKEND_URL}/job/${jobId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedData),
    });

    if (response.code === 200) {
      setJobTemp(job);
      toast.success(response.data, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } else {
      toast.error(response.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  const getAppliciants = async () => {
    setIsLoadingAppliciant(true);
    const response = await FetchIntercept(
      `${BACKEND_URL}/job/${jobId}/appliciants?pane=${paneParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (response.code === 200) {
      setAppliciants(response.data);
      setIsLoadingAppliciant(false);
    } else {
      console.log('error');
      setIsLoadingAppliciant(false);
    }
  };

  const approveAppliciant = async (appliciantId: string) => {
    setIsLoadingApprove(true);
    const response = await FetchIntercept(
      `${BACKEND_URL}/job/approve/${userId}/${appliciantId}/${jobId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message }),
      }
    );

    if (response.code === 200) {
      toast.success(response.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setIsLoadingApprove(false);
      getAppliciants();
    } else {
      toast.error(response.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setIsLoadingApprove(false);
    }
    setOpenModal(false);
    setMessage('');
    setSelectedUser(null);
  };

  const rejectAppliciant = async (appliciantId: string) => {
    setIsLoadingReject(true);
    const response = await FetchIntercept(
      `${BACKEND_URL}/job/reject/${userId}/${appliciantId}/${jobId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (response.code === 200) {
      toast.success(response.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setIsLoadingReject(false);
      getAppliciants();
    } else {
      toast.error(response.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setIsLoadingReject(false);
    }

    setOpenModalReject(false);
    setMessageReject('');
    setSelectedUserReject(null);
  };

  // ------------------  useEffects ------------------
  useEffect(() => {
    if (editorState) {
      const htmlDescription = stateToHTML(editorState.getCurrentContent());
      setJob({ ...job, description: htmlDescription });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  useEffect(() => {
    if (jobId) {
      getJobDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAppliciants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paneParams]);

  return (
    <>
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
      ) : userId === job?.userId ? (
        <Box sx={{ mb: 5 }}>
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
              {/* Location Job */}
              <Typography variant="body1">Location</Typography>
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
                  <InputLabel id="country">Country</InputLabel>
                  <Select
                    labelId="country"
                    id="country"
                    label="Country"
                    value={job?.country}
                    onChange={(e) => {
                      setJob({
                        ...job,
                        state: '',
                        city: '',
                        country: e.target.value,
                      });
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {Country.getAllCountries()
                      .filter((country) => country.isoCode === 'ID')
                      .map((country) => (
                        <MenuItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {/* State */}
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="state">State</InputLabel>
                  <Select
                    labelId="state"
                    id="state"
                    label="State"
                    value={job?.state}
                    onChange={(e) => {
                      setJob({
                        ...job,
                        city: '',
                        state: e.target.value,
                      });
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {State.getStatesOfCountry(job.country).map((state) => (
                      <MenuItem key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* City */}
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="state">City</InputLabel>
                  <Select
                    labelId="city"
                    id="city"
                    label="City"
                    value={job?.city}
                    onChange={(e) => {
                      setJob({
                        ...job,
                        city: e.target.value,
                      });
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {City.getCitiesOfState(job.country, job.state).map(
                      (city) => (
                        <MenuItem key={city.name} value={city.name}>
                          {city.name}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Box>
              {/* category */}
              <Typography variant="body1" sx={{ mt: 2 }}>
                Category
              </Typography>
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
                    // eslint-disable-next-line no-useless-escape
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
                loadingIndicator="Loading???"
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

          {/* Appliciants */}
          <Box sx={{ display: 'flex', mt: 4, gap: 2 }}>
            <NavLink
              style={{ textDecoration: 'none' }}
              to={`/job/edit/${jobId}?pane=pending`}
            >
              <Button
                sx={
                  paneParams === `pending` || paneParams === null
                    ? {
                        fontWeight: 700,
                        fontSize: '16px',
                        textDecoration: 'underline',
                      }
                    : {
                        fontWeight: 400,
                        fontSize: '16  px',
                        textDecoration: 'none',
                      }
                }
              >
                Applicants
              </Button>
            </NavLink>
            <NavLink
              style={{ textDecoration: 'none' }}
              to={`/job/edit/${jobId}?pane=approved`}
            >
              <Button
                sx={
                  paneParams === `approved`
                    ? {
                        fontWeight: 700,
                        fontSize: '16px',
                        textDecoration: 'underline',
                      }
                    : {
                        fontWeight: 400,
                        fontSize: '16  px',
                        textDecoration: 'none',
                      }
                }
              >
                Approved
              </Button>
            </NavLink>
            <NavLink
              style={{ textDecoration: 'none' }}
              to={`/job/edit/${jobId}?pane=rejected`}
            >
              <Button
                sx={
                  paneParams === `rejected`
                    ? {
                        fontWeight: 700,
                        fontSize: '16px',
                        textDecoration: 'underline',
                      }
                    : {
                        fontWeight: 400,
                        fontSize: '16  px',
                        textDecoration: 'none',
                      }
                }
              >
                Rejected
              </Button>
            </NavLink>
          </Box>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Appliciants
              </Typography>

              {isLoadingAppliciant ? (
                <p>Loading</p>
              ) : appliciants && appliciants.length > 0 ? (
                appliciants.map((item, index) => (
                  <div key={index}>
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
                          <Avatar alt="Remy Sharp" src={item?.user.avatar} />
                          <Typography
                            variant="body1"
                            component={'a'}
                            href={`/user/${item.userId}/profile`}
                            sx={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            {item.user.username}
                          </Typography>
                          <Typography
                            target="_blank"
                            component={'a'}
                            variant="body2"
                            sx={{ color: 'grey.500', cursor: 'pointer' }}
                            href={item?.user.cv}
                          >
                            Download CV
                          </Typography>
                        </Box>

                        <div>
                          {item.isApprove === `pending` ||
                          item.isApprove === null ? (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                sx={{ ml: 2 }}
                                onClick={() => {
                                  setOpenModal(true);
                                  setSelectedUser(item.userId);
                                }}
                              >
                                Accept
                              </Button>

                              <Button
                                variant="contained"
                                color="error"
                                sx={{ ml: 2 }}
                                onClick={() => {
                                  setOpenModalReject(true);
                                  setSelectedUserReject(item.userId);
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            ''
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              ) : (
                ''
              )}
            </CardContent>
          </Card>
        </Box>
      ) : (
        <p>404 - Not found</p>
      )}

      <DialogApproveAppliciant
        open={openModal}
        message={message}
        setMessage={setMessage}
        isLoading={isLoadingApprove}
        handleClose={() => {
          setOpenModal(false);
          setSelectedUser(null);
        }}
        handleApprove={() => selectedUser && approveAppliciant(selectedUser)}
      />

      <DialogRejectAppliciant
        open={openModalReject}
        message={messageReject}
        setMessage={setMessageReject}
        isLoading={isLoadingReject}
        handleClose={() => {
          setOpenModalReject(false);
          setSelectedUserReject(null);
        }}
        handleReject={() =>
          selectedUserReject && rejectAppliciant(selectedUserReject)
        }
      />
    </>
  );
};

export default JobControlPage;
