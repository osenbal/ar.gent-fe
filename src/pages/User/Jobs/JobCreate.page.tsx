import React, { useState, useEffect } from 'react';
import { EditorState, convertFromRaw, CompositeDecorator } from 'draft-js';
import { ToastContainer, toast } from 'react-toastify';
import { NumericFormat } from 'react-number-format';
import { stateToHTML } from 'draft-js-export-html';
import TextEditor from '@/components/Reusable/TextEditor';
import { BACKEND_URL } from '@/config/config';
import {
  IState_NewJob,
  EJobLevel,
  EJobType,
  EJobWorkPlace,
  INew_ObjectJob,
} from '@/interfaces/job.interface';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Button,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  City,
  Country,
  ICity,
  State,
  ICountry,
  IState,
} from 'country-state-city';

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

const JobCreatePage: React.FC = () => {
  const data = localStorage.getItem(TEXT_EDITOR_ITEM);
  const initialState = data
    ? EditorState.createWithContent(
        convertFromRaw(JSON.parse(data)),
        linkDecorator
      )
    : EditorState.createEmpty(linkDecorator);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editorState, setEditorState] = useState<EditorState>(initialState);
  const [jobData, setJobData] = useState<IState_NewJob>({
    title: '',
    description: '',
    city: '',
    state: '',
    country: '',
    salary: 0,
    type: '',
    level: '',
    workPlace: '',
  });

  const optionTypes = Object.values(EJobType).map((value: string) => value);
  const optionLevels = Object.values(EJobLevel).map((value: string) => value);
  const optionWorkPlace = Object.values(EJobWorkPlace).map(
    (value: string) => value
  );

  const handleCreateJob = async () => {
    if (
      !jobData.title ||
      !jobData.description ||
      !jobData.level ||
      !jobData.type ||
      !jobData.workPlace ||
      !jobData.city ||
      !jobData.state ||
      !jobData.country
    ) {
      console.log('Please fill all the fields');
      return;
    }

    setIsLoading(true);

    const country: ICountry | null =
      Country.getCountryByCode(jobData.country) || null;
    const state: IState | null =
      State.getStateByCodeAndCountry(jobData.state, jobData.country) || null;
    const city: ICity = City.getCitiesOfState(
      jobData.country,
      jobData.state
    ).filter((city) => city.name === jobData.city)[0];

    if (!country || !state || !city) {
      console.log('Please fill all the fields');
      return;
    }

    const location = {
      country,
      state,
      city,
    };

    const newJobObject: INew_ObjectJob = {
      ...jobData,
      ...location,
    };

    const response = await fetch(`${BACKEND_URL}/job`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newJobObject,
      }),
    });

    if (response.ok) {
      toast.success('Job created successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setJobData({
        title: '',
        description: '',
        city: '',
        state: '',
        country: '',
        salary: 0,
        type: '',
        level: '',
        workPlace: '',
      });
      setEditorState(EditorState.createEmpty(linkDecorator));
      setIsLoading(false);
    } else {
      toast.error('Something went wrong', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const htmlDescription = stateToHTML(editorState.getCurrentContent());
    setJobData({ ...jobData, description: htmlDescription });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  return (
    <>
      <ToastContainer />
      <Box>
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              sx={{ textAlign: { xs: 'center', md: 'left' } }}
            >
              Create a Job
            </Typography>
            {/* Title Job */}
            <TextField
              value={jobData.title}
              onChange={(e) =>
                setJobData({ ...jobData, title: e.target.value })
              }
              label="Job Title"
              variant="outlined"
              fullWidth
              margin="normal"
            />

            {/* Location Job */}
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
                  value={jobData.country}
                  onChange={(e) => {
                    setJobData({
                      ...jobData,
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
                  value={jobData.state}
                  onChange={(e) => {
                    setJobData({
                      ...jobData,
                      city: '',
                      state: e.target.value,
                    });
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {State.getStatesOfCountry(jobData.country).map((state) => (
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
                  value={jobData.city}
                  onChange={(e) => {
                    setJobData({
                      ...jobData,
                      city: e.target.value,
                    });
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {City.getCitiesOfState(jobData.country, jobData.state).map(
                    (city) => (
                      <MenuItem key={city.name} value={city.name}>
                        {city.name}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mt: 2,
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              {/* Job Type */}
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="filterJobType">Job Type</InputLabel>
                <Select
                  labelId="filterJobType"
                  id="filterJobType"
                  label="Job Type"
                  value={jobData.type}
                  onChange={(e) => {
                    let val: EJobType = e.target.value as EJobType;
                    setJobData({ ...jobData, type: val });
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
                  value={jobData.level}
                  label="Level"
                  onChange={(event: SelectChangeEvent) => {
                    let val: EJobLevel = event.target.value as EJobLevel;
                    setJobData({ ...jobData, level: val });
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
                  value={jobData.workPlace}
                  label="Workplace"
                  onChange={(event: SelectChangeEvent) => {
                    let val: EJobWorkPlace = event.target
                      .value as EJobWorkPlace;
                    setJobData({ ...jobData, workPlace: val });
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

            {/* Salary Job */}
            <NumericFormat
              fullWidth
              sx={{ display: 'block', width: '100%', mt: 3 }}
              value={jobData.salary}
              customInput={TextField}
              decimalSeparator=","
              thousandSeparator="."
              allowNegative={false}
              label="Salary"
              prefix="Rp. "
              type="text"
              onChange={(e) => {
                setJobData((prev) => ({
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
            <TextEditor
              editorState={editorState}
              setEditorState={setEditorState}
            />
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
              create job
            </LoadingButton>
          ) : (
            <Button
              disabled={isLoading}
              sx={{ mr: 0, width: { xs: '100%', md: '150px' } }}
              variant="contained"
              color="success"
              onClick={handleCreateJob}
            >
              Create
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default JobCreatePage;
