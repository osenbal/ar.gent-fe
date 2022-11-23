import React, { useState } from 'react';
import { FormControl, Box, MenuItem, InputLabel, styled } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const FilterSearch = () => {
  const [jobType, setJobType] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [workplace, setWorkplace] = useState<string>('');

  const handleChangeJobType = (event: SelectChangeEvent) => {
    setJobType(event.target.value);
  };

  const ContainerFilterSearch = styled(Box)<{ uptab?: string }>(
    ({ theme, uptab }) => ({
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'row',
      whiteSpace: 'nowrap',
    })
  );

  return (
    <>
      <ContainerFilterSearch sx={{ width: '100%' }}>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="filterJobType">Job Type</InputLabel>
          <Select
            labelId="filterJobType"
            id="filterJobType"
            value={jobType}
            label="Job Type"
            onChange={handleChangeJobType}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>Full Time</MenuItem>
            <MenuItem value={2}>Part Time</MenuItem>
            <MenuItem value={3}>Internship</MenuItem>
            <MenuItem value={3}>Internship</MenuItem>
            <MenuItem value={30}>Contract</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="filterCategory">Category</InputLabel>
          <Select
            labelId="filterCategory"
            id="filterCategory"
            value={category}
            label="Category"
            onChange={(event: SelectChangeEvent) =>
              setCategory(event.target.value)
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>Developer</MenuItem>
            <MenuItem value={2}>Task</MenuItem>
            <MenuItem value={2}>Front End</MenuItem>
            <MenuItem value={2}>Back End</MenuItem>
            <MenuItem value={2}>Full Stack</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="filterLevel">Level</InputLabel>
          <Select
            labelId="filterLevel"
            id="filterLevel"
            value={level}
            label="Level"
            onChange={(event: SelectChangeEvent) =>
              setLevel(event.target.value)
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>Beginer</MenuItem>
            <MenuItem value={2}>Mid Senior</MenuItem>
            <MenuItem value={2}>Senior</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="filterWorkPlace">Workplace</InputLabel>
          <Select
            labelId="filterWorkPlace"
            id="filterWorkPlace"
            value={workplace}
            label="Workplace"
            onChange={(event: SelectChangeEvent) =>
              setWorkplace(event.target.value)
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>Remote</MenuItem>
            <MenuItem value={2}>Onsite</MenuItem>
            <MenuItem value={3}>Hybrith</MenuItem>
          </Select>
        </FormControl>
      </ContainerFilterSearch>
    </>
  );
};

export default FilterSearch;
