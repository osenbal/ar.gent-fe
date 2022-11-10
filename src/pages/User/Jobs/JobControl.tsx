import React, { useState } from 'react';
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

const JobControl: React.FC = () => {
  const [jobType, setJobType] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [workplace, setWorkplace] = useState<string>('');
  const [salary, setSalary] = useState<number | null>(null);

  const handleChangeJobType = (event: SelectChangeEvent) => {
    setJobType(event.target.value);
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5">Job Edit</Typography>
          <TextField
            label="Job Title"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{ mt: 1 }}
          />
          <FormControl sx={{ m: 1, ml: 0, minWidth: 120 }} size="small">
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
          <NumericFormat
            fullWidth
            sx={{ display: 'block', width: '100%', mt: 1 }}
            value={salary}
            customInput={TextField}
            decimalSeparator=","
            thousandSeparator="."
            allowNegative={false}
            label="Salary"
            prefix="Rp. "
            type="text"
            onChange={(e) => {
              setSalary(Number(e.target.value.replace(/[A-Za-z\.\s]/g, '')));
            }}
          />
          <Card>
            <CardContent>
              <TextEditor />
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Appliciants
          </Typography>
          {/* List user appliciants */}
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
  );
};

export default JobControl;
