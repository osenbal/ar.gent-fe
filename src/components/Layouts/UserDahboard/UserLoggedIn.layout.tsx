import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { asyncLogout } from '@/store/authSlice';
import Slider from './Slider';
import { BACKEND_URL } from '@/config/config';
import IUser from '@/interfaces/user.interface';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery, Typography, Toolbar, IconButton } from '@mui/material';

const APP_BAR_DESKTOP = 0;
const APP_BAR_MOBILE = 64;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  widthScreen?: number;
}

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  maxWidth: '1980px',
  margin: '0 auto',
});

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100vh',
  height: '100%',
  // paddingBottom: theme.spacing(10),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  paddingTop: APP_BAR_MOBILE,
  [theme.breakpoints.up('md')]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

// ------------------------------------------

const UserLoggedInLayout = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));
  const { userId } = useAppSelector((state) => state.auth);

  const [open, setOpen] = useState(upTabScreen);
  const [intialUser, setInitialUser] = useState<IUser | null>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(asyncLogout());
  };

  const getUserInitials = async (userId: string) => {
    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.ok) {
      const user = await response.json();
      setInitialUser(user.data);
    }
  };

  useEffect(() => {
    getUserInitials(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledRoot>
      <AppBar sx={{ display: { xs: 'block', md: 'none' } }} position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            AR.GENT
          </Typography>
        </Toolbar>
      </AppBar>

      <Slider
        user={intialUser}
        openNav={open}
        onClosedNav={handleDrawerClose}
        handleLogout={handleLogout}
      />

      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
};

export default UserLoggedInLayout;
