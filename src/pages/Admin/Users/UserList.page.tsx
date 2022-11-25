import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { Helmet } from 'react-helmet-async';
import UserListToolbar from './UserListToolbar';
import UserListHead from './UserListHead';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
  TablePagination,
} from '@mui/material';
import { BACKEND_URL } from '@/config/config';
import { IUser } from '@/interfaces/user.interface';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fullName', label: 'Name', alignRight: false },
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
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

const UserList: React.FC = () => {
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('fullName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState<IUser[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event: any) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers = applySortFilter(
    users,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  const getUserList = async (page: number) => {
    setIsLoading(true);
    const response = await fetch(`${BACKEND_URL}/admin/get/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      setUsers(data.data);
      setIsLoading(false);
    } else {
      console.log('error');
      setUsers([]);
      setIsLoading(false);
    }
  };

  const handleBannedUser = async (userId: string) => {
    const response = await fetch(`${BACKEND_URL}/admin/banned/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      setUsers(
        users.map((user: any) =>
          user._id === data.data._id ? data.data : user
        )
      );

      setOpen(null);
    } else {
      console.log('error');
      setOpen(null);
    }
  };

  const handleDeleteUsers = async () => {
    console.log(selected);
    const response = await fetch(`${BACKEND_URL}/admin/delete/users`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usersId: selected }),
    });
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      setUsers(data.data);
      setSelected([]);
      setOpen(null);
    } else {
      console.log('error');
      setSelected([]);
      setOpen(null);
    }
  };

  const handleDeleteUserById = async (userId: string) => {
    const response = await fetch(`${BACKEND_URL}/admin/delete/user/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setUsers(data.data);
      setOpen(null);
      setSelected([]);
    } else {
      console.log('error');
      setOpen(null);
      setSelected([]);
    }
  };

  useEffect(() => {
    getUserList(page);
  }, []);

  return (
    <>
      <Helmet>
        <title>Users | admin</title>
      </Helmet>

      {isLoading ? (
        <p>loading...</p>
      ) : (
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              User
            </Typography>
            <Button variant="contained">New User</Button>
          </Stack>

          <Card>
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              handleDeleteUsers={handleDeleteUsers}
            />
            <Paper sx={{ width: '100%', mb: 2, overflow: 'auto' }}>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={users.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={(e) => handleSelectAllClick(e, users)}
                  />
                  <TableBody>
                    {filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row: any) => {
                        const {
                          _id,
                          fullName,
                          username,
                          email,
                          avatar,
                          status,
                          isVerified,
                        }: {
                          _id: never;
                          fullName: never;
                          username: any;
                          email: any;
                          status: any;
                          avatar: any;
                          isVerified: any;
                        } = row;
                        const selectedUser = selected.indexOf(_id) !== -1;

                        return (
                          <TableRow
                            hover
                            key={_id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={selectedUser}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedUser}
                                onChange={(event) => handleClick(event, _id)}
                              />
                            </TableCell>

                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Avatar alt={fullName} src={avatar} />
                                <Typography variant="subtitle2" noWrap>
                                  {fullName}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{username}</TableCell>

                            <TableCell align="left">{email}</TableCell>

                            <TableCell align="left">
                              {isVerified ? 'Yes' : 'No'}
                            </TableCell>

                            <TableCell align="left">
                              <Button>{status ? 'Active' : 'Banned'}</Button>
                            </TableCell>

                            <TableCell align="right">
                              <IconButton
                                id={_id}
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
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
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
              </TableContainer>
            </Paper>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      )}

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

        <MenuItem onClick={() => (open ? handleBannedUser(open.id) : null)}>
          Banned / Unbanned
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

export default UserList;
