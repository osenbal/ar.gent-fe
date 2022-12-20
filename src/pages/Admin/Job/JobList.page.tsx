import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { Helmet } from 'react-helmet-async';
import JobListHead from './JobListHead';
import JobListToolbar from './JobListToolbar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactPaginate from 'react-paginate';
import { BACKEND_URL } from '@/config/config';
import IUser from '@/interfaces/user.interface';
import IJob, { IReturn_GET_Jobs } from '@/interfaces/job.interface';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';
import FetchAdminIntercept from '@/utils/api.admin';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'isClosed', label: 'Status', alignRight: false },
  { id: 'status', label: '', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a: any, b: any, orderBy: any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: any, orderBy: any) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array: any, comparator: any, query: any) {
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user: any) =>
        _user.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el: any) => el[0]);
}

// ----------------------------------------------------------------------

const JobListPage: React.FC = () => {
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [pages, setPages] = useState<number>(0);
  const [rows, setRows] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [msg, setMsg] = useState<string>('');
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState<string>('fullName');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterTitle, setFilterTitle] = useState<string>('');
  const [jobs, setJobs] = useState<IReturn_GET_Jobs[] | []>([]);

  const handleOpenMenu = (event: any) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: any, jobs: any) => {
    if (event.target.checked) {
      const newSelecteds = jobs.map((n: any) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: any, _id: never) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected: any = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = ({ selected }: { selected: any }) => {
    setPage(selected);
    if (selected === 9) {
      setMsg(
        'If data not found, please search by username or name or email in search bar'
      );
    } else {
      setMsg('');
    }
  };

  const handleFilterByTitle = (event: any) => {
    event.preventDefault();
    setPage(0);
    setSearch(query);
  };

  const filteredJobs = applySortFilter(
    jobs,
    getComparator(order, orderBy),
    filterTitle
  );

  const isNotFound = !filteredJobs.length && !!filterTitle;

  const handleCloseOrOpenJob = async (jobId: string) => {
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/job/close/${jobId}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response);
    if (response.code === 200) {
      setJobs(
        jobs.map((job: any) =>
          job._id === response.data[0]._id ? response.data[0] : job
        )
      );

      setOpen(null);
    } else {
      console.log('error');
      setOpen(null);
    }
  };

  const handleDeleteUsers = async () => {
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/user/delete`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usersId: selected }),
      }
    );
    if (response.code === 200) {
      if (page === 0) {
        const controller = new AbortController();
        getJobList(controller);
      } else {
        setPage(0);
      }
      setSelected([]);
      setOpen(null);
    } else {
      console.log('error');
      setSelected([]);
      setOpen(null);
    }
  };

  const handleDeleteUserById = async (userId: string) => {
    if (!open) return;
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/user/${userId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.code === 200) {
      setJobs(jobs.filter((job) => job._id !== open.id));
      setOpen(null);
      setSelected([]);
    } else {
      console.log('error');
      setOpen(null);
      setSelected([]);
    }
  };

  const getJobList = async (controller: any) => {
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/job?page=${page}&limit=${limit}&search=${search}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal: controller.signal,
      }
    );
    if (response.code === 200) {
      // const data = await response.json();
      setJobs(response.data);
      setPage(response.page);
      setLimit(response.limit);
      setPages(response.totalPage);
      setRows(response.totalRows);
    } else {
      setJobs([]);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getJobList(controller);

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  useEffect(() => {
    setSelected([]);
  }, [page]);

  return (
    <>
      <Helmet>
        <title>Jobs | admin</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Jobs
          </Typography>
        </Stack>

        <Card>
          <JobListToolbar
            numSelected={selected.length}
            filterTitle={query}
            onChangeQuery={(e: any) => setQuery(e.target.value)}
            onFilterTitle={handleFilterByTitle}
            handleDeleteJobs={handleDeleteUsers}
          />
          <Paper sx={{ width: '100%', mb: 2, overflow: 'auto' }}>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <JobListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={jobs.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={(e) => handleSelectAllClick(e, jobs)}
                />
                <TableBody>
                  {filteredJobs.map((row: IReturn_GET_Jobs) => {
                    const selectedJob = selected.indexOf(row._id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={row?._id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={selectedJob}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedJob}
                            onChange={(event) => handleClick(event, row?._id)}
                          />
                        </TableCell>

                        <TableCell align="left">
                          <Typography variant="subtitle2" noWrap>
                            {row?.title}
                          </Typography>
                        </TableCell>

                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          align="left"
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Avatar
                              alt={row?.user.username}
                              src={row?.user.avatar}
                            />
                            <Typography variant="subtitle2" noWrap>
                              {row?.user.username}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{row?.user.email}</TableCell>

                        <TableCell align="left">
                          <Button> {row?.isClosed ? 'Closed' : 'Open'}</Button>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            id={row?._id}
                            size="large"
                            color="inherit"
                            onClick={handleOpenMenu}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterTitle}&quot;</strong>.
                            <br /> Try checking for typos or using complete
                            words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <div>
              <p className="pagginatiin-data">
                Total Rows: {rows} | Total Pages: {rows ? page + 1 : 0} of
                {pages}
              </p>
              <Typography
                variant="body1"
                paragraph
                sx={{ color: 'red', textAlign: 'center' }}
              >
                {msg}
              </Typography>
            </div>
            {jobs?.length > 0 && (
              <nav key={rows}>
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
                  pageCount={Math.min(10, pages)}
                  onPageChange={handleChangePage}
                />
              </nav>
            )}
          </Paper>
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 190,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {/* get id from user list */}

        <MenuItem onClick={() => (open ? handleCloseOrOpenJob(open.id) : null)}>
          Close / Open
        </MenuItem>

        <MenuItem
          onClick={() => (open ? handleDeleteUserById(open.id) : null)}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Popover>
    </>
  );
};

export default JobListPage;
