import React, { useState } from 'react';
import { EJobLevel, EJobType, EJobWorkPlace } from '@/interfaces/job.interface';
import { FormControl, Box, MenuItem, InputLabel, styled } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const FilterSearch = () => {
  const [jobType, setJobType] = useState<string>('');
  const [jobLevel, setJobLevel] = useState<string>('');
  const [workplace, setWorkplace] = useState<string>('');

  const optionTypes = Object.values(EJobType).map((value: string) => value);
  const optionLevels = Object.values(EJobLevel).map((value: string) => value);
  const optionWorkPlace = Object.values(EJobWorkPlace).map(
    (value: string) => value
  );

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
      </ContainerFilterSearch>
    </>
  );
};

export default FilterSearch;
