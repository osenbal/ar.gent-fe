import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Button,
} from '@mui/material';
// component

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    // boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

JobListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterTitle: PropTypes.string,
  onFilterTitle: PropTypes.func,
  handleDeleteJobs: PropTypes.func,
};

export default function JobListToolbar({
  numSelected,
  filterTitle,
  onFilterTitle,
  onChangeQuery,
  handleDeleteJobs,
}: {
  numSelected: number;
  filterTitle: string;
  onFilterTitle: any;
  onChangeQuery: any;
  handleDeleteJobs: any;
}) {
  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <form onSubmit={onFilterTitle}>
          <StyledSearch
            onChange={onChangeQuery}
            value={filterTitle}
            placeholder="Search user..."
            startAdornment={<InputAdornment position="start"></InputAdornment>}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ ml: 1 }}
          >
            Search
          </Button>
        </form>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDeleteJobs}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </StyledRoot>
  );
}
