import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import UserReportListToolbar from './UserReportListToolbar';
import UserReportListHead from './UserReportListHead';
import NoData from '@/components/Reusable/NoData';
import { BACKEND_URL } from '@/config/config';
import FetchAdminIntercept from '@/utils/api.admin';
import { IReturn_Reported_User } from '@/interfaces/user.interface';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Loader from '@/components/Reusable/Loader';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'userReported', label: 'User Reported', alignRight: false },
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'description', label: 'Short Description', alignRight: false },
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

// ----------------------------------------------------------------------

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

const UserReportPage: React.FC = () => {
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
  const [filterName, setFilterName] = useState<string>('');
  const [users, setUsers] = useState<IReturn_Reported_User[] | []>([]);

  // ----------------------------------------------------------------------

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: any, users: any) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n: any) => n._id);
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

  const handleFilterByName = (event: any) => {
    event.preventDefault();
    setPage(0);
    setSearch(query);
  };

  const filteredUsers = applySortFilter(
    users,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  const handleDeleteReport = async () => {
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/user/report/delete`,
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
      setPage(0);
      setSelected([]);
    } else {
      console.log('error');
      setSelected([]);
    }
  };

  const getUserList = async (controller: any) => {
    setIsLoading(true);
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/user/report?page=${page}&limit=${limit}&search=${search}`,
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
      setUsers(response.data);
      setPage(response.page);
      setLimit(response.limit);
      setPages(response.totalPage);
      setRows(response.totalRows);
      setIsLoading(false);
    } else {
      console.log('error');
      setUsers([]);
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();
    getUserList(controller);

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
        <title>Users | admin</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
        </Stack>

        <Card>
          <UserReportListToolbar
            numSelected={selected.length}
            filterName={query}
            onChangeQuery={(e: any) => setQuery(e.target.value)}
            onFilterName={handleFilterByName}
            handleDeleteReports={handleDeleteReport}
          />
          <Paper sx={{ width: '100%', mb: 2, overflow: 'auto' }}>
            <TableContainer sx={{ minWidth: 800 }}>
              {isLoading ? (
                <Loader />
              ) : users?.length > 0 ? (
                <Table>
                  <UserReportListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={users.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={(e) => handleSelectAllClick(e, users)}
                  />
                  <TableBody>
                    {filteredUsers.map((row: IReturn_Reported_User) => {
                      const selectedUser = selected.indexOf(row._id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={row._id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedUser}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedUser}
                              onChange={(event) => handleClick(event, row._id)}
                            />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar
                                alt={row.userReported.fullName}
                                src={row.userReported.avatar}
                              />
                              <Typography variant="subtitle2" noWrap>
                                {row.userReported.fullName}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">
                            <Link to={`/admin/reports/${row._id}`}>
                              {row.userReported.username}
                            </Link>
                          </TableCell>

                          <TableCell align="left">
                            {row.userReported.email}
                          </TableCell>

                          <TableCell align="left">
                            {row.userReported.verified ? 'Yes' : 'No'}
                          </TableCell>

                          <TableCell align="left">
                            <Button>
                              {row.userReported.status ? 'Active' : 'Banned'}
                            </Button>
                          </TableCell>

                          <TableCell
                            sx={{
                              wordWrap: 'break-word',
                              whiteSpace: 'normal',
                            }}
                            align="right"
                          >
                            <Typography
                              sx={{
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                textAlign: 'left',
                                maxWidth: 130,
                                '-webkit-line-clamp': 2,
                                '-webkit-box-orient': 'vertical',
                              }}
                              variant="subtitle2"
                              noWrap
                            >
                              {row.description}
                            </Typography>
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
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete
                              words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              ) : (
                <NoData upTabScreen={upTabScreen} message="No report data" />
              )}
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

            {users?.length > 0 && (
              <nav key={rows}>
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
                  pageCount={Math.min(10, pages)}
                  onPageChange={handleChangePage}
                />
              </nav>
            )}
          </Paper>
        </Card>
      </Container>
    </>
  );
};

export default UserReportPage;
